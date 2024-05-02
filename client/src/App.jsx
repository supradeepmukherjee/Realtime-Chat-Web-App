import axios from 'axios';
import { lazy, Suspense, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Loader } from './components/layout/Loader';
import { server } from './constants/config';
import { userExists, userNotExists } from './redux/reducers/auth';
import { SocketProvider } from './socket';
const Home = lazy(() => import('./pages/Home'))
const RegisterLogin = lazy(() => import('./pages/RegisterLogin'))
const Chat = lazy(() => import('./pages/Chat'))
const Groups = lazy(() => import('./pages/Groups'))
const Error404 = lazy(() => import('./pages/Error404'))
const ProtectRoute = lazy(() => import('./components/ProtectRoute'))
const Login = lazy(() => import('./pages/admin/Login'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const Chats = lazy(() => import('./pages/admin/Chats'))
const Msgs = lazy(() => import('./pages/admin/Msgs'))
const Users = lazy(() => import('./pages/admin/Users'))
const Reset = lazy(() => import('./pages/Reset'))

function App() {
  const dispatch = useDispatch()
  const { user, loading } = useSelector(state => state.auth)
  useEffect(() => {
    axios.get(`${server}/user/my-profile`, { withCredentials: true })
      .then(({ data }) => dispatch(userExists(data.user)))
      .catch(() => dispatch(userNotExists()))
  }, [dispatch])
  return (
    <Router>
      {loading ? <Loader /> :
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route exact path='/login' element={<RegisterLogin />} />
            <Route exact path='/reset-password/:token' element={<Reset />} />
            <Route exact path='/admin' element={<Login />} />
            <Route element={
              <SocketProvider>
                <ProtectRoute user={user} />
              </SocketProvider>
            }>
              <Route exact path='/' element={<Home />} />
              <Route exact path='/chat/:id' element={<Chat />} />
              <Route exact path='/groups' element={<Groups />} />
              <Route exact path='/admin/dashboard' element={<Dashboard />} />
              <Route exact path='/admin/users' element={<Users />} />
              <Route exact path='/admin/msgs' element={<Msgs />} />
              <Route exact path='/admin/chats' element={<Chats />} />
            </Route>
            <Route exact path='*' element={<Error404 />} />
          </Routes>
        </Suspense>}
      <Toaster position='bottom-center' />
    </Router >
  )
}

export default App