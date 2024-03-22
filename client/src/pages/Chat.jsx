import { useRef, useState } from 'react'
import { IconButton, Stack } from '@mui/material'
import Layout from '../components/layout/Layout'
import { AttachFile, Send } from '@mui/icons-material'
import { InputBox } from '../components/Styled'
import FileMenu from '../components/dialog/FileMenu'
import { sampleMsgs } from '../constants/sample'
import Msg from '../components/shared/Msg'

const Chat = () => {
  const container = useRef(null)
  const user={
    _id:'jnbhjfirurb',
    name:'fake user'
  }
  const [msgs, setMsgs] = useState(sampleMsgs)
  return (
    <>
      <Stack ref={container} spacing='1rem' className='box-border p-4 bg-[#f7f7f7] h-[90%] overflow-x-hidden overflow-y-auto'>
        {msgs.map(msg => <Msg key={msg._id} msg={msg} user={user} />)}
      </Stack>
      <form className="h-[10%]">
        <Stack direction='row' className='p-2'>
          <IconButton>
            <AttachFile />
          </IconButton>
          <InputBox placeholder='Type Message Here...' />
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