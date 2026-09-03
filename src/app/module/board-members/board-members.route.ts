import { Router } from 'express'
import { auth } from '../../middleware/checkAuth'
import { BoardMembersController } from './board-members.controller'

const router = Router({ mergeParams: true })

router.post('/', auth(), BoardMembersController.addMember)
router.get('/', auth(), BoardMembersController.findMembers)
router.patch('/:userId', auth(), BoardMembersController.updateMemberRole)
router.delete('/:userId', auth(), BoardMembersController.removeMember)

export const BoardMembersRoutes = router
