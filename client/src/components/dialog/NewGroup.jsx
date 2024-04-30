import { Camera } from "@mui/icons-material"
import { Avatar as Chavi, Button, Dialog, DialogTitle, IconButton, Skeleton, Stack, TextField } from "@mui/material"
import { useState } from "react"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import useErrors from "../../hooks/useErrors"
import useMutation from "../../hooks/useMutation"
import { useMyFriendsQuery, useNewGrpMutation } from "../../redux/api"
import { setIsNewGrp } from "../../redux/reducers/misc"
import UserItem from "../shared/UserItem"
import { HiddenInput } from "../Styled"

const NewGroup = () => {
  const [name, setName] = useState('')
  const [members, setMembers] = useState([])
  const dispatch = useDispatch()
  const { isNewGrp } = useSelector(({ misc }) => misc)
  const { isLoading, data, error, isError } = useMyFriendsQuery({})
  const [chavi, setChavi] = useState(null)
  const [chaviFile, setChaviFile] = useState(null)
  const chaviHandler = e => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = async () => {
      setChavi(reader.result)
    }
    setChaviFile(file)
  }
  const selectMember = id => {
    setMembers(m =>
      m.includes(id) ?
        m.filter(i => i !== id)
        :
        [...m, id]
    )
  }
  const [createGrp] = useMutation(useNewGrpMutation)
  const createHandler = async () => {
    if (members.length < 2) return toast.error('A group must have atleast 3 members')
    if (name === '') return toast.error('Group name can\'t be empty')
    const formData = new FormData()
    formData.append('chavi', chaviFile)
    formData.append('name', name)
    formData.append('members', JSON.stringify(members))
    console.log(formData.get('members'),'working')
    createGrp('Creating Group...', formData)
    dispatch(setIsNewGrp(false))
  }
  useErrors([{ error, isError }])
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
        <Stack className='relative w-20 !m-auto'>
          <Chavi className='!w-20 !h-20 object-cover' src={chavi} />
          <IconButton className='!absolute left-14 top-14 w-6 h-6 !text-[#ffffff] !bg-[#00000080] hover:text-[#000000b3]' component='label'>
            <>
              <Camera className='!w-4' />
              <HiddenInput type='file' accept='image/*' onChange={chaviHandler} />
            </>
          </IconButton>
        </Stack>
        <TextField value={name} onChange={e => setName(e.target.value)} label='Group Name' />
        <Stack>
          {isLoading ? <Skeleton /> :
            data.friends.map(user => <UserItem key={user._id} user={user} handler={selectMember} isSelected={members.includes(user._id)} />)}
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