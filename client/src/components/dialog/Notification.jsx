import { Avatar as Chavi, Button, Dialog, DialogTitle, ListItem, Stack, Typography } from "@mui/material"
import { memo } from "react"
import { sampleNotifications } from "../../constants/sample"

const Notification = () => {
  const friendHandler = async (id, accept) => {

  }
  return (
    <Dialog open>
      <Stack
        p={{
          xs: '1rem',
          sm: '2rem'
        }}
        maxWidth={'25rem'}>
        <DialogTitle>
          Notifications
        </DialogTitle>
        {sampleNotifications.length > 0 ?
          sampleNotifications.map(notification => <NotificationItem key={notification._id} notification={notification} handler={friendHandler} />)
          :
          <Typography textAlign='center'>
            No Notifications
          </Typography>
        }
      </Stack>
    </Dialog>
  )
}

// eslint-disable-next-line react/display-name
const NotificationItem = memo(({ notification, handler }) => {
  const { sender, _id } = notification
  const { chavi, name } = sender
  return (
    <ListItem>
      <Stack direction='row' alignItems='center' spacing='1rem' width='100%'>
        <Chavi />
        <Typography variant='body1' className="grow line-clamp-1">
          {name}
        </Typography>
        <Stack direction={{
          xs:'column',
          sm:'row'
        }}>
          <Button onClick={() => handler(_id, true)} color='success'>
            Accept
          </Button>
          <Button onClick={() => handler(_id, false)} color='error'>
            Reject
          </Button>
        </Stack>
      </Stack>
    </ListItem>
  )
})

export default Notification