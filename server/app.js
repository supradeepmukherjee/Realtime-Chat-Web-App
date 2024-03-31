import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import express from 'express'
import { isAuthenticated } from './middlewares/auth.js'
import { errorMiddleware } from './middlewares/error.js'
import user from './routes/user.js'
import chat from './routes/chat.js'
import { connectDB } from './utils/features.js'
import { createUser } from './seeders/user.js'

dotenv.config({ path: './.env' })

const port = process.env.PORT || 6000

const app = express()

app.use(express.json())
app.use(cookieParser())

connectDB(process.env.MONGO_URI)

app.use('/user', user)

app.use(isAuthenticated)
app.use('/chat', chat)

app.use(errorMiddleware)

app.listen(port, () => console.log(`Server running on port ${port}`))