import { Request, Response } from 'express'
import httpStatus from 'http-status'
import { catchAsync } from '../../utils/catchAsync'
import { sendResponse } from '../../utils/sendResponse'
import { BoardsService } from './boards.service'


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
    
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Patient registered successfully',
        data: {
        },
    })
})

const getBoardById = catchAsync(async (req: Request, res: Response) => {
    
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Patient registered successfully',
        data: {
        },
    })
})

const updateBoard = catchAsync(async (req: Request, res: Response) => {
    
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Patient registered successfully',
        data: {
        },
    })
})

const deleteBoard = catchAsync(async (req: Request, res: Response) => {
    
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Patient registered successfully',
        data: {
        },
    })
})






export const BoardsController = {
    createBoards,
    getAllBoards,
    getBoardById,
    updateBoard,
    deleteBoard,
}
