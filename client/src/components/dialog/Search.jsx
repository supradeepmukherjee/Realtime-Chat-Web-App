import { Dialog, DialogTitle, InputAdornment, List, Stack, TextField } from "@mui/material"
import { useState } from "react"
import { Search as SearchIcon } from '@mui/icons-material'
import UserItem from "../shared/UserItem"
import { sampleUsers } from "../../constants/sample"

const Search = () => {
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState(sampleUsers)
  const makeFriendHandler = async id => {

  }
  return (
    <Dialog open>
      <Stack p='2rem' width='25rem'>
        <DialogTitle textAlign='center'>
          Find People
        </DialogTitle>
        <TextField
          value={search}
          onChange={e => setSearch(e.target.value)}
          variant='outlined'
          size="small"
          InputProps={{
            startAdornment:
              <InputAdornment position='start'>
                <SearchIcon />
              </InputAdornment>
          }}
        />
        <List>
          {users.map(user => <UserItem key={user._id} user={user} handler={makeFriendHandler} loading={false} />)}
        </List>
      </Stack>
    </Dialog>
  )
}

export default Search