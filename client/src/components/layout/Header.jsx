import { lazy, Suspense, useState } from 'react'
import { AppBar, Backdrop, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Menu, Search as SearchIcon, Add, Group, ExitToApp as LogoutIcon, Notifications as NotificationIcon } from '@mui/icons-material'
const Search = lazy(() => import('../dialog/Search'))
const Notification = lazy(() => import('../dialog/Notification'))
const NewGroup = lazy(() => import('../dialog/NewGroup'))
const Logout = lazy(() => import('../dialog/Logout'))

const Header = () => {
    const navigate = useNavigate()
    const [searchOpen, setSearchOpen] = useState(false)
    const [groupOpen, setGroupOpen] = useState(false)
    const [notificationOpen, setNotificationOpen] = useState(false)
    const [logoutOpen, setLogoutOpen] = useState(false)
    const mobileHandler = e => {

    }
    const toggleSearchDialog = () => setSearchOpen(open => !open)
    const newGroup = () => setGroupOpen(open => !open)
    const toggleNotifications = () => setNotificationOpen(open => !open)
    const toggleLogoutDialog = () => setLogoutOpen(open => !open)
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
                            <IconButton color='inherit' onClick={mobileHandler}>
                                <Menu />
                            </IconButton>
                        </Box>
                        <Box sx={{ flexGrow: 1 }} />
                        <Box>
                            <Button title='Search User' onClick={toggleSearchDialog} icon={<SearchIcon />} />
                            <Button title='Create a Group' onClick={newGroup} icon={<Add />} />
                            <Button title='Go to Groups' onClick={() => navigate('/groups')} icon={<Group />} />
                            <Button title={`Notifications(${0})`} onClick={toggleNotifications} icon={<NotificationIcon />} />
                            <Button title='Logout' onClick={toggleLogoutDialog} icon={<LogoutIcon />} />
                        </Box>
                    </Toolbar>
                </AppBar>
            </Box>
            {searchOpen &&
                <Suspense fallback={<Backdrop open />}>
                    <Search />
                </Suspense>
            }
            {groupOpen &&
                <Suspense fallback={<Backdrop open />}>
                    <NewGroup />
                </Suspense>
            }
            {notificationOpen &&
                <Suspense fallback={<Backdrop open />}>
                    <Notification />
                </Suspense>
            }
            {logoutOpen &&
                <Suspense fallback={<Backdrop open />}>
                    <Logout closeHandler={toggleLogoutDialog} open={logoutOpen} />
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