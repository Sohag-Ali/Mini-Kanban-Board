import httpStatus from 'http-status'
import { BoardRole, Prisma } from '../../../generated/prisma/client'
import { prisma } from '../../lib/prisma'
import { AppError } from '../../utils/appError'
import {
	ICreateColumnPayload,
	IUpdateColumnPayload,
} from './column.interface'

const assertBoardAccess = async (userId: string, boardId: string) => {
	const board = await prisma.board.findUnique({
		where: { id: boardId },
		select: { id: true, ownerId: true },
	})

	if (!board) {
		throw new AppError(httpStatus.NOT_FOUND, 'Board not found')
	}

	if (board.ownerId === userId) {
		return { board, role: BoardRole.OWNER }
	}

	const membership = await prisma.boardMember.findUnique({
		where: {
			boardId_userId: {
				boardId,
				userId,
			},
		},
		select: { role: true },
	})

	if (!membership) {
		throw new AppError(httpStatus.FORBIDDEN, 'You do not have access to this board')
	}

	return { board, role: membership.role }
}

const assertMutationAccess = async (userId: string, boardId: string) => {
	const access = await assertBoardAccess(userId, boardId)

	if (access.role === BoardRole.VIEWER) {
		throw new AppError(httpStatus.FORBIDDEN, 'Viewers cannot modify columns')
	}

	return access.board
}

const create = async (
	userId: string,
	boardId: string,
	payload: ICreateColumnPayload,
) => {
	await assertMutationAccess(userId, boardId)

	if (typeof payload.name !== 'string' || !payload.name.trim()) {
		throw new AppError(httpStatus.BAD_REQUEST, 'Column name is required')
	}

	const name = payload.name.trim()

	if (name.length > 100) {
		throw new AppError(httpStatus.BAD_REQUEST, 'Column name must be 100 characters or fewer')
	}

	try {
		return await prisma.$transaction(async (tx) => {
			const lastColumn = await tx.column.aggregate({
				where: { boardId },
				_max: { position: true },
			})

			return tx.column.create({
				data: {
					name,
					boardId,
					position: (lastColumn._max.position ?? -1) + 1,
				},
			})
		})
	} catch (_error) {
		throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to create column')
	}
}

const findAll = async (userId: string, boardId: string) => {
	await assertBoardAccess(userId, boardId)

	return prisma.column.findMany({
		where: { boardId },
		orderBy: { position: 'asc' },
	})
}

const findOne = async (userId: string, boardId: string, columnId: string) => {
	await assertBoardAccess(userId, boardId)

	const column = await prisma.column.findFirst({
		where: { id: columnId, boardId },
	})

	if (!column) {
		throw new AppError(httpStatus.NOT_FOUND, 'Column not found')
	}

	return column
}

const update = async (
	userId: string,
	boardId: string,
	columnId: string,
	payload: IUpdateColumnPayload,
) => {
	await assertMutationAccess(userId, boardId)

	if (typeof payload.name !== 'string' || !payload.name.trim()) {
		throw new AppError(httpStatus.BAD_REQUEST, 'Column name is required')
	}

	const name = payload.name.trim()

	if (name.length > 100) {
		throw new AppError(httpStatus.BAD_REQUEST, 'Column name must be 100 characters or fewer')
	}

	await findOne(userId, boardId, columnId)

	try {
		return await prisma.column.update({
			where: { id: columnId },
			data: { name },
		})
	} catch (_error) {
		throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to update column')
	}
}

const remove = async (userId: string, boardId: string, columnId: string) => {
	await assertMutationAccess(userId, boardId)
	await findOne(userId, boardId, columnId)

	try {
		return await prisma.$transaction(async (tx) => {
			const deletedColumn = await tx.column.delete({
				where: { id: columnId },
			})

			const remainingColumns = await tx.column.findMany({
				where: { boardId },
				orderBy: { position: 'asc' },
				select: { id: true },
			})

			for (const [position, column] of remainingColumns.entries()) {
				await tx.column.update({
					where: { id: column.id },
					data: { position },
				})
			}

			return deletedColumn
		})
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
			throw new AppError(httpStatus.CONFLICT, 'Column cannot be deleted while it contains tasks')
		}

		throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to delete column')
	}
}

export const ColumnService = {
	create,
	findAll,
	findOne,
	update,
	remove,
}
