import { Request, Response } from 'express'
import httpStatus from 'http-status'
import { AppError } from '../../utils/appError'
import { catchAsync } from '../../utils/catchAsync'
import { sendResponse } from '../../utils/sendResponse'
import { ColumnService } from './column.service'

const getParam = (req: Request, key: string) => {
	const value = req.params[key]

	if (typeof value !== 'string') {
		throw new AppError(httpStatus.BAD_REQUEST, `${key} is required`)
	}

	return value
}

const getUserId = (req: Request) => {
	if (!req.user) {
		throw new AppError(httpStatus.UNAUTHORIZED, 'User information is missing in the request')
	}

	return req.user.userId
}

const create = catchAsync(async (req: Request, res: Response) => {
	const result = await ColumnService.create(
		getUserId(req),
		getParam(req, 'boardId'),
		req.body,
	)

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: 'Column created successfully',
		data: result,
	})
})

const findAll = catchAsync(async (req: Request, res: Response) => {
	const result = await ColumnService.findAll(getUserId(req), getParam(req, 'boardId'))

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Columns fetched successfully',
		data: result,
	})
})

const findOne = catchAsync(async (req: Request, res: Response) => {
	const result = await ColumnService.findOne(
		getUserId(req),
		getParam(req, 'boardId'),
		getParam(req, 'columnId'),
	)

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Column fetched successfully',
		data: result,
	})
})

const update = catchAsync(async (req: Request, res: Response) => {
	const result = await ColumnService.update(
		getUserId(req),
		getParam(req, 'boardId'),
		getParam(req, 'columnId'),
		req.body,
	)

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Column updated successfully',
		data: result,
	})
})

const remove = catchAsync(async (req: Request, res: Response) => {
	const result = await ColumnService.remove(
		getUserId(req),
		getParam(req, 'boardId'),
		getParam(req, 'columnId'),
	)

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Column deleted successfully',
		data: result,
	})
})

export const ColumnController = {
	create,
	findAll,
	findOne,
	update,
	remove,
}
