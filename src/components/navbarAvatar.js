import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Badge, Box, Button, IconButton, Typography, Menu } from '@material-ui/core';
import Icon from '../utils/icons';
import ImageButton from './imageButton';
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
function NavbarAvatar(props) {
    const { userId, userName, profileImageUrl, setProfileImageUrl, handleLogout } = props;
    const [anchorEl, setAnchorEl] = useState(null);
    const classes = useStyles();
    // profile image/avatar
    // TODO: for now, placeholder initial value instead of "null" 
    // since photouploaddialog reset avatar function sets profileImage to null
    // and we want to update profile picture in backend when profileImage changes (useeffect)
    /* 
    const [profileImage, setProfileImage] = useState("initial");
    */
    const [openPhotoDialog, setOpenPhotoDialog] = useState(false);

    // TODO: the "initial" method breaks: if user has empty avatar, presses reset on photo upload dialog,
    // then calls useEffect anyway - wastes a database call
    // instead, use a new state variable for profileImageUrl

    // TODO: don't pass setProfileImageUrl directly in photoupload dialog, instead pass a separate state variable that
    // takes profileImageUrl as the initial value; also
    // TODO: setProfileImageUrl should be set to the return value of putUserProfileImage
    // TODO: putUserProfileImage should resolve to the getDownloadUrl of the newly set image
    // this way, the context variable userProfileImageUrl is always a firebase url 
    // rather than being set to a filereader url (like it is currently)

    // TODO: replace profileImageUrl with below variable
    // TODO: also need a separate variable like profileImage that is the file blob to upload to backend
    
    // TODO: semi-hacky method of determining whether to call backend or not on initial image set
    // if null, then pressing reset on photoupload dialog will not call the useeffect
    // note: url variables should ALWAYS be a firebase url (unless picking profile image on register form)
    /* 
    const initialImage = profileImageUrl ? "initial" : null;
    const [newImage, setNewImage] = useState(initialImage);
    */

    // less hacky method: keep track of previous image url
    // - prevents recursive useEffect(...[newImageUrl]) if calling setNewImageUrl inside it
    const [previous, setPrevious] = useState(profileImageUrl);
    const [newImage, setNewImage] = useState(null);
    const [newImageUrl, setNewImageUrl] = useState(profileImageUrl);   

    // TODO: backend for updating profile picture
    // call only if profile image has been changed
    useEffect(() => {
        if (newImageUrl !== previous) {
        // if (newImage !== initialImage) {
            console.log("CHANGED PROFILE IMAGE");
            (async () => {
                let url = await DB.putUserProfileImage(userId, newImage);
                console.log(url);
                setPrevious(url);
                setNewImageUrl(url);
                // setNewImage(url ? "initial" : null);
            })();
        // }
        }
    // }, [newImage]);
    }, [newImageUrl]);

    function handleOpen(event) {
        setAnchorEl(event.currentTarget);
    }

    function handleClose() {
        setAnchorEl(null);
    }

    function handleOpenPhotoDialog() {
        setOpenPhotoDialog(true);
    }

    return (
        <>
            <ImageButton 
                imageUrl={newImageUrl}
                iconName="settings"
                handleClick={handleOpen}
                avatar
                navbar
            />
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
                                    />
                                </>
                            }
                        >
                            <Avatar src={newImageUrl} className={classes.menuAvatar} />
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
