import React from 'react';
import { Button, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// show loading spinner on top of button
const useStyles = makeStyles((theme) => ({
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
    buttonSpinner: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    }
}));

function ProgressButton(props) {
    const { 
        color, variant, size, disabled, disableRipple, disableElevation, 
        loading, handleClick 
    } = props;
    const classes = useStyles();
    return (
        <div className={classes.wrapper}>
            <Button
                color={color} 
                variant={variant}
                size={size}
                disabled={disabled || loading}
                disableElevation={disableElevation}
                disableRipple={disableRipple}
                onClick={() => handleClick()}
            >
                {props.children}
            </Button>
            {loading && <CircularProgress size={24} className={classes.buttonSpinner}/>}
        </div>
    );
}

export default ProgressButton;