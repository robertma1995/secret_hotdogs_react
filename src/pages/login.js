import React, { useContext } from 'react';
import { Box, Container } from '@material-ui/core';
import { LoginForm, PageTitle } from '../components';
// routing
import { Redirect } from 'react-router-dom';
import * as routes from '../utils/routes';
// context
import { UserContext } from '../userContext';

function Login() {
	// redirect to home page if user already logged in
    const { userId } = useContext(UserContext);
    if (userId) {
        return (
            <Redirect to={routes.HOME}/>
        );
    }

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
