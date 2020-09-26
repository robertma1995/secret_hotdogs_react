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
    const { userId, setCurrentUserId, userName, setCurrentUserName, userProfileImageUrl } = useContext(UserContext);
    const [openLoginDialog, setOpenLoginDialog] = useState(false);

    // unset context vars and redirect to login page
    function handleLogout() {
        setCurrentUserId(null);
        setCurrentUserName(null);
        props.history.push(routes.HOME);
    }

    function handleOpenLoginDialog() {
        setOpenLoginDialog(true);
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
                    <Box>
                        { userId && 
                            <NavbarAvatar 
                                avatarUrl={userProfileImageUrl}
                                userName={userName}
                                handleLogout={handleLogout} 
                            />
                        }
                        { !userId && 
                            <>
                                <Button 
                                    component={Link}
                                    to={routes.REGISTER}
                                    color="secondary" 
                                    variant="text" 
                                    disableElevation
                                > 
                                    Sign Up
                                </Button>
                                <Button 
                                    variant="text" 
                                    color="secondary" 
                                    onClick={() => handleOpenLoginDialog()}
                                >
                                    Login
                                </Button>
                                <LoginFormDialog open={openLoginDialog} setOpen={setOpenLoginDialog} />
                            </>
                        }
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default withRouter(NavBar);
