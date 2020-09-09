import React, { useContext, useState } from 'react';
// material ui
import { AppBar, Avatar, Box, Button, Toolbar, Typography, } from '@material-ui/core';
// routing
import { withRouter } from 'react-router-dom';
import * as routes from '../utils/routes';
// my components
import RouterLink from './routerLink';
import LoginFormDialog from './loginFormDialog';
// routing
import { Link } from 'react-router-dom';
// context
import { UserContext } from '../userContext';
// database
import * as DB from '../database/wrapper';

function NavBar(props) { 
    // TODO: remove userName placeholder after user profile images finished
    const { userId, setCurrentUserId, userName, setCurrentUserName } = useContext(UserContext);
    const [avatarUrl, setAvatarUrl] = useState("");
    
    // TODO: maybe wrap this is a useEffect instead
    if (userId) {
        console.log("USER ID SET: " + userId);
        (async () => {
            const url = await DB.getUserProfileImage(userId);
            console.log("profile image url: " + url);
            setAvatarUrl(url);
        })();
    }
    
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
                            {/* TODO: only use RouterLink once - no need for separate file */}
                            <RouterLink color="primary" underline="none" to={routes.HOME}>
                                Secret Ninja Hotdogs
                            </RouterLink>
                        </Typography>
                    </Box>
                    <Box p={1}>
                        { userId && 
                            <Avatar src={avatarUrl} />
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
                                color="secondary"
                                variant="text" 
                                disableElevation
                                onClick={() => handleLogout()}
                            >
                                Logout 
                            </Button>
                        }
                        { !userId && 
                            <LoginFormDialog />
                        }
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default withRouter(NavBar);
