import React, { useContext, useState } from 'react';
// email validator
import isEmail from 'validator/lib/isEmail';
// my components
import Form from './form';
import FormField from './formField';
import FormButtonWrapper from './formButtonWrapper';
import ProgressButton from './progressButton';
import FormFooter from './formFooter';
import RouterLink from './routerLink';
// routing
import { withRouter } from 'react-router-dom';
import * as routes from '../utils/routes';
// context
import { UserContext } from '../userContext';
// database
import * as DB from '../database/wrapper';

function LoginForm(props) {
 	// context + state variables (default error " " prevents form from looking ugly)
    const { setCurrentUserId, setCurrentUserName } = useContext(UserContext);
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

        // remove trailing whitespace from email before checking validity
        const emailTrimmed = email.trim();
        if (!emailTrimmed) {
            setEmailError(emptyError);
        } else if (!isEmail(emailTrimmed)) {
            setEmailError("Invalid email");
        } else {
            setEmailError(" ");
            emailValid = true;
        }
        setEmail(emailTrimmed);

        if (!password) {
            setPasswordError(emptyError);
        } else {
            setPasswordError(" ");
            passwordValid = true;
        }

        if (emailValid && passwordValid) {
            setLoading(true);
            // if login succeeds, set context user id and redirect to home page
            (async () => {
                // trim again just in case, since set<value>(<value>Trimmed) is asynchronous
                const loginUserId = await DB.login(email.trim(), password);
                setLoading(false);
                if (!loginUserId) {
                    setEmailError("Incorrect email or password");
                    setPasswordError("Incorrect email or password");
                } else {
                    // get user details (users currently only have a name)
                    const loginUser = await DB.getUser(loginUserId);
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
                type="text"
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
            <FormButtonWrapper>
                <ProgressButton 
                    text="Login" 
                    loading={loading} 
                    handleClick={handleLogin}
                />
            </FormButtonWrapper>
            {/* TODO: also close LoginFormDialog if click on sign up link */}
            <FormFooter>
                Don't have an account? <RouterLink color="primary" underline="hover" to={routes.REGISTER}> Sign Up </RouterLink>
            </FormFooter>
        </Form>
    );
}

export default withRouter(LoginForm);