import React from 'react';
import { Box, Container } from '@material-ui/core';
import { RegisterForm, PageTitle } from '../components';

function Register() {
    return (
        <Container maxWidth="xs">
            <Box p={2}>
                <PageTitle text="Sign Up"/>
            </Box>
            <RegisterForm/>
        </Container>
    );
}

export default Register;
