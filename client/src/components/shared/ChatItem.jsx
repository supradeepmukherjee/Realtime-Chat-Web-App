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
                    </Stack>
                    {isOnline || newMsgAlert && <Box className={`w-[20px] h-[20px] rounded-[50px] ${isOnline ? 'bg-green-500' : 'bg-red-500'} text-white absolute right-4 flex items-center justify-center`}>
                        {newMsgAlert &&
                            <Typography>
                                {newMsgAlert.count}
                            </Typography>}
                    </Box>}
                </div>
            </div>
        </Link>
    )
}

export default memo(ChatItem)