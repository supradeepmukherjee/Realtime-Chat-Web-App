import { Add, ExitToApp as LogoutIcon, Group, Menu, Notifications as NotificationIcon, Search as SearchIcon } from '@mui/icons-material'
import { AppBar, Backdrop, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import { lazy, Suspense } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setIsLogout, setIsMobile, setIsNewGrp, setIsNotification, setIsSearch } from '../../redux/reducers/misc'
const Search = lazy(() => import('../dialog/Search'))
const Notification = lazy(() => import('../dialog/Notification'))
const NewGroup = lazy(() => import('../dialog/NewGroup'))
const Logout = lazy(() => import('../dialog/Logout'))

const Header = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { isMobile, isSearch, isNotification, isNewGrp, isLogout } = useSelector(({ misc }) => misc)
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
                        <Box sx={{ flexGrow: 1 }} />
                        <Box>
                            <Button title='Search User' onClick={() => dispatch(setIsSearch(!isSearch))} icon={<SearchIcon />} />
                            <Button title='Create a Group' onClick={() => dispatch(setIsNewGrp(!isNewGrp))} icon={<Add />} />
                            <Button title='Go to Groups' onClick={() => navigate('/groups')} icon={<Group />} />
                            <Button title={`Notifications(${0})`} onClick={() => dispatch(setIsNotification(!isNotification))} icon={<NotificationIcon />} />
                            <Button title='Logout' onClick={() => dispatch(setIsLogout(!isLogout))} icon={<LogoutIcon />} />
                        </Box>
                    </Toolbar>
                </AppBar>
            </Box>
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

const Button = ({ title, icon, onClick }) => {
    return (
        <Tooltip title={title}>
            <IconButton color='inherit' size='large' onClick={onClick} >
                {icon}
            </IconButton>
        </Tooltip>
    )
}

export default Header