import { Button, Dialog, DialogActions, DialogTitle, Stack, Typography } from "@mui/material"
import { useState } from "react"
import { sampleUsers } from '../../constants/sample'
import UserItem from "../shared/UserItem"

const AddMember = ({ Member, isLoading, id, closeHandler }) => {
    const [users, setUsers] = useState(sampleUsers)
    const [members, setMembers] = useState([])
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
    }
    return (
        <Dialog open onClose={closeHandler}>
            <Stack className='p-6 w-80'>
                <DialogTitle textAlign='center'>
                    Add Member
                </DialogTitle>
                <Stack spacing='1rem'>
                    {users.length > 0 ?
                        users.map(user => <UserItem key={user._id} user={user} handler={selectMember} isSelected={members.includes(user._id)} />)
                        :
                        <Typography textAlign='center'>
                            No Members to Add
                        </Typography>}
                </Stack>
                <DialogActions className='!pt-8'>
                    <Button variant='outlined' onClick={closeHandler}>
                        Cancel
                    </Button>
                    <Button variant='contained' onClick={submitHandler} disabled={isLoading}>
                        Add Member
                    </Button>
                </DialogActions>
            </Stack>
        </Dialog>
    )
}

export default AddMember