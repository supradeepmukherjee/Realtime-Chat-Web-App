import { Dialog, DialogContent, DialogContentText, DialogTitle } from "@mui/material"

const DeleteGrp = ({ open, closeHandler, deleteHandler }) => {
    return (
        <Dialog>
            <DialogTitle>
                Confirm
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want DELETE this Group?
                </DialogContentText>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteGrp