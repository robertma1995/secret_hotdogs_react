import React, { useCallback, useEffect, useState } from 'react';
// TODO: image cropper
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.min.css';
// TODO: image dropzone
import { useDropzone } from 'react-dropzone';
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
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
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
    const { 
        getRootProps, 
        getInputProps, 
        isDragActive, 
        isDragAccept, 
        isDragReject 
    } = useDropzone({
        onDrop,
        accept: 'image/jpeg, image/png'
    });

    function onDrop(acceptedFiles) {
        const file = acceptedFiles[0];
        console.log("UPLOADED FILE");
        const reader = new FileReader();
        reader.onload = () => setCropperImage(reader.result);
        reader.readAsDataURL(file);
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
                    {/* 
                        TODO: react-dropzone instead of simple input 
                        if cropperImage set (i.e. file uploaded), show cropper, otherwise show dropzone 
                    */}
                    {/* 
                    <input 
                        type="file"
                        onChange={(event) => uploadFile(event.target.files[0])}
                    />
                    <h1> CROPPER </h1>
                    */}
                    { !cropperImage && 
                        <div {...getRootProps({className: classes.dropzone})}>
                            <input {...getInputProps()}/>
                            {/* <Box  */}
                            {/*     display="flex"  */}
                            {/*     flexDirection="row"  */}
                            {/*     alignItems="center"  */}
                            {/*     justifyContent="center" */}
                            {/*     height="100%"  */}
                            {/*     width="100%" */}
                            {/* > */}
                            {/*     <Box> */}
                            { !isDragActive && 
                                <Typography color="textSecondary" variant="h4">
                                    Drag a {type} photo here
                                </Typography> 
                            }
                            { isDragAccept && 
                                <Typography color="textSecondary" variant="h4">
                                    File type accepted
                                </Typography> 
                            }
                            { isDragReject && 
                                <Typography color="textSecondary" variant="h4">
                                    File type rejected
                                </Typography> 
                            }
                            {/*     </Box> */}
                            {/* </Box> */}
                        </div>
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
