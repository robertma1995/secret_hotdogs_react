import React, { useCallback, useEffect, useState } from 'react';
// cropper
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.min.css';
// dropzone
import { useDropzone } from 'react-dropzone';
import Dropzone from 'react-dropzone';
// material ui
import { 
    Avatar, Box, Button, IconButton, Typography,
    Dialog, DialogActions, DialogContent 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
// my components - photo preview
import Icon from '../utils/icons';
import ImageButton from './imageButton';

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
    // make dropzone fill dialogcontent below preview section
    dropzone: {
        height: '100%',
        width: '100%',
    },
    // highlight dropzone when dropping
    accept: {
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
    // image name + caption area above cropper
    cropperImageHeader: {
        maxWidth: '95%'
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
    Also converts photo into a dataURL so it can be displayed in the preview
    Also saves crop box data in state so user can go back even if the dialog closes
*/
function PhotoUploadDialog(props) {
    const { type, setPhoto, photoUrl, setPhotoUrl } = props;
    const [uploadError, setUploadError] = useState("");
    const [imageName, setImageName] = useState("");
    const [cropperImage, setCropperImage] = useState(null);
    const [cropper, setCropper] = useState();
    const [cropperData, setCropperData] = useState();
    const [open, setOpen] = useState(true);
    const classes = useStyles();
    const [loading, setLoading] = useState(true);

    /*
        custom accepted file handler since react-dropzone "mutliple={false}" doesn't work consistently
        react-dropzone behaviour: if multiple files, one is accepted type and others rejected, 
        pushes accepted file to accepted array, and other files to rejected array
        below onDrop handler behaviour: if number of files exceeds 1, then reject all
    */
    function onDrop(files) {
        if (files.length > 1) {
            setUploadError("Too many photos! Drag your desired profile photo only");
        } else {
            // setLoading(true);
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
            setLoading(false);
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
            setPhoto(blob);
            let reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = () => setPhotoUrl(reader.result);
        }, 'image/jpeg');
        setCropperData(cropper.getData());
    }

    /* 
        resets photo/avatar for parent to default
    */
    function handleResetPhoto() {
        setPhoto(null);
        setPhotoUrl("");
    }

    function handleResetCropper() {
        setCropperImage(null);
        setCropperData(null);
    }

    function handleOpen() {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
    }

    return (
        <>
            <Button 
                variant="text" 
                color="primary"
                disableRipple 
                onClick={() => handleOpen()}
            >
                Upload profile picture
            </Button>
            <Dialog 
                fullWidth
                maxWidth="md"
                open={open}
                onClose={() => handleClose()}
            >
                <Box display="flex" flexDirection="row" alignItems="center">
                    <Box flexGrow={1}>
                        <Typography variant="h6" color="textSecondary" className={classes.title}>
                            Select new {type} photo
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
                        <Box 
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            className={classes.preview}
                        >
                            <Typography color="primary" variant="caption" style={{ paddingBottom: '5px' }}> 
                                <b>Preview</b>
                            </Typography>
                            <ImageButton 
                                imageType="avatar"
                                imageUrl={photoUrl}
                                iconName="close"
                                iconSize="large"
                                handleClick={handleResetPhoto}
                            />
                        </Box>
                        { !cropperImage && 
                            <Box height="100%" width="100%">
                                <Dropzone onDrop={(files) => onDrop(files)}>
                                    {({getRootProps, getInputProps, isDragActive, isDragAccept}) => (
                                        <div {...getRootProps({className: classes.dropzone})}>
                                            <input {...getInputProps()}/>
                                            <Box 
                                                display="flex" 
                                                flexDirection="row" 
                                                alignItems="center" 
                                                justifyContent="center"
                                                height="100%" 
                                                width="100%"
                                                className={isDragAccept ? classes.accept : undefined}
                                            >
                                                <Typography align="center" color="textSecondary" variant="h5">
                                                    { !isDragActive && uploadError.trim() === "" && 
                                                        `Drag a new ${type} photo here` 
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
                        { cropperImage && !loading &&
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
                                    className={classes.cropperImageHeader}
                                >
                                    <Typography variant="caption" className={classes.overflow}> 
                                        <b>{imageName}</b>
                                    </Typography>
                                    <Typography variant="caption"> 
                                        To crop this image, drag the region below and then click 
                                        "Set {type} photo". 
                                        To upload a new photo, click "Reset photo".
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
                        Set {type} photo
                    </Button>
                    <Button 
                        variant="contained" 
                        color="primary"
                        size="small"
                        disableElevation
                        disabled={!cropperImage}
                        onClick={() => handleResetCropper()}
                    > 
                        Reset photo 
                    </Button>
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
        </>
    );

}

export default PhotoUploadDialog;
