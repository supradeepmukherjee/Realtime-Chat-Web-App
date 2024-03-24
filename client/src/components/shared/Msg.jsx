import { Box, Typography } from "@mui/material"
import moment from "moment"
import { memo } from "react"
import { fileFormat } from '../../lib/features'
import RenderAttachment from "./RenderAttachment"

const Msg = ({ msg, user }) => {
    const { sender, content, attachments, createdAt } = msg
    const { _id, name } = sender
    const sameSender = _id === user._id
    return (
        <div className={`!self-${sameSender ? 'end' : 'start'} bg-white w-fit rounded p-2`}>
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
            {attachments?.map(({ url, publicId }) => {
                const file = fileFormat(url)
                return (
                    <Box key={publicId}>
                        <a href={url} target='_blank' className="text-black">
                            {RenderAttachment(file,url)}33930
                        </a>
                    </Box>
                )
            })}
            <Typography variant='caption' color='text.secondary'>
                {moment(createdAt).fromNow()}
            </Typography>
        </div>
    )
}

export default memo(Msg)