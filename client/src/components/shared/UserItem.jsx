import { memo } from "react"
import { Avatar as Chavi, IconButton, ListItem, Stack, Typography } from "@mui/material"
import { Add, Remove } from '@mui/icons-material'

const UserItem = ({ user, handler, loading, isSelected = false, style }) => {
    const { name, _id, chavi } = user
    return (
        <ListItem>
            <Stack
                direction='row'
                sx={{
                    ...style,
                    width: '100%',
                    gap: '1rem',
                    alignItems: 'center'
                }}
            >
                <Chavi />
                <Typography variant='body1' className="grow line-clamp-1">
                    {name}
                </Typography>
                <IconButton
                    onClick={() => handler(_id)}
                    disabled={loading}
                    size='small'
                    sx={{
                        color: 'white',
                        bgcolor: isSelected ? 'error.main' : 'primary.main',
                        '&:hover': { bgcolor: isSelected ? 'error.dark' : 'primary.dark' }
                    }}>
                    {isSelected ? <Remove /> : <Add />}
                </IconButton>
            </Stack>
        </ListItem>
    )
}

export default memo(UserItem)