import { Application } from 'express'
import authController from '../controllers/auth.controller'

export default function (app: Application) {
    app.post('/register', authController.register)
    app.post('/login', authController.login)
    app.post('/refresh-token', authController.refreshToken)
    app.delete('/logout', authController.logout)
}
