import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from "@mui/material"
import axios from "axios"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { server } from "../../constants/config"
import { setIsDelMsg } from "../../redux/reducers/misc"

const DelMsg = ({ setMsgs }) => {
    const { isDelMsg, selectedDelMsg } = useSelector(({ misc }) => misc)
    const dispatch = useDispatch()
    const delChatHandler = async () => {
        const id = toast.loading('Sending Email...')
        dispatch(setIsDelMsg(false))
        try {
            const { data } = await axios.delete(`${server}/chat/del-msg/${selectedDelMsg}`, { withCredentials: true })
            toast.success(data.msg, { id })
            setMsgs(m => m.filter(({ _id }) => _id !== selectedDelMsg))
        } catch (err) {
            console.log(err)
            toast.error(err?.response?.data?.msg || 'Something went wrong', { id })
        }
    }
    return (
        <Dialog open={isDelMsg} onClose={() => dispatch(setIsDelMsg(!isDelMsg))}>
            <DialogContent>
                <DialogContentText className="text-center">
                    Delete this Msg?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant='outlined' onClick={() => dispatch(setIsDelMsg(!isDelMsg))}>
                    Cancel
                </Button>
                <Button variant='contained' color='error' onClick={delChatHandler}>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DelMsg