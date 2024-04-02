import { Router } from 'express'
import { addMembers, getGroupDetails, getMyChats, getMyGrps, leaveGroup, newGrpChat, removeMember, renameGrp, sendAttachments } from '../controllers/chat.js'
import { multerAttachments } from '../middlewares/multer.js'

const app = Router()

app.post('/new', newGrpChat)
app.get('/my-chats', getMyChats)
app.get('/my-grps', getMyGrps)
app.put('/add-members', addMembers)
app.put('/remove-member', removeMember)
app.put('/leave/:id', leaveGroup)
app.post('/msg', multerAttachments, sendAttachments)
app.route('/:id').get(getGroupDetails).put(renameGrp).delete()

export default app