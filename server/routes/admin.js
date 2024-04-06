import { Router } from 'express'
import { getChats, getMsgs, getUsers, logOut } from '../controllers/admin.js'
import { validateHandler } from '../lib/validators.js'
import { isAuthenticated } from '../middlewares/auth.js'

const app = Router()

// app.put('/login', loginValidator(), validateHandler, login)

// app.use(isAuthenticated)
// app.post('/my-profile', getMyProfile)
app.get('/logout', logOut)
app.get('/users', getUsers)
app.get('/chats', getChats)
app.get('/msgs', getMsgs)

export default app