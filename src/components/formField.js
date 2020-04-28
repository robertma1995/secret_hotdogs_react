import React from 'react';
import { Box, TextField } from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';

const icons = {
    "email": <EmailIcon/>,
    "password": <LockIcon/>
}

// Text field with icon - to be wrapped in a Form
function FormField(props) {
    const { label, type, value, setValue, error } = props;
    return (
        <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center" p={1}>
            <Box mr={0.5}>
                {icons[type]}
            </Box>
            <Box flexGrow={1} p={1}>
                <TextField
                    label={label}
                    type={type}
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    error={error.trim() !== ""}
                    helperText={error}
                    fullWidth
                />
            </Box>
        </Box>
    );
}

export default FormField;
