import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Dialog, DialogContent, DialogContentText, DialogTitle, Fab } from '@material-ui/core';
import { Box, IconButton, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
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
    const [open, setOpen] = useState(true);

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
                <AddIcon color="secondary"/>
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
                            <CloseIcon />
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
