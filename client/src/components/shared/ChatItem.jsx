import { Box, Stack, Typography } from "@mui/material"
import { memo } from "react"
import { Link } from "../Styled"
import ChaviCard from "./ChaviCard"
import { motion } from 'framer-motion'

const ChatItem = ({
    chavi = [],
    name,
    id,
    grpChat = false,
    selected,
    isOnline,
    newMsgAlert,
    i = 0,
    deleteChatHandler
}) => {
    return (
        <Link to={`/chat/${id}`} onContextMenu={e => deleteChatHandler(e, id, grpChat)} sx={{ p: 0 }}>
            <motion.div
                initial={{
                    opacity: 0,
                    y: '-100%'
                }}
                animate={{
                    opacity: 1,
                    y: '0'
                }}
                transition={{ delay: i * .15 }}
                onContextMenu={e => e.preventDefault()}
            >
                <div className={`flex items-center p-4 gap-4 relative ${selected ? 'bg-[#000] text-[#fff]' : ''}`}>
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
            </motion.div>
        </Link>
    )
}

export default memo(ChatItem)