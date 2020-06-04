import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Dialog, DialogContent, DialogTitle, Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
// my components
import AddForm from './addForm';

const useStyles = makeStyles((theme) => ({
    fab: {
        position: 'fixed',
        bottom: theme.spacing(4),
        right: theme.spacing(4),
    }
}));


// Dialog wrapper for AddForm used on home page (HomeHotdogGrid)
// FAB at bottom right of screen open dialog
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
                <AddIcon color="secondary"/>
            </Fab>
            <Dialog open={open} onClose={() => handleClose()}>
                <DialogTitle> Add a hotdog </DialogTitle>
                <DialogContent>
                    <p> ADD FORM PLACEHOLDER </p>
                </DialogContent>
            </Dialog>
        </div>


    );
}

export default AddFormDialog;
