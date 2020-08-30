import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { 
    Box, IconButton,
    Dialog, DialogContent, DialogContentText, DialogTitle, Fab
} from '@material-ui/core';
import icons from '../utils/icons';
// my components
import AddForm from './addForm';

const useStyles = makeStyles((theme) => ({
    // anchor fab to bottom right of screen
    fab: {
        position: 'fixed',
        bottom: theme.spacing(4),
        right: theme.spacing(4),
    },
}));

// Dialog wrapper for AddForm used on home page (HomeHotdogGrid)
// clicking on fab opens the dialog
function AddFormDialog() {
    const [open, setOpen] = useState(false);

    function handleOpen() {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
    }

    const classes = useStyles();
    return (
        <div>
            <Fab
                className={classes.fab} 
                aria-label="Add a hotdog"
                color="primary"
                onClick={() => handleOpen()}
            >
                {icons["plus"]}
            </Fab>
            <Dialog 
                fullWidth
                maxWidth="xs"
                open={open}
                onClose={() => handleClose()}
            >
                <Box display="flex" flexDirection="row">
                    <Box flexGrow={1}>
                        <DialogTitle> Post a new hotdog </DialogTitle>
                    </Box>
                    <Box>
                        <IconButton onClick={() => handleClose()}>
                            {icons["close"]}
                        </IconButton>
                    </Box>
                </Box>
                <DialogContent>
                    <DialogContentText>
                        Type in the details of your new hotdog.
                    </DialogContentText>
                    <AddForm/>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default AddFormDialog;
