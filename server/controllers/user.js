import { compare } from 'bcrypt'
import { tryCatch } from '../middlewares/error.js'
import { Chat } from '../models/Chat.js'
import { User } from '../models/User.js'
import { cookieOptions, sendToken } from '../utils/features.js'
import { ErrorHandler } from '../utils/utility.js'

const register = tryCatch(async (req, res) => {
    const { name, uName, password, bio } = req.body
    const chavi = {
        publicID: 'fsjriurwiu',
        url: 'ehg2ry9230042nf209094'
    }
    const user = await User.create({ name, uName, password, chavi, bio })
    sendToken(res, user, 201, 'Registration Successful')
})

const login = tryCatch(async (req, res, next) => {
    const { uName, password } = req.body
    const user = await User.findOne({ uName }).select('+password')
    if (!user) return next(new ErrorHandler(400, 'Username or Password is incorrect'))
    const isMatch = await compare(password, user.password)
    if (!isMatch) return next(new ErrorHandler(400, 'Username or Password is incorrect'))
    sendToken(res, user, 200, `Welcome Back, ${user.name}`)
})

const getMyProfile = tryCatch(async (req, res) => {
    const user = await User.findById(req.user)
    res.status(200).json({ success: true, user })
})

const logOut = tryCatch(async (req, res) => {
    res.status(200).cookie('user', null, { ...cookieOptions, maxAge: 0 }).json({ success: true, msg: 'Logged Out Successfully' })
})

const searchUser = tryCatch(async (req, res) => {
    const { name } = req.query
    const chats = await Chat.find({
        grpChat: false,
        members: req.user
    })
    const allUsersOfMyChats = chats.flatMap(c => c.members).filter(m => m !== req.user)
    const allUsersExceptMeAndFriends = await User.find({ _id: { $nin: allUsersOfMyChats } })
    console.log(allUsersExceptMeAndFriends)
    res.status(200).json({ success: true,  })
})

export { login, register, getMyProfile, logOut, searchUser }
