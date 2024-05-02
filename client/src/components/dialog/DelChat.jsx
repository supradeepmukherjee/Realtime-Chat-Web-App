import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import useMutation from "../../hooks/useMutation"
import { useDelChatMutation } from "../../redux/api"
import { setIsDelChat } from "../../redux/reducers/misc"

const DelChat = ({ name, grp, openClose }) => {
    const { isDelChat, selectedDelChat } = useSelector(({ misc }) => misc)
    const [delChat, loading] = useMutation(useDelChatMutation)
    const dispatch = useDispatch()
    const delChatHandler = async () => {
        dispatch(setIsDelChat(false))
        delChat(`Deleting ${grp ? 'Group' : 'Chat'}`, selectedDelChat.id)
    }
    return (
        <Dialog open={isDelChat} onClose={openClose}>
            <DialogTitle>
                Confirm
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Do you want to delete the {grp ? `Group named "${name}"` : `Chat with "${name}"`}?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant='outlined' onClick={openClose}>
                    Cancel
                </Button>
                <Button variant='contained' color='error' onClick={delChatHandler} disabled={loading}>
                    Yes, Delete
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DelChat