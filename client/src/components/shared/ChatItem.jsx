import { Avatar as Chavi, Box, Stack, Typography } from "@mui/material"
import { motion } from 'framer-motion'
import { memo } from "react"
import { useDispatch, useSelector } from "react-redux"
import useMutation from "../../hooks/useMutation"
import { transformImg } from "../../lib/features"
import { useLazyUnreadQuery, useReadMutation } from "../../redux/api"
import { setFreshNewMsgsAlert } from "../../redux/reducers/chat"
import { Link } from "../Styled"

const ChatItem = ({
    chavi,
    name,
    id,
    grpChat = false,
    selected,
    newMsgAlert,
    i = 0,
    deleteChatHandler
}) => {
    const { user } = useSelector(({ auth }) => auth)
    const dispatch = useDispatch()
    const [readChat] = useMutation(useReadMutation)
    const [getUnread] = useLazyUnreadQuery()
    const clickHandler = async () => {
        await readChat('Marked as Read', { userID: user._id, chatID: id })
        getUnread(user._id)
            .then(({ data }) => dispatch(setFreshNewMsgsAlert(data.unread.unread)))
            .catch(err => console.log(err))
    }
    return (
        <Link to={`/chat/${id}`}
            onContextMenu={() => deleteChatHandler(name, grpChat, id)} sx={{ p: 0 }}
            onClick={clickHandler}
        >
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
                    <Chavi src={transformImg(chavi)} alt='chavi' />
                    <Stack>
                        <Typography>
                            {name}
                        </Typography>
                    </Stack>
                    {newMsgAlert && <Box className='w-[20px] h-[20px] rounded-[50px] bg-green-500 text-white absolute right-4 flex items-center justify-center text-xs'>
                        {newMsgAlert &&
                            <>
                                {newMsgAlert.qty}
                            </>}
                    </Box>}
                </div>
            </motion.div>
        </Link>
    )
}

export default memo(ChatItem)