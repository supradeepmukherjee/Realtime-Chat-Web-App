import { Box, Stack, Typography } from "@mui/material"
import { memo } from "react"
import { Link } from "../Styled"
import ChaviCard from "./ChaviCard"

const ChatItem = ({
    chavi = [],
    name,
    id,
    grpChat = false,
    sameSender,
    isOnline,
    newMsgAlert,
    i = 0,
    deleteChatHandler
}) => {
    return (
        <Link to={`/chat/${id}`} onContextMenu={e => deleteChatHandler(e, id, grpChat)} sx={{ p: 0 }}>
            <div onContextMenu={e => e.preventDefault()}>
                <div className={`flex items-center justify- p-4 gap-4 relative ${sameSender ? 'bg-[#000] text-[#fff]' : ''}`}>
                    <ChaviCard chavi={chavi} />
                    <Stack>
                        <Typography>
                            {name}
                        </Typography>
                        {newMsgAlert &&
                            <Typography>
                                {newMsgAlert.count} New Message(s)
                            </Typography>}
                    </Stack>
                    {isOnline && <Box className='w-[10px] h-[10px] rounded-[50px] bg-green-500 absolute top-1/2 right-4' />}
                </div>
            </div>
        </Link>
    )
}

export default memo(ChatItem)