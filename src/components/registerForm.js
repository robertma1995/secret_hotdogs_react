import React, { useState } from 'react';
// email validator
import isEmail from 'validator/lib/isEmail';
// my components
import Form from './form';
import FormField from './formField';
import FormButtonWrapper from './formButtonWrapper';
import ProgressButton from './progressButton';
import SuccessSnackbar from './successSnackbar';
import LoginFormDialog from './loginFormDialog';
// utils
import * as routes from '../utils/routes';
// database
import * as DB from '../database/wrapper';

/* 
    checks trimmed input, returning the appropriate error message
    for now, each field has to be one word (no spaces between words)
*/
/*
function checkInput(inputTrimmed) {
    var error = " ";
    const emptyError = "Please fill out this field";
    const invalidError = "Special characters not allowed";
    const emailError = "Invalid email";
    if (!inputTrimmed) {
        error = emptyError;
    } else if (!inputTrimmed.match(/^[A-Za-z0-9]+$/g)) {
        error = invalidError;
    }
    return error;
}
*/

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
        // set added to false again to handle consecutive adds on same page (no reload)
        setRegistered(false);
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
                // trim again just in case, since set<value>(<value>Trimmed) is asynchronous
                // TEMP: stop new registrations since public hosting now
                // var registerStatus = false;
                var registerStatus = await DB.register(name.trim(), email.trim(), password);
                setLoading(false);
                // if register succeeds, reset all fields and give user option to go to login 
                if (!registerStatus) {
                    // setEmailError("Email already in use, please type in a different email");
                    setEmailError("Invalid email");
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
                iconName="none"
                label="Confirm Password"
                value={passwordConfirm}
                setValue={setPasswordConfirm}
                error={passwordConfirmError}
            />
            <FormButtonWrapper>
                <ProgressButton 
                    text="Register" 
                    loading={loading} 
                    handleClick={handleRegister}
                />
            </FormButtonWrapper>
            <SuccessSnackbar
                open={registered}
                setOpen={setRegistered}
                message="Registration successful"
                action={<LoginFormDialog snackbar />}
            />
        </Form>
    );
}

export default RegisterForm;