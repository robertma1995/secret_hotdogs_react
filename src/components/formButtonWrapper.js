import React from 'react';
import Box from '@material-ui/core/Box';

// Form button wrapper - to be used in a Form
function FormButtonWrapper(props) {
    return (
        <Box display="flex" justifyContent="center" p={1}>
            {props.children}
        </Box>
    );
}

export default FormButtonWrapper;
