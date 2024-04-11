import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import axios from 'axios'
import { server } from '../../constants/config'
import { useDispatch } from 'react-redux'
import { userNotExists } from '../../redux/reducers/auth'
import toast from 'react-hot-toast'

const Logout = ({ closeHandler, open }) => {
    const dispatch = useDispatch()
    const logoutHandler = async () => {
        try {
            const { data } = await axios.get(`${server}/user/logout`, { withCredentials: true })
            dispatch(userNotExists())
            toast.success(data.msg)
        } catch (err) {
            console.log(err)
            toast.error(err?.response?.data?.msg || 'Something went wrong')
        }
    }
    return (
        <Dialog open={open} onClose={closeHandler}>
            <DialogTitle>
                Confirm
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to Logout?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant='outlined' onClick={closeHandler}>
                    Cancel
                </Button>
                <Button variant='contained' color='error' onClick={logoutHandler}>
                    Logout
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default Logout