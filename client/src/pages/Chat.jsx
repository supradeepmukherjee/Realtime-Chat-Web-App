import { useRef } from 'react'
import { IconButton, Stack } from '@mui/material'
import Layout from '../components/layout/Layout'
import { AttachFile, Send } from '@mui/icons-material'
import { InputBox } from '../components/Styled'

const Chat = () => {
  const container = useRef(null)
  return (
    <>
      <Stack ref={container} spacing='1rem' className='box-border p-4 bg-[#f7f7f7] h-[90%] overflow-x-hidden overflow-y-auto'>
      </Stack>
      <form className="h-[10%]">
        <Stack direction='row' className='p-2 items-center relative'>
          <IconButton>
            <AttachFile />
          </IconButton>
          <InputBox placeholder='Type Message Here...' />
          <IconButton type='submit' className='!bg-green-300'>
            <Send />
          </IconButton>
        </Stack>
      </form>
    </>
  )
}

export default Layout()(Chat)