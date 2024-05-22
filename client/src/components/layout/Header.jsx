import { Add, Delete, Edit, ExitToApp as LogoutIcon, Group, Menu, Notifications as NotificationIcon, Search as SearchIcon } from '@mui/icons-material'
import { AppBar, Backdrop, Badge, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import { lazy, Suspense, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useLazyGetNotificationsQuery } from '../../redux/api'
import { resetNotificationCount, setNotificationCount } from '../../redux/reducers/chat'
import { setIsDelAccount, setIsEditAccount, setIsLogout, setIsMobile, setIsNewGrp, setIsNotification, setIsSearch } from '../../redux/reducers/misc'
const DelAccount = lazy(() => import('../dialog/DelAccount'))
const EditAccount = lazy(() => import('../dialog/EditAccount'))
const Search = lazy(() => import('../dialog/Search'))
const Notification = lazy(() => import('../dialog/Notification'))
const NewGroup = lazy(() => import('../dialog/NewGroup'))
const Logout = lazy(() => import('../dialog/Logout'))

const Header = ({ unreadChats }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { isMobile, isSearch, isNotification, isNewGrp, isLogout, isDelAccount, isEditAccount } = useSelector(({ misc }) => misc)
    const { notificationCount } = useSelector(({ chat }) => chat)
    const [getNotifications] = useLazyGetNotificationsQuery()
    const openNotification = () => {
        dispatch(setIsNotification(true))
        dispatch(resetNotificationCount())
    }
    useEffect(() => {
        getNotifications()
            .then(({ data }) => dispatch(setNotificationCount(data.requests.length)))
            .catch(err => console.log(err))
    }, [dispatch, getNotifications])
    return (
        <>
            <Box className='grow h-16'>
                <AppBar className='!bg-green-500'>
                    <Toolbar>
                        <Typography variant='h6' sx={{
                            display: {
                                xs: 'none',
                                sm: 'block'
                            }
                        }}>
                            Chat
                        </Typography>
                        <Box sx={{
                            display: {
                                sm: 'none',
                                xs: 'block'
                            }
                        }}>
                            <IconButton color='inherit' onClick={() => dispatch(setIsMobile(!isMobile))}>
                                <Menu />
                            </IconButton>
                        </Box>
                        {unreadChats > 0 && <Box className={`w-[20px] h-[20px] rounded-[50px] bg-red-500 text-white ml-3 flex items-center justify-center text-xs`}>
                            <>
                                {unreadChats}
                            </>
                        </Box>}
                        <Box sx={{ flexGrow: 1 }} />
                        <Box>
                            <Button title='Delete Account' onClick={() => dispatch(setIsDelAccount(!isDelAccount))} icon={<Delete />} />
                            <Button title='Update Account' onClick={() => dispatch(setIsEditAccount(!isEditAccount))} icon={<Edit />} />
                            <Button title='Search User' onClick={() => dispatch(setIsSearch(!isSearch))} icon={<SearchIcon />} />
                            <Button title='Create a Group' onClick={() => dispatch(setIsNewGrp(!isNewGrp))} icon={<Add />} />
                            <Button title='Go to Groups' onClick={() => navigate('/groups')} icon={<Group />} />
                            <Button title={`Notifications(${notificationCount})`} showBadge={true} onClick={openNotification} icon={<NotificationIcon />} count={notificationCount} />
                            <Button title='Logout' onClick={() => dispatch(setIsLogout(!isLogout))} icon={<LogoutIcon />} />
                        </Box>
                    </Toolbar>
                </AppBar>
            </Box>
            {isEditAccount &&
                <Suspense fallback={<Backdrop open />}>
                    <EditAccount />
                </Suspense>
            }
            {isDelAccount &&
                <Suspense fallback={<Backdrop open />}>
                    <DelAccount />
                </Suspense>
            }
            {isSearch &&
                <Suspense fallback={<Backdrop open />}>
                    <Search />
                </Suspense>
            }
            {isNewGrp &&
                <Suspense fallback={<Backdrop open />}>
                    <NewGroup />
                </Suspense>
            }
            {isNotification &&
                <Suspense fallback={<Backdrop open />}>
                    <Notification />
                </Suspense>
            }
            {isLogout &&
                <Suspense fallback={<Backdrop open />}>
                    <Logout />
                </Suspense>
            }
        </>
    )
}

const Button = ({ title, icon, onClick, showBadge, count }) => {
    return (
        <Tooltip title={title}>
            <IconButton color='inherit' size='large' onClick={onClick} >
                {showBadge ? <Badge badgeContent={count} color="error">
                    {icon}
                </Badge>
                    :
                    icon
                }
            </IconButton>
        </Tooltip>
    )
}

export default Header