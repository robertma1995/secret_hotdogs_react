import React, { useContext, useEffect, useState } from 'react';
// material ui, email validator
import { Box, Button, CircularProgress, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import isEmail from 'validator/lib/isEmail';
// routing
import { withRouter } from 'react-router-dom';
import * as routes from '../utils/routes';
// context
import { UserContext } from '../userContext';

// show loading spinner on top of login button
const useStyles = makeStyles((theme) => ({
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
    buttonProgress: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    }
}));

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

        // TODO (optional): add a form to allow for login via pressing enter (<form action=login()>)

        // TODO (optional): loading spinner (state variable called "loading", and useEffect)
    }

    const classes = useStyles();
    return (
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
                    error={emailError.trim()}
                    helperText={emailError}
                />
            </Box>
            <Box display="flex" flexDirection="column" justifyContent="center" p={2}>
                <TextField 
                    label="Password" 
                    type="password"
                    value={password}
                    onChange={(event) => handlePasswordChange(event.target.value)}
                    error={passwordError.trim()}
                    helperText={passwordError}
                />
            </Box>
            <Box display="flex" justifyContent="center" p={2}>
                <div className={classes.wrapper}>
                    <Button
                        href="#" 
                        color="primary" 
                        variant="contained"
                        disabled={loading}
                        onClick={() => handleLogin()}
                        disableElevation
                    >
                        Login 
                    </Button>
                    {loading && <CircularProgress size={24} className={classes.buttonProgress}/>}
                </div>
            </Box>
        </Box>
    );
}

export default withRouter(LoginForm);