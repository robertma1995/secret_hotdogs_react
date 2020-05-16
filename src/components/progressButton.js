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
    const { text, loading, handleClick } = props;
    const classes = useStyles();
    return (
        <div className={classes.wrapper}>
            <Button
                color="primary" 
                variant="contained"
                disabled={loading}
                onClick={() => handleClick()}
                disableElevation
            >
                {text}
            </Button>
            {loading && <CircularProgress size={24} className={classes.buttonSpinner}/>}
        </div>
    );
}

export default ProgressButton;