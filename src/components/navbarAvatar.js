import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Badge, Box, Button, IconButton, Typography, Menu } from '@material-ui/core';
import Icon from '../utils/icons';

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
    overflow: {
        textOverflow: 'ellipsis',
        overflow: 'hidden'
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
    // line dividing header and rest of menu - copy-pasted from mui's ListItem divider
    menuHeader: {
        padding: '5px',
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        backgroundClip: 'padding-box',
    },
    menuHeaderItem: {
        paddingTop: '3px',
        paddingBottom: '3px',
    },
    menuButton: {
        fontSize: '0.85rem'
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
                getContentAnchorEl={null}
                keepMounted
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
            >
                <Box display="flex" flexDirection="column" alignItems="center" className={classes.menuHeader}>
                    <Box className={classes.menuHeaderItem}>
                        <Badge 
                            overlap="circle"
                            anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                            badgeContent={
                                <IconButton className={classes.menuAvatarBadge}>
                                    <Icon name="camera" size="small" />
                                </IconButton>
                            }
                        >
                            <Avatar src={imageUrl} className={classes.menuAvatar} />
                        </Badge>
                    </Box>
                    <Box className={classes.menuHeaderItem}>
                        <Typography variant="body2" className={classes.overflow}> 
                            {userName} 
                        </Typography>
                    </Box>
                </Box>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Box width="100%">
                        <Button
                            variant="text"
                            color="primary"
                            disableElevation
                            fullWidth
                            startIcon={<Icon name="logout" size="small" />}
                            onClick={() => handleLogout()}
                            className={classes.menuButton}
                        >
                            Sign Out
                        </Button>
                    </Box>
                </Box>
            </Menu>
        </>
    );
}

export default NavbarAvatar;
