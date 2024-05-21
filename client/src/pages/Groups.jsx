import { Add, Delete, Done, Edit, KeyboardBackspace as Back, Menu } from '@mui/icons-material'
import { Avatar as Chavi, Backdrop, Box, Button, Drawer, Grid, IconButton, Stack, TextField, Tooltip, Typography } from "@mui/material"
import { lazy, Suspense, useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from "react-router-dom"
import { Loader } from '../components/layout/Loader'
import UserItem from '../components/shared/UserItem'
import { Link } from "../components/Styled"
import useErrors from '../hooks/useErrors'
import useMutation from '../hooks/useMutation'
import { transformImg } from '../lib/features'
import { useChatDetailsQuery, useDelChatMutation, useMyGrpsQuery, useRemoveMemberMutation, useRenameGrpMutation, useToggleAdminMutation } from '../redux/api'
import { setIsAddMember, setIsDelGrp } from '../redux/reducers/misc'
const DeleteGrp = lazy(() => import('../components/dialog/DeleteGrp'))
const AddMember = lazy(() => import('../components/dialog/AddMember'))

const Groups = () => {
  const id = useSearchParams()[0].get('grp')
  const [menuOpen, setMenuOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [grpName, setGrpName] = useState('')
  const [members, setMembers] = useState([])
  const [updatedGrpName, setUpdatedGrpName] = useState('')
  const { user } = useSelector(({ auth }) => auth)
  const { isAddMember, isDelGrp } = useSelector(({ misc }) => misc)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading, data, error, isError } = useMyGrpsQuery()
  const { data: grpData, error: grpError, isError: grpIsError } = useChatDetailsQuery(
    { id, populate: 1 },
    { skip: !id }
  )
  const [renameGrp, renameLoading] = useMutation(useRenameGrpMutation)
  const [removeMember, removeLoading] = useMutation(useRemoveMemberMutation)
  const [delGrp, delLoading] = useMutation(useDelChatMutation)
  const [toggleAdmin, toggleAdminLoading] = useMutation(useToggleAdminMutation)
  const toggleDelete = () => dispatch(setIsDelGrp(!isDelGrp))
  const toggleAddMember = () => dispatch(setIsAddMember(!isAddMember))
  const deleteHandler = async () => {
    navigate('/groups')
    dispatch(setIsDelGrp(false))
    delGrp('Deleting Group', id)
  }
  const removeHandler = userID => removeMember('Removing Member', { chatID: id, userID })
  const updateGrpName = async () => {
    setIsEdit(false)
    setGrpName(updatedGrpName)
    renameGrp('Renaming Group', { name: updatedGrpName, id })
  }
  useEffect(() => {
    if (id) {
      setGrpName(``)
      setUpdatedGrpName(``)
    }
    return () => {
      setGrpName("")
      setUpdatedGrpName("")
      setIsEdit(false)
    }
  }, [id])
  useEffect(() => {
    setGrpName(grpData?.chat?.name)
    setUpdatedGrpName(grpData?.chat?.name)
    setMembers(grpData?.chat?.members)
    return () => {
      setIsEdit(false)
      setGrpName('')
      setUpdatedGrpName('')
      setMembers([])
    }
  }, [grpData?.chat?.members, grpData?.chat?.name])
  useErrors([
    { error, isError },
    { error: grpError, isError: grpIsError },
  ])
  return (
    isLoading ? <Loader /> :
      <Grid container height='100vh'>
        <Grid
          item
          sm={4}
          sx={{
            display: {
              xs: 'none',
              sm: 'block'
            },
            overflowY: 'auto',
            height: '100%'
          }}
        >
          <GroupsList myGrps={data.grps} id={id} />
        </Grid>
        <Grid item xs={12} sm={8} className='flex items-center !flex-col relative py-4 px-12'>
          <IconBtns setMenuOpen={setMenuOpen} />
          {grpName &&
            <>
              <Stack direction='row' className='items-center justify-center gap-4 p-12'>
                {isEdit ?
                  <>
                    <TextField value={updatedGrpName} onChange={e => setUpdatedGrpName(e.target.value)} />
                    <IconButton onClick={updateGrpName}>
                      <Done />
                    </IconButton>
                  </>
                  :
                  <>
                    <Typography variant='h4'>
                      {grpName}
                    </Typography>
                    <IconButton disabled={renameLoading} onClick={() => setIsEdit(true)}>
                      <Edit />
                    </IconButton>
                  </>}
              </Stack>
              <Stack
                className='max-w-[45rem] w-full box-border gap-8 h-[50vh] overflow-auto'
                padding={{
                  xs: '0',
                  sm: '1rem',
                  md: '1rem 4rem'
                }}
              >
                {members.map(member => <UserItem
                  key={member._id}
                  user={member}
                  isSelected={true}
                  handler={() => removeHandler(member._id)}
                  loading={removeLoading || toggleAdminLoading}
                  chatID={grpData?.chat?._id}
                  showBtn={grpData?.chat?.admin.includes(user._id)}
                  isAdmin={grpData?.chat?.admin.includes(member._id)}
                  showAdminBtn={true}
                  toggleAdmin={toggleAdmin}
                  style={{
                    boxShadow: '0 0 .5rem rgba(0,0,0,.2)',
                    padding: '1rem 2rem',
                    borderRadius: '1rem'
                  }}
                />)}
              </Stack>
              {grpData?.chat?.admin.includes(user._id) &&
                <Stack
                  direction={{
                    xs: 'column-reverse',
                    sm: 'row'
                  }}
                  p={{
                    xs: '0',
                    sm: '1rem',
                    md: '1rem 4rem'
                  }}
                  spacing='1rem'
                >
                  <Button color='error' variant='outlined' startIcon={<Delete />} onClick={toggleDelete}>
                    Delete Group
                  </Button>
                  <Button variant='contained' startIcon={<Add />} onClick={toggleAddMember}>
                    Add Member
                  </Button>
                </Stack>}
            </>}
        </Grid>
        {isAddMember &&
          <Suspense fallback={<Backdrop open />}>
            <AddMember open={isAddMember} closeHandler={toggleAddMember} id={id} />
          </Suspense>}
        {isDelGrp &&
          <Suspense fallback={<Backdrop open />}>
            <DeleteGrp open={isDelGrp} closeHandler={toggleDelete} deleteHandler={deleteHandler} />
          </Suspense>}
        <Drawer
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          sx={{
            display: {
              xs: 'block',
              sm: 'none'
            }
          }}
        >
          <GroupsList myGrps={data.grps} id={id} w='50vw' />
        </Drawer>
      </Grid>
  )
}

const IconBtns = ({ setMenuOpen }) => {
  const navigate = useNavigate()
  return (
    <>
      <Box
        sx={{
          display: {
            xs: 'block',
            sm: 'none'
          }
        }}
        className='fixed right-4 top-4'
      >
        <IconButton onClick={() => setMenuOpen(true)}>
          <Menu />
        </IconButton>
      </Box>
      <Tooltip title='Go Back'>
        <IconButton className='!absolute top-8 left-8 !bg-[#000000bf] !text-white hover:!bg-[rgba(0,0,0,0.6)]' onClick={() => navigate('/')}>
          <Back />
        </IconButton>
      </Tooltip>
    </>
  )
}

const GroupsList = ({ w = '100%', myGrps, id }) => (
  <Stack width={w} className='border-r-2 min-h-screen border-black'>
    {myGrps.length > 0 ?
      myGrps.map(({ name, chavi, _id }) => {
        const selected = id === _id
        return (
          <Link
            key={_id}
            to={`?grp=${_id}`}
            onClick={e => {
              if (selected) e.preventDefault()
            }}
            className={selected ? 'bg-[#000] !text-[#fff] hover:!bg-[#000] hover:!text-[#fff]' : ''}
          >
            <Stack className='items-center !flex-row gap-4'>
              <Chavi src={transformImg(chavi)} alt='Group Chavi' />
              <Typography>
                {name}
              </Typography>
            </Stack>
          </Link>
        )
      })
      :
      <Typography className='text-center p-4'>
        You have not joined any Group
      </Typography>}
  </Stack>
)

export default Groups