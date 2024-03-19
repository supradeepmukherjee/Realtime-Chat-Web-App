import { memo } from "react"
import { Avatar as Chavi, IconButton, ListItem, Stack, Typography } from "@mui/material"
import { Add } from '@mui/icons-material'

const UserItem = ({ user, handler, loading }) => {
    const { name, _id, chavi } = user
    return (
        <ListItem>
            <Stack direction='row' alignItems='center' spacing='1rem' width='100%'>
                <Chavi />
                <Typography variant='body1' className="grow line-clamp-1">
                    {name}
                </Typography>
                <IconButton onClick={() => handler(_id)} disabled={loading} size='small' className='!bg-[#1976d2] !text-white hover:!bg-[#1565c0]'>
                    <Add />
                </IconButton>
            </Stack>
        </ListItem>
    )
}

export default memo(UserItem)