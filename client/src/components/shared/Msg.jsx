/* eslint-disable react/prop-types */
import { Box, Typography } from "@mui/material"
import moment from "moment"
import { memo } from "react"
import { fileFormat } from '../../lib/features'
import RenderAttachment from "./RenderAttachment"
import { motion } from 'framer-motion'
import { setIsDelMsg, setSelectedDelMsg } from "../../redux/reducers/misc"
import { useDispatch } from "react-redux"
import toast from "react-hot-toast"

const Msg = ({ msg, user }) => {
    const { sender, content, attachments, createdAt, _id: msgID } = msg
    const { _id, name, id } = sender
    const sameSender = (id || _id) === user._id
    const dispatch = useDispatch()
    const delMsgHandler = () => {
        if (!msgID) return toast.error('Message can be deleted only after reloading the page')
        dispatch(setIsDelMsg(true))
        dispatch(setSelectedDelMsg(msgID))
    }
    return (
        <div
            onContextMenu={e => {
                e.preventDefault()
                delMsgHandler()
            }}
            className={`${sameSender ? 'self-end' : 'self-start'} bg-white w-fit rounded p-2`}
        >
            <motion.div
                initial={{
                    opacity: 0,
                    x: '-100%'
                }}
                animate={{
                    opacity: 1,
                    x: '0'
                }}
            >
                {!sameSender &&
                    <Typography className="text-[#2694ab] font-semibold" variant='caption'>
                        {name}
                    </Typography>
                }
                {content &&
                    <Typography>
                        {content}
                    </Typography>
                }
                {attachments?.map(({ url }) => {
                    const file = fileFormat(url)
                    return (
                        <Box key={url}>
                            <a href={url} target='_blank' className="text-black">
                                {RenderAttachment(file, url)}
                            </a>
                        </Box>
                    )
                })}
                <Typography variant='caption' color='text.secondary'>
                    {moment(createdAt).fromNow()}
                </Typography>
            </motion.div>
        </div>
    )
}

export default memo(Msg)