import { Backdrop, Stack } from "@mui/material"
import { Suspense } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setIsDelChat, setSelectedDelChat } from '../redux/reducers/misc'
import DelChat from "./dialog/DelChat"
import ChatItem from './shared/ChatItem'

const ChatList = ({
    w = '100%',
    chats = [],
    id,
    newMsgsAlert,
}) => {
    const { isDelChat, selectedDelChat } = useSelector(({ misc }) => misc)
    const dispatch = useDispatch()
    const selectChat = async (name, grp, id) => {
        dispatch(setIsDelChat(true))
        dispatch(setSelectedDelChat({ name, grp, id }))
    }
    const openCloseDialog = () => dispatch(setIsDelChat(!isDelChat))
    return (
        <Stack width={w}>
            {chats.map(({ _id, name, chavi, grpChat }, i) => {
                const newMsgAlert = newMsgsAlert.find(({ chat }) => chat === _id)
                return <ChatItem key={i} name={name} chavi={chavi} id={_id} newMsgAlert={newMsgAlert} grpChat={grpChat} selected={id === _id} deleteChatHandler={selectChat} i={i} />
            })}
            {isDelChat &&
                <Suspense fallback={<Backdrop open />}>
                    <DelChat name={selectedDelChat.name} grp={selectedDelChat.grp} openClose={openCloseDialog}/>
                </Suspense>
            }
        </Stack>
    )
}

export default ChatList