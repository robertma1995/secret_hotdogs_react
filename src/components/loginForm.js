import React, { useContext, useEffect, useState } from 'react';
// material ui, email validator, loading spinner
import { Box, Grid, Link, TextField, Typography } from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';
import isEmail from 'validator/lib/isEmail';
import ProgressButton from './progressButton';
// routing
import { withRouter } from 'react-router-dom';
import * as routes from '../utils/routes';
// context
import { UserContext } from '../userContext';

function LoginForm(props) {
 	// context + state variables
    const { userId, setCurrentUserId } = useContext(UserContext);
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(" ");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState(" ");
    const [loading, setLoading] = useState(false);
    const emptyError = "Please fill out this field";

    function handleEmailChange(email) {
        setEmail(email);
    }

    function handlePasswordChange(password) {
        setPassword(password);
    }

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
            setEmailError(" ");
            emailValid = true;
        }

        // handle empty password
        if (!password) {
            setPasswordError(emptyError);
        } else {
            setPasswordError(" ");
            passwordValid = true;
        }

        if (emailValid && passwordValid) {
            console.log("Email: " + email);
            console.log("Password: " + password);
            console.log("Current user id: " + userId);
            // TODO: call firebase login, pass email + password to api to handle login
            setLoading(true);
            (async () => {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({email: email, password: password})
                });
                // if login succeeds, set context user id and redirect to home page
                const loginUserId = await response.json();
                console.log("loginUserId: " + loginUserId);
                setLoading(false);
                if (!loginUserId) {
                    setEmailError("Incorrect email or password");
                    setPasswordError("Incorrect email or password");
                } else {
                    setCurrentUserId(loginUserId);
                    props.history.push(routes.HOME);
                }
            })();
        }
    }

    return (
        <Box 
            bgcolor="secondary.main"
            display="flex" 
            flexDirection="column"
            justifyContent="center"
            p={2}
        >
            <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center" p={1}>
                <Box mr={0.5}>
                    <EmailIcon/>
                </Box>
                <Box flexGrow={1} p={1}>
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        value={email}
                        onChange={(event) => handleEmailChange(event.target.value)}
                        error={emailError.trim()}
                        helperText={emailError}
                    />
                </Box>
            </Box>
            <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center" p={1}>
                <Box mr={0.5}>
                    <LockIcon/>
                </Box>
                <Box flexGrow={1} p={1}>
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        value={password}
                        onChange={(event) => handlePasswordChange(event.target.value)}
                        error={passwordError.trim()}
                        helperText={passwordError}
                    />
                </Box>
            </Box>
            <Box display="flex" justifyContent="center" p={1}>
                <ProgressButton text="Login" loading={loading} onClick={() => handleLogin()}/>
            </Box>
            <Box display="flex" justifyContent="center" p={1}>
                <Typography color="textSecondary" variant="body2">
                    Don't have an account? <Link href={routes.REGISTER}> Sign Up </Link>
                </Typography>
            </Box>
        </Box>
    );
}

export default withRouter(LoginForm);