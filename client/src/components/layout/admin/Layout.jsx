import { Close, Dashboard, Group, Logout, ManageAccounts, Menu, Message } from "@mui/icons-material"
import { Box, Drawer, Grid, IconButton, Stack, Typography } from "@mui/material"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Navigate, useLocation } from "react-router-dom"
import { Link } from "../../Styled"
import { adminLogout } from '../../../redux/thunks/admin'

const Layout = ({ children }) => {
    const [mobile, setMobile] = useState(false)
    const { isAdmin } = useSelector(({ auth }) => auth)
    const handleMobile = () => setMobile(!mobile)
    if (!isAdmin) return <Navigate to='/admin' />
    return (
        <Grid container minHeight='100vh'>
            <Box sx={{
                position: 'fixed',
                right: '1rem',
                top: '1rem',
                display: { xs: 'block', md: 'none' }
            }}>
                <IconButton onClick={handleMobile}>
                    {mobile ? <Close /> : <Menu />}
                </IconButton>
            </Box>
            <Grid
                item
                md={4}
                lg={3}
                sx={{
                    display: {
                        xs: 'none',
                        md: 'block'
                    }
                }}>
                <Sidebar />
            </Grid>
            <Grid
                item
                xs={12}
                md={8}
                lg={9}
                bgcolor='#f5f5f5'
            >
                {children}
            </Grid>
            <Drawer open={mobile} onClose={handleMobile}>
                <Sidebar w='50vw' />
            </Drawer>
        </Grid>
    )
}

const Sidebar = ({ w = '100%' }) => {
    const { pathname } = useLocation()
    const dispatch = useDispatch()
    const logoutHandler = async () => {
        dispatch(adminLogout())
    }
    const tabs = [
        {
            name: 'Dashboard',
            path: '/admin/dashboard',
            icon: <Dashboard />
        },
        {
            name: 'Users',
            path: '/admin/users',
            icon: <ManageAccounts />
        },
        {
            name: 'Chats',
            path: '/admin/chats',
            icon: <Group />
        },
        {
            name: 'Messages',
            path: '/admin/msgs',
            icon: <Message />
        },
    ]
    return (
        <Stack width={w} className='p-12 gap-12'>
            <Typography variant='h5' textTransform='uppercase'>
                Chat Admin
            </Typography>
            <Stack spacing='1rem'>
                {tabs.map(({ name, path, icon }) => (
                    <Link
                        key={path}
                        to={path}
                        style={pathname === path ? {
                            backgroundColor: 'black',
                            borderRadius: '1rem',
                            color: 'white'
                        } : {}}
                    >
                        <Stack className='!flex-row items-center gap-4'>
                            {icon}
                            <Typography fontSize='1.1rem'>
                                {name}
                            </Typography>
                        </Stack>
                    </Link>
                ))}
                <Link onClick={logoutHandler}>
                    <Stack className='!flex-row items-center gap-4'>
                        <Logout />
                        <Typography fontSize='1.1rem'>
                            Log Out
                        </Typography>
                    </Stack>
                </Link>
            </Stack>
        </Stack>
    )
}

export default Layout