import { AttachFile, Send } from '@mui/icons-material'
import { IconButton, Skeleton, Stack } from '@mui/material'
import { useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import FileMenu from '../components/dialog/FileMenu'
import Layout from '../components/layout/Layout'
import { Typing } from '../components/layout/Loader'
import Msg from '../components/shared/Msg'
import { InputBox } from '../components/Styled'
import { alert as ALERT, new_msg, start_typing, stop_typing } from '../constants/events'
import useErrors from '../hooks/useErrors'
import useSocketEvents from '../hooks/useSocketEvents'
import { useChatDetailsQuery, useLazyGetMsgsQuery } from '../redux/api'
import { removeMsgsAlert } from '../redux/reducers/chat'
import { setIsFileMenu } from '../redux/reducers/misc'
import { getSocket } from '../socket'

const Chat = () => {
  const [msgs, setMsgs] = useState([])
  const [msg, setMsg] = useState('')
  const [page, setPage] = useState(2)
  const [hasMore, setHasMore] = useState(true)
  const [iAmTyping, setIAmTyping] = useState(false)
  const [userTyping, setUserTyping] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const typingTimeout = useRef(null)
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(({ auth }) => auth)
  const { uploadingLoader } = useSelector(({ misc }) => misc)
  const { isLoading, data, error, isError } = useChatDetailsQuery({ id, skip: !id })
  const [getMsgs] = useLazyGetMsgsQuery()
  const socket = getSocket()
  const members = data?.chat?.members
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
  const alertListener = useCallback(content => {
    setMsgs(prev => [
      {
        content,
        chat: id,
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
  }
  useSocketEvents(socket, eventHandler)
  useErrors([{ error, isError }])
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
    if (!data?.chat) navigate('/')
  }, [data?.chat, navigate])
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
    isLoading ? <Skeleton /> :
      <>
        <div className='box-border p-4 bg-[#f7f7f7] h-[90%] flex flex-col-reverse overflow-x-hidden overflow-y-auto' id="scrollableDiv">
          <InfiniteScroll
            hasMore={hasMore}
            dataLength={msgs?.length || 0}
            next={fetch}
            inverse={true}
            scrollableTarget="scrollableDiv"
            style={{
              display: 'flex',
              flexDirection: 'column-reverse',
              gap: '1rem'
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
      </>
  )
}

export default Layout()(Chat)