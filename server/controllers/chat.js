import { alert, refetch_chats } from "../constants/events.js"
import { findOtherPerson } from "../lib/helper.js"
import { tryCatch } from "../middlewares/error.js"
import { Chat } from '../models/Chat.js'
import { emitEvent } from "../utils/features.js"
import { ErrorHandler } from "../utils/utility.js"

const newGrpChat = tryCatch(async (req, res, next) => {
    const { name, members } = req.body
    if (members.length < 2) return next(new ErrorHandler(400, 'Group must have atleast 3 members'))
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

export { newGrpChat, getMyChats, getMyGrps }
