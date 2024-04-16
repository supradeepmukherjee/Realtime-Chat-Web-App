import { alert, new_attachments, new_msg, refetch_chats } from "../constants/events.js"
import { findOtherPerson } from "../lib/helper.js"
import { tryCatch } from "../middlewares/error.js"
import { Chat } from '../models/Chat.js'
import { User } from '../models/User.js'
import { Msg } from '../models/Msg.js'
import { delCloudinaryFiles, emitEvent } from "../utils/features.js"
import { ErrorHandler } from "../utils/utility.js"

const newGrpChat = tryCatch(async (req, res, next) => {
    const { name, members } = req.body
    const allMembers = [...members, req.user]
    const chat = await Chat.create({
        name,
        grpChat: true,
        members: allMembers,
        creator: req.user
    })
    emitEvent(req, alert, allMembers, `Welcome to ${name} Group`)
    emitEvent(req, refetch_chats, members)
    res.status(201).json({ success: true, msg: 'Group Created', chat })
})

const getMyChats = tryCatch(async (req, res, next) => {
    const chats = await Chat.find({ members: req.user }).populate('members', 'name chavi')
    const transformedChats = chats.map(({ _id, name, members, grpChat }) => {
        const otherPerson = findOtherPerson(members, req.user)
        return {
            _id,
            grpChat,
            name: grpChat ? name : otherPerson.name,
            members: members.reduce((prev, curr) => {
                if (curr._id.toString() !== req.user.toString()) prev.push(curr._id)
                return prev
            }, []),
            chavi: grpChat ?
                members.slice(0, 3).map(({ chavi }) => chavi.url)
                :
                [otherPerson.chavi.url]
        }
    })
    res.status(200).json({ success: true, chats: transformedChats })
})

const getMyGrps = tryCatch(async (req, res, next) => {
    const chats = await Chat.find({ creator: req.user }).populate('members', 'name chavi')
    const grps = chats.map(({ members, _id, grpChat, name }) => ({
        _id,
        grpChat,
        name,
        chavi: members.slice(0, 3).map(({ chavi }) => chavi.url)
    }))
    res.status(200).json({ success: true, grps })
})

const addMembers = tryCatch(async (req, res, next) => {
    const { id, members } = req.body
    const chat = await Chat.findById(id)
    if (!chat) return next(new ErrorHandler(404, 'Chat Not Found'))
    if (!chat.grpChat) return next(new ErrorHandler(400, 'Not a Group Chat'))
    if (chat.creator.toString() !== req.user.toString()) return next(new ErrorHandler(403, 'You are not allowed to Add Members'))
    const allNewMembersPromise = members.map(m => User.findById(m, 'name'))
    const allNewMembers = await Promise.all(allNewMembersPromise)
    const uniqueMembers = allNewMembers.filter(m =>
        !chat.members.includes(m._id.toString())
    ).map(m => m._id)
    chat.members.push(...uniqueMembers)
    if (chat.members.length > 100) return next(new ErrorHandler(400, 'There can\'t be more than 100 members'))
    await chat.save()
    const allUsersName = allNewMembers.map(m => m.name).join(',')
    emitEvent(
        req,
        alert,
        chat.members,
        `${allUsersName} ${allUsersName.length > 1 ? 'have' : 'has'} been added to ${chat.name} group`)
    emitEvent(req, refetch_chats, chat.members)
    res.status(200).json({ success: true, msg: 'Members Added Successfully' })
})

const removeMember = tryCatch(async (req, res, next) => {
    const { chatID, userID } = req.body
    const [chat, user] = await Promise.all([Chat.findById(chatID), User.findById(userID, 'name')])
    if (!chat) return next(new ErrorHandler(404, 'Chat Not Found'))
    if (!chat.grpChat) return next(new ErrorHandler(400, 'Not a Group Chat'))
    if (chat.creator.toString() !== req.user.toString()) return next(new ErrorHandler(403, 'You are not allowed to remove Members'))
    if (chat.members.length < 4) return next(new ErrorHandler(400, 'Group must have atleast 3 members'))
    chat.members = chat.members.filter(m => m.toString() !== userID.toString())
    await chat.save()
    emitEvent(
        req,
        alert,
        chat.members,
        `${user.name} has been removed from the group`
    )
    emitEvent(req, refetch_chats, chat.members)
    res.status(200).json({ success: true, msg: 'Removed Successfully' })
})

