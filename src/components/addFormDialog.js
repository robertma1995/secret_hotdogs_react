import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { 
    Box, IconButton, Typography,
    Dialog, DialogContent, DialogContentText, DialogTitle, Fab
} from '@material-ui/core';
import Icon from '../utils/icons';
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
                <Icon name="plus" color="secondary" />
            </Fab>
            <Dialog 
                fullWidth
                maxWidth="xs"
                open={open}
                onClose={() => handleClose()}
            >
                <Box display="flex" flexDirection="row" alignItems="center">
                    <Box flexGrow={1}>
                        <Typography 
                            variant="h5" 
                            align="center" 
                            color="textSecondary"
                            className={classes.title}
                        > 
                            Post a new hotdog
                        </Typography>
                    </Box>
                    <Box>
                        <IconButton onClick={() => handleClose()}>
                            <Icon name="close" />
                        </IconButton>
                    </Box>
                </Box>
                <DialogContent>
                    <AddForm />
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default AddFormDialog;
