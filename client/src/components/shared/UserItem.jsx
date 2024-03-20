import { memo } from "react"
import { Avatar as Chavi, IconButton, ListItem, Stack, Typography } from "@mui/material"
import { Add, Remove } from '@mui/icons-material'

const UserItem = ({ user, handler, loading, isSelected = false }) => {
    const { name, _id, chavi } = user
    return (
        <ListItem>
            <Stack direction='row' alignItems='center' spacing='1rem' width='100%'>
                <Chavi />
                <Typography variant='body1' className="grow line-clamp-1">
                    {name}
                </Typography>
                <IconButton onClick={() => handler(_id)} disabled={loading} size='small' className={`!bg-[#${!isSelected ? '1976d2' : 'f44336'}] !text-white hover:!bg-[#${!isSelected ? '1565c0' : 'd32f2f'}]`}>
                    {isSelected ? <Remove /> : <Add />}
                </IconButton>
            </Stack>
        </ListItem>
    )
}

export default memo(UserItem)