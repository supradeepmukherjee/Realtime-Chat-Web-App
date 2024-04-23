import { Delete, ExitToApp } from '@mui/icons-material'
import { Menu, Stack, Typography } from '@mui/material'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useMutation from '../../hooks/useMutation'
import { useDelChatMutation } from '../../redux/api'

const DelChatMenu = ({ open, closeHandler, anchorEl, selectedDelChat }) => {
    const navigate = useNavigate()
    const isGrp = selectedDelChat.grpChat
    const [delChatMutation, _, delChatData] = useMutation(useDelChatMutation)
    const leaveGrp = () => {

    }
    const delChat = () => {
        closeHandler()
        delChatMutation('Deleting Chat', selectedDelChat.id)
    }
    useEffect(() => {
        if (delChatData) navigate('/')
    }, [delChatData, navigate])
    return (
        <Menu
            open={open}
            onClose={closeHandler}
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'center',
                horizontal: 'center'
            }}
            onClick={isGrp ? leaveGrp : delChat}
        >
            <Stack className='w-40 p-2 cursor-pointer flex-row items-center gap-2'>
                {isGrp ?
                    <>
                        <ExitToApp />
                        <Typography>
                            Leave Group
                        </Typography>
                    </>
                    :
                    <>
                        <Delete />
                        <Typography>
                            Delete Chat
                        </Typography>
                    </>
                }
            </Stack>
        </Menu >
    )
}

export default DelChatMenu