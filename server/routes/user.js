import { Router } from 'express'
import { acceptRequest, getFriends, getMyProfile, getOnline, getRequests, lastSeen, login, logOut, markAsRead, register, searchUser, sendRequest, unreadChats, updatePassword, updateProfile } from '../controllers/user.js'
import { acceptRequestValidator, loginValidator, registerValidator, sendRequestValidator, validateHandler } from '../lib/validators.js'
import { isAuthenticated } from '../middlewares/auth.js'
import { singleChavi } from '../middlewares/multer.js'

const app = Router()

app.post('/register', singleChavi, registerValidator(), validateHandler, register)
app.put('/login', loginValidator(), validateHandler, login)

app.use(isAuthenticated)
app.get('/my-profile', getMyProfile)
app.get('/logout', logOut)
app.get('/search', searchUser)
app.post('/sendReq', sendRequestValidator(), validateHandler, sendRequest)
app.put('/acceptReq', acceptRequestValidator(), validateHandler, acceptRequest)
app.get('/notifications', getRequests)
app.get('/friends', getFriends)
app.get('/online', getOnline)
app.get('/last-seen/:id', lastSeen)
app.get('/unread/:id', unreadChats)
app.put('/read/:id', markAsRead)
app.put('/update-profile', singleChavi, updateProfile)
app.put('/update-password', updatePassword)

export default app