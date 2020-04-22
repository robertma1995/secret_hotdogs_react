import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, Container, TextField } from '@material-ui/core';
import isEmail from 'validator/lib/isEmail';
import { UserContext } from '../userContext';
import { PageTitle } from '../components';


function Login() {
    // TODO: track email and password state vars
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const emptyError = "Please fill out this field";

    function handleEmailChange(email) {
        setEmail(email);
    }

    function handlePasswordChange(password) {
        setPassword(password);
    }

    const { userId, setCurrentUserId } = useContext(UserContext);
    function handleLogin() {
        // setError functions are asynchronous, so use local vars instead for login check
        var emailValid = false;
        var passwordValid = false;

        // handle empty email/invalid syntax
        if (!email) {
            setEmailError(emptyError);
        } else if (!isEmail(email)) {
            setEmailError("Invalid email");
        } else {
            setEmailError("");
            emailValid = true;
        }

        // handle empty password
        if (!password) {
            setPasswordError(emptyError);
        } else {
            setPasswordError("");
            passwordValid = true;
        }

        if (emailValid && passwordValid) {
            console.log("Email: " + email);
            console.log("Password: " + password);
            console.log("Current user id: " + userId);
            // TODO: call firebase login, pass email + password to api to handle login
            (async () => {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({email: email, password: password})
                });
                const loginStatus = await response.json();
                console.log(loginStatus);
            })();
            // TODO: setCurrentUserId(id);
        }

        // TODO (optional): add a form to allow for login via pressing enter (<form action=login()>)
    }

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
                    <TextField 
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(event) => handleEmailChange(event.target.value)}
                        error={emailError}
                        helperText={emailError}
                    />
                </Box>
                <Box display="flex" flexDirection="column" justifyContent="center" p={2}>
                    <TextField 
                        label="Password" 
                        type="password"
                        value={password}
                        onChange={(event) => handlePasswordChange(event.target.value)}
                        error={passwordError}
                        helperText={passwordError}
                    />
                </Box>
                <Box display="flex" justifyContent="center" p={2}>
                    <Button 
                        href="#" 
                        color="primary" 
                        variant="contained" 
                        onClick={() => handleLogin()}
                        disableElevation
                    >
                        Login 
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default Login;
