import React, { useState } from 'react';
import { Avatar, Button, Typography } from '@material-ui/core';
// email validator
import isEmail from 'validator/lib/isEmail';
// my components
import Form from './form';
import FormField from './formField';
import FormButtonWrapper from './formButtonWrapper';
import FormMessage from './formMessage';
import ImageButton from './imageButton';
import LoginFormDialog from './loginFormDialog';
import PhotoUploadDialog from './photoUploadDialog';
import ProgressButton from './progressButton';
import SuccessSnackbar from './successSnackbar';
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
    // user details
    const [name, setName] = useState("");
    const [nameError, setNameError] = useState(" ");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(" ");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState(" ");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [passwordConfirmError, setPasswordConfirmError] = useState(" ");
    const [registered, setRegistered] = useState(false);
    const [loading, setLoading] = useState(false);
    // profile image/avatar
    const [profileImage, setProfileImage] = useState(null);
    const [profileImageUrl, setProfileImageUrl] = useState("");
    const [openPhotoDialog, setOpenPhotoDialog] = useState(false);
    function handleOpenPhotoDialog() {
        setOpenPhotoDialog(true);
    }
    // login dialog for snackbar action on successful registration
    // TODO: might remove action button altogether from snackbar
    const [openLoginDialog, setOpenLoginDialog] = useState(false);
    function handleOpenLoginDialog() {
        setOpenLoginDialog(true);
    }

    function handleRegister() {
        // set registered to false again to handle consecutive adds on same page (no reload)
        setRegistered(false);
        const nameValid = isValid("name", name, setName, setNameError);
        const emailValid = isValid("email", email, setEmail, setEmailError);
        const passwordValid = isValid("password", password, setPassword, setPasswordError);
        const passwordConfirmValid = isValid("passwordConfirm", passwordConfirm, setPasswordConfirm, setPasswordConfirmError, password);

        if (nameValid && emailValid && passwordValid && passwordConfirmValid) {
            setLoading(true);
            (async () => {
                // NOTE: if profileImage === null (i.e. user did not set a profile image),
                // then database does not create a new image reference ("validity" check moved to backend)
                var registerStatus = await DB.register(name, email, password, profileImage);
                setLoading(false);
                
                // if register succeeds, reset all fields and give user option to go to login 
                if (!registerStatus) {
                    // setEmailError("Email already in use, please type in a different email");
                    setEmailError(errors["email"]);
                } else {
                    setName("");
                    setEmail("");
                    setPassword("");
                    setPasswordConfirm("");
                    setProfileImage(null);
                    setProfileImageUrl("");
                    setRegistered(true);
                }
            })();
        }
    }

    return (
        <Form>
            <FormMessage variant="body2" color="textSecondary">
                { !profileImage && "Select your profile picture by clicking the avatar" }
                { profileImage && "Your profile picture" }
            </FormMessage>
            <FormButtonWrapper style={{ borderBottom: '1px solid #cbb09c' }}>
                <ImageButton
                    imageUrl={profileImageUrl}
                    iconName="camera"
                    iconSize="large"
                    handleClick={handleOpenPhotoDialog}
                    avatar
                />
            </FormButtonWrapper>
            <PhotoUploadDialog 
                setPhoto={setProfileImage} 
                photoUrl={profileImageUrl}
                setPhotoUrl={setProfileImageUrl}
                open={openPhotoDialog}
                setOpen={setOpenPhotoDialog}
                profile
            />
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
                action={
                    <>
                        <Button variant="text" color="secondary" onClick={() => handleOpenLoginDialog()}>
                            Login
                        </Button>
                        <LoginFormDialog open={openLoginDialog} setOpen={setOpenLoginDialog} />
                    </>
                }
            />
        </Form>
    );
}

export default RegisterForm;