import React, { useState } from 'react';
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

function RegisterForm(props) {
 	// state variables
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(" ");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState(" ");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [passwordConfirmError, setPasswordConfirmError] = useState(" ");
    const [loading, setLoading] = useState(false);
    const emptyError = "Please fill out this field";

    function handleRegister() {
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

        // TODO: add more fields
        if (emailValid && passwordValid) {
            
        }
    }

    return (
        <Form>
            <FormField
                type="text"
                iconName="user"
                label="Name"
                value={name}
                setValue={setName}
                error={" "}
            />
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
            <FormField
                type="password"
                iconName="passwordConfirm"
                label="Confirm Password"
                value={passwordConfirm}
                setValue={setPasswordConfirm}
                error={passwordConfirmError}
            />
            <FormButton
                text="Register"
                loading={loading}
                handleClick={handleRegister}
            />
        </Form>
    );
}

export default withRouter(RegisterForm);