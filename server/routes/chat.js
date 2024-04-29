import { Router } from 'express'
import { addMembers, delGroup, getGroupDetails, getMsgs, getMyChats, getMyGrps, leaveGroup, newGrpChat, removeMember, renameGrp, sendAttachments, toggleAdmin } from '../controllers/chat.js'
import { addMembersValidator, chatIDValidator, newGrpValidator, removeMemberValidator, renameGrpValidator, sendAttachmentsValidator, validateHandler, toggleAdminValidator } from '../lib/validators.js'
import { multerAttachments } from '../middlewares/multer.js'

const app = Router()

app.post('/new', newGrpValidator(), validateHandler, newGrpChat)
app.get('/my-chats', getMyChats)
app.get('/my-grps', getMyGrps)
app.put('/add-members', addMembersValidator(), validateHandler, addMembers)
app.put('/remove-member', removeMemberValidator(), validateHandler, removeMember)
app.put('/leave/:id', chatIDValidator(), validateHandler, leaveGroup)
app.post('/attachment', multerAttachments, sendAttachmentsValidator(), validateHandler, sendAttachments)
app.get('/msg/:id', chatIDValidator(), validateHandler, getMsgs)
app.put('/make-admin', toggleAdminValidator(), validateHandler, toggleAdmin)
app.route('/:id')
    .get(chatIDValidator(), validateHandler, getGroupDetails)
    .put(renameGrpValidator(), validateHandler, renameGrp)
    .delete(chatIDValidator(), validateHandler, delGroup)

export default app