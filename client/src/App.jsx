import { lazy } from 'react'
import { Routes, BrowserRouter as Router, Route } from 'react-router-dom';
const Home = lazy(() => import('./pages/Home'))
const RegisterLogin = lazy(() => import('./pages/RegisterLogin'))
const Chat = lazy(() => import('./pages/Chat'))
const Group = lazy(() => import('./pages/Group'))
const Error404 = lazy(() => import('./pages/Error404'))
import Header from './components/Header'
import ProtectRoute from './components/ProtectRoute';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route exact path='/login' element={<RegisterLogin />} />
        <Route element={<ProtectRoute user={true} />}>
          <Route exact path='/' element={<Home />} />
          <Route exact path='/chat/:id' element={<Chat />} />
          <Route exact path='/group' element={<Group />} />
        </Route>
        <Route exact path='*' element={<Error404 />} />
      </Routes>
    </Router >
  )
}

export default App