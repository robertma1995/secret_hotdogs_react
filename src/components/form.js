import React from 'react';
import { Box, Grid, Link, TextField, Typography } from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';


// Generic form template - white box with dynamic no. of textfields
function Form(props) {
    console.log("hello :)");
    console.log(props);

    return(
        <Box 
            bgcolor="secondary.main"
            display="flex" 
            flexDirection="column"
            justifyContent="center"
            p={2}
        >
            <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center" p={1}>
                <Box mr={0.5}>
                    {props.fields[0]}
                </Box>
                <Box flexGrow={1} p={1}>
                    {props.fields[1]}
                </Box>
            </Box>
            <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center" p={1}>
                <Box mr={0.5}>
                    {props.fields[2]}
                </Box>
                <Box flexGrow={1} p={1}>
                    {props.fields[3]}
                </Box>
            </Box>
            <Box display="flex" justifyContent="center" p={1}>
                {props.button}
            </Box>
        </Box>
    );
}

export default Form;