import React, { useContext, useState } from 'react';
// material ui, email validator
import Link from '@material-ui/core/Link';
import isEmail from 'validator/lib/isEmail';
// my components
import Form from './form';
import FormField from './formField';
import FormButton from './formButton';
import FormFooter from './formFooter';
// routing
import { withRouter } from 'react-router-dom';
import * as routes from '../utils/routes';
// context
import { UserContext } from '../userContext';

function LoginFormTest(props) {
 	// context + state variables
    const { userId, setCurrentUserId } = useContext(UserContext);
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(" ");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState(" ");
    const [loading, setLoading] = useState(false);
    const emptyError = "Please fill out this field";

    function handleLogin() {
        // setError functions are asynchronous, so use local vars instead for login check
        var emailValid = false;
        var passwordValid = false;

        // handle empty email/invalid syntax (" " error prevents form from looking hideous)
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
        <Form>
            <FormField
                type="email"
                label="Email"
                value={email}
                setValue={setEmail}
                error={emailError}
            />
            <FormField
                type="password"
                label="Password"
                value={password}
                setValue={setPassword}
                error={passwordError}
            />
            <FormButton
                text="Login"
                loading={loading}
                handleClick={handleLogin}
            />
            <FormFooter>
                Don't have an account? <Link href={routes.REGISTER}> Sign Up </Link>
            </FormFooter>
        </Form>
    );
}

export default withRouter(LoginFormTest);