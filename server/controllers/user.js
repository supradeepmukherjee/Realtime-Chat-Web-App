import { compare } from 'bcrypt'
import { new_req, refetch_chats } from '../constants/events.js'
import { findOtherPerson } from '../lib/helper.js'
import { tryCatch } from '../middlewares/error.js'
import { Chat } from '../models/Chat.js'
import { Request } from '../models/Request.js'
import { User } from '../models/User.js'
import { cookieOptions, emitEvent, sendToken, uploadToCloudinary } from '../utils/features.js'
import { ErrorHandler } from '../utils/utility.js'
import { v2 } from 'cloudinary'

const register = tryCatch(async (req, res, next) => {
    const { name, uName, password, about } = req.body
    const file = req.file
    if (!file) return next(new ErrorHandler(400, 'Please upload Chavi'))
    const userExists = await User.find({ uName })
    if (userExists.length !== 0) return next(new ErrorHandler(400, 'Username already registered'))
    const chaviResult = await uploadToCloudinary([file])
    const chavi = {
        publicID: chaviResult[0].publicID,
        url: chaviResult[0].url,
    }
    const user = await User.create({ name, uName, password, chavi, about })
    sendToken(res, user, 201, 'Registration Successful')
})

const login = tryCatch(async (req, res, next) => {
    const { uName, password } = req.body
    const user = await User.findOne({ uName }).select('+password')
    if (!user) return next(new ErrorHandler(400, 'Username or Password is incorrect'))
    const isMatch = await compare(password, user.password)
    if (!isMatch) return next(new ErrorHandler(400, 'Username or Password is incorrect'))
    user.password = undefined
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
    allUsersOfMyChats.push(req.user)
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
    const { id, name } = req.query
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
        console.log('working')
        const chat = await Chat.findById(id)
        const availableFriends = friends.filter(({ _id }) => !chat.members.includes(_id))
        const allUsers = await User.find({
            name: {
                $regex: name,
                $options: 'i'
            },
        })
        let matchingFriends = []
        for (let i = 0; i < availableFriends.length; i++) {
            const friend = availableFriends[i];
            for (let j = 0; j < allUsers.length; j++) {
                const user = allUsers[j];
                if (friend._id.toString() === user._id.toString()) {
                    matchingFriends.push(friend)
                }
            }
        }
        res.status(200).json({ success: true, friends: matchingFriends })
    } else {
        res.status(200).json({ success: true, friends })
    }
})

const getOnline = tryCatch(async (req, res) => {
    const rawUsers = await User.find({ online: true }).select('_id')
    const users = rawUsers.map(({ _id }) => _id)
    res.status(200).json({ success: true, users })
})

const lastSeen = tryCatch(async (req, res) => {
    const { lastOnline } = await User.findById(req.params.id).select('lastOnline')
    const lastSeen = lastOnline.toLocaleString()
    res.status(200).json({ success: true, lastSeen })
})

const unreadChats = tryCatch(async (req, res) => {
    const unread = await User.findById(req.params.id).select('unread')
    res.status(200).json({ success: true, unread })
})

const markAsRead = tryCatch(async (req, res) => {
    const user = await User.findById(req.params.id).select('unread')
    if (user.unread.length > 0) {
        const readChats = user.unread?.filter(({ chat }) => chat?.toString() !== req.query.chat)
        user.unread = readChats
        await user.save()
    }
    res.status(200).json({ success: true, msg: 'Marked as Read' })
})

const updateProfile = tryCatch(async (req, res, next) => {
    const { name, uName, about } = req.body
    const file = req.file
    console.log(name, uName, about)
    const user = await User.findById(req.user)
    if (!user) return next(new ErrorHandler(404, 'User not found'))
    if (name) user.name = name
    if (uName) user.uName = uName
    if (about) user.about = about
    if (file) {
        await v2.uploader.destroy(user.chavi.publicID)
        const chaviResult = await uploadToCloudinary([file])
        const chavi = {
            publicID: chaviResult[0].publicID,
            url: chaviResult[0].url,
        }
        user.chavi = chavi
    }
    await user.save()
    res.status(200).json({ success: true, msg: 'Profile Updated Successfully' })
})

const updatePassword = tryCatch(async (req, res, next) => {
    const { old, newP } = req.body
    const user = await User.findById(req.user).select('+password')
    if (!user) return next(new ErrorHandler(404, 'User not found'))
    if (!old || !newP) return next(new ErrorHandler(400, 'Please provide old & new password'))
    const isMatch = await compare(old, user.password)
    if (!isMatch) return next(new ErrorHandler(400, 'Old Password entered is incorrect'))
    user.password = newP
    await user.save()
    res.status(200).json({ success: true, msg: 'Password Updated Successfully' })
})

export { login, register, getMyProfile, logOut, searchUser, sendRequest, acceptRequest, getRequests, getFriends, getOnline, lastSeen, unreadChats, markAsRead, updateProfile, updatePassword }