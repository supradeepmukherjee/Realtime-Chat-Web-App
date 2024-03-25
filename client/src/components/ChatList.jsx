import { Stack } from "@mui/material"
import ChatItem from './shared/ChatItem'

const ChatList = ({
    w = '100%',
    chats = [],
    id,
    online = [],
    newMsgsAlert = [{
        id: null,
        count: 0
    }],
    deleteChatHandler
}) => {
    return (
        <Stack width={w}         >
            {chats.map(({ _id, name, chavi, members, grpChat }, i) => {
                const newMsgAlert = newMsgsAlert.find(({ id }) => id === _id)
                const isOnline = members.some(_ => online.includes(_id))
                return <ChatItem key={i} name={name} chavi={chavi} id={_id} newMsgAlert={newMsgAlert} isOnline={isOnline} grpChat={grpChat} sameSender={id === _id} deleteChatHandler={deleteChatHandler} />
            })}
        </Stack>
    )
}

export default ChatList