import React, { useContext } from 'react';
// material ui
import { AppBar, Box, Button, Toolbar, Typography, } from '@material-ui/core';
// routing
import { withRouter } from 'react-router-dom';
import * as routes from '../utils/routes';
// my components
import RouterLink from './routerLink';
// routing
import { Link } from 'react-router-dom';
// context
import { UserContext } from '../userContext';

function NavBar(props) { 
    const { userId, setCurrentUserId, userName, setCurrentUserName } = useContext(UserContext);
    
    // unset context vars and redirect to login page
    function handleLogout() {
        setCurrentUserId(null);
        setCurrentUserName(null);
        props.history.push(routes.HOME);
    }

    return (
        <AppBar position="sticky" elevation={0}>
            <Toolbar>
                <Box display="flex" alignItems="center" width={1}>
                    <Box flexGrow={1}>
                        <Typography variant="h6">
                            <RouterLink color="primary" underline="none" to={routes.HOME}>
                                Secret Ninja Hotdogs
                            </RouterLink>
                        </Typography>
                    </Box>
                    <Box p={1}>
                        { userId && 
                            <Typography variant="subtitle1" color="secondary">
                                Welcome, {userName}!
                            </Typography>
                        }
                        { !userId && 
                            <Button 
                                component={Link}
                                to={routes.REGISTER}
                                color="secondary" 
                                variant="text" 
                                disableElevation
                            > 
                                Sign Up
                            </Button>
                        }
                    </Box>
                    <Box>
                        { userId && 
                            <Button
                                color="primary"
                                variant="text" 
                                disableElevation
                                onClick={() => handleLogout()}
                            >
                                Logout 
                            </Button>
                        }
                        { !userId && 
                            <Button 
                                component={Link}
                                to={routes.LOGIN}
                                color="primary"
                                variant="text" 
                                disableElevation
                            > 
                                Login
                            </Button>
                        }
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default withRouter(NavBar);
