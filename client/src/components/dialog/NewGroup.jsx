import { Button, Dialog, DialogTitle, Stack, TextField, Typography } from "@mui/material"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { sampleUsers } from "../../constants/sample"
import { setIsNewGrp } from "../../redux/reducers/misc"
import UserItem from "../shared/UserItem"

const NewGroup = () => {
  const [name, setName] = useState('')
  const [users, setUsers] = useState(sampleUsers)
  const [members, setMembers] = useState([])
  const dispatch = useDispatch()
  const { isNewGrp } = useSelector(({ misc }) => misc)
  const selectMember = id => {
    setMembers(m =>
      m.includes(id) ?
        m.filter(i => i !== id)
        :
        [...m, id]
    )
  }
  const createHandler = async () => {

  }
  return (
    <Dialog open={isNewGrp} onClose={() => dispatch(setIsNewGrp(!isNewGrp))}>
      <Stack
        p={{
          xs: '1rem',
          sm: '3rem'
        }}
        width='25rem'
        spacing='2rem'>
        <DialogTitle textAlign='center' variant='h5'>
          Create New Group
        </DialogTitle>
        <TextField value={name} onChange={e => setName(e.target.value)} label='Group Name' />
        <Typography variant='body1'>
          Members
        </Typography>
        <Stack>
          {users.map(user => <UserItem key={user._id} user={user} handler={selectMember} isSelected={members.includes(user._id)} />)}
        </Stack>
        <Stack direction='row' justifyContent='space-evenly'>
          <Button variant='outlined' color='error' onClick={() => dispatch(setIsNewGrp(!isNewGrp))}>
            Cancel
          </Button>
          <Button variant='contained' onClick={createHandler}>
            Create
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  )
}

export default NewGroup