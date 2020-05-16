import React, { useContext, useState } from 'react';
import { AppBar, Box, Button, Grid, Link, Toolbar, Typography, } from '@material-ui/core';
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
                <Box display="flex" alignItems="center" width={1}>
                    <Box flexGrow={1}>
                        <Typography variant="h4">
                            <Link href={routes.HOME} color="primary" underline="none">
                                Secret Ninja Hotdogs
                            </Link>
                        </Typography>
                    </Box>
                    <Box>
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
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

/*
{ userId &&
    <Grid container justify="space-between">
        <Grid item>
            Arisette
        </Grid>
        <Grid item>
            <Button 
                color="primary" 
                variant="contained" 
                disableElevation
                onClick={() => handleLogout()}
            > 
                Logout 
            </Button>
        </Grid>
    </Grid>
}
*/

export default withRouter(NavBar);
