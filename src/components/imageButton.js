import React, { useState } from 'react';
import { Avatar, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Icon from '../utils/icons';

const useStyles = makeStyles((theme) => ({
    // button padding based on if used in navbar or not
    button: {
        position: 'relative',
        padding: 'unset'
    },
    navButton: {
        paddingTop: '5px!important',
        paddingBottom: '5px!important'    
    },
    // image size based on if used in navbar or not
    navImage: {
        height: '40px', 
        width: '40px',
    },
    defaultImage: {
        height: '100px', 
        width: '100px',
    },
    // icon size based on if used in navbar or not
    icon: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: '-18px',
        marginLeft: '-18px',
    },
    navIcon: {
        marginTop: '-12px!important',
        marginLeft: '-12px!important',
    },
    hover: {
        '-webkit-filter': 'brightness(35%)',
    },
}));

/* 
    Avatar or img wrapped in a button - on hover, darkens and shows an Icon
*/
function ImageButton(props) {
    const { imageUrl, iconName, iconSize, handleClick, avatar, navbar } = props;
    const [hover, setHover] = useState(false);
    const classes = useStyles();

    function handleMouseEnter() {
        setHover(true);
    }

    function handleMouseLeave() {
        setHover(false);
    }

    const Image = avatar ? Avatar : 'img';

    return (
        <IconButton 
            onMouseEnter={() => handleMouseEnter()}
            onMouseLeave={() => handleMouseLeave()} 
            onClick={navbar ? (event) => handleClick(event) : () => handleClick()} 
            className={
                `${classes.button} ` +
                (navbar ? `${classes.navButton}` : undefined)
            }
        >
            <Image 
                src={imageUrl} 
                className={
                    (navbar ? `${classes.navImage} ` : `${classes.defaultImage} `) +
                    (hover ? `${classes.hover}` : undefined)
                } 
            />
            { hover && iconName &&
                <Icon 
                    name={iconName}
                    size={navbar ? "inherit" : iconSize}
                    className={
                        `${classes.icon} ` + 
                        (navbar ? `${classes.navIcon}` : undefined)
                    }
                /> 
            }
        </IconButton>
    );
}

export default ImageButton;
