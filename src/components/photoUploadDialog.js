import React, { useEffect, useState } from 'react';
// TODO: image preview + cropper
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.min.css';
// material ui
import { 
    Box, Button, Typography,
    Dialog, DialogContent 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import icons from '../utils/icons';

const useStyles = makeStyles((theme) => ({
    // TODO: after all elements working correctly
}));


/*
    Dialog that allows a photo to be uploaded and cropped,
    Sets parent's image state variable as the cropped image upon pressing the "set" button
    Saves crop box data in state so user can go back even if the dialog closes
*/
function PhotoUploadDialog(props) {
    const { buttonText, setImage } = props;
    const [cropperImage, setCropperImage] = useState("");
    const [cropper, setCropper] = useState();
    const [cropperData, setCropperData] = useState();
    const [open, setOpen] = useState(true);
    const classes = useStyles();

    function uploadFile(file) {
        console.log("UPLOADED FILE");
        // TODO: only read data if file is defined
        const reader = new FileReader();
        reader.onload = () => setCropperImage(reader.result);
        reader.readAsDataURL(file);
    }

    function handleSetImage() {
        console.log("SETTING IMAGE");
        // TODO: add null check for cropper.getCroppedCanvas()
        // if transparent background, then fills in missing areas with white
        cropper.getCroppedCanvas({ fillColor: '#fff' }).toBlob((blob) => {
            setImage(blob);
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
            <Button 
                variant="text" 
                color="primary"
                disableRipple 
                onClick={() => handleOpen()}
            >
                {buttonText}
            </Button>
            <Dialog 
                fullWidth
                maxWidth="md"
                open={open}
                onClose={() => handleClose()}
            >
                <DialogContent>
                    {/* 
                        TODO: react-dropzone instead of simple input 
                        if cropperImage set (i.e. file uploaded), show cropper, otherwise show dropzone 
                    */}
                    <input 
                        type="file"
                        onChange={(event) => uploadFile(event.target.files[0])}
                    />
                    <h1> CROPPER </h1>
                    <Cropper
                        style={{ 
                            height: '400px', 
                            width: '100%' 
                        }}
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
                    {/* TEMP */}
                    <Button onClick={() => handleSetImage()}> Set image </Button>
                </DialogContent>
            </Dialog>
        </>
    );

}

export default PhotoUploadDialog;
