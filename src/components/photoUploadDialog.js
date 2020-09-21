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
import icons from '../utils/icons';

const useStyles = makeStyles((theme) => ({
    // fix height of dropzone + cropper
    dialogContent: {
        height: '500px',
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        borderTop: '1px solid rgba(0, 0, 0, 0.12)',
    },
    title: {
        paddingLeft: '12px'
    },
    dropzone: {
        height: '100%',
        width: '100%',
    },
    accept: {
        boxSizing: 'border-box',
        border: '2px solid #4d90fe',
        transition: 'border .1s ease-in-out',
        backgroundColor: '#eaf2fe'
    },
    cropper: {
        height: '85%', 
        width: '85%',
        // maxHeight: '80%',
        // maxWidth: '80%',
        // maxHeight: '400px',
        // maxWidth: '600px',
    },
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

    /*
        custom accepted file handler since react-dropzone "mutliple={false}" doesn't work consistently
        react-dropzone behaviour: if multiple files, one is accepted type and others rejected, 
        pushes accepted file to accepted array, and other files to rejected array
        below onDrop handler behaviour: if number of files exceeds 1, then reject all
    */
    function onDrop(files) {
        console.log("DROPPED FILE(S)");
        if (files.length > 1) {
            setUploadError("Too many photos! Drag your desired profile photo only");
        } else {
            let file = files[0];
            if (file.type === "image/jpeg" || file.type === "image/png") {
                console.log("Correct file type!");
                console.log(file);
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => setCropperImage(reader.result);
                setImageName(file.name);
                setUploadError("");
            } else {
                console.log("Incorrect file type - " + file.type);
                setUploadError("Upload error - choose a JPG or PNG and try again");
            }
        }
    }   

    /* 
        Sets photo blob for parent, where it will be uploaded via firebase call
        Sets photo dataURL - parent and dialog both use this for preview
    */
    function handleSetPhoto() {
        console.log("SETTING IMAGE FOR PARENT");
        cropper.getCroppedCanvas({ fillColor: '#fff' }).toBlob((blob) => {
            setPhoto(blob);
            // TODO: testing avatar preview on photo upload dialog as well
            let reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = () => setPhotoUrl(reader.result);
        }, 'image/jpeg');

        // save cropper data at time of setting picture
        setCropperData(cropper.getData());
    }

    function handleResetCropper() {
        console.log("RESET CROPPER!");
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
            {/* TODO: separate all dialogs from buttons */}
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
                            Select {type} photo
                        </Typography>
                    </Box>
                    <Box>
                        <IconButton onClick={() => handleClose()}>
                            {icons["close"]}
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
                        style={{ overflow: 'hidden' }}
                    >
                        {/* TODO: make preview area look nicer */}
                        <Box style={{ paddingBottom: '10px', borderBottom: '1px solid #e1e1e1' }}>
                            {/* {imageName} */}
                            <Typography variant="caption" align="center"> Preview </Typography>
                            { type === "profile" && 
                                <Avatar src={photoUrl} style={{ height: '100px', width: '100px' }} />
                            }
                            { type === "hotdog" && 
                                <img src={photoUrl || "https://www.svgrepo.com/show/133687/hot-dog.svg"} style={{ height: '100px', width: '100px' }} />
                            }
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
                                                <Typography align="center" color="textSecondary" variant="h4">
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
                        { cropperImage && 
                            /*  
                                NOTE: making cropper's parent container dimensions 100% 
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
                                <Box>
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
{/* 
                    { !cropperImage &&
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
                                        <Typography align="center" color="textSecondary" variant="h4">
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
                    }
                    { cropperImage &&
                        <Box 
                            display="flex"
                            flexDirection="column"
                            height="100%"
                            width="100%"
                            justifyContent="center"
                            alignItems="center"
                            style={{ overflow: 'hidden' }}
                        >
                            <Box style={{ paddingBottom: '15px' }}>
                                <Typography variant="caption" align="center"> Your avatar </Typography>
                                <Avatar src={avatarUrl} style={{ height: '100px', width: '100px' }}/>
                            </Box>
                            <Box>
                                <Cropper
                                    className={classes.cropper}
                                    aspectRatio={1}
                                    src={cropperImage}
                                    data={cropperData}
                                    viewMode={1}
                                    center={false}
                                    minCropBoxHeight={80}
                                    minCropBoxWidth={80}
                                    background={false}
                                    responsive={true}
                                    autoCropArea={1}
                                    checkOrientation={false}
                                    zoomable={false}
                                    toggleDragModeOnDblclick={false}
                                    onInitialized={(instance) => setCropper(instance)}
                                />
                            </Box>
                        </Box>
                    }
*/}
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
                        Set {type === "profile" ? "avatar" : type} photo
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
