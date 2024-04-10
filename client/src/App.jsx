import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Loader } from './components/layout/Loader';
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
import axios from 'axios'
import { server } from './constants/config';

function App() {
  useEffect(() => {
    axios.get(`${server}/user/my-profile`)
      .then(res => console.log(res))
      .catch(err => console.log(err))
  }, [])
  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route exact path='/login' element={<RegisterLogin />} />
          <Route exact path='/admin' element={<Login />} />
          <Route element={<ProtectRoute user={true} />}>
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
      </Suspense>
    </Router >
  )
}

export default App