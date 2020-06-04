import React, { useState } from 'react';
// material ui
import { Box, Button, IconButton, Snackbar, Typography }  from '@material-ui/core';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CloseIcon from '@material-ui/icons/Close';
// my components
import RouterLink from './routerLink';

function SuccessSnackbar(props) {
    // snackbar only opens if parent opens it, sets parent val to false if time out
    const { open, setOpen, message, action, actionRoute } = props;

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    }

    // message with an icon
    const snackbarMessage = (
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

    // main action button + close button
    // TODO: may generalize to add onclick functionality to action button
    const snackbarAction = (
        <div>
            <Button color="primary" disableElevation> 
                <RouterLink color="secondary" underline="none" to={actionRoute}>
                    {action}
                </RouterLink>
            </Button>
            <IconButton size="small" aria-label="close" onClick={handleClose}>
                <CloseIcon color="secondary" fontSize="small"/>
            </IconButton>
        </div>
    );


    const autoHideDuration = 10000;
    return (
        <Snackbar 
            open={open}
            autoHideDuration={autoHideDuration}
            onClose={handleClose}
            message={snackbarMessage}
            action={snackbarAction}
        />
    );
}

export default SuccessSnackbar;
