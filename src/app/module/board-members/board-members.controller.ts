import { Request, Response } from 'express'
import httpStatus from 'http-status'
import { catchAsync } from '../../utils/catchAsync'
import { sendResponse } from '../../utils/sendResponse'
import { BoardMembersService } from './board-members.service'

const addMember = catchAsync(async (req: Request, res: Response) => {
	const user = req.user

	if (!user) {
		throw new Error('User information is missing in the request')
	}

	const result = await BoardMembersService.addMember(
		user.userId,
		req.params.boardId as string,
		req.body,
	)

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: 'Board member added successfully',
		data: result,
	})
})

const findMembers = catchAsync(async (req: Request, res: Response) => {
	const user = req.user

	if (!user) {
		throw new Error('User information is missing in the request')
	}

	const result = await BoardMembersService.findMembers(
		user.userId,
		req.params.boardId as string,
	)

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Board members fetched successfully',
		data: result,
	})
})

const updateMemberRole = catchAsync(async (req: Request, res: Response) => {
	const user = req.user

	if (!user) {
		throw new Error('User information is missing in the request')
	}

	const result = await BoardMembersService.updateMemberRole(
		user.userId,
		req.params.boardId as string,
		req.params.userId as string,
		req.body,
	)

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Board member role updated successfully',
		data: result,
	})
})

const removeMember = catchAsync(async (req: Request, res: Response) => {
	const user = req.user

	if (!user) {
		throw new Error('User information is missing in the request')
	}

	const result = await BoardMembersService.removeMember(
		user.userId,
		req.params.boardId as string,
		req.params.userId as string,
	)

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Board member removed successfully',
		data: result,
	})
})

export const BoardMembersController = {
	addMember,
	findMembers,
	updateMemberRole,
	removeMember,
}
