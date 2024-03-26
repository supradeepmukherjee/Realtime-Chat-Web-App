import { Button, Container, Paper, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { Navigate } from 'react-router-dom'

const Login = () => {
  const [key, setKey] = useState('')
  const [admin, setAdmin] = useState(true)
  const loginHandler = async e => {
    e.preventDefault()
  }
  if (admin) return <Navigate to='/admin/dashboard' />
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
        <Typography variant='h5'>
          Admin Login
        </Typography>
        <form onSubmit={loginHandler} className='w-full mt-4'>
          <TextField required fullWidth label='Secret Key' margin='normal' type='password' value={key} onChange={e => setKey(e.target.value)} />
          <div className="flex justify-center">
            <Button variant='contained' type='submit' className='!mt-4'>
              Login
            </Button>
          </div>
        </form>
      </Paper>
    </Container>
  )
}

export default Login