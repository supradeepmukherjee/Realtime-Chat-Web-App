import { Router } from 'express'
import { getMyProfile, login, logOut, register, searchUser } from '../controllers/user.js'
import { isAuthenticated } from '../middlewares/auth.js'
import { singleChavi } from '../middlewares/multer.js'

const app = Router()

app.post('/register', singleChavi, register)
app.put('/login', login)

app.use(isAuthenticated)
app.get('/my-profile', getMyProfile)
app.get('/logout', logOut)
app.get('/search', searchUser)

export default app