import { Request, Response } from 'express'
import httpStatus from 'http-status'
import { AppError } from '../../utils/appError'
import { catchAsync } from '../../utils/catchAsync'
import { sendResponse } from '../../utils/sendResponse'
import { BoardsService } from './boards.service'

const getBoardId = (req: Request) => {
    const { id } = req.params

    if (typeof id !== 'string') {
        throw new AppError(httpStatus.BAD_REQUEST, 'Board ID is required')
    }

    return id
}


const createBoards = catchAsync(async (req: Request, res: Response) => {
    const user = req.user

    if (!user) {
        throw new Error('User information is missing in the request')
    }

    const result = await BoardsService.create(user.userId, req.body)

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Board created successfully',
        data: result,
    })
})

const getAllBoards = catchAsync(async (req: Request, res: Response) => {
    const user = req.user

    if (!user) {
        throw new Error('User information is missing in the request')
    }

    const result = await BoardsService.findAll(user.userId)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Boards fetched successfully',
        data: result,
    })
})

const getBoardById = catchAsync(async (req: Request, res: Response) => {
    const user = req.user

    if (!user) {
        throw new Error('User information is missing in the request')
    }

    const result = await BoardsService.findOne(user.userId, getBoardId(req))

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Board fetched successfully',
        data: result,
    })
})

const updateBoard = catchAsync(async (req: Request, res: Response) => {
    const user = req.user

    if (!user) {
        throw new Error('User information is missing in the request')
    }

    const result = await BoardsService.update(user.userId, getBoardId(req), req.body)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Board updated successfully',
        data: result,
    })
})

const deleteBoard = catchAsync(async (req: Request, res: Response) => {
    const user = req.user

    if (!user) {
        throw new Error('User information is missing in the request')
    }

    const result = await BoardsService.remove(user.userId, getBoardId(req))

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Board deleted successfully',
        data: result,
    })
})






export const BoardsController = {
    createBoards,
    getAllBoards,
    getBoardById,
    updateBoard,
    deleteBoard,
}
