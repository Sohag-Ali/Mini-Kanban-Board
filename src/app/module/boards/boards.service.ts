import httpStatus from 'http-status'
import { Prisma } from '../../../generated/prisma/client'
import { prisma } from '../../lib/prisma'
import { AppError } from '../../utils/appError'
import { ICreateBoardPayload } from './boards.interface'



const create = async (userId: string, createBoardDto: ICreateBoardPayload) => {
    const owner = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
    })

    if (!owner) {
        throw new AppError(httpStatus.NOT_FOUND, 'Authenticated user not found')
    }

    try {
        return await prisma.board.create({
            data: {
                name: createBoardDto.name,
                ownerId: userId,
            },
        })
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            throw new AppError(httpStatus.CONFLICT, 'A board with this name already exists')
        }

        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to create board')
    }
}

const getAllBoards = async () => {

}

const getBoardById = async (id: string) => {

}

const updateBoard = async () => {

}

const deleteBoard = async () => {

}





export const BoardsService = {
    create,
    getAllBoards,
    getBoardById,
    updateBoard,
    deleteBoard,
}
