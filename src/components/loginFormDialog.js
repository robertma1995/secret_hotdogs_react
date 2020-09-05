import React, { useState } from 'react';
import { 
    Box, Button, IconButton, Typography,
    Dialog, DialogContent
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LoginForm from './loginForm';
import icons from '../utils/icons';

const useStyles = makeStyles((theme) => ({
    dialog: {
        paddingTop: 'unset!important',
        padding: 'unset',
        // height: '700px'
    },
    button: {
        '&:hover': {
            color: '#b9f6ca',
        }
    },
    title: {
        paddingLeft: '50px'
    }
}));

/*
    login dialog instead of a separate page, different hover color if used in snackbar
*/
function LoginFormDialog(props) {
    const { snackbar } = props;
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
                className={snackbar ? classes.button : undefined}
            >
                Login
            </Button>
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
                            Login 
                        </Typography>
                    </Box>
                    <Box>
                        <IconButton onClick={() => handleClose()}>
                            {icons["close"]}
                        </IconButton>
                    </Box>
                </Box>
                <DialogContent className={classes.dialog}>
                    <LoginForm closeDialog={handleClose} />
                </DialogContent>
            </Dialog>
        </>
    );
}

export default LoginFormDialog;
