import { Stack } from "@mui/material"
import ChatItem from './shared/ChatItem'

const ChatList = ({
    w = '100%',
    chats = [],
    id,
    online = [],
    newMsgsAlert,
    deleteChatHandler
}) => {
    return (
        <Stack width={w}>
            {chats.map(({ _id, name, chavi, members, grpChat }, i) => {
                const newMsgAlert = newMsgsAlert.find(({ id }) => id === _id)
                let isOnline
                if (members.length < 3) isOnline = online.includes(members[0])
                return <ChatItem key={i} name={name} chavi={chavi} id={_id} newMsgAlert={newMsgAlert} isOnline={isOnline} grpChat={grpChat} selected={id === _id} deleteChatHandler={deleteChatHandler} i={i} />
            })}
        </Stack>
    )
}

export default ChatList