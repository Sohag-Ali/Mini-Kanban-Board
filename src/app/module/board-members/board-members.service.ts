import httpStatus from 'http-status'
import { BoardRole, Prisma } from '../../../generated/prisma/client'
import { prisma } from '../../lib/prisma'
import { AppError } from '../../utils/appError'
import {
	IAddBoardMemberPayload,
	IUpdateBoardMemberPayload,
} from './board-members.interface'

const assertBoardOwner = async (requesterId: string, boardId: string) => {
	const board = await prisma.board.findUnique({
		where: { id: boardId },
		select: { id: true, ownerId: true },
	})

	if (!board) {
		throw new AppError(httpStatus.NOT_FOUND, 'Board not found')
	}

	if (board.ownerId !== requesterId) {
		throw new AppError(httpStatus.FORBIDDEN, 'Only the board owner can manage members')
	}

	return board
}

const addMember = async (
	requesterId: string,
	boardId: string,
	payload: IAddBoardMemberPayload,
) => {
	await assertBoardOwner(requesterId, boardId)

	if (typeof payload.email !== 'string' || !payload.email.trim()) {
		throw new AppError(httpStatus.BAD_REQUEST, 'A member email is required')
	}

	const email = payload.email.trim().toLowerCase()
	const role = payload.role ?? BoardRole.VIEWER

	if (role !== BoardRole.EDITOR && role !== BoardRole.VIEWER) {
		throw new AppError(httpStatus.BAD_REQUEST, 'Only EDITOR or VIEWER roles can be assigned')
	}

	const user = await prisma.user.findUnique({
		where: { email },
		select: { id: true, name: true, email: true },
	})

	if (!user) {
		throw new AppError(httpStatus.NOT_FOUND, 'User not found')
	}

	try {
		return await prisma.boardMember.create({
			data: {
				boardId,
				userId: user.id,
				role,
			},
			select: {
				id: true,
				boardId: true,
				userId: true,
				role: true,
				createdAt: true,
				user: {
					select: { id: true, name: true, email: true },
				},
			},
		})
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
			throw new AppError(httpStatus.CONFLICT, 'User is already a member of this board')
		}

		throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to add board member')
	}
}

const findMembers = async (requesterId: string, boardId: string) => {
	await assertBoardOwner(requesterId, boardId)

	return prisma.boardMember.findMany({
		where: { boardId },
		orderBy: { createdAt: 'asc' },
		select: {
			id: true,
			boardId: true,
			userId: true,
			role: true,
			createdAt: true,
			user: {
				select: { id: true, name: true, email: true },
			},
		},
	})
}

const updateMemberRole = async (
	requesterId: string,
	boardId: string,
	targetUserId: string,
	payload: IUpdateBoardMemberPayload,
) => {
	const board = await assertBoardOwner(requesterId, boardId)

	if (payload.role !== BoardRole.EDITOR && payload.role !== BoardRole.VIEWER) {
		throw new AppError(httpStatus.BAD_REQUEST, 'Only EDITOR or VIEWER roles can be assigned')
	}

	if (targetUserId === board.ownerId) {
		throw new AppError(httpStatus.FORBIDDEN, 'The board owner role cannot be changed')
	}

	const member = await prisma.boardMember.findUnique({
		where: {
			boardId_userId: {
				boardId,
				userId: targetUserId,
			},
		},
	})

	if (!member) {
		throw new AppError(httpStatus.NOT_FOUND, 'Board member not found')
	}

	try {
		return await prisma.boardMember.update({
			where: { id: member.id },
			data: { role: payload.role },
			select: {
				id: true,
				boardId: true,
				userId: true,
				role: true,
				createdAt: true,
				user: {
					select: { id: true, name: true, email: true },
				},
			},
		})
	} catch (_error) {
		throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to update board member')
	}
}

const removeMember = async (
	requesterId: string,
	boardId: string,
	targetUserId: string,
) => {
	const board = await assertBoardOwner(requesterId, boardId)

	if (targetUserId === board.ownerId) {
		throw new AppError(httpStatus.FORBIDDEN, 'The board owner cannot be removed')
	}

	const member = await prisma.boardMember.findUnique({
		where: {
			boardId_userId: {
				boardId,
				userId: targetUserId,
			},
		},
		select: { id: true },
	})

	if (!member) {
		throw new AppError(httpStatus.NOT_FOUND, 'Board member not found')
	}

	try {
		return await prisma.boardMember.delete({
			where: { id: member.id },
		})
	} catch (_error) {
		throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to remove board member')
	}
}

export const BoardMembersService = {
	addMember,
	findMembers,
	updateMemberRole,
	removeMember,
}
