import express, { Application, Request, Response, NextFunction } from 'express'
const morgan = require('morgan')
const createError = require('http-errors')

require('dotenv').config({ path: '.env' })
import db from './utils/init_mongodb'
// const { verifyAccessToken } = require('./utils/jwt_helper')
// require('./utils/init_redis')

import authRoute from './routes/auth.route'

const app: Application = express()

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// app.get(
//     '/',
//     verifyAccessToken,
//     async (req: Request, res: Response, next: NextFunction) => {
//         res.send('Hello from express.')
//     }
// )

app.use(async (req: Request, res: Response, next: NextFunction) => {
    next(createError.NotFound())
})

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500)
    res.send({
        error: {
            status: err.status || 500,
            message: err.message,
        },
    })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    db()
    authRoute(app)
})
