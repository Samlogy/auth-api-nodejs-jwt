const createError = require('http-errors')
import express, { Application, Request, Response, NextFunction } from 'express'

import User from '../models/User.model'
import client from '../utils/init_redis'
import jwtHelper from '../utils/jwt_helper'
import authSchema from '../utils/validation_schema'

export default {
    register: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await authSchema.validateAsync(req.body) // validate data using joi + schema validation

            const doesExist = await User.findOne({ email: result.email })
            if (doesExist)
                throw createError.Conflict(
                    `${result.email} is already been registered`
                )

            const user = new User(result)
            const savedUser = await user.save()
            const accessToken = await jwtHelper.signAccessToken(savedUser.id)
            const refreshToken = await jwtHelper.signRefreshToken(savedUser.id)

            res.send({ accessToken, refreshToken })
        } catch (error: any) {
            if (error.isJoi === true) error.status = 422
            next(error)
        }
    },

    login: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await authSchema.validateAsync(req.body)
            const user = await User.findOne({ email: result.email })
            if (!user) throw createError.NotFound('User not registered')

            const isMatch = await user.isValidPassword(result.password)
            if (!isMatch)
                throw createError.Unauthorized('Username/password not valid')

            const accessToken = await jwtHelper.signAccessToken(user.id)
            const refreshToken = await jwtHelper.signRefreshToken(user.id)

            res.send({ accessToken, refreshToken })
        } catch (error: any) {
            if (error.isJoi === true)
                return next(createError.BadRequest('Invalid Username/Password'))
            next(error)
        }
    },

    refreshToken: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { refreshToken } = req.body
            if (!refreshToken) throw createError.BadRequest()
            const userId = await jwtHelper.verifyRefreshToken(refreshToken)

            const accessToken = await jwtHelper.signAccessToken(userId)
            const refToken = await jwtHelper.signRefreshToken(userId)
            res.send({ accessToken: accessToken, refreshToken: refToken })
        } catch (error: any) {
            next(error)
        }
    },

    logout: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { refreshToken } = req.body
            if (!refreshToken) throw createError.BadRequest()
            const userId = await jwtHelper.verifyRefreshToken(refreshToken)
            client.DEL(userId, (err: any, val: any) => {
                if (err) {
                    console.log(err.message)
                    throw createError.InternalServerError()
                }
                console.log(val)
                res.sendStatus(204)
            })
        } catch (error: any) {
            next(error)
        }
    },
}
