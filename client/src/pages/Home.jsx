import { Box, Typography } from '@mui/material'
import Layout from '../components/layout/Layout'

const Home = () => {
  return (
    <Box className='border-l-2 border-black h-[calc(100vh-4rem)]'>
      <Typography variant='h5' className='text-center p-8'>
        Chat with a Friend
      </Typography>
    </Box>
  )
}

export default Layout()(Home)