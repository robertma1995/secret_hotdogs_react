import React from 'react';
import { Box, Typography } from '@material-ui/core';

// Typography wrapper for use in Forms
function FormMessage(props) {
	const { color, variant } = props;
    return (
        <Box display="flex" justifyContent="center" p={1}>
            <Typography color={color} variant={variant}>
                {props.children}
            </Typography>
        </Box>
    );
}

export default FormMessage;