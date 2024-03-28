import { AdminPanelSettings, Group, Message, Notifications, Person } from "@mui/icons-material"
import { Box, Container, Paper, Stack, Typography } from '@mui/material'
import moment from 'moment'
import Layout from "../../components/layout/admin/Layout"
import { DoughnutChart, LineChart } from "../../components/shared/Charts"
import { Button, SearchField } from "../../components/Styled"

const Dashboard = () => {
  return (
    <Layout>
      <Container component='main'>
        <Paper elevation={3} className='my-8 p-4 rounded-2xl'>
          <Stack className='!flex-row items-center gap-4'>
            <AdminPanelSettings sx={{ fontSize: "2.4rem" }} />
            <SearchField placeholder="Type Here" />
            <Button>
              Search
            </Button>
            <Box flexGrow={1} />
            <Typography
              display={{
                xs: 'none',
                lg: 'block'
              }}
              className='text-center text-[rgba(0,0,0,.7)]'
            >
              {moment().format('dddd, D MMMM YYYY')}
            </Typography>
            <Notifications />
          </Stack>
        </Paper>
        <Stack
          direction={{
            xs: 'column',
            lg: 'row'
          }}
          className='gap-8 flex-wrap justify-center'
          alignItems={{
            xs: 'center',
            lg: 'stretch'
          }}>
          <Paper elevation='3' className="py-8 px-14 rounded-2xl w-full max-w-[45rem]">
            <Typography variant='h4' margin='2rem 0'>
              Last Messages
            </Typography>
            <LineChart val={[3, 64, 21, 6, 2, 77]} />
          </Paper>
          <Paper
            elevation={3}
            sx={{
              width: {
                xs: '100%',
                sm: '50%'
              }
            }}
            className='p-4 rounded-2xl flex justify-center items-center relative max-w-[45rem]'
          >
            <DoughnutChart labels={['Personal Chats', 'Group Chats']} val={[177, 78]} />
            <Stack className='!flex-row absolute justify-center items-center gap-2 w-full h-full'>
              <Group />
              <Typography>
                vs
              </Typography>
              <Person />
            </Stack>
          </Paper>
        </Stack>
        <Stack
          direction={{
            xs: 'column',
            sm: 'row'
          }}
          className='gap-8 justify-between items-center my-8'
        >
          <Widget text='Users' val={38} icon={<Person />} />
          <Widget text='Chats' val={138} icon={<Group />} />
          <Widget text='Messages' val={73768} icon={<Message />} />
        </Stack>
      </Container>
    </Layout>
  )
}

const Widget = ({ icon, text, val }) => {
  return (
    <Paper className='p-8 my-8 !rounded-3xl w-80' elevation={3}>
      <Stack className='items-center gap-4'>
        <Typography className='rounded-full text-[rgba(0,0,0,.7)] border-4 border-gray-900 w-20 h-20 flex justify-center items-center'>
          {val}
        </Typography>
        <Stack className='!flex-row gap-4 items-center'>
          {icon}
          <Typography>
            {text}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  )
}

export default Dashboard