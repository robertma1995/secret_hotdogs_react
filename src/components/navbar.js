import React, { useContext, useState } from 'react';
// material ui
import { AppBar, Box, Button, Toolbar, Typography, } from '@material-ui/core';
// my components
import RouterLink from './routerLink';
import LoginFormDialog from './loginFormDialog';
import NavbarAvatar from './navbarAvatar';
// routing
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import * as routes from '../utils/routes';
// context
import { UserContext } from '../userContext';
// database
import * as DB from '../database/wrapper';

function NavBar(props) { 
    // TODO: remove userName placeholder after user profile images finished
    const { userId, setCurrentUserId, userName, setCurrentUserName } = useContext(UserContext);
    const [avatarUrl, setAvatarUrl] = useState("");
    
    // TODO: maybe wrap this is a useEffect instead
    // TODO: add profile image url to context to prevent empty avatar on reload
    // TODO: avatar clickable menu + logout
    if (userId) {
        (async () => {
            const url = await DB.getUserProfileImage(userId);
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
                            <RouterLink color="primary" underline="none" to={routes.HOME}>
                                Secret Ninja Hotdogs
                            </RouterLink>
                        </Typography>
                    </Box>
                    <Box p={1}>
                        { userId && 
                            <NavbarAvatar 
                                imageUrl={avatarUrl}
                                userName={userName}
                                handleLogout={handleLogout} 
                            />
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
