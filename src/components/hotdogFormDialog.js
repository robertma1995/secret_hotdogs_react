import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { 
    Box, IconButton, Typography,
    Dialog, DialogContent
} from '@material-ui/core';
import Icon from '../utils/icons';
// my components
import HotdogForm from './hotdogForm';

const useStyles = makeStyles((theme) => ({
    title: {
        paddingLeft: '50px'
    },
    dialogContent: {
        paddingLeft: '5px!important',
        paddingRight: '5px!important'
    }
}));

/* 
    Dialog wrapper for HotdogForm - used in HotdogGrid & HotdogDetailsDialog
        id, description, ..., setDialogHotdogImageUrl - used exclusively in HotdogDetailsDialog
        setAddId, setEditId - used exclusively for HotdogGrid fake real-time
*/ 
function HotdogFormDialog(props) {
    const { 
        open, setOpen,
        id, description, ingredients, title, edit, dialogHotdogImageUrl, setDialogHotdogImageUrl,
        setAddId, setEditId,
    } = props;
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
                        {edit && "Edit hotdog"}
                        {!edit && "Post a new hotdog"}
                    </Typography>
                </Box>
                <Box>
                    <IconButton onClick={() => handleClose()}>
                        <Icon name="close" />
                    </IconButton>
                </Box>
            </Box>
            <DialogContent className={classes.dialogContent}>
                <HotdogForm
                    id={id}
                    initialDescription={description}
                    initialHotdogImageUrl={dialogHotdogImageUrl}
                    initialIngredients={ingredients}
                    initialTitle={title}
                    edit={edit}
                    setDialogHotdogImageUrl={setDialogHotdogImageUrl}
                    setAddId={setAddId}
                    setEditId={setEditId}
                />
            </DialogContent>
        </Dialog>
    );
}

export default HotdogFormDialog;
