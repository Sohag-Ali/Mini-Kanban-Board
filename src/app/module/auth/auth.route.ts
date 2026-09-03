import { Router } from 'express'
import { auth } from '../../middleware/checkAuth'
import { AuthController } from './auth.controller'

const router = Router()

router.post('/register', AuthController.registerPatient)
router.post('/login', AuthController.loginUser)
router.get(
    '/me',
    auth(),
    AuthController.getMe,
)
router.post('/refresh-token', AuthController.refreshToken)
export const AuthRoutes = router
