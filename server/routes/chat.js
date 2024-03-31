import { Router } from 'express'
import { getMyChats, getMyGrps, newGrpChat } from '../controllers/chat.js'

const app = Router()

app.post('/new', newGrpChat)
app.get('/my-chats', getMyChats)
app.get('/my-grps', getMyGrps)

export default app