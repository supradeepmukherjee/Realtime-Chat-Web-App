import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"

const DeleteGrp = ({ open, closeHandler, deleteHandler }) => {
    return (
        <Dialog open={open} onClose={closeHandler}>
            <DialogTitle>
                Confirm
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want DELETE this Group?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant='outlined' onClick={closeHandler}>
                    Cancel
                </Button>
                <Button variant='contained' color='error' onClick={deleteHandler}>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DeleteGrp