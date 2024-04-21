import { Search as SearchIcon } from '@mui/icons-material'
import { Dialog, DialogTitle, InputAdornment, List, Stack, TextField } from "@mui/material"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLazySearchUserQuery, useSendRequestMutation } from "../../redux/api"
import { setIsSearch } from "../../redux/reducers/misc"
import UserItem from "../shared/UserItem"
import useMutation from '../../hooks/useMutation'

const Search = () => {
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState([])
  const { isSearch } = useSelector(state => state.misc)
  const dispatch = useDispatch()
  const [searchUser] = useLazySearchUserQuery()
  const [sendRequest, loading] = useMutation(useSendRequestMutation)
  const makeFriendHandler = id => sendRequest('Sending Friend Request', { id })
  useEffect(() => {
    if (search === '') return
    const timeout = setTimeout(() => {
      searchUser(({ name: search }))
        .then(({ data }) => setUsers(data.users))
        .catch(err => console.log(err))
    }, 1000);
    return () => { clearTimeout(timeout) }
  }, [search, searchUser])
  return (
    <Dialog open={isSearch} onClose={() => dispatch(setIsSearch(!isSearch))}>
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
          {users.map(user => <UserItem key={user._id} user={user} handler={makeFriendHandler} loading={loading} />)}
        </List>
      </Stack>
    </Dialog>
  )
}

export default Search