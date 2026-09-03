import { Request, Response } from 'express'
import httpStatus from 'http-status'
import { AppError } from '../../utils/appError'
import { catchAsync } from '../../utils/catchAsync'
import { sendResponse } from '../../utils/sendResponse'
import { TaskService } from './task.service'
import { validateCreateTask, validateUpdateTask } from './task.validation'

const getParam = (req: Request, name: string) => {
	const value = req.params[name]
	if (typeof value !== 'string') {
		throw new AppError(httpStatus.BAD_REQUEST, `${name} is required`)
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
	const result = await TaskService.create(
		getUserId(req),
		getParam(req, 'columnId'),
		validateCreateTask(req.body),
	)

	sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: 'Task created successfully', data: result })
})

const findAll = catchAsync(async (req: Request, res: Response) => {
	const result = await TaskService.findAll(getUserId(req), getParam(req, 'columnId'))
	sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Tasks fetched successfully', data: result })
})

const findOne = catchAsync(async (req: Request, res: Response) => {
	const result = await TaskService.findOne(getUserId(req), getParam(req, 'columnId'), getParam(req, 'taskId'))
	sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Task fetched successfully', data: result })
})

const update = catchAsync(async (req: Request, res: Response) => {
	const result = await TaskService.update(
		getUserId(req),
		getParam(req, 'columnId'),
		getParam(req, 'taskId'),
		validateUpdateTask(req.body),
	)
	sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Task updated successfully', data: result })
})

const remove = catchAsync(async (req: Request, res: Response) => {
	const result = await TaskService.remove(getUserId(req), getParam(req, 'columnId'), getParam(req, 'taskId'))
	sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Task deleted successfully', data: result })
})

export const TaskController = { create, findAll, findOne, update, remove }