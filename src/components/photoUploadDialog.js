import React, { useEffect, useState } from 'react';
// cropper
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.min.css';
// dropzone
import Dropzone from 'react-dropzone';
// material ui
import { 
    Box, Button, IconButton, Typography,
    Dialog, DialogActions, DialogContent 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
// my components - photo preview
import ImageButton from './imageButton';
import ProgressButton from './progressButton';
import Icon from '../utils/icons';
import constants from '../utils/constants';

const useStyles = makeStyles((theme) => ({
    // fixed height of for preview + dropzone/cropper
    dialogContent: {
        height: '500px',
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        borderTop: '1px solid rgba(0, 0, 0, 0.12)',
    },
    title: {
        paddingLeft: '12px'
    },
    // prevent momentary scrollbar flash on drop due to weird cropper container spacing
    container: {
        overflow: 'hidden'
    },
    preview: {
        paddingTop: '5px',
        paddingBottom: '5px', 
        borderBottom: '1px solid #cbb09c',
    },
    // same behaviour on isDragAccept and &:focus - blue background + border
    dropzone: {
        height: '100%',
        width: '100%',
        outline: 'none',
        '&:focus': {
            boxSizing: 'border-box',
            border: '2px solid #4d90fe',
            transition: 'border .1s ease-in-out',
            backgroundColor: '#eaf2fe'
        }
    },
    accept: {
        outline: 'none',
        boxSizing: 'border-box',
        border: '2px solid #4d90fe',
        transition: 'border .1s ease-in-out',
        backgroundColor: '#eaf2fe'
    },
    // fixed cropper image dimensions based on window dimensions at the time of drop
    cropper: {
        height: '82%', 
        width: '82%',
    },
    // image name + caption area above cropper (no preview if not used for profile picture, so add padding to fill empty space)
    cropperImageHeader: {
        maxWidth: '95%'
    },
    paddingBottom: {
        paddingBottom: '40px'
    },
    // prevent long image names (loses the file tag if overflow)
    overflow: {
        textOverflow: 'ellipsis',
        overflow: 'hidden'
    }
}));

/*
    Dialog that allows a photo to be uploaded and cropped,
    Sets parent's photo state variable as the cropped image upon pressing the "set" button
    Converts cropped photo into a dataURL to be used in "img", "Avatar", etc. 
    Also saves crop box data in state so user can go back even if the dialog closes
    If confirm is required, then pressing set button will only set local photo url variables 
    - once the confirm button is pressed, then calls parent setPhoto and setPhotoUrl variable is changed
*/
function PhotoUploadDialog(props) {
    const { 
        setPhoto, photoUrl, setPhotoUrl, 
        open, setOpen, profile, 
        confirmRequired, confirmLoading 
    } = props;
    const [uploadError, setUploadError] = useState("");
    const [imageName, setImageName] = useState("");
    const [cropperImage, setCropperImage] = useState(null);
    const [cropper, setCropper] = useState();
    const [cropperData, setCropperData] = useState();
    const classes = useStyles();

    // TODO: confirm button before setting parent photo
    const [confirmActive, setConfirmActive] = useState(false);
    const [localPhoto, setLocalPhoto] = useState(null);
    const [localPhotoUrl, setLocalPhotoUrl] = useState(photoUrl);

    /*
        custom accepted file handler since react-dropzone "mutliple={false}" doesn't work consistently
        react-dropzone behaviour: if multiple files, one is accepted type and others rejected, 
        pushes accepted file to accepted array, and other files to rejected array
        below onDrop handler behaviour: if number of files exceeds 1, then reject all
    */
    function onDrop(files) {
        if (files.length > 1) {
            setUploadError(`Too many photos! Drag your desired ${profile ? "profile" : "hotdog"} photo only`);
        } else {
            let file = files[0];
            if (file.type === "image/jpeg" || file.type === "image/png") {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => setCropperImage(reader.result);
                setImageName(file.name);
                setUploadError("");
            } else {
                setUploadError("Upload error - choose a JPG or PNG and try again");
            }
        }
    }   

    /* 
        Sets photo blob for parent, where it will be uploaded via firebase call
        Sets photo dataURL - parent and dialog both use this for preview
        Saves current crop box dimensions/positioning
    */
    function handleSetPhoto() {
        const max = 1024;
        cropper.getCroppedCanvas({ 
            fillColor: '#fff',
            maxHeight: max,
            maxWidth: max,
        }).toBlob((blob) => {
            let reader = new FileReader();
            reader.readAsDataURL(blob);
            // TODO: confirm button before setting parent photo
            if (confirmRequired) {
                reader.onload = () => setLocalPhotoUrl(reader.result);
                setLocalPhoto(blob);
                setConfirmActive(true);
            } else {
                reader.onload = () => setPhotoUrl(reader.result);
                setPhoto(blob);
            }
        }, 'image/jpeg');
        setCropperData(cropper.getData());
    }

    /* 
        clicking preview button resets photo/avatar for parent to default
        if photo upload dialog used for profile picture, then set to default material-ui avatar
    */
    function handleResetPhoto() {
        console.log("RESET PHOTO");
        // TODO: confirm button before setting parent photo
        const url = profile ? "" : constants["hotdogImageUrl"];
        if (confirmRequired) {
            setLocalPhoto(null);
            setLocalPhotoUrl(url);
            setConfirmActive(true);
        } else {
            setPhoto(null);
            setPhotoUrl(url);
        }
    }

    // TODO: confirm button before setting parent photo
    function handleConfirmPhoto() {
        console.log("CONFIRMED - SETTING PARENT PHOTO");
        setPhoto(localPhoto);
        setPhotoUrl(localPhotoUrl);
        setConfirmActive(false);
    }

    function handleResetCropper() {
        setCropperImage(null);
        setCropperData(null);
    }

    function handleClose() {
        setOpen(false);
        // TODO: confirm button before setting parent photo
        if (confirmRequired) {
            const sleep = (ms) => {
                return new Promise(resolve => setTimeout(resolve, ms));
            };
            sleep(500).then(() => {
                setCropperImage(null);
                setLocalPhotoUrl(photoUrl);
                setConfirmActive(false);
            });
        }
    }

    return (
        <Dialog 
            fullWidth
            maxWidth="md"
            open={open}
            onClose={() => handleClose()}
        >
            <Box display="flex" flexDirection="row" alignItems="center">
                <Box flexGrow={1}>
                    <Typography variant="h6" color="textSecondary" className={classes.title}>
                        Select new {profile ? "profile" : "hotdog"} photo
                    </Typography>
                </Box>
                <Box>
                    <IconButton onClick={() => handleClose()}>
                        <Icon name="close" />
                    </IconButton>
                </Box>
            </Box>
            <DialogContent className={classes.dialogContent}>
                <Box 
                    display="flex"
                    flexDirection="column"
                    height="100%"
                    width="100%"
                    justifyContent="center"
                    alignItems="center"
                    className={classes.container}
                >
                    { profile && 
                        <Box 
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            className={classes.preview}
                        >
                            <Typography color="primary" variant="caption" style={{ paddingBottom: '5px' }}> 
                                <b>Your photo</b>
                            </Typography>
                            <ImageButton 
                                imageUrl={confirmRequired ? localPhotoUrl : photoUrl}
                                iconName="delete"
                                iconSize="large"
                                handleClick={handleResetPhoto}
                                avatar
                            />
                        </Box>
                    }
                    { !cropperImage && 
                        <Box height="100%" width="100%">
                            <Dropzone onDrop={(files) => onDrop(files)}>
                                {({getRootProps, getInputProps, isDragActive, isDragAccept}) => (
                                    <div {...getRootProps({
                                        className: `${classes.dropzone} ` + (isDragAccept ? `${classes.accept}` : undefined)
                                    })}>
                                        <input {...getInputProps()}/>
                                        <Box 
                                            display="flex" 
                                            flexDirection="row" 
                                            alignItems="center" 
                                            justifyContent="center"
                                            height="100%" 
                                            width="100%"
                                        >
                                            <Typography align="center" color="textSecondary" variant="h5">
                                                { !isDragActive && uploadError.trim() === "" && 
                                                    `Drag a new ${profile ? "profile" : "hotdog"} photo here or click to upload` 
                                                }
                                                { isDragAccept && uploadError.trim() === "" && 
                                                    "Drop photo to upload" 
                                                }
                                                { uploadError.trim() !== "" && 
                                                    uploadError 
                                                }
                                            </Typography> 
                                        </Box>
                                    </div>
                                )}
                            </Dropzone>
                        </Box>
                    }
                    { cropperImage &&
                        /*  
                            NOTE: making Cropper's parent container dimensions 100% 
                            will scale small images up, but won't re-center the image if window is resized
                        */
                        <Box 
                            display="flex"
                            flexDirection="column"
                            height="100%"
                            width="100%"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Box 
                                display="flex"
                                flexDirection="column"
                                height="15%"
                                width="95%"
                                justifyContent="center"
                                className={
                                    `${classes.cropperImageHeader} ` + 
                                    (!profile ? `${classes.paddingBottom}` : undefined)
                                }
                            >
                                <Typography variant="caption" className={classes.overflow}> 
                                    <b>{imageName}</b>
                                </Typography>
                                <Typography variant="caption"> 
                                    To crop, drag the region below and click "Set". 
                                    To upload another photo, click "Reset". 
                                </Typography>
                            </Box>
                            <Box flexGrow={1}>
                                <Cropper
                                    aspectRatio={1}
                                    src={cropperImage}
                                    data={cropperData}
                                    viewMode={1}
                                    center={false}
                                    minCropBoxHeight={80}
                                    minCropBoxWidth={80}
                                    background={false}
                                    responsive={false}
                                    autoCropArea={1}
                                    checkOrientation={false}
                                    zoomable={false}
                                    toggleDragModeOnDblclick={false}
                                    onInitialized={(instance) => setCropper(instance)}
                                    className={classes.cropper}
                                />
                            </Box>
                        </Box>
                    }
                </Box>
            </DialogContent>
            <DialogActions>
                <Button 
                    variant="contained" 
                    color="primary"
                    size="small"
                    disableElevation
                    disabled={!cropperImage}
                    onClick={() => handleSetPhoto()}
                > 
                    Set
                </Button>
                <Button 
                    variant="contained" 
                    color="primary"
                    size="small"
                    disableElevation
                    disabled={!cropperImage}
                    onClick={() => handleResetCropper()}
                > 
                    Reset
                </Button>
                { confirmRequired && 
                    <ProgressButton 
                        size="small"
                        disabled={!confirmActive}
                        loading={confirmLoading}
                        handleClick={handleConfirmPhoto}
                    >
                        Confirm new photo
                    </ProgressButton>
                }
                <Button 
                    variant="contained" 
                    color="secondary"
                    size="small"
                    disableRipple
                    disableElevation
                    onClick={() => handleClose()}
                > 
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );

}

export default PhotoUploadDialog;
