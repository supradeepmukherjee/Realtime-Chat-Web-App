import { Avatar as Chavi, Button, Dialog, DialogTitle, ListItem, Skeleton, Stack, Typography } from "@mui/material"
import { memo } from "react"
import { useDispatch, useSelector } from "react-redux"
import useErrors from "../../hooks/useErrors"
import useMutation from "../../hooks/useMutation"
import { useAcceptRequestMutation, useGetNotificationsQuery } from "../../redux/api"
import { setIsNotification } from "../../redux/reducers/misc"

const Notification = () => {
  const { isLoading, data, error, isError } = useGetNotificationsQuery()
  const { isNotification } = useSelector(({ misc }) => misc)
  const dispatch = useDispatch()
  const [acceptRequest] = useMutation(useAcceptRequestMutation)
  const friendHandler = async (id, accept) => {
    dispatch(setIsNotification(false))
    acceptRequest('Please wait...', { id, accept })
  }
  useErrors([{ error, isError }])
  return (
    <Dialog open={isNotification} onClose={() => dispatch(setIsNotification(!isNotification))}>
      <Stack
        p={{
          xs: '1rem',
          sm: '2rem'
        }}
        maxWidth={'25rem'}>
        <DialogTitle>
          Notifications
        </DialogTitle>
        {isLoading ? <Skeleton /> :
          (data?.requests?.length > 0 ?
            data?.requests?.map(notification => <NotificationItem key={notification._id} notification={notification} handler={friendHandler} />)
            :
            <Typography textAlign='center'>
              No Notifications
            </Typography>
          )}
      </Stack>
    </Dialog>
  )
}

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
          xs: 'column',
          sm: 'row'
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