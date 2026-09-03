import { Router } from 'express'
import { auth } from '../../middleware/checkAuth'
import { TaskController } from './task.controller'

const router = Router({ mergeParams: true })

router.post('/', auth(), TaskController.create)
router.get('/', auth(), TaskController.findAll)
router.get('/:taskId', auth(), TaskController.findOne)
router.patch('/:taskId', auth(), TaskController.update)
router.delete('/:taskId', auth(), TaskController.remove)

export const TaskRoutes = router