import React from 'react';
import { Box, Typography } from '@material-ui/core';

// Misc message at the end of a Form
function FormFooter(props) {
    return (
        <Box display="flex" justifyContent="center" p={1}>
            <Typography color="textSecondary" variant="body2">
                {props.children}
            </Typography>
        </Box>
    );
}

export default FormFooter;