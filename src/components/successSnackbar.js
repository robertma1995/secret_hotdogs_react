import React from 'react';
// material ui
import { Box, Button, IconButton, Snackbar, Typography }  from '@material-ui/core';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CloseIcon from '@material-ui/icons/Close';
// routing
import { Link } from 'react-router-dom';

/*
    message with an icon
*/
function Message(props) {
    const { message } = props;
    return (
        <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center">
            <Box mr={2}>
                <CheckCircleOutlineIcon/>
            </Box>
            <Box>
                <Typography variant="subtitle2" display="inline">
                    {message}
                </Typography>
            </Box>
        </Box>
    );
}

/* 
    close button (default) + action button (if defined)
*/
function Action(props) {
    const { actionButton, handleClose } = props;
    return (
        <>
            {actionButton}
            <IconButton size="small" aria-label="close" onClick={handleClose}>
                <CloseIcon color="secondary" fontSize="small"/>
            </IconButton>
        </>
    );    
}

/* 
    only opens if parent opens it, sets parent val to false if time out or closed
*/
function SuccessSnackbar(props) {
    const { open, setOpen, message, action } = props;

    function handleClose(event, reason) {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    }

    const autoHideDuration = 10000;
    return (
        <Snackbar 
            open={open}
            autoHideDuration={autoHideDuration}
            onClose={(event, reason) => handleClose(event, reason)}
            message={<Message message={message} />}
            action={<Action actionButton={action} handleClose={handleClose}/>}
        />
    );
}

export default SuccessSnackbar;
