import { Button, Dialog, DialogTitle, Stack, TextField, Typography } from "@mui/material"
import { sampleUsers } from "../../constants/sample"
import UserItem from "../shared/UserItem"

const NewGroup = () => {
  const selectMember = e => {

  }
  return (
    <Dialog open>
      <Stack
        p={{
          xs: '1rem',
          sm: '3rem'
        }}
        width='25rem'
        spacing='2rem'>
        <DialogTitle>
          Create New Group
        </DialogTitle>
        <TextField />
        <Typography>
          Members
        </Typography>
        <Stack>
          {sampleUsers.map(user => <UserItem key={user._id} user={user} handler={selectMember} />)}
        </Stack>
        <Stack direction='row'>
          <Button variant='contained' color='error'>
            Cancel
          </Button>
          <Button variant='contained'>
            Create
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  )
}

export default NewGroup