const leaveGroup = tryCatch(async (req, res, next) => {
    const { id } = req.params
    const chat = await Chat.findById(id)
    if (!chat) return next(new ErrorHandler(404, 'Chat Not Found'))
    if (!chat.grpChat) return next(new ErrorHandler(400, 'Not a Group Chat'))
    if (!chat.members.includes(req.user)) return next(new ErrorHandler(400, 'Person not present in group'))
    if (chat.members.length < 4) return next(new ErrorHandler(400, 'Group must have atleast 3 members'))
    const filterMe = chat.members.filter(m => m.toString() !== req.user.toString())
    if (chat.creator.toString() === req.user.toString()) {
        const remainingMembers = filterMe
        chat.creator = remainingMembers[Math.floor(Math.random() * remainingMembers.length)]
    }
    chat.members = filterMe
    const [user] = await Promise.all([User.findById(req.user, 'name'), chat.save()])
    emitEvent(
        req,
        alert,
        chat.members,
        `${user.name} has left the group`
    )
    res.status(200).json({ success: true, msg: 'Left Group' })
})

const sendAttachments = tryCatch(async (req, res, next) => {
    const { id } = req.body
    const files = req.files || []
    if (files.length < 1) return next(new ErrorHandler(400, 'Please provide attachments'))
    if (files.length > 5) return next(new ErrorHandler(400, 'Max. 5 files can be sent at a time'))
    const [chat, user] = await Promise.all([Chat.findById(id), User.findById(req.user)])
    if (!chat) return next(new ErrorHandler(404, 'Chat Not Found'))
    const attachments = []
    const dbMsg = {
        attachments,
        sender: req.user,
        chat: id
    }
    const realTimeMsg = {
        ...dbMsg,
        sender: {
            id: req.user,
            name: user.name,
            chavi: user.chavi.url
        }
    }
    const msg = await Msg.create(dbMsg)
    emitEvent(req, new_attachments, chat.members, { msg: realTimeMsg, id })
    emitEvent(req, new_msg, chat.members, { id })
    res.status(200).json({ success: true, msg })
})

const getGroupDetails = tryCatch(async (req, res, next) => {
    const { id } = req.params
    if (req.query.populate === '1') {
        const chat = await Chat.findById(id).populate('members', 'name chavi').lean()
        if (!chat) return next(new ErrorHandler(404, 'Chat Not Found'))
        chat.members = chat.members.map(({ _id, name, chavi }) => ({
            _id,
            name,
            chavi: chavi.url
        }))
        res.status(200).json({ success: true, chat })
    } else {
        const chat = await Chat.findById(id)
        if (!chat) return next(new ErrorHandler(404, 'Chat Not Found'))
        res.status(200).json({ success: true, chat })
    }
})

const renameGrp = tryCatch(async (req, res, next) => {
    const chat = await Chat.findById(req.params.id)
    if (!chat) return next(new ErrorHandler(404, 'Chat Not Found'))
    if (!chat.grpChat) return next(new ErrorHandler(400, 'Not a Group Chat'))
    if (chat.creator.toString() !== req.user.toString()) return next(new ErrorHandler(403, 'You are not allowed to change group name'))
    chat.name = req.body.name
    await chat.save()
    emitEvent(req, refetch_chats, chat.members)
    res.status(200).json({ success: true, msg: 'Group Renamed Successfully', chat })
})

const delGroup = tryCatch(async (req, res, next) => {
    const { id } = req.params
    const chat = await Chat.findById(id)
    if (!chat) return next(new ErrorHandler(404, 'Chat Not Found'))
    if (chat.grpChat && chat.creator.toString() !== req.user.toString()) return next(new ErrorHandler(403, 'You are not allowed to delete this group'))
    if (!chat.grpChat && !chat.members.includes(req.user.toString())) return next(new ErrorHandler(403, 'You are not allowed to delete this chat'))
    const msgsWithAttachments = await Msg.findById({
        chat: id,
        attachments: {
            $exists: true,
            $ne: []
        }
    })
    const publicIDs = []
    msgsWithAttachments.forEach(({ attachments }) => {
        attachments.forEach(a => publicIDs.push(a.publicID))
    })
    await Promise.all([
        delCloudinaryFiles(publicIDs),
        // delete one chat,
        // del many msgs using chat id
    ])
    // emitEvent(req,refetch_chats,members)
    res.status(200).json({ success: true, msg: 'Chat Deleted Successfully' })
})

const getMsgs = tryCatch(async (req, res, next) => {
    const { id } = req.params
    const { page } = req.query
    const chat = await Chat.findById(id)
    if (!chat) return next(new ErrorHandler(404, 'No Messages found as chat doesn\'t exist'))
    const limit = 20
    const [totalMsgs, msgs] = await Promise.all([
        Msg.countDocuments({ chat: id }),
        Msg
            .find({ chat: id })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('sender', 'name chavi')
            .lean()
    ])
    const totalPages = Math.ceil(totalMsgs / limit)
    res.status(200).json({ success: true, msgs, totalPages })
})

export { newGrpChat, getMyChats, getMyGrps, addMembers, removeMember, leaveGroup, sendAttachments, getGroupDetails, renameGrp, delGroup, getMsgs }