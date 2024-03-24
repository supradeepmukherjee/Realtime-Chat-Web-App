import { Add, Delete, Done, Edit, KeyboardBackspace as Back, Menu } from '@mui/icons-material'
import { Box, Button, Drawer, Grid, IconButton, Stack, TextField, Tooltip, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import ChaviCard from '../components/shared/ChaviCard'
import { Link } from "../components/Styled"
import { sample } from '../constants/sample'

const Groups = () => {
  const id = useSearchParams()[0].get('grp')
  const [menuOpen, setMenuOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [grpName, setGrpName] = useState('')
  const [updatedGrpName, setUpdatedGrpName] = useState('')
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [AddMemberOpen, setAddMemberOpen] = useState(false)
  const deleteHandler = () => {
    setDeleteOpen(true)
  }
  const addMember = () => {
    setAddMemberOpen(true)
  }
  const updateGrpName = async () => {
    setIsEdit(false)
  }
  useEffect(() => {
    setGrpName('GName')
    return () => {
      setIsEdit(false)
    }
  }, [id])
  return (
    <Grid container height='100vh'>
      <Grid
        item
        sm={4}
        sx={{
          display: {
            xs: 'none',
            sm: 'block'
          }
        }}
      >
        <GroupsList myGrps={sample} id={id} />
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
                  <IconButton onClick={() => setIsEdit(true)}>
                    <Edit />
                  </IconButton>
                </>}
            </Stack>
            <Typography variant='body1' className='m-4 self-start'>
              Members
            </Typography>
            <Stack
              className='max-w-[45rem] w-full box-border gap-8 bg-[#ffe4c4] h-[50vh] overflow-auto'
              padding={{
                xs: '0',
                sm: '1rem',
                md: '1rem 4rem'
              }}
            >
              members
            </Stack>
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
              <Button color='error' variant='outlined' startIcon={<Delete />} onClick={deleteHandler}>
                Delete Group
              </Button>
              <Button variant='contained' startIcon={<Add />} onClick={addMember}>
                Add Member
              </Button>
            </Stack>
          </>}
      </Grid>
      {deleteOpen &&
        <></>}
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
        <GroupsList myGrps={sample} id={id} w='50vw' />
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
  <Stack width={w}>
    {myGrps.length > 0 ?
      myGrps.map(({ name, chavi, _id }) => (
        <Link
          key={_id}
          to={`?grp=${_id}`}
          onClick={e => {
            if (id === _id) e.preventDefault()
          }}
        >
          <Stack direction='row' spacing='1rem' alignItems='center'>
            <ChaviCard chavi={chavi} />
            <Typography>
              {name}
            </Typography>
          </Stack>
        </Link>
      ))
      :
      <Typography className='text-center p-4'>
        You have not joined any Group
      </Typography>}
  </Stack>
)

export default Groups