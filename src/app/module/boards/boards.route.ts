import { Router } from 'express'
import { auth } from '../../middleware/checkAuth'
import { BoardsController } from './boards.controller'


const router = Router()


router.post('/', auth(), BoardsController.createBoards )
router.get('/', auth(), BoardsController.getAllBoards )
router.get('/:id', auth(), BoardsController.getBoardById)
router.patch('/:id', auth(), BoardsController.updateBoard)
router.delete('/:id', auth(), BoardsController.deleteBoard)

export const BoardsRoutes = router
