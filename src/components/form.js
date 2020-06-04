import React from 'react';
import Box from '@material-ui/core/Box';

// Wrapper for all forms
function Form(props) {
    return (
        <Box 
            bgcolor="secondary.main"
            display="flex" 
            flexDirection="column"
            justifyContent="center"
            p={2}
        >
            {props.children}
        </Box>
    );
}

export default Form;