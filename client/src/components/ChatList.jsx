import { Stack } from "@mui/material"
import ChatItem from './shared/ChatItem'

const ChatList = ({
    w = '100%',
    chats = [],
    id,
    newMsgsAlert,
    deleteChatHandler
}) => {
    return (
        <Stack width={w}>
            {chats.map(({ _id, name, chavi, members, grpChat }, i) => {
                const newMsgAlert = newMsgsAlert.find(({ id }) => id === _id)
                return <ChatItem key={i} name={name} chavi={chavi} id={_id} newMsgAlert={newMsgAlert} grpChat={grpChat} selected={id === _id} deleteChatHandler={deleteChatHandler} i={i} />
            })}
        </Stack>
    )
}

export default ChatList