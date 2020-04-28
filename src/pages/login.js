import React from 'react';
import { Box, Container } from '@material-ui/core';
import { LoginForm, PageTitle } from '../components';

function Login() {
    return (
        <Container maxWidth="xs">
            <Box p={2}>
                <PageTitle text="Login"/>
            </Box>
            <LoginForm/>
        </Container>
    );
}

export default Login;
