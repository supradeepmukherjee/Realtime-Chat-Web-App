import { Router } from 'express'
import { getMyProfile, login, logOut, register, searchUser } from '../controllers/user.js'
import { loginValidator, registerValidator, validateHandler } from '../lib/validators.js'
import { isAuthenticated } from '../middlewares/auth.js'
import { singleChavi } from '../middlewares/multer.js'

const app = Router()

app.post('/register', singleChavi, registerValidator(), validateHandler, register)
app.put('/login', loginValidator(), validateHandler, login)

app.use(isAuthenticated)
app.get('/my-profile', getMyProfile)
app.get('/logout', logOut)
app.get('/search', searchUser)

export default app