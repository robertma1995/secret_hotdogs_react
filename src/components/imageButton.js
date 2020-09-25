import React, { useState } from 'react';
import { Avatar, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Icon } from '../utils/icons';

const useStyles = makeStyles((theme) => ({
    button: {
        padding: 'unset',
        position: 'relative',
    },
    icon: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -18,
        marginLeft: -18,
    },
    image: {
        height: '100px', 
        width: '100px',
    },
    hover: {
        '-webkit-filter': 'brightness(35%)',
    },
}));

/* 
    Avatar or img wrapped in a button - on hover, darkens and shows an Icon
*/
function ImageButton(props) {
    const { imageType, imageUrl, iconName, iconSize, handleClick } = props;
    const [hover, setHover] = useState(false);
    const classes = useStyles();

    function handleHover() {
        setHover(!hover);
    }

    const Image = imageType === "avatar" ? Avatar : 'img';

    return (
        <IconButton 
            onMouseEnter={() => handleHover()}
            onMouseLeave={() => handleHover()} 
            onClick={() => handleClick()} 
            className={classes.button}
        >
            <Image 
                src={imageUrl} 
                className={`${classes.image} ` + (hover ? `${classes.hover}` : undefined)} 
            />
            { hover && 
                <Icon 
                    name={iconName}
                    size={iconSize}
                    className={classes.icon}
                /> 
            }
        </IconButton>
    );
}

export default ImageButton;
