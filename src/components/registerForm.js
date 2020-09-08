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
import errors from '../utils/errors';
// database
import * as DB from '../database/wrapper';

/* 
    helper: checks trimmed input, returning the appropriate error message
    for now, each field can't have spaces or special characters
    type determines checking method, password arg is only used for passwordConfirm checking
*/
function checkInput(type, inputTrimmed, password) {
    if (!inputTrimmed && type !== "passwordConfirm") {
        return errors["empty"];
    } 
    var error = " ";
    switch (type) {
        case "name": 
            if (!inputTrimmed.match(/^[A-Za-z0-9]+$/g)) error = errors["special"];
            break;
        case "email": 
            if (!isEmail(inputTrimmed)) error = errors["email"];
            break;
        case "password":
            const length = 6;
            if (inputTrimmed.length < length) error = errors["password"](length);
            break;
        case "passwordConfirm":
            if (inputTrimmed !== password) error = errors["passwordConfirm"];
            break;
        default: 
            break;
    }
    return error;
}

/*
    helper: checks validity of input based on returned error, trims input, and sets input error
*/
function isValid(type, input, setInput, setInputError, password) {
    const trimmed = input.trim();
    const error = type === "passwordConfirm" ? checkInput(type, trimmed, password) : checkInput(type, trimmed);
    setInput(trimmed);
    setInputError(error);
    return error.trim() === "";
}

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
    const [profileImage, setProfileImage] = useState("");
    const [loading, setLoading] = useState(false);
    const [registered, setRegistered] = useState(false);

    function uploadFile(file) {
        console.log("UPLOADED FILE");
        setProfileImage(file);
    }

    function handleRegister() {
        // set registered to false again to handle consecutive adds on same page (no reload)
        setRegistered(false);
        const nameValid = isValid("name", name, setName, setNameError);
        const emailValid = isValid("email", email, setEmail, setEmailError);
        const passwordValid = isValid("password", password, setPassword, setPasswordError);
        const passwordConfirmValid = isValid("passwordConfirm", passwordConfirm, setPasswordConfirm, setPasswordConfirmError, password);

        // TODO: image upload - use firebase storage (see docs)
        // current plan: one folder for users, one folder for hotdogs, 

        if (nameValid && emailValid && passwordValid && passwordConfirmValid) {
            setLoading(true);
            (async () => {
                // TEMP: stop new registrations since public hosting now
                // var registerStatus = false;
                var registerStatus = await DB.register(name, email, password, profileImage);
                setLoading(false);
                // if register succeeds, reset all fields and give user option to go to login 
                if (!registerStatus) {
                    // setEmailError("Email already in use, please type in a different email");
                    setEmailError(errors["email"]);
                } else {
                    // TODO: also clear the image input field
                    setName("");
                    setEmail("");
                    setPassword("");
                    setPasswordConfirm("");
                    setProfileImage("");
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
            <input 
                type="file"
                onChange={(event) => uploadFile(event.target.files[0])}
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