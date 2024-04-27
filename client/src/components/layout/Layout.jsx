/* eslint-disable react-hooks/rules-of-hooks */
import { Drawer, Grid, Skeleton } from '@mui/material'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { is_online, new_msg_alert, new_req, refetch_chats, was_online } from '../../constants/events'
import useErrors from '../../hooks/useErrors'
import useSocketEvents from '../../hooks/useSocketEvents'
import { getOrSave_Storage } from '../../lib/features'
import { useGetOnlineQuery, useMyChatsQuery } from '../../redux/api'
import { incrementNotificationCount, setNewMsgsAlert } from '../../redux/reducers/chat'
import { setIsDeleteMenu, setIsMobile, setSelectedDelChat } from '../../redux/reducers/misc'
import { getSocket } from '../../socket'
import ChatList from '../ChatList'
import DelChatMenu from '../dialog/DelChatMenu'
import Profile from '../shared/Profile'
import Title from '../shared/Title'
import Header from './Header'

const Layout = () => WrappedComponent => {
    // eslint-disable-next-line react/display-name
    return p => {
        const { id } = useParams()
        const dispatch = useDispatch()
        const navigate = useNavigate()
        const anchorEl = useRef(null)
        const [online, setOnline] = useState([])
        const { isMobile, isDeleteMenu, selectedDelChat } = useSelector(({ misc }) => misc)
        const { newMsgsAlert } = useSelector(({ chat }) => chat)
        const { isLoading, data, isError, error, refetch } = useMyChatsQuery()
        const { isError: onlineIsError, error: onlineError, data: onlineData } = useGetOnlineQuery()
        const socket = getSocket()
        const deleteChatHandler = async (e, id, grpChat) => {
            anchorEl.current = e.currentTarget
            dispatch(setIsDeleteMenu(true))
            dispatch(setSelectedDelChat({ id, grpChat }))
        }
        const closeDelChatMenu = () => dispatch(setIsDeleteMenu(false))
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
        const isOnlineListener = useCallback(data => {
            setOnline(prev => [...prev, data.id])
        }, [])
        const wasOnlineListener = useCallback(data => {
            const newOnline = online.filter(o => o !== data.id)
            setOnline(newOnline)
        }, [online])
        const eventHandlers = {
            [new_msg_alert]: newMsgAlertHandler,
            [new_req]: newReqListener,
            [refetch_chats]: refetchListener,
            [is_online]: isOnlineListener,
            [was_online]: wasOnlineListener,
        }
        useSocketEvents(socket, eventHandlers)
        useErrors([
            { isError, error },
            { isError: onlineIsError, error: onlineError }
        ])
        useEffect(() => {
            getOrSave_Storage(false, new_msg_alert, newMsgsAlert)
        }, [newMsgsAlert])
        useEffect(() => {
            if (onlineData) setOnline(onlineData?.users)
        }, [onlineData])
        return (
            <>
                <Title />
                <Header unreadChats={newMsgsAlert.length - 1} />
                {isLoading ? <Skeleton /> :
                    <Drawer open={isMobile} onClose={() => dispatch(setIsMobile(!isMobile))}>
                        <ChatList online={online} w='70vw' chats={data?.chats} id={id} deleteChatHandler={deleteChatHandler} newMsgsAlert={newMsgsAlert} />
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
                        {isLoading ? <Skeleton /> : <ChatList online={online} chats={data?.chats} id={id} deleteChatHandler={deleteChatHandler} newMsgsAlert={newMsgsAlert} />}
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
                <DelChatMenu open={isDeleteMenu} closeHandler={closeDelChatMenu} anchorEl={anchorEl.current} selectedDelChat={selectedDelChat} />
            </>)
    }
}

export default Layout