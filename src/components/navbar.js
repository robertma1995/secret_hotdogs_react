import React, { useContext, useEffect, useState } from 'react';
// material ui
import { AppBar, Avatar, Box, Button, CircularProgress, Toolbar, Typography } from '@material-ui/core';
// my components
import LoginFormDialog from './loginFormDialog';
import NavbarMenu from './navbarMenu';
import RouterLink from './routerLink';
// routing
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import * as routes from '../utils/routes';
// context
import { UserContext } from '../userContext';
// database
import * as DB from '../database/wrapper';

function NavBar(props) { 
    const { userId, setCurrentUserId } = useContext(UserContext);
    const [openLoginDialog, setOpenLoginDialog] = useState(false);
    const [userName, setUserName] = useState("");
    const [userImageUrl, setUserImageUrl] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId !== null) {
            (async () => {
                // reset loading status to allow logging in/out to refresh the navbar avatar
                setLoading(true);
                const user = await DB.getUser(userId);
                const url = await DB.getUserImage(userId);
                setUserName(user["name"]);
                setUserImageUrl(url);
                setLoading(false);
            })();
        }
    }, [userId]);

    function handleLogout() {
        setCurrentUserId(null);
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
                        { userId && !loading &&
                            <NavbarMenu 
                                userId={userId}
                                userName={userName}
                                userImageUrl={userImageUrl}
                                setUserImageUrl={setUserImageUrl}
                                handleLogout={handleLogout}
                            />
                        }
                        { userId && loading &&
                            <Avatar style={{ height: '40px', width: '40px', backgroundColor: 'transparent' }}>
                                <CircularProgress color="primary" size="inherit" />
                            </Avatar>
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
