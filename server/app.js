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
import { new_msg, alert } from './constants/events.js'
import { v4 as randomId } from 'uuid'
import { getSockets } from './lib/helper.js'

import { } from './seeders/msg.js'

dotenv.config({ path: './.env' })

const port = process.env.PORT || 6000
const envMode = process.env.NODE_ENV.trim() || 'PRODUCTION'

const app = express()
const server = createServer(app)
const io = new Server(server, {

})
const userSocketIDs = new Map()

app.use(express.json())
app.use(cookieParser())

connectDB(process.env.MONGO_URI)

app.use('/user', user)

const adminKey = process.env.ADMIN_KEY
app.use('/admin', admin)

app.use(isAuthenticated)
app.use('/chat', chat)

io.on('connection', socket => {
    console.log('user connected', socket.id)
    userSocketIDs.set('user._id.toString()', socket.id)
    socket.on(new_msg, async ({ id, members, msg }) => {
        const realTimeMsg = {
            msg,
            id: randomId(),
            chat: new Date().toISOString(),
            createdAt: id,
            sender: {
                _id: 'user._id',
                name: 'user.name'
            }
        }
        const dbMsg = {
            content: msg,
            chat: id,
            sender: 'user._id'
        }
        const membersSocket = getSockets(members)
        io.to(membersSocket).emit(new_msg, {
            id,
            msg: realTimeMsg
        })
        io.to(membersSocket).emit(alert, { id })
    })
    socket.on('disconnect', () => {
        userSocketIDs.delete('user._id.toString()')
        console.log('user disconnected')
    })
})

app.use(errorMiddleware)

server.listen(port, () => console.log(`Server running on port ${port} in ${envMode} mode`))

export { envMode, adminKey, userSocketIDs }