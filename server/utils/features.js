import { connect } from "mongoose"
import jwt from 'jsonwebtoken'

const connectDB = async uri => {
    try {
        const { connection } = await connect(uri)
        console.log(`Connected to DB: ${connection.host}`)
    } catch (err) {
        console.log(err)
    }
}

const sendToken = async (res, user, code, msg) => {
    const token = jwt.sign({_id:user._id},process.env.JWT_SECRET)
    return res
        .status(code)
        .cookie('user', token, {
            maxAge: 60 * 60 * 24 * 15000,
            sameSite: 'none',
            httpOnly: true,
            secure: true
        })
        .json({ success: true, msg })
}

export { connectDB, sendToken }