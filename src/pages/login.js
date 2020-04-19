import React from 'react';
// material ui
import { Box, Button, Container, Grid, Paper, TextField } from '@material-ui/core';
import { PageTitle } from '../components'; 


function Login() {
    // TODO: track email and password state vars

    return (
        <Container maxWidth="xs">
            <Box p={2}>
                <PageTitle text="Login"/>
            </Box>
            <Box 
                bgcolor="secondary.main"
                display="flex" 
                flexDirection="column"
                justifyContent="center"
                p={2}
            >
                <Box display="flex" flexDirection="column" justifyContent="center" p={2}>
                    <TextField label="Email"></TextField>
                </Box>
                <Box display="flex" flexDirection="column" justifyContent="center" p={2}>
                    <TextField label="Password"></TextField>
                </Box>
                <Box display="flex" justifyContent="center" p={2}>
                    <Button href="#" color="primary" variant="contained" disableElevation> Login </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default Login;
