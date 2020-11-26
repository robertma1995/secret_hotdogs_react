import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Badge, Box, Button, CircularProgress, IconButton, Typography, Menu } from '@material-ui/core';
import ImageButton from './imageButton';
import Icon from '../utils/icons';
import PhotoUploadDialog from './photoUploadDialog';
import * as DB from '../database/wrapper';

const useStyles = makeStyles((theme) => ({
    button: {
        paddingTop: '5px',
        paddingBottom: '5px'
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
    // transparent background if menu avatar is loading
    loading: {
        backgroundColor: 'transparent'
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
        outline: 'none',
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
function NavbarMenu(props) {
    const { userId, userName, userImageUrl, setUserImageUrl, handleLogout } = props;
    const [anchor, setAnchor] = useState(null);
    const [openPhotoDialog, setOpenPhotoDialog] = useState(false);
    const [newImage, setNewImage] = useState(null);
    const [newImageUrl, setNewImageUrl] = useState(userImageUrl);
    const [loading, setLoading] = useState(false);
    const classes = useStyles();

    // update backend, set image src as firebase url - set new image last to prevent recursive calls
    useEffect(() => {
        if (newImageUrl !== userImageUrl) {
            // console.log("CHANGED USER IMAGE");
            (async () => {
                setLoading(true);
                let url = await DB.putUserImage(userId, newImage);
                setUserImageUrl(url);
                setNewImageUrl(url);
                setLoading(false);
            })();
        }
    }, [newImageUrl]);
    
    function handleOpen(event) {
        setAnchor(event.currentTarget);
    }

    function handleClose() {
        setAnchor(null);
    }

    function handleOpenPhotoDialog() {
        setOpenPhotoDialog(true);
    }

    return (
        <>
            <ImageButton 
                imageUrl={userImageUrl}
                iconName="settings"
                handleClick={handleOpen}
                avatar
                navbar
            />
            <Menu
                open={Boolean(anchor)}
                onClose={() => handleClose()}
                anchorEl={anchor}
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
                                <>
                                    <IconButton onClick={() => handleOpenPhotoDialog()} className={classes.menuAvatarBadge}>
                                        <Icon name="camera" size="small" />
                                    </IconButton>
                                    <PhotoUploadDialog 
                                        setPhoto={setNewImage} 
                                        photoUrl={newImageUrl}
                                        setPhotoUrl={setNewImageUrl}
                                        open={openPhotoDialog}
                                        setOpen={setOpenPhotoDialog}
                                        profile
                                        confirmRequired
                                        confirmLoading={loading}
                                    />
                                </>
                            }
                        >
                            { loading &&
                                <Avatar className={`${classes.menuAvatar} ${classes.loading}`}>
                                    <CircularProgress color="primary" size="inherit" />
                                </Avatar>
                            }
                            { !loading && 
                                <Avatar src={userImageUrl} className={classes.menuAvatar} />
                            }
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

export default NavbarMenu;
