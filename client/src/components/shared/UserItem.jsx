/* eslint-disable react/prop-types */
import { Add, AddModerator, Remove, RemoveModerator } from '@mui/icons-material'
import { Avatar as Chavi, IconButton, ListItem, Stack, Typography } from "@mui/material"
import { memo } from "react"
import { transformImg } from "../../lib/features"

const UserItem = ({ user, handler, loading, isSelected = false, style, showBtn = true, showAdminBtn = false, isAdmin, toggleAdmin, chatID }) => {
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
                <Chavi src={transformImg(chavi)} />
                <Typography variant='body1' className="grow line-clamp-1">
                    {name}
                </Typography>
                {showBtn &&
                    <>
                        {showAdminBtn &&
                            <IconButton
                                onClick={() => toggleAdmin(isAdmin ? 'Revoking Admin Rights' : 'Assigning Admin Rights', { chatID, userID: _id, make: !isAdmin })}
                                disabled={loading}
                                size='small'
                                sx={{
                                    color: 'white',
                                    bgcolor: isAdmin ? 'error.main' : 'success.main',
                                    '&:hover': { bgcolor: isAdmin ? 'error.dark' : 'success.dark' }
                                }}>
                                {isAdmin ? <RemoveModerator /> : <AddModerator />}
                            </IconButton>}
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
                    </>}
            </Stack>
        </ListItem>
    )
}

export default memo(UserItem)