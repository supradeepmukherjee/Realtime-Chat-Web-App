import { Router } from 'express'
import { addMembers, delGroup, getGroupDetails, getMsgs, getMyChats, getMyGrps, leaveGroup, newGrpChat, removeMember, renameGrp, sendAttachments } from '../controllers/chat.js'
import { multerAttachments } from '../middlewares/multer.js'

const app = Router()

app.post('/new', newGrpChat)
app.get('/my-chats', getMyChats)
app.get('/my-grps', getMyGrps)
app.put('/add-members', addMembers)
app.put('/remove-member', removeMember)
app.put('/leave/:id', leaveGroup)
app.post('/msg', multerAttachments, sendAttachments)
app.get('/msg/:id', getMsgs)
app.route('/:id').get(getGroupDetails).put(renameGrp).delete(delGroup)

export default app