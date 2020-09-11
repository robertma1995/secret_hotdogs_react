import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Badge, Box, Button, IconButton, Menu, MenuItem, Typography } from '@material-ui/core';
import icons from '../utils/icons';

const useStyles = makeStyles((theme) => ({
    button: {
        paddingLeft: 'unset',
        paddingRight: 'unset'
    },
    avatar: {
        opacity: 0.6,
        '&:hover': {
            opacity: 1
        }
    },
    menuAvatar: {
        width: theme.spacing(10),
        height: theme.spacing(10),
    },
    // override theme.js IconButton hover background color, shadow copied from google account selector
    menuAvatarBadge: {
        width: '30px',
        height: '30px',
        // border: '1px solid white',
        backgroundColor: 'white',
        boxShadow: '0 1px 1px 0 rgba(65, 69, 73, 0.3)',
        '&:hover': {
            backgroundColor: '#f6f2ef',
        }
    },
    menuHeader: {
        padding: '5px',
    }
}));


/* 
    Avatar with material ui menu - for now, only used in navbar, and also takes in handleLogout function
*/
function NavbarAvatar(props) {
    const { imageUrl, userName, handleLogout } = props;
    const [anchorEl, setAnchorEl] = useState(null);
    const classes = useStyles();

    function handleOpen(event) {
        setAnchorEl(event.currentTarget);
    }

    function handleClose() {
        setAnchorEl(null);
    }

    return (
        <>
            <Button onClick={(event) => handleOpen(event)} className={classes.button}>
                <Avatar src={imageUrl} className={classes.avatar} />
            </Button>
            <Menu
                open={Boolean(anchorEl)}
                onClose={() => handleClose()}
                anchorEl={anchorEl}
                className={classes.menu}
                keepMounted
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
            >
                <Box display="flex" flexDirection="column" alignItems="center" className={classes.menuHeader}>
                    <Box>
                        <Badge 
                            overlap="circle"
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right'
                            }}
                            badgeContent={
                                <IconButton className={classes.menuAvatarBadge}>
                                    {icons["camera"]}
                                </IconButton>
                            }
                        >
                            <Avatar src={imageUrl} className={classes.menuAvatar} />
                        </Badge>
                    </Box>
                    <Box>
                        <Typography variant="caption"> {userName} </Typography>
                    </Box>
                </Box>
                <MenuItem onClick={() => handleClose()}>
                    Logout
                </MenuItem>
            </Menu>
        </>
    );
}

export default NavbarAvatar;
