import { Visibility, VisibilityOff } from '@mui/icons-material'
import Camera from '@mui/icons-material/CameraAlt'
import { Avatar as Chavi, Button, Container, IconButton, InputAdornment, Paper, Stack, TextField, Typography } from '@mui/material'
import axios from 'axios'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { redirect, useNavigate } from 'react-router-dom'
import { HiddenInput } from '../components/Styled'
import { server } from '../constants/config'
import { userExists } from '../redux/reducers/auth'
import { nameValidator, passwordValidator, uNameValidator } from '../utils/validators'

const RegisterLogin = () => {
  const { user } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [login, setLogin] = useState(true)
  const [show, setShow] = useState(false)
  const [forgot, setForgot] = useState(false)
  const [email, setEmail] = useState('')
  const [loginCredentials, setLoginCredentials] = useState({
    uName: '',
    password: ''
  })
  const [userDetails, setUserDetails] = useState({
    name: '',
    password: '',
    about: '',
    uName: '',
    email: ''
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
  const registerHandler = async e => {
    e.preventDefault()
    const id = toast.loading('Registering...')
    let validationMsg = ''
    validationMsg = nameValidator(userDetails.name) || uNameValidator(userDetails.uName) || passwordValidator(userDetails.password) || ''
    if (validationMsg !== '') return toast.error(validationMsg, { id })
    setLoading(true)
    const formData = new FormData()
    formData.append('chavi', chaviFile)
    formData.append('name', userDetails.name)
    formData.append('uName', userDetails.uName)
    formData.append('password', userDetails.password)
    formData.append('about', userDetails.about)
    formData.append('email', userDetails.email)
    try {
      const { data } = await axios.post(`${server}/user/register`,
        formData,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      )
      dispatch(userExists(data.user))
      toast.success(data.msg, { id })
      redirect('/')
    } catch (err) {
      console.log(err)
      toast.error(err?.response?.data?.msg || 'Something went wrong', { id })
    } finally {
      setLoading(false)
    }
  }
  const loginHandler = async e => {
    e.preventDefault()
    const id = toast.loading('Logging In...')
    setLoading(true)
    try {
      const { data } = await axios.put(`${server}/user/login`,
        loginCredentials,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        }
      )
      dispatch(userExists(data.user))
      toast.success(data.msg, { id })
      redirect('/')
    } catch (err) {
      console.log(err)
      toast.error(err?.response?.data?.msg || 'Something went wrong', { id })
    } finally {
      setLoading(false)
    }
  }
  const forgotPasswordHandler = async e => {
    e.preventDefault()
    const id = toast.loading('Sending Email...')
    setLoading(true)
    try {
      const { data } = await axios.put(`${server}/user/forgot-password`,
        { email },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        }
      )
      toast.success(data.msg, { id })
    } catch (err) {
      console.log(err)
      toast.error(err?.response?.data?.msg || 'Something went wrong', { id })
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    if (user) return navigate('/')
    return () => {
      setUserDetails({
        name: '',
        password: '',
        about: '',
        uName: '',
        email: ''
      })
      setLoginCredentials({
        uName: '',
        password: ''
      })
      setChaviFile(null)
      setChavi(null)
    }
  }, [navigate, user, login])
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
              {forgot ? 'Forgot Password' : 'Login'}
            </Typography>
            <form onSubmit={forgot ? forgotPasswordHandler : loginHandler} className='w-full mt-4'>
              <TextField required fullWidth label={forgot ? 'Email ID' : 'Username'} name={forgot ? 'email' : 'uName'} margin='normal' value={forgot ? email : loginCredentials.uName} onChange={forgot ? e => setEmail(e.target.value) : loginCredentialsChangeHandler} />
              {!forgot &&
                <TextField
                  required
                  fullWidth
                  label='Password'
                  name='password'
                  margin='normal'
                  type={show ? 'text' : 'password'}
                  value={loginCredentials.password}
                  onChange={loginCredentialsChangeHandler}
                  InputProps={{
                    endAdornment:
                      <InputAdornment position='end'>
                        <IconButton onClick={() => setShow(s => !s)}>
                          {show ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                  }}
                />}
              <div className="flex justify-center">
                <Button variant='contained' type='submit' className='!mt-4' disabled={loading}>
                  {forgot ? 'Send Link to Email' : 'Login'}
                </Button>
              </div>
              <div className="flex justify-center mt-4 mb-4">
                <Button variant='outlined' onClick={() => setLogin(false)} disabled={loading}>
                  Don&apos;t have an account?
                </Button>
              </div>
            </form>
            <div className="flex justify-center">
              <Button variant='outlined' onClick={() => setForgot(!forgot)} disabled={loading}>
                {forgot ? 'Login now' : 'Forgot Password?'}
              </Button>
            </div>
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
              <TextField required fullWidth label='Email' name='email' margin='dense' value={userDetails.email} type='email' onChange={userDetailsChangeHandler} />
              <TextField required fullWidth label='About' name='about' margin='dense' value={userDetails.about} onChange={userDetailsChangeHandler} />
              <TextField
                required
                fullWidth
                label='Password'
                name='password'
                margin='dense'
                type={show ? 'text' : 'password'}
                value={userDetails.password}
                onChange={userDetailsChangeHandler}
                InputProps={{
                  endAdornment:
                    <InputAdornment position='end'>
                      <IconButton onClick={() => setShow(s => !s)}>
                        {show ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                }}
              />
              <div className="flex justify-center">
                <Button variant='contained' type='submit' className='!mt-4' disabled={loading}>
                  Register
                </Button>
              </div>
              <div className="flex justify-center mt-4">
                <Button
                  variant='outlined'
                  onClick={() => {
                    setLogin(true)
                    setForgot(false)
                  }}
                  disabled={loading}>
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