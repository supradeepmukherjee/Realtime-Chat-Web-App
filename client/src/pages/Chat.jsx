import { AttachFile, Send } from '@mui/icons-material'
import { IconButton, Skeleton, Stack } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import FileMenu from '../components/dialog/FileMenu'
import Layout from '../components/layout/Layout'
import Msg from '../components/shared/Msg'
import { InputBox } from '../components/Styled'
import { new_msg } from '../constants/events'
import useErrors from '../hooks/useErrors'
import useSocketEvents from '../hooks/useSocketEvents'
import { useChatDetailsQuery, useLazyGetMsgsQuery } from '../redux/api/api'
import { removeMsgsAlert } from '../redux/reducers/chat'
import { setIsFileMenu } from '../redux/reducers/misc'
import { getSocket } from '../socket'

const Chat = () => {
  const [msgs, setMsgs] = useState([])
  const [msg, setMsg] = useState('')
  const [page, setPage] = useState(2)
  const [hasMore, setHasMore] = useState(true)
  const [anchorEl, setAnchorEl] = useState(null)
  const { id } = useParams()
  const dispatch = useDispatch()
  const { user } = useSelector(({ auth }) => auth)
  const { isLoading, data, error, isError } = useChatDetailsQuery({ id, skip: !id })
  const [getMsgs] = useLazyGetMsgsQuery()
  const socket = getSocket()
  const fileOpenHandler = async e => {
    dispatch(setIsFileMenu(true))
    setAnchorEl(e.target)
  }
  const submitHandler = async e => {
    e.preventDefault()
    if (!msg.trim()) return
    socket.emit(new_msg, { id, members: data.chat.members, msg })
    setMsg('')
  }
  const newMsgsHandler = useCallback(data => {
    setMsgs(prev => [data.msg, ...prev])
  }, [])
  const eventHandler = { [new_msg]: newMsgsHandler }
  useSocketEvents(socket, eventHandler)
  useErrors([{ error, isError }])
  useEffect(() => {
    getMsgs({ id, page: 1 })
      .then(({ isError: msgsIsError, error: msgsError, data: msgsData }) => {
        setMsgs(msgsData.msgs)
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
            dataLength={msgs.length}
            next={fetch}
            inverse={true}
            scrollableTarget="scrollableDiv"
            style={{
              display: 'flex',
              flexDirection: 'column-reverse',
              gap: '1rem'
            }}
          >
            {msgs.map(msg => <Msg key={msg._id ? msg._id : msg.id} msg={msg} user={user} />)}
          </InfiniteScroll>
        </div>
        <form className="h-[10%]" onSubmit={submitHandler}>
          <Stack direction='row' className='p-2'>
            <IconButton onClick={fileOpenHandler}>
              <AttachFile />
            </IconButton>
            <InputBox placeholder='Type Message Here...' value={msg} onChange={e => setMsg(e.target.value)} />
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