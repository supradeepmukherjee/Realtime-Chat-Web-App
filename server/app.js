import { v2 } from 'cloudinary'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { v4 as randomId } from 'uuid'
import { corsOptions } from './constants/config.js'
import { new_msg, new_msg_alert, start_typing, stop_typing } from './constants/events.js'
import { getSockets } from './lib/helper.js'
import { isAuthenticated, socketAuthenticator } from './middlewares/auth.js'
import { errorMiddleware } from './middlewares/error.js'
import { Msg } from './models/Msg.js'
import admin from './routes/admin.js'
import chat from './routes/chat.js'
import user from './routes/user.js'
import { } from './seeders/msg.js'
import { connectDB } from './utils/features.js'

dotenv.config({ path: './.env' })
v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET,
})

const port = process.env.PORT || 6000
const envMode = process.env.NODE_ENV.trim() || 'PRODUCTION'

const app = express()
const server = createServer(app)
const io = new Server(server, { cors: corsOptions })
const userSocketIDs = new Map()
app.set('io', io)

app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))

connectDB(process.env.MONGO_URI)

app.use('/api/user', user)

const adminKey = process.env.ADMIN_KEY
app.use('/api/admin', admin)

app.use(isAuthenticated)
app.use('/api/chat', chat)

io.use((socket, next) => {
    cookieParser()(socket.request, socket.request.res, async err => await socketAuthenticator(err, socket, next))
})

io.on('connection', socket => {
    const { user } = socket
    userSocketIDs.set(user._id.toString(), socket.id)
    socket.on(new_msg, async ({ id, members, msg }) => {
        const realTimeMsg = {
            content: msg,
            id: randomId(),
            chat: id,
            createdAt: new Date().toISOString(),
            sender: {
                _id: user._id,
                name: user.name
            }
        }
        const membersSocket = getSockets(members)
        io.to(membersSocket).emit(new_msg, {
            id,
            msg: realTimeMsg
        })
        io.to(membersSocket).emit(new_msg_alert, { id })
        try {
            await Msg.create({
                content: msg,
                chat: id,
                sender: user._id
            })
        } catch (err) {
            console.log(err)
        }
    })
    socket.on(start_typing, ({ members, id }) => {
        socket.to(getSockets(members)).emit(start_typing, { id })
    })
    socket.on(stop_typing, ({ members, id }) => {
        socket.to(getSockets(members)).emit(stop_typing, { id })
    })
    socket.on('disconnect', () => {
        userSocketIDs.delete(user._id.toString())
        console.log('user disconnected')
    })
})

app.use(errorMiddleware)

server.listen(port, () => console.log(`Server running on port ${port} in ${envMode} mode`))

export { envMode, adminKey, userSocketIDs }