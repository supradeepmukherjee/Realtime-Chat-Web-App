import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import express from 'express'
import { isAuthenticated } from './middlewares/auth.js'
import { errorMiddleware } from './middlewares/error.js'
import user from './routes/user.js'
import chat from './routes/chat.js'
import admin from './routes/admin.js'
import { connectDB } from './utils/features.js'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { } from './seeders/msg.js'
import { new_msg } from './constants/events.js'

dotenv.config({ path: './.env' })

const port = process.env.PORT || 6000
export const envMode = process.env.NODE_ENV.trim() || 'PRODUCTION'

const app = express()
const server = createServer(app)
const io = new Server(server, {
    transports: ['websocket']
})

app.use(express.json())
app.use(cookieParser())

connectDB(process.env.MONGO_URI)

app.use('/user', user)

export const adminKey = process.env.ADMIN_KEY
app.use('/admin', admin)

app.use(isAuthenticated)
app.use('/chat', chat)

io.on('connection', socket => {
    console.log('user connected', socket.id)
    socket.on(new_msg,()=>{})
    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
})

app.use(errorMiddleware)

server.listen(port, () => console.log(`Server running on port ${port} in ${envMode} mode`))