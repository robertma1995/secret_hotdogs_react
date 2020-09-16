import React, { useState } from 'react';
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

}));


/*
    Dialog that allows a photo to be uploaded and cropped,
    Sets parent's image state variable as the cropped image upon pressing the "set" button 
*/
function PhotoUploadDialog(props) {
    const { setImage } = props;
    const [cropperImage, setCropperImage] = useState("");
    const [cropper, setCropper] = useState();

    function uploadFile(file) {
        console.log("UPLOADED FILE");
        // TODO: fix error when upload button is clicked but no file selected
        const reader = new FileReader();
        reader.onload = () => {
            setCropperImage(reader.result);
        }
        reader.readAsDataURL(file);
    }

    function handleSetImage() {
        console.log("SETTING IMAGE");
        cropper.getCroppedCanvas().toBlob((blob) => {
            setImage(blob);
        }, 'image/jpeg');
    }

    return (
        <>
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
                preview=".profileImagePreview"
                src={cropperImage}
                viewMode={1}
                guides={true}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false}
                onInitialized={(instance) => setCropper(instance)}
            />
            <h1> PREVIEW </h1>
            <div 
                style={{ 
                    // NOTE: minheight prevents the child image from changing parent container dimensions
                    // maxHeight prevents preview from overflowing
                    width: '100%',
                    maxHeight: '200px',
                    minHeight: '200px',
                    float: 'right', 
                }}
            >       
                <div
                    className="profileImagePreview"
                    style={{ 
                        // height is needed otherwise no image is displayed
                        // overflow hidden prevent overflowing + properly show cropped area
                        width: '100%', 
                        float: 'left',
                        height: '200px', 
                        overflow: 'hidden' 
                    }}
                />
            </div>
            {/* TEMP */}
            <Button onClick={() => handleSetImage()}> Set image </Button>
        </>
    );

}

export default PhotoUploadDialog;
