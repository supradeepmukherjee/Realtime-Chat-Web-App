import { tryCatch } from "../middlewares/error.js"
import { User } from '../models/User.js'
import { Chat } from '../models/Chat.js'
import { Msg } from '../models/Msg.js'

const getUsers = tryCatch(async (req, res) => {
    const rawUsers = await User.find()
        .populate('members', 'name chavi')
        .populate('creator', 'name chavi')
    const users = await Promise.all(rawUsers.map(async ({ name, uName, chavi, _id }) => {
        const [grps, friends] = await Promise.all([
            Chat.countDocuments({
                grpChat: true,
                members: _id
            }),
            Chat.countDocuments({
                grpChat: false,
                members: _id
            }),
        ])
        return {
            name,
            uName,
            chavi: chavi.url,
            _id,
            grps,
            friends
        }
    }))
    res.status(200).json({ success: true, users })
})

const getChats = tryCatch(async (req, res) => {
    const rawChats = await Chat.find()
    const chats = await Promise.all(rawChats.map(async ({ name, grpChat, _id, members, creator }) => {
        const totalMsgs = await Msg.countDocuments({ chat: _id })
        return {
            _id,
            name,
            grpChat,
            totalMsgs,
            // chavi: members.slice(0, 3).map(({ chavi }) => chavi.url),
            totalMembers: members.length,
            members: members.map(({ _id, name, chavi }) => ({
                _id,
                name,
                // chavi: chavi.url
            })),
            // creator: {
            //     name: creator?.name || 'None',
            //     chavi: creator?.chavi.url || null
            // },
        }
    }))
    res.status(200).json({ success: true, chats })
})

const getMsgs = tryCatch(async (req, res) => {
    const rawMsgs = await Msg.find()
    res.status(200).json({ success: true, msgs })
})

const logOut = tryCatch(async (req, res) => {

    res.status(200).json({ success: true, })
})

export { getUsers, getChats, getMsgs, logOut }