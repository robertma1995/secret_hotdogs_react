import React, { useContext, useState } from 'react';
import { AppBar, Button, Grid, Link, Toolbar, Typography, } from '@material-ui/core';
// routing
import { withRouter } from 'react-router-dom';
import * as routes from '../utils/routes';
// context
import { UserContext } from '../userContext';

function NavBar(props) { 
    const { userId, setCurrentUserId, userName, setCurrentUserName } = useContext(UserContext);
    
    // unset context vars and redirect to login page
    function handleLogout() {
        setCurrentUserId(null);
        setCurrentUserName(null);
        props.history.push(routes.LOGIN);
    }

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
                        { !userId && <Button href={routes.LOGIN} color="primary" variant="contained" disableElevation> Login </Button> }
                        { userId && 
                            <Button 
                                color="primary" 
                                variant="contained" 
                                disableElevation
                                onClick={() => handleLogout()}
                            > 
                                Logout 
                            </Button>
                        }
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    );
}

export default withRouter(NavBar);
