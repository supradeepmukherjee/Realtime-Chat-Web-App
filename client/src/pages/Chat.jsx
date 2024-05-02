import { AttachFile, Send } from '@mui/icons-material'
import { AppBar, Backdrop, IconButton, Skeleton, Stack } from '@mui/material'
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import FileMenu from '../components/dialog/FileMenu'
import Layout from '../components/layout/Layout'
import { Typing } from '../components/layout/Loader'
import Msg from '../components/shared/Msg'
import { InputBox } from '../components/Styled'
import { alert as ALERT, is_online, new_msg, start_typing, stop_typing, was_online } from '../constants/events'
import useErrors from '../hooks/useErrors'
import useSocketEvents from '../hooks/useSocketEvents'
import { useChatDetailsQuery, useGetOnlineQuery, useLazyGetMsgsQuery, useLazyLastSeenQuery } from '../redux/api'
import { removeMsgsAlert } from '../redux/reducers/chat'
import { setIsFileMenu } from '../redux/reducers/misc'
import { getSocket } from '../socket'
const DelMsg = lazy(() => import('../components/dialog/DelMsg'))

const Chat = () => {
  const [msgs, setMsgs] = useState([])
  const [msg, setMsg] = useState('')
  const [page, setPage] = useState(2)
  const [hasMore, setHasMore] = useState(true)
  const [iAmTyping, setIAmTyping] = useState(false)
  const [userTyping, setUserTyping] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [online, setOnline] = useState(true)
  const [lastSeen, setLastSeen] = useState('')
  const typingTimeout = useRef(null)
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [lastSeenQuery] = useLazyLastSeenQuery()
  const { user } = useSelector(({ auth }) => auth)
  const { uploadingLoader, isDelMsg } = useSelector(({ misc }) => misc)
  const { isLoading, data, error, isError } = useChatDetailsQuery({ id, skip: !id })
  const { isError: onlineIsError, error: onlineError, data: onlineData, isLoading: onlineLoading } = useGetOnlineQuery()
  const [getMsgs] = useLazyGetMsgsQuery()
  const socket = getSocket()
  const members = data?.chat?.members
  const isOnlineListener = useCallback(data => {
    if (members.includes(data.id)) setOnline(true)
  }, [members])
  const wasOnlineListener = useCallback(data => {
    if (members.includes(data.id)) {
      setOnline(false)
      setLastSeen(data.time)
    }
  }, [members])
  const fileOpenHandler = async e => {
    if (uploadingLoader) return
    dispatch(setIsFileMenu(true))
    setAnchorEl(e.target)
  }
  const msgChangeHandler = e => {
    setMsg(e.target.value)
    if (!iAmTyping) {
      socket.emit(start_typing, { members, id })
      setIAmTyping(true)
    }
    if (typingTimeout.current) clearTimeout(typingTimeout.current)
    typingTimeout.current = setTimeout(() => {
      socket.emit(stop_typing, { members, id })
      setIAmTyping(false)
    }, 1000)
  }
  const submitHandler = async e => {
    e.preventDefault()
    if (!msg.trim()) return
    socket.emit(new_msg, { id, members, msg })
    setMsg('')
  }
  const newMsgsListener = useCallback(data => {
    if (data.id !== id) return
    setMsgs(prev => [data.msg, ...prev])
  }, [id])
  const startTypingListener = useCallback(data => {
    if (data.id !== id) return
    setUserTyping(true)
  }, [id])
  const stopTypingListener = useCallback(data => {
    if (data.id !== id) return
    setUserTyping(false)
  }, [id])
  const alertListener = useCallback(({ msg, chatID }) => {
    if (chatID === id)
      setMsgs(prev => [
        {
          content: msg,
          chat: chatID,
          createdAt: new Date().toISOString(),
          sender: {
            _id: Math.floor(Math.random() * 999),
            name: 'Admin'
          }
        },
        ...prev
      ])
  }, [id])
  const eventHandler = {
    [new_msg]: newMsgsListener,
    [start_typing]: startTypingListener,
    [stop_typing]: stopTypingListener,
    [ALERT]: alertListener,
    [is_online]: isOnlineListener,
    [was_online]: wasOnlineListener,
  }
  useSocketEvents(socket, eventHandler)
  useErrors([
    { error, isError },
    { isError: onlineIsError, error: onlineError }
  ])
  useEffect(() => {
    getMsgs({ id, page: 1 })
      .then(({ isError: msgsIsError, error: msgsError, data: msgsData }) => {
        setMsgs(msgsData?.msgs)
        if (msgsIsError) toast.error(msgsError.data.msg)
      })
      .catch(err => {
        console.log(err)
        toast.error('Something went wrong')
      })
  }, [id])
  useEffect(() => {
    dispatch(removeMsgsAlert(id))
    return () => {
      setMsgs([])
      setMsg('')
      setPage(2)
      setHasMore(true)
    }
  }, [dispatch, id])
  useEffect(() => {
    if (data) {
      if (onlineData) {
        if (data.chat.members.length < 3) {
          const otherPerson = data.chat.members.find(m => m !== user._id)
          const isOnline = onlineData.users.includes(otherPerson)
          setOnline(isOnline)
          if (!isOnline) {
            lastSeenQuery(otherPerson)
              .then(({ data }) => setLastSeen(data.lastSeen))
              .catch(err => console.log(err))
          }
        }
      }
    }
  }, [data, lastSeenQuery, online, onlineData, user._id])
  useEffect(() => {
    if (isError) navigate('/')
  }, [isError, navigate])
  const fetch = async () => {
    try {
      const { isError: msgsIsError, error: msgsError, data: msgsData } = await getMsgs({ id, page })
      setMsgs(prev => [...prev, ...msgsData.msgs])
      Math.ceil(msgs.length / 20) < msgsData.totalPages ? setHasMore(true) : setHasMore(false)
      if (msgsIsError) toast.error(msgsError.data.msg)
      setPage(p => p + 1)
    } catch (err) {
      console.log(err)
      toast.error('Something went wrong')
    }
  }
  return (
    (isLoading || onlineLoading) ? <Skeleton /> :
      <>
        {!data.chat.grpChat &&
          <AppBar sx={{
            position: 'relative',
            bgcolor: '#c7eac9',
            color: '#000',
            height: '5%',
            display: 'flex',
            justifyContent: 'center',
            paddingLeft: '.5rem'
          }}>
            {online ? 'Online' : `Last seen at ${lastSeen}`}
          </AppBar>}
        <div className={`box-border p-4 bg-[#f7f7f7] ${data.chat.grpChat ? 'h-[90%]' : 'h-[85%]'} flex flex-col-reverse overflow-x-hidden overflow-y-auto`} id="scrollableDiv">
          <InfiniteScroll
            hasMore={hasMore}
            dataLength={msgs?.length || 0}
            next={fetch}
            inverse={true}
            scrollableTarget="scrollableDiv"
            style={{
              display: 'flex',
              flexDirection: 'column-reverse',
              gap: '1rem',
              overflowX: 'hidden'
            }}
          >
            {userTyping && <Typing />}
            {msgs?.map(msg => <Msg key={msg._id ? msg._id : msg.id} msg={msg} user={user} />)}
          </InfiniteScroll>
        </div>
        <form className="h-[10%]" onSubmit={submitHandler}>
          <Stack direction='row' className='p-2'>
            <IconButton onClick={fileOpenHandler}>
              <AttachFile />
            </IconButton>
            <InputBox placeholder='Type Message Here...' value={msg} onChange={msgChangeHandler} />
            <IconButton type='submit' className='!bg-green-400 ml-4 p-2 hover:!bg-green-500'>
              <Send />
            </IconButton>
          </Stack>
        </form>
        <FileMenu anchorEl={anchorEl} id={id} />
        {isDelMsg &&
          <Suspense fallback={<Backdrop open />}>
            <DelMsg setMsgs={setMsgs} />
          </Suspense>
        }
      </>
  )
}

export default Layout()(Chat)