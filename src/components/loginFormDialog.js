import React, { useState } from 'react';
import { Button, Dialog, DialogContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LoginForm from './loginForm';
import icons from '../utils/icons';

const useStyles = makeStyles((theme) => ({
    dialog: {
        paddingTop: 'unset!important',
        padding: 'unset',
        // height: '700px'
    },
}));

/*
    login dialog instead of a separate page
*/
function LoginFormDialog() {
    const [open, setOpen] = useState(false);
    const classes = useStyles();

    function handleOpen() {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
    }

    return (
        <>
            <Button 
                variant="text" 
                color="secondary" 
                onClick={() => handleOpen()}
            >
                Login
            </Button>
            <Dialog 
                fullWidth
                maxWidth="xs"
                open={open}
                onClose={() => handleClose()}
            >
                <DialogContent className={classes.dialog}>
                    <LoginForm />
                </DialogContent>
            </Dialog>
        </>
    );
}

export default LoginFormDialog;
