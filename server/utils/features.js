import jwt from 'jsonwebtoken'
import { connect } from "mongoose"

const cookieOptions = {
    maxAge: 60 * 60 * 24 * 15000,
    sameSite: 'none',
    httpOnly: true,
    // secure: true
}

const connectDB = async uri => {
    try {
        await connect(uri)
        console.log('Connected to DB')
    } catch (err) {
        console.log(err)
    }
}

const sendToken = async (res, user, code, msg) => {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
    return res
        .status(code)
        .cookie('user', token, cookieOptions)
        .json({ success: true, msg })
}

const emitEvent = (req, e, users, data) => {
    console.log(e)
}

export { connectDB, sendToken, cookieOptions, emitEvent }

