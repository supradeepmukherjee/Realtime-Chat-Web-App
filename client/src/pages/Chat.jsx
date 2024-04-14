import { AttachFile, Send } from '@mui/icons-material'
import { IconButton, Skeleton, Stack } from '@mui/material'
import { useCallback, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import FileMenu from '../components/dialog/FileMenu'
import Layout from '../components/layout/Layout'
import Msg from '../components/shared/Msg'
import { InputBox } from '../components/Styled'
import { new_msg } from '../constants/events'
import useErrors from '../hooks/useErrors'
import useSocketEvents from '../hooks/useSocketEvents'
import { useChatDetailsQuery } from '../redux/api/api'
import { getSocket } from '../socket'

const Chat = () => {
  const container = useRef(null)
  const [msgs, setMsgs] = useState([])
  const [msg, setMsg] = useState('')
  const { id } = useParams()
  const { user } = useSelector(({ auth }) => auth)
  const { isLoading, data, error, isError } = useChatDetailsQuery(id, { skip: !id })
  const socket = getSocket()
  const submitHandler = async e => {
    e.preventDefault()
    if (!msg.trim()) return
    socket.emit(new_msg, { id, members: data.chat.members, msg })
    setMsg('')
  }
  const newMsgsHandler = useCallback((data) => {
    console.log(data)
    setMsgs(prev => [...prev, data.msg])
  }, [])
  console.log(msgs)
  const eventHandler = { [new_msg]: newMsgsHandler }
  useSocketEvents(socket, eventHandler)
  useErrors([{ error, isError }])
  return (
    isLoading ? <Skeleton /> :
      <>
        <Stack ref={container} spacing='1rem' className='box-border p-4 bg-[#f7f7f7] h-[90%] overflow-x-hidden overflow-y-auto'>
          {msgs.map(msg => <Msg key={msg._id} msg={msg} user={user} />)}
        </Stack>
        <form className="h-[10%]" onSubmit={submitHandler}>
          <Stack direction='row' className='p-2'>
            <IconButton>
              <AttachFile />
            </IconButton>
            <InputBox placeholder='Type Message Here...' value={msg} onChange={e => setMsg(e.target.value)} />
            <IconButton type='submit' className='!bg-green-400 ml-4 p-2 hover:!bg-green-500'>
              <Send />
            </IconButton>
          </Stack>
        </form>
        <FileMenu />
      </>
  )
}

export default Layout()(Chat)