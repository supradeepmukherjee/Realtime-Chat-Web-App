import { Error } from '@mui/icons-material'
import { Container, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

const Error404 = () => {
  return (
    <Container className='h-screen w-screen'>
      <Stack className='items-center gap-8 content-center'>
        <Error />
        <Typography variant='h1' fontSize='10rem'>
          404 Not Found
        </Typography>
        <Link to='/'>
          Go to Home
        </Link>
      </Stack>
    </Container>
  )
}

export default Error404