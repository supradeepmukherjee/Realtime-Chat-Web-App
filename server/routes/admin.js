import { Router } from 'express'
import { getAdminData, getChats, getDashboardStats, getMsgs, getUsers, login, logOut } from '../controllers/admin.js'
import { adminLoginValidator, validateHandler } from '../lib/validators.js'
import { isAdmin } from '../middlewares/auth.js'

const app = Router()

app.put('/login', adminLoginValidator(), validateHandler, login)

app.use(isAdmin)
app.get('/', getAdminData)
app.get('/logout', logOut)
app.get('/users', getUsers)
app.get('/chats', getChats)
app.get('/msgs', getMsgs)
app.get('/dashboard', getDashboardStats)

export default app