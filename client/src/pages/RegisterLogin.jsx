import { useState } from 'react'
import { Avatar, Button, Container, IconButton, Paper, Stack, TextField, Typography } from '@mui/material'

const RegisterLogin = () => {
  const [login, setLogin] = useState(true)
  const loginHandler = async e => {
    e.preventDefault()
  }
  const registerHandler = async e => {
    e.preventDefault()
  }
  return (
    <Container maxWidth='xs' className='h-screen !flex justify-center items-center'>
      <Paper
        elevation={3}
        sx={{
          padding: 4,
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
              <TextField required fullWidth label='Email' margin='normal' type='email' />
              <TextField required fullWidth label='Password' margin='normal' type='password' />
              <div className="flex justify-center">
                <Button variant='contained' type='submit' className='!mt-4'>
                  Login
                </Button>
              </div>
              <Typography className='text-center !m-4'>
                OR
              </Typography>
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
            <Stack className='relative w-40 m-auto'>
              <Avatar className='w-40 h-40 object-cover' />
              <IconButton>
                <>
                
                </>
              </IconButton>
            </Stack>
            <form onSubmit={registerHandler} className='w-full mt-4'>
              <TextField required fullWidth label='Name' margin='normal' />
              <TextField required fullWidth label='About' margin='normal' />
              <TextField required fullWidth label='Email' margin='normal' type='email' />
              <TextField required fullWidth label='Password' margin='normal' type='password' />
              <div className="flex justify-center">
                <Button variant='contained' type='submit' className='!mt-4'>
                  Register
                </Button>
              </div>
              <Typography className='text-center !m-4'>
                OR
              </Typography>
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