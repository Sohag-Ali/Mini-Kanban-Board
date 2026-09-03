import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Application, Request, Response } from 'express'
import httpStatus from "http-status"
import config from './app/config'
import { globalErrorHandler } from './app/middleware/globalErrorHandler'
import { notFound } from './app/middleware/notFound'
import { AuthRoutes } from './app/module/auth/auth.route'
import { BoardMembersRoutes } from './app/module/board-members/board-members.route'
import { BoardsRoutes } from './app/module/boards/boards.route'
import { ColumnRoutes } from './app/module/cloumns/column.route'
import { TaskRoutes } from './app/module/tasks/task.route'

const app: Application = express()

app.use(
    cors({
        origin: config.frontend_url,
        credentials: true,
    }),
)

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }))

// Middleware to parse JSON bodies
app.use(express.json())
app.use(cookieParser())

app.use('/api/v1/auth', AuthRoutes)
app.use('/api/v1/boards', BoardsRoutes)
app.use('/api/v1/boards/:boardId/members', BoardMembersRoutes)
app.use('/api/v1/boards/:boardId/columns', ColumnRoutes)
app.use('/api/v1/columns/:columnId/tasks', TaskRoutes)

// Basic route
app.get('/', async (req: Request, res: Response) => {
    res.status(httpStatus.OK).json({
        success: true,
        message: 'Welcome to Mini Kunban Board',
    })
})

app.use(globalErrorHandler)
app.use(notFound)

export default app
