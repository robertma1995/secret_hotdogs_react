import React from 'react';
import { AppBar, Toolbar, Typography, Button, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import * as routes from '../utils/routes';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    title: {
        flexGrow: 1,
    },
}));

function NavBar() { 
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <AppBar position="static" color="transparent" elevation={0}>
                <Toolbar disableGutters>
                    <Typography variant="h4" className={classes.title}>
                        <Link href={routes.HOME} color="primary" underline="none">
                            Secret Ninja Hotdogs
                        </Link>
                    </Typography>
                    <Button href={routes.LOGIN} color="primary" variant="contained" disableElevation> Login </Button>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default NavBar;
