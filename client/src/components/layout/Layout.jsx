/* eslint-disable react-hooks/rules-of-hooks */
import { Drawer, Grid, Skeleton } from '@mui/material'
import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { new_msg_alert, new_req, refetch_chats } from '../../constants/events'
import useErrors from '../../hooks/useErrors'
import useMutation from '../../hooks/useMutation'
import useSocketEvents from '../../hooks/useSocketEvents'
import { useMyChatsQuery, useReadMutation, useUnreadQuery } from '../../redux/api'
import { incrementNotificationCount, setFreshNewMsgsAlert, setNewMsgsAlert } from '../../redux/reducers/chat'
import { setIsMobile } from '../../redux/reducers/misc'
import { getSocket } from '../../socket'
import ChatList from '../ChatList'
import Profile from '../shared/Profile'
import Title from '../shared/Title'
import Header from './Header'

const Layout = () => WrappedComponent => {
    // eslint-disable-next-line react/display-name
    return p => {
        const { id } = useParams()
        const dispatch = useDispatch()
        const navigate = useNavigate()
        const [readChat] = useMutation(useReadMutation)
        const { isMobile } = useSelector(({ misc }) => misc)
        const { newMsgsAlert } = useSelector(({ chat }) => chat)
        const { user } = useSelector(({ auth }) => auth)
        const { isLoading, data, isError, error, refetch } = useMyChatsQuery()
        const { isLoading: unreadLoading, data: unreadData, isError: unreadIsError, error: unreadError } = useUnreadQuery(user._id)
        const socket = getSocket()
        const newMsgAlertHandler = useCallback(data => {
            if (data.id === id) return
            dispatch(setNewMsgsAlert(data.id))
        }, [dispatch, id])
        const newReqListener = useCallback(() => {
            dispatch(incrementNotificationCount())
        }, [dispatch])
        const refetchListener = useCallback(() => {
            refetch()
            navigate('/')
        }, [navigate, refetch])
        const eventHandlers = {
            [new_msg_alert]: newMsgAlertHandler,
            [new_req]: newReqListener,
            [refetch_chats]: refetchListener
        }
        useSocketEvents(socket, eventHandlers)
        useErrors([
            { isError, error },
            { unreadIsError, unreadError },
        ])
        useEffect(() => {
            if (unreadData) {
                console.log(unreadData)
                const { unread } = unreadData
                dispatch(setFreshNewMsgsAlert(unread.unread))
            }
        }, [unreadData])
        useEffect(() => {
            return () => {
                readChat('Marked as Read', { userID: user._id, chatID: id })
            }
        }, [id, user._id])
        console.log(newMsgsAlert)
        return (
            <>
                <Title />
                <Header unreadChats={newMsgsAlert.length} />
                {(isLoading || unreadLoading) ? <Skeleton /> :
                    <Drawer open={isMobile} onClose={() => dispatch(setIsMobile(!isMobile))}>
                        <ChatList w='70vw' chats={data?.chats} id={id} newMsgsAlert={newMsgsAlert} />
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
                        {(isLoading || unreadLoading) ? <Skeleton /> : <ChatList chats={data?.chats} id={id} newMsgsAlert={newMsgsAlert} />}
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
                        <Profile data={data?.chats?.filter(({ _id }) => _id.toString() === id)[0]} id={id} />
                    </Grid>
                </Grid>
            </>)
    }
}

export default Layout