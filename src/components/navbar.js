import React, { useContext, useState } from 'react';
import { AppBar, Grid, Toolbar, Typography, Button, Link } from '@material-ui/core';
// routing
import { withRouter } from 'react-router-dom';
import * as routes from '../utils/routes';
// context
import { UserContext } from '../userContext';

function NavBar() { 
    const { userId, setCurrentUserId, userName, setCurrentUserName } = useContext(UserContext);
    
    // TODO: change navbar depending on if user is logged in - useEffect?

    return (
        <AppBar position="static" color="transparent" elevation={0}>
            <Toolbar disableGutters>
                <Grid container justify="space-between">
                    <Grid item>
                        <Typography variant="h4">
                            <Link href={routes.HOME} color="primary" underline="none">
                                Secret Ninja Hotdogs
                            </Link>
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Button href={routes.LOGIN} color="primary" variant="contained" disableElevation> Login </Button>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;
