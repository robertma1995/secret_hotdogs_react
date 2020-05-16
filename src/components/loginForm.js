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
// helper for accessing api
import { apiPost, apiGetUser } from '../utils/apiHelper'; 

function LoginForm(props) {
 	// context + state variables
    const { userId, setCurrentUserId,userName, setCurrentUserName } = useContext(UserContext);
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
            setLoading(true);
            // if login succeeds, set context user id and redirect to home page
            (async () => {
                const bodyJson = {
                    email: email,
                    password: password 
                }
                const loginUserId = await apiPost('login', bodyJson);
                console.log("loginUserId: " + loginUserId);
                setLoading(false);
                if (!loginUserId) {
                    setEmailError("Incorrect email or password");
                    setPasswordError("Incorrect email or password");
                } else {
                    const loginUser = await apiGetUser(loginUserId);
                    console.log("loginUserName: " + loginUser.name);
                    setCurrentUserName(loginUser.name);
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
                iconName="email"
                label="Email"
                value={email}
                setValue={setEmail}
                error={emailError}
            />
            <FormField
                type="password"
                iconName="password"
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

export default withRouter(LoginForm);