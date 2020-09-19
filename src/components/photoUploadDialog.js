import React, { useCallback, useEffect, useState } from 'react';
// TODO: image cropper
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.min.css';
// TODO: image dropzone
import { useDropzone } from 'react-dropzone';
import Dropzone from 'react-dropzone';
// material ui
import { 
    Box, Button, IconButton, Typography,
    Dialog, DialogActions, DialogContent 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import icons from '../utils/icons';

const useStyles = makeStyles((theme) => ({
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
        borderWidth: 2,
        borderStyle: 'solid',
        transition: 'border .1s ease-in-out',
        borderColor: '#00e676',
        backgroundColor: '#e2fae8'
    },
    reject: {
        boxSizing: 'border-box',
        borderWidth: 2,
        borderStyle: 'solid',
        transition: 'border .1s ease-in-out',
        borderColor: '#ef5350',
        backgroundColor: '#ffebee',
    },
    cropper: {
        height: '80%', 
        width: '80%',
        maxHeight: '80%',
        maxWidth: '80%',
    },
}));

/*
    Dialog that allows a photo to be uploaded and cropped,
    Sets parent's image state variable as the cropped image upon pressing the "set" button
    Saves crop box data in state so user can go back even if the dialog closes
*/
function PhotoUploadDialog(props) {
    const { type, setPhoto } = props;
    const [cropperImage, setCropperImage] = useState("");
    const [cropper, setCropper] = useState();
    const [cropperData, setCropperData] = useState();
    const [open, setOpen] = useState(true);
    const classes = useStyles();
    
    function onDrop(accepted, rejected) {
        // TODO: still need to handle rejected files...?
        /*
        const file = acceptedFiles[0];
        console.log("UPLOADED FILE");
        const reader = new FileReader();
        reader.onload = () => setCropperImage(reader.result);
        reader.readAsDataURL(file);
        */
        console.log("ACCEPTED FILES:");
        console.log(accepted);
        console.log("REJECTED FILES:");
        console.log(rejected);
        // NOTE: even though multiple={false}, 
        // if you drag multiple files but one of them is an accepted type, and the others are rejected types
        // still pushes that one file to accepted array,
        // and pushes the other files to rejected array...
        // wanted behaviour: if number of files exceeds 1, then reject all
        // TODO: consider doing it like google - accept all files/types, accept multiple,
        // but, output final error message - i.e. don't use isDragAccepted, accept prop, etc.
    }   

    function handleSetPhoto() {
        console.log("SETTING IMAGE FOR PARENT");
        // TODO: add undefined check for cropper.getCroppedCanvas()
        // if transparent background, then fills in missing areas with white
        cropper.getCroppedCanvas({ fillColor: '#fff' }).toBlob((blob) => {
            setPhoto(blob);
        }, 'image/jpeg');
    }

    function handleOpen() {
        setOpen(true);
    }

    function handleClose() {
        if (cropperImage) setCropperData(cropper.getData());
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
                    { !cropperImage && 
                        <Dropzone 
                            onDrop={(accepted, rejected) => onDrop(accepted, rejected)}
                            accept='image/jpeg, image/png'
                            multiple={false}
                        >
                            {({getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject}) => (
                                <div {...getRootProps({className: classes.dropzone})}>
                                    <input {...getInputProps()}/>
                                    <Box 
                                        display="flex" 
                                        flexDirection="row" 
                                        alignItems="center" 
                                        justifyContent="center"
                                        height="100%" 
                                        width="100%"
                                        className={isDragAccept ? classes.accept : (isDragReject ? classes.reject : undefined)}
                                    >
                                        <Typography color="textSecondary" variant="h4">
                                            { !isDragActive && `Drag a ${type} photo here` }
                                            { isDragAccept && "Drop photo to upload" }
                                            { isDragReject && "Error - choose a JPG or PNG and try again" }
                                            {/* { !fileAccepted && "Error - choose a JPG or PNG and try again"} */}
                                        </Typography> 
                                    </Box>
                                </div>
                            )}
                        </Dropzone>
                    }
                    { cropperImage && 
                        <Box display="flex" height="100%" width="100%" justifyContent="center" alignItems="center">
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
                    }
                </DialogContent>
                <DialogActions>
                    <Button 
                        variant="contained" 
                        color="primary"
                        size="small"
                        onClick={() => handleSetPhoto()}
                    > 
                        Set {type} photo
                    </Button>
                    <Button 
                        variant="text" 
                        color="primary"
                        disableRipple
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
