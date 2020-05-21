import React, { useContext } from 'react';
// material ui
import { AppBar, Box, Button, Toolbar, Typography, } from '@material-ui/core';
// routing
import { withRouter } from 'react-router-dom';
import * as routes from '../utils/routes';
// my components
import RouterLink from './routerLink';
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
                            <RouterLink color="primary" underline="none" to={routes.HOME}>
                                Secret Ninja Hotdogs
                            </RouterLink>
                        </Typography>
                    </Box>
                    { userId &&
                        // TODO: instead of a welcome message, display user avatar with dropdown menu
                        <Box p={2}>
                            <Typography variant="subtitle1" color="textSecondary">
                                Welcome, {userName}!
                            </Typography>
                        </Box>
                    }
                    <Box>
                        { !userId && 
                            <Button color="primary" variant="contained" disableElevation> 
                                <RouterLink color="secondary" underline="none" to={routes.LOGIN}>
                                    Login
                                </RouterLink>
                            </Button>
                        }
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

export default withRouter(NavBar);
