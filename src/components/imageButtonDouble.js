import React, { useState } from 'react';
import { IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Icon from '../utils/icons';

const useStyles = makeStyles((theme) => ({
    wrapper: {
        position: 'relative',
    },
    image: {
        height: '200px',
        width: '200px'
    },
    iconWrapper: {
        position: 'absolute',
        top: '50%',
        left: '25%',
        marginTop: '-30px',
        marginLeft: '-5px',
    },
    hover: {
        cursor: 'pointer',
        '-webkit-filter': 'brightness(35%)',
    },
}));

/* 
    imageButton with two buttons
*/
function ImageButtonDouble(props) {
    const { imageUrl, iconNameOne, iconNameTwo, handleClickOne, handleClickTwo } = props;
    const [hover, setHover] = useState(false);
    const classes = useStyles();

    function handleMouseEnter() {
        setHover(true);
    }

    function handleMouseLeave() {
        setHover(false);
    }

    return (
        <div
            onMouseEnter={() => handleMouseEnter()}
            onMouseLeave={() => handleMouseLeave()} 
            className={classes.wrapper}
        >
            <img 
                alt="button"
                src={imageUrl} 
                className={
                    `${classes.image} ` +
                    (hover ? `${classes.hover}` : undefined)
                } 
            />
            { hover &&
                <div className={classes.iconWrapper}>
                    <IconButton color="primary" onClick={() => handleClickOne()}>
                        <Icon name={iconNameOne} size="large" /> 
                    </IconButton>
                    <IconButton color="primary" onClick={() => handleClickTwo()}>
                        <Icon name={iconNameTwo} size="large" /> 
                    </IconButton>
                </div>
            }
        </div>
    );
}

export default ImageButtonDouble;
