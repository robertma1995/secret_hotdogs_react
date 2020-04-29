import React, { useState } from 'react';
import { Box, Button, IconButton, Link, Snackbar, Typography }  from '@material-ui/core';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CloseIcon from '@material-ui/icons/Close';
import * as routes from '../utils/routes';

function SuccessSnackbar(props) {
    // snackbar only open if parent opens it and not timed out
    const { parentOpen, message, action, actionRoute } = props;
    const [open, setOpen] = useState(true);

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
            <Button href={actionRoute} color="primary" disableElevation> 
                {action} 
            </Button>
            <IconButton size="small" aria-label="close" onClick={handleClose}>
                <CloseIcon color="secondary" fontSize="small"/>
            </IconButton>
        </div>
    );


    const autoHideDuration = 10000;
    return (
        <Snackbar 
            open={parentOpen && open}
            autoHideDuration={autoHideDuration}
            onClose={handleClose}
            message={snackbarMessage}
            action={snackbarAction}
        />
    );
}

export default SuccessSnackbar;
