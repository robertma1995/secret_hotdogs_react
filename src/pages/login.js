import React, { useState, useContext } from 'react';
// material ui
import { Box, Button, Container, TextField } from '@material-ui/core';
import { PageTitle } from '../components';
// context
import { UserContext } from '../userContext';


function Login() {
    // TODO: track email and password state vars
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    // set id if user login successful
    const { userId, setCurrentUserId } = useContext(UserContext);
    function login(id) {

        // TODO: validate email (self-coded like in php app, or use: https://www.npmjs.com/package/react-material-ui-form-validator )
        if (email !== "kappa") {
            setEmailError("Incorrect email");
        } else {
            setEmailError("Correct email smile smile :)")
        }

        // TODO: call firebase login, pass email + password to api to handle login
        setCurrentUserId(id);

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
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        error={emailError}
                        helperText={emailError}
                    />
                </Box>
                <Box display="flex" flexDirection="column" justifyContent="center" p={2}>
                    <TextField 
                        label="Password" 
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        error={passwordError}
                        helperText={passwordError}
                    />
                </Box>
                <Box display="flex" justifyContent="center" p={2}>
                    <Button 
                        href="#" 
                        color="primary" 
                        variant="contained" 
                        onClick={() => login()}
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
