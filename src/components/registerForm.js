import React, { useState } from 'react';
// email validator
import isEmail from 'validator/lib/isEmail';
// my components
import Form from './form';
import FormField from './formField';
import FormButton from './formButton';
import SuccessSnackbar from './successSnackbar';
// routing
import * as routes from '../utils/routes';
// helper for accessing api
import { apiPost } from '../utils/apiHelper';

function RegisterForm(props) {
 	// state variables
    const [name, setName] = useState("");
    const [nameError, setNameError] = useState(" ");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(" ");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState(" ");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [passwordConfirmError, setPasswordConfirmError] = useState(" ");
    const [loading, setLoading] = useState(false);
    const [registered, setRegistered] = useState(false);
    const emptyError = "Please fill out this field";

    function handleRegister() {
        // setError functions are asynchronous, so use local vars instead for final check
        var nameValid = false;
        var emailValid = false;
        var passwordValid = false;
        var passwordConfirmValid = false;

        // remove trailing whitespace before checking inputs
        const nameTrimmed = name.trim();
        if (!nameTrimmed) {
            setNameError(emptyError);
        } else {
            setNameError(" ");
            nameValid = true;
        }
        setName(nameTrimmed);

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

        const passwordLength = 6;
        if (!password) {
            setPasswordError(emptyError);
        } else if (password.length < passwordLength) {
            setPasswordError("Password must be at least " + passwordLength + " characters long")
        } else {
            setPasswordError(" ");
            passwordValid = true;
        }

        if (passwordConfirm !== password) {
            setPasswordConfirmError("Please make sure your passwords match");
        } else {
            setPasswordConfirmError(" ");
            passwordConfirmValid = true;
        }

        if (nameValid && emailValid && passwordValid && passwordConfirmValid) {
            setLoading(true);
            (async () => {
                const bodyJson = {
                    name: name,
                    email: email,
                    password: password 
                }
                const registerStatus = await apiPost('register', bodyJson);
                console.log("registerStatus: " + registerStatus);
                setLoading(false);

                // if register succeeds, reset all fields and give user option to go to login 
                if (!registerStatus) {
                    setEmailError("Email already in use, please type in a different email");
                } else {
                    setName("");
                    setEmail("");
                    setPassword("");
                    setPasswordConfirm("");
                    setRegistered(true);                        
                }
            })();
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
                error={nameError}
            />
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
            <SuccessSnackbar
                parentOpen={registered}
                message="Registration successful"
                action="LOGIN"
                actionRoute={routes.LOGIN}
            />
        </Form>
    );
}

export default RegisterForm;