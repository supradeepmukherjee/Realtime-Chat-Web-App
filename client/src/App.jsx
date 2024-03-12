import { lazy } from 'react'
import { Routes, BrowserRouter as Router, Route } from 'react-router-dom';
const Home = lazy(() => import('./pages/Home'))
const RegisterLogin = lazy(() => import('./pages/RegisterLogin'))
const Chat = lazy(() => import('./pages/Chat'))
const Group = lazy(() => import('./pages/Group.jsx'))
import Header from './components/Header.jsx'

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route exact path='/login' element={<RegisterLogin />} />
        <Route exact path='/chat' element={<Chat />} />
        <Route exact path='/group' element={<Group />} />
      </Routes>
    </Router >
  )
}

export default App