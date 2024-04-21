/* eslint-disable react-hooks/rules-of-hooks */
import { Drawer, Grid, Skeleton } from '@mui/material'
import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { new_msg_alert, new_req, refetch_chats } from '../../constants/events'
import useErrors from '../../hooks/useErrors'
import useSocketEvents from '../../hooks/useSocketEvents'
import { useMyChatsQuery } from '../../redux/api'
import { setIsMobile } from '../../redux/reducers/misc'
import { incrementNotificationCount, setNewMsgsAlert } from '../../redux/reducers/chat'
import { getSocket } from '../../socket'
import ChatList from '../ChatList'
import Profile from '../shared/Profile'
import Title from '../shared/Title'
import Header from './Header'
import { getOrSave_Storage } from '../../lib/features'

const Layout = () => WrappedComponent => {
    // eslint-disable-next-line react/display-name
    return p => {
        const { id } = useParams()
        const dispatch = useDispatch()
        const { isAddMember, isMobile, isDeleteMenu, selectedDelChat } = useSelector(({ misc }) => misc)
        const { newMsgsAlert } = useSelector(({ chat }) => chat)
        const { isLoading, data, isError, error, refetch } = useMyChatsQuery()
        const socket = getSocket()
        const deleteChatHandler = async (e, id, grpChat) => {

        }
        const newMsgAlertHandler = useCallback(data => {
            if (data.id === id) return
            dispatch(setNewMsgsAlert(data.id))
        }, [dispatch, id])
        const newReqListener = useCallback(() => {
            dispatch(incrementNotificationCount())
        }, [dispatch])
        const refetchListener = useCallback(() => {
            refetch()
        }, [refetch])
        const eventHandlers = {
            [new_msg_alert]: newMsgAlertHandler,
            [new_req]: newReqListener,
            [refetch_chats]: refetchListener,
        }
        useSocketEvents(socket, eventHandlers)
        useErrors([{ isError, error }])
        useEffect(() => {
            getOrSave_Storage(false, new_msg_alert, newMsgsAlert)
        }, [newMsgsAlert])
        return (
            <>
                <Title />
                <Header unreadChats={newMsgsAlert.length - 1} />
                {isLoading ? <Skeleton /> :
                    <Drawer open={isMobile} onClose={() => dispatch(setIsMobile(!isMobile))}>
                        <ChatList w='70vw' chats={data?.chats} id={id} deleteChatHandler={deleteChatHandler} newMsgsAlert={newMsgsAlert} />
                    </Drawer>}
                <Grid container height={'calc(100vh - 4rem)'}>
                    <Grid
                        item
                        sm={4}
                        md={3}
                        sx={{
                            display: {
                                xs: 'none',
                                sm: 'block'
                            },
                            height: '100%',
                            overflowY: 'auto'
                        }}>
                        {isLoading ? <Skeleton /> : <ChatList chats={data?.chats} id={id} deleteChatHandler={deleteChatHandler} newMsgsAlert={newMsgsAlert} />}
                    </Grid>
                    <Grid item xs={12} sm={8} md={5} lg={6} height='100%'>
                        <WrappedComponent {...p} />
                    </Grid>
                    <Grid
                        item
                        md={4}
                        lg={3}
                        sx={{
                            display: {
                                xs: 'none',
                                md: 'block'
                            },
                            p: '2rem',
                            bgcolor: 'rgba(0,0,0,.8)'
                        }}
                        height='100%'>
                        <Profile />
                    </Grid>
                </Grid>
            </>)
    }
}

export default Layout