import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { 
    Box, IconButton, Typography,
    Dialog, DialogContent
} from '@material-ui/core';
import Icon from '../utils/icons';
// my components
import AddForm from './addForm';

const useStyles = makeStyles((theme) => ({
    title: {
        paddingLeft: '50px'
    },
    dialogContent: {
        paddingLeft: '5px!important',
        paddingRight: '5px!important'
    }
}));

// Dialog wrapper for AddForm used on home page (HomeHotdogGrid)
// clicking on fab opens the dialog
function AddFormDialog(props) {
    const { open, setOpen } = props;
    const classes = useStyles();

    function handleClose() {
        setOpen(false);
    }

    return (
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
            <DialogContent className={classes.dialogContent}>
                <AddForm />
            </DialogContent>
        </Dialog>
    );
}

export default AddFormDialog;
