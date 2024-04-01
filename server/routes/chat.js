import { Router } from 'express'
import { addMembers, getMyChats, getMyGrps, leaveGroup, newGrpChat, removeMember } from '../controllers/chat.js'

const app = Router()

app.post('/new', newGrpChat)
app.get('/my-chats', getMyChats)
app.get('/my-grps', getMyGrps)
app.put('/add-members', addMembers)
app.put('/remove-member', removeMember)
app.put('/leave/:id', leaveGroup)

export default app