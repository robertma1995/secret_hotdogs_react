import React, { useContext, useReducer, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
// TODO: add separate "formX" component for add topping button if necessary
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
// my components
import Form from './form';
import FormField from './formField';
import FormButton from './formButton';
import SuccessSnackbar from './successSnackbar';
// context
import { UserContext } from '../userContext';
// database
import * as DB from '../database/wrapper';

/* 
    checks trimmed input, returning the appropriate error message
    for now, each field has to be one word (no spaces between words)
*/
function checkInput(inputTrimmed) {
    var error = " ";
    const emptyError = "Please fill out this field";
    const invalidError = "Invalid input - special characters not allowed";
    if (!inputTrimmed) {
        error = emptyError;
    } else if (!inputTrimmed.match(/^[A-Za-z0-9]+$/g)) {
        error = invalidError;
    }
    return error;
}

/*
    helper: checks validity of input based on returned error, trims input, and sets input error
*/
function isValid(input, setInput, setInputError) {
    const trimmed = input.trim();
    var error = checkInput(trimmed);
    setInput(trimmed);
    setInputError(error);
    return error.trim() === "";
}

/*
    helper: same functionality as isValid, but for toppings
    redundant to send both the topping and topping key, but saves from having to pass toppings each call
    cheaper to pass an index and the dispatch functions instead
*/
function isValidTopping(topping, key, updateToppings, updateToppingErrors) {
    const trimmed = topping.trim();
    var error = checkInput(trimmed);
    updateToppings(key, trimmed);
    updateToppingErrors(key, error);
    return error.trim() === "";
}

function AddForm() {
    const { userId, userName } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [added, setAdded] = useState(false);
    const [title, setTitle] = useState("");
    const [titleError, setTitleError] = useState(" ");
    const [sausage, setSausage] = useState("");
    const [sausageError, setSausageError] = useState(" ");
    const [sauce, setSauce] = useState("");
    const [sauceError, setSauceError] = useState(" ");

    // separate topping/errors Maps, since not always updating error while updating topping (i.e. textfield -> onchange)
    const [toppings, setToppings] = useState(new Map());
    function updateToppings(key, value) {
        setToppings(new Map(toppings.set(key, value)));
    }
    function removeTopping(key) {
        var t = new Map(toppings);
        t.delete(key);
        setToppings(t);
    }
    const [toppingErrors, setToppingErrors] = useState(new Map());
    function updateToppingErrors(key, value) {
        setToppingErrors(new Map(toppingErrors.set(key, value)));
    }
    function removeToppingError(key) {
        var e = new Map(toppingErrors);
        e.delete(key);
        setToppingErrors(e);
    }

    function handleAdd() {
        // set added to false again to handle consecutive adds on same page (no reload)
        setAdded(false);

        var titleValid = isValid(title, setTitle, setTitleError);
        var sausageValid = isValid(sausage, setSausage, setSausageError);
        var sauceValid = isValid(sauce, setSauce, setSauceError);

        var toppingsValid = true;
        console.log(toppings);
        console.log(toppingErrors);
        for (const key of toppings.keys()) {
            var topping = toppings.get(key);
            if (!isValidTopping(topping, key, updateToppings, updateToppingErrors)) {
                toppingsValid = false;
            }
        }
        console.log("toppingsValid: " + toppingsValid);

        // TODO: testing - don't add any new hotdogs for now
        toppingsValid = false;

        // check errors with local vars, since setError functions are asynchronous
        if (titleValid && sausageValid && sauceValid && toppingsValid) {
            setLoading(true);
            (async () => {
                // trim again just in case, since set<value>(<value>Trimmed) is asynchronous
                // TODO: after state variable stuff figured out, change backend stuff
                const hotdog = {
                    creatorId: userId,
                    creatorName: userName,
                    title: title.trim(),
                    ingredients: {
                        sausage: sausage.trim(),
                        sauce: sauce.trim(),
                        // toppingA: toppingA.trim(),
                        // toppingB: toppingB.trim(),
                    }
                }
                const addStatus = await DB.addHotdog(hotdog);
                setLoading(false);

                // if add hotdog succeeds, reset all fields and give user option to go back to homepage 
                // no restrictions on field values for now, so shouldn't fail
                if (!addStatus) {
                    console.log("addForm.js: something went wrong :(");
                } else {
                    setTitle("");
                    setSausage("");
                    setSauce("");
                    // setToppingA("");
                    // setToppingB("");
                    setAdded(true);
                }
            })();
        }
    }

    // adds a topping and error state variables
    function handleAddTopping() {
        const id = uuidv4();
        updateToppings(id, "");
        updateToppingErrors(id, " ");
    }

    // removes given topping and error state variables
    function handleRemoveTopping(id) {
        console.log(id);
        removeTopping(id);
        removeToppingError(id);
    }

    return (
        <Form>
            <FormField
                type="text"
                iconName="hotdogTitle"
                label="Title"
                value={title}
                setValue={setTitle}
                error={titleError}
            />
            <FormField
                type="text"
                iconName="hotdogSausage"
                label="Sausage"
                value={sausage}
                setValue={setSausage}
                error={sausageError}
            />
            <FormField
                type="text"
                iconName="hotdogSauce"
                label="Sauce"
                value={sauce}
                setValue={setSauce}
                error={sauceError}
            />
            {[...toppings.keys()].map(key => (
                <React.Fragment key={key}>
                    <FormField
                        type="text"
                        iconName="none"
                        label={"Topping"}
                        value={toppings.get(key)}
                        setValue={updateToppings}
                        error={toppingErrors.get(key)}
                        topping
                        toppingKey={key}
                        toppingRemove={handleRemoveTopping}
                    />
                    {/* <TextField */}
                    {/*     fullWidth */}
                    {/*     type="text" */}
                    {/*     label={"Topping " + key} */}
                    {/*     value={toppings.get(key)} */}
                    {/*     onChange={event => updateToppings(key, event.target.value)} */}
                    {/*     error={toppingErrors.get(key).trim() !== ""} */}
                    {/*     helperText={toppingErrors.get(key)} */}
                    {/* /> */}
                    {/* <Button */}
                    {/*     variant="outlined"  */}
                    {/*     color="primary" */}
                    {/*     disableElevation */}
                    {/*     onClick={() => handleRemoveTopping(key)} */}
                    {/* > */}
                    {/*     Remove */}
                    {/* </Button> */}
                </React.Fragment>
            ))}
            <Button 
                variant="contained" 
                color="primary" 
                disableElevation
                onClick={() => handleAddTopping()}
            >
                Add topping
            </Button>
            <FormButton
                text="Submit"
                loading={loading}
                handleClick={handleAdd}
            />
            <SuccessSnackbar
                open={added}
                setOpen={setAdded}
                message="Posted new hotdog!"
            />
        </Form>
    );
} 

export default AddForm;
