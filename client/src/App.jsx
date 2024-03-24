import { lazy, Suspense } from 'react'
import { Routes, BrowserRouter as Router, Route } from 'react-router-dom';
const Home = lazy(() => import('./pages/Home'))
const RegisterLogin = lazy(() => import('./pages/RegisterLogin'))
const Chat = lazy(() => import('./pages/Chat'))
const Groups = lazy(() => import('./pages/Groups'))
const Error404 = lazy(() => import('./pages/Error404'))
import { Loader } from './components/layout/Loader';
import ProtectRoute from './components/ProtectRoute';

function App() {
  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route exact path='/login' element={<RegisterLogin />} />
          <Route element={<ProtectRoute user={true} />}>
            <Route exact path='/' element={<Home />} />
            <Route exact path='/chat/:id' element={<Chat />} />
            <Route exact path='/groups' element={<Groups />} />
          </Route>
          <Route exact path='*' element={<Error404 />} />
        </Routes>
      </Suspense>
    </Router >
  )
}

export default App