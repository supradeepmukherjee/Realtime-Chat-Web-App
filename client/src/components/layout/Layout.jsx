import Header from './Header'
import Title from '../shared/Title'
import { Drawer, Grid, Skeleton } from '@mui/material'
import ChatList from '../ChatList'
import { sample } from '../../constants/sample'
import { useParams } from 'react-router-dom'
import Profile from '../shared/Profile'
import { useMyChatsQuery } from '../../redux/api/api'
import { useDispatch, useSelector } from 'react-redux'
import { setIsMobile } from '../../redux/reducers/misc'
import { useErrors } from '../../hooks/hook'

const Layout = () => WrappedComponent => {
    // eslint-disable-next-line react/display-name
    return p => {
        const { id } = useParams()
        const dispatch = useDispatch()
        const { isNewGrp, isAddMember, isNotification, isMobile, isSearch, isFileMenu, isDeleteMenu, uploadingLoader, selectedDelChat } = useSelector(state => state.misc)
        const { isLoading, data, isError, refetch, error } = useMyChatsQuery()
        const deleteChatHandler = async (e, id, grpChat) => {

        }
        useErrors([{ isError, error }])
        return (
            <>
                <Title />
                <Header />
                {isLoading ? <Skeleton /> :
                    <Drawer open={isMobile} onClose={() => dispatch(setIsMobile(!isMobile))}>
                        <ChatList w='70vw' chats={data?.chats} id={id} deleteChatHandler={deleteChatHandler} />
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
                        {isLoading ? <Skeleton /> : <ChatList chats={data?.chats} id={id} deleteChatHandler={deleteChatHandler} />}
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