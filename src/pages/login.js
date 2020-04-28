import React from 'react';
import { Box, Container } from '@material-ui/core';
import { LoginForm, PageTitle } from '../components';
import { LoginFormTest } from '../components';

function Login() {
    return (
        <Container maxWidth="xs">
            <Box p={2}>
                <PageTitle text="Login"/>
            </Box>
            <LoginFormTest/>
        </Container>
    );
}

export default Login;
