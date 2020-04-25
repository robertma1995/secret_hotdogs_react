import React from 'react';
import { Box, Grid, Link, TextField, Typography } from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';
import * as routes from '../utils/routes';

// Generic form template - white box with dynamic no. of textfields
// TODO: function that takes variable no. of arguments (easier formation of props.fields)

function Form(props) {
    let fields = props.fields;
    const button = props.button;
    const type = props.type;

    return (
        <Box 
            bgcolor="secondary.main"
            display="flex" 
            flexDirection="column"
            justifyContent="center"
            p={2}
        >
            {Object.keys(fields).map((fieldName) => (
                <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center" p={1}>
                    <Box mr={0.5}>
                        {fields[fieldName][0]}
                    </Box>
                    <Box flexGrow={1} p={1}>
                        {fields[fieldName][1]}
                    </Box>
                </Box>
            ))}
            <Box display="flex" justifyContent="center" p={1}>
                {button}
            </Box>
            {type === "login" && 
                <Box display="flex" justifyContent="center" p={1}>
                    <Typography color="textSecondary" variant="body2">
                        Don't have an account? <Link href={routes.REGISTER}> Sign Up </Link>
                    </Typography>
                </Box>
            }
        </Box>
    );
}

export default Form;