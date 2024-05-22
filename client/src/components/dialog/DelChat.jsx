import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import useMutation from "../../hooks/useMutation"
import { useDelChatMutation, useLazyUnreadQuery } from "../../redux/api"
import { setFreshNewMsgsAlert } from "../../redux/reducers/chat"
import { setIsDelChat } from "../../redux/reducers/misc"

const DelChat = ({ name, grp, openClose }) => {
    const { user } = useSelector(({ auth }) => auth)
    const { isDelChat, selectedDelChat } = useSelector(({ misc }) => misc)
    const [delChat, loading] = useMutation(useDelChatMutation)
    const [getUnread] = useLazyUnreadQuery()
    const dispatch = useDispatch()
    const delChatHandler = async () => {
        dispatch(setIsDelChat(false))
        await delChat(`Deleting ${grp ? 'Group' : 'Chat'}`, selectedDelChat.id)
        getUnread(user._id)
            .then(({ data }) => dispatch(setFreshNewMsgsAlert(data.unread.unread)))
            .catch(err => console.log(err))
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