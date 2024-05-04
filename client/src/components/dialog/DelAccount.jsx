import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import axios from "axios"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from 'react-router-dom'
import { server } from "../../constants/config"
import { userNotExists } from "../../redux/reducers/auth"
import { setIsDelAccount } from "../../redux/reducers/misc"

const DelAccount = () => {
    const { isDelAccount } = useSelector(({ misc }) => misc)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const delAccountHandler = async () => {
        dispatch(setIsDelAccount(false))
        try {
            const { data } = await axios.delete(`${server}/user`, { withCredentials: true })
            dispatch(userNotExists())
            navigate('/login')
            toast.success(data.msg)
        } catch (err) {
            console.log(err)
            toast.error(err?.response?.data?.msg || 'Something went wrong')
        }
    }
    return (
        <Dialog open={isDelAccount} onClose={() => dispatch(setIsDelAccount(!isDelAccount))}>
            <DialogTitle>
                Confirm
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to Delete your Account? This process is irreversible and cannot be reversed under any circumstances. Please think twice.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant='outlined' onClick={() => dispatch(setIsDelAccount(!isDelAccount))}>
                    Cancel
                </Button>
                <Button variant='contained' color='error' onClick={delAccountHandler}>
                    Yes, Delete
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DelAccount