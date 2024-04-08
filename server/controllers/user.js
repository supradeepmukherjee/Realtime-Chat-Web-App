import { compare } from 'bcrypt'
import { tryCatch } from '../middlewares/error.js'
import { Chat } from '../models/Chat.js'
import { User } from '../models/User.js'
import { Request } from '../models/Request.js'
import { cookieOptions, emitEvent, sendToken } from '../utils/features.js'
import { ErrorHandler } from '../utils/utility.js'
import { new_req, refetch_chats } from '../constants/events.js'
import { findOtherPerson } from '../lib/helper.js'

const register = tryCatch(async (req, res, next) => {
    const { name, uName, password, bio } = req.body
    if (!req.file) return next(new ErrorHandler(400, 'Please upload Chavi'))
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

const getMyProfile = tryCatch(async (req, res, next) => {
    const user = await User.findById(req.user)
    if (!user) return next(new ErrorHandler(404, 'User not found'))
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
    const allUsersExceptMeAndFriends = await User.find({
        _id: { $nin: allUsersOfMyChats },
        name: {
            $regex: name,
            $options: 'i'
        },
    })
    const users = allUsersExceptMeAndFriends.map(({ _id, name, chavi }) => ({
        _id,
        name,
        chavi: chavi.url,
    }))
    res.status(200).json({ success: true, users })
})

const sendRequest = tryCatch(async (req, res, next) => {
    const { id } = req.body
    const user = await User.findById(id)
    if (!user) return next(new ErrorHandler(404, 'User doesn\'t exist'))
    const request = await Request.findOne({
        $or: [
            {
                sender: req.user,
                receiver: id
            },
            {
                sender: id,
                receiver: req.user,
            },
        ]
    })
    if (request) return next(new ErrorHandler(400, 'Request Already Sent'))
    await Request.create({
        sender: req.user,
        receiver: id,
    })
    emitEvent(req, new_req, [id])
    res.status(200).json({ success: true, msg: 'Request Sent!' })
})

const acceptRequest = tryCatch(async (req, res, next) => {
    const { id, accept } = req.body
    const request = await Request.findById(id)
        .populate('sender', 'name')
        .populate('receiver', 'name')
    if (!request) return next(new ErrorHandler(404, 'Request not found'))
    const { sender, receiver } = request
    if (receiver._id.toString() !== req.user.toString()) return next(new ErrorHandler(401, 'You are not allowed to accept/reject this request'))
    if (!accept) {
        await Request.findByIdAndDelete(id)
        return res.status(200).json({ success: true, msg: 'Request Rejected :(' })
    }
    const members = [sender._id, receiver._id]
    await Promise.all([
        Chat.create({
            members,
            name: `${sender.name} - ${receiver.name}`
        }),
        Request.findByIdAndDelete(id)
    ])
    emitEvent(req, refetch_chats, members)
    res.status(200).json({ success: true, msg: 'Request Accepted :)' })
})

const getRequests = tryCatch(async (req, res) => {
    const reqs = await Request.find({ receiver: req.user }).populate('sender', 'name chavi')
    const requests = reqs.map(({ sender, _id }) => ({
        _id,
        sender: {
            _id: sender._id,
            name: sender.name,
            chavi: sender.chavi.url
        }
    }))
    res.status(200).json({ success: true, requests })
})

const getFriends = tryCatch(async (req, res) => {
    const { id } = req.query
    const chats = await Chat.find({
        members: req.user,
        grpChat: false
    }).populate('members', 'name chavi')
    const friends = chats.map(({ members }) => {
        const otherUser = findOtherPerson(members, req.user)
        const { _id, name, chavi } = otherUser
        return {
            _id,
            name,
            chavi: chavi.url
        }
    })
    if (id) {
        const chat = await Chat.findById(id)
        const availableFriends = friends.filter(({ _id }) => !chat.members.includes(_id))
        res.status(200).json({ success: true, friends: availableFriends })
    } else {
        res.status(200).json({ success: true, friends })
    }
})

export { login, register, getMyProfile, logOut, searchUser, sendRequest, acceptRequest, getRequests, getFriends }