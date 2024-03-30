import { Router } from 'express'
import { getMyProfile, login, register } from '../controllers/user.js'
import { singleChavi } from '../middlewares/multer.js'

const app = Router()

app.post('/register', singleChavi, register)
app.put('/login', login)
app.get('/my-profile', getMyProfile)

export default app