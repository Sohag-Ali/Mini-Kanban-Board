import { Router } from 'express'
import { auth } from '../../middleware/checkAuth'
import { ColumnController } from './column.controller'

const router = Router({ mergeParams: true })

router.post('/', auth(), ColumnController.create)
router.get('/', auth(), ColumnController.findAll)
router.get('/:columnId', auth(), ColumnController.findOne)
router.patch('/:columnId', auth(), ColumnController.update)
router.delete('/:columnId', auth(), ColumnController.remove)

export const ColumnRoutes = router
