import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import * as routes from '../routes';

// TODO: currently using material ui "Link" - might need to replace with react-router-dom "Link"
// when using dynamic paths...
// import { Link } from 'react-router-dom'; 


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
            <AppBar position="static" color="transparent" elevation="0">
                <Toolbar disableGutters>
                    <Typography variant="h4" className={classes.title}>
                        <Link href={routes.HOME} underline="none" color="primary">
                            Secret Ninja Hotdogs
                        </Link>
                    </Typography>
                    <Button color="primary" variant="contained" disableElevation> Login </Button>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default NavBar;
