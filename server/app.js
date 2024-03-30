import express from 'express'
import user from './routes/user.js'
import { connectDB } from './utils/features.js'
import dotenv from 'dotenv'
import { errorMiddleware } from './middlewares/error.js'

dotenv.config({ path: './.env' })

const port = process.env.PORT || 6000

const app = express()

app.use(express.json())

connectDB(process.env.MONGO_URI)

app.use('/user', user)

app.use(errorMiddleware)

app.listen(port, () => console.log(`Server running on port ${port}`))