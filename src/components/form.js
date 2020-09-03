import React from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
    padding: {
        paddingTop: 'unset'
    }
}));

// Wrapper for all forms, optional no top padding (for loginform/loginformdialog)
function Form(props) {
    const classes = useStyles();
    const { noTopPadding } = props;

    return (
        <Box 
            bgcolor="secondary.main"
            display="flex" 
            flexDirection="column"
            justifyContent="center"
            p={2}
            className={noTopPadding ? classes.padding : undefined}
        >
            {props.children}
        </Box>
    );
}

export default Form;
