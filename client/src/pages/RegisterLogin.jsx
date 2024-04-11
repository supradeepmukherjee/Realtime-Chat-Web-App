import { useEffect, useState } from 'react'
import { Avatar as Chavi, Button, Container, IconButton, Paper, Stack, TextField, Typography } from '@mui/material'
import Camera from '@mui/icons-material/CameraAlt'
import { HiddenInput } from '../components/Styled'
import { uNameValidator, passwordValidator } from '../utils/validators'
import axios from 'axios'
import { server } from '../constants/config'
import { useDispatch, useSelector } from 'react-redux'
import { userExists } from '../redux/reducers/auth'
import toast from 'react-hot-toast'
import { useNavigate, redirect } from 'react-router-dom'

const RegisterLogin = () => {
  const { user } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [login, setLogin] = useState(true)
  const [loginCredentials, setLoginCredentials] = useState({
    uName: '',
    password: ''
  })
  const [userDetails, setUserDetails] = useState({
    name: '',
    password: '',
    about: '',
    uName: ''
  })
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
  const loginCredentialsChangeHandler = e => setLoginCredentials({ ...loginCredentials, [e.target.name]: e.target.value })
  const userDetailsChangeHandler = e => setUserDetails({ ...userDetails, [e.target.name]: e.target.value })
  const loginHandler = async e => {
    e.preventDefault()
    try {
      const { data } = await axios.put(`${server}/user/login`,
        {
          uName: loginCredentials.uName,
          password: loginCredentials.password,
        },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        }
      )
      dispatch(userExists(true))
      toast.success(data.msg)
      redirect('/')
    } catch (err) {
      console.log(err)
      toast.error(err?.response?.data?.msg || 'Something went wrong')
    }
  }
  const registerHandler = async e => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('chavi', chaviFile)
    formData.append('name', userDetails.name)
    formData.append('uName', userDetails.uName)
    formData.append('password', userDetails.password)
    formData.append('about', userDetails.about)
    try {
      const { data } = await axios.post(`${server}/user/register`,
        formData,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      )
      dispatch(userExists(true))
      toast.success(data.msg)
      redirect('/')
    } catch (err) {
      console.log(err)
      toast.error(err?.response?.data?.msg || 'Something went wrong')
    }
  }
  useEffect(() => {
    if (user) return navigate('/')
  }, [navigate, user])
  return (
    <Container maxWidth='xs' className='h-screen !flex justify-center items-center' component='main'>
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          paddingTop: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
        {login ?
          <>
            <Typography variant='h5'>
              Login
            </Typography>
            <form onSubmit={loginHandler} className='w-full mt-4'>
              <TextField required fullWidth label='Username' name='uName' margin='normal' value={loginCredentials.uName} onChange={loginCredentialsChangeHandler} />
              <TextField required fullWidth label='Password' name='password' margin='normal' type='password' value={loginCredentials.password} onChange={loginCredentialsChangeHandler} />
              <div className="flex justify-center">
                <Button variant='contained' type='submit' className='!mt-4'>
                  Login
                </Button>
              </div>
              <div className="flex justify-center">
                <Button variant='outlined' onClick={() => setLogin(false)}>
                  Don&apos;t have an account?
                </Button>
              </div>
            </form>
          </>
          :
          <>
            <Typography variant='h5'>
              Register
            </Typography>
            <Stack className='relative w-20 m-auto'>
              <Chavi className='!w-20 !h-20 object-cover' src={chavi} />
              <IconButton className='!absolute left-14 top-14 w-6 h-6 !text-[#ffffff] !bg-[#00000080] hover:text-[#000000b3]' component='label'>
                <>
                  <Camera className='!w-4' />
                  <HiddenInput type='file' accept='image/*' onChange={chaviHandler} />
                </>
              </IconButton>
            </Stack>
            <form onSubmit={registerHandler} className='w-full mt-4'>
              <TextField required fullWidth label='Name' name='name' margin='dense' value={userDetails.name} onChange={userDetailsChangeHandler} />
              <TextField required fullWidth label='Username' name='uName' margin='dense' value={userDetails.uName} onChange={userDetailsChangeHandler} />
              <TextField required fullWidth label='About' name='about' margin='dense' value={userDetails.about} onChange={userDetailsChangeHandler} />
              <TextField required fullWidth label='Password' name='password' margin='dense' type='password' value={userDetails.password} onChange={userDetailsChangeHandler} />
              <div className="flex justify-center">
                <Button variant='contained' type='submit' className='!mt-4'>
                  Register
                </Button>
              </div>
              <div className="flex justify-center">
                <Button variant='outlined' onClick={() => setLogin(true)}>
                  Already Registered?
                </Button>
              </div>
            </form>
          </>}
      </Paper>
    </Container>
  )
}

export default RegisterLogin