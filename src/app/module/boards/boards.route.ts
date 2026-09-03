import { Router } from 'express'
import { auth } from '../../middleware/checkAuth'
import { BoardsController } from './boards.controller'


const router = Router()


router.post('/', auth(), BoardsController.createBoards )
router.get('/',BoardsController.getAllBoards )
router.get('/:id',BoardsController.getBoardById)
router.patch('/:id',BoardsController.updateBoard)
router.delete('/:id',BoardsController.deleteBoard)

export const BoardsRoutes = router
