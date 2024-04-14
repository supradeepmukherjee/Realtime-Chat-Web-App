import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import axios from 'axios'
import { server } from '../../constants/config'
import { useDispatch, useSelector } from 'react-redux'
import { userNotExists } from '../../redux/reducers/auth'
import toast from 'react-hot-toast'
import { setIsLogout } from "../../redux/reducers/misc"

const Logout = () => {
    const dispatch = useDispatch()
    const { isLogout } = useSelector(({ misc }) => misc)
    const logoutHandler = async () => {
        try {
            const { data } = await axios.get(`${server}/user/logout`, { withCredentials: true })
            dispatch(userNotExists())
            dispatch(setIsLogout(false))
            toast.success(data.msg)
        } catch (err) {
            console.log(err)
            toast.error(err?.response?.data?.msg || 'Something went wrong')
        }
    }
    return (
        <Dialog open={isLogout} onClose={() => dispatch(setIsLogout(!isLogout))}>
            <DialogTitle>
                Confirm
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to Logout?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant='outlined' onClick={() => dispatch(setIsLogout(!isLogout))}>
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