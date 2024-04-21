/* eslint-disable react/prop-types */
import { Search } from "@mui/icons-material"
import { Button, Dialog, DialogActions, DialogTitle, InputAdornment, Stack, TextField } from "@mui/material"
import { useEffect, useState } from "react"
import useMutation from "../../hooks/useMutation"
import { useAddMembersMutation, useLazyMyFriendsQuery } from "../../redux/api"
import UserItem from "../shared/UserItem"

const AddMember = ({ open, closeHandler, id }) => {
    const [search, setSearch] = useState('')
    const [users, setUsers] = useState([])
    const [members, setMembers] = useState([])
    const [searchUser] = useLazyMyFriendsQuery()
    const [addMembers, addMembersLoading] = useMutation(useAddMembersMutation)
    const selectMember = id => {
        setMembers(m =>
            m.includes(id) ?
                m.filter(i => i !== id)
                :
                [...m, id]
        )
    }
    const submitHandler = async () => {
        closeHandler()
        addMembers('Adding Members', { id, members })
    }
    useEffect(() => {
        if (search === '') return
        const timeout = setTimeout(() => {
            searchUser(({ name: search, id }))
                .then(({ data }) => setUsers(data.friends))
                .catch(err => console.log(err))
        }, 1000)
        return () => { clearTimeout(timeout) }
    }, [id, search, searchUser])
    return (
        <Dialog open={open} onClose={closeHandler}>
            <Stack className='p-6 w-80'>
                <DialogTitle textAlign='center'>
                    Add Member
                </DialogTitle>
                <TextField
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    variant='outlined'
                    size="small"
                    InputProps={{
                        startAdornment:
                            <InputAdornment position='start'>
                                <Search />
                            </InputAdornment>
                    }}
                    sx={{ mb: '2rem' }}
                />
                <Stack spacing='1rem'>
                    {users?.map(user => <UserItem key={user._id} user={user} handler={selectMember} isSelected={members.includes(user._id)} />)}
                </Stack>
                <DialogActions className='!pt-8'>
                    <Button variant='outlined' onClick={closeHandler}>
                        Cancel
                    </Button>
                    <Button variant='contained' onClick={submitHandler} disabled={addMembersLoading}>
                        Add Member
                    </Button>
                </DialogActions>
            </Stack>
        </Dialog>
    )
}

export default AddMember