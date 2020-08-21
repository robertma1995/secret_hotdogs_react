import React, { useContext, useReducer, useState } from 'react';
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
    const inputTrimmed = input.trim();
    var error = checkInput(inputTrimmed);
    setInput(inputTrimmed);
    setInputError(error);
    return error.trim() === "";
}

/*
    helper: same functionality as isValid, but for toppings
    redundant to send both the input and index of the input, but saves from having to pass toppings each call
    cheaper to pass an index and the dispatch functions instead
*/
function isValidTopping(topping, index, dispatchToppings, dispatchToppingErrors) {
    const toppingTrimmed = topping.trim();
    var error = checkInput(toppingTrimmed);
    dispatchToppings({ type: "update", index: index, value: toppingTrimmed });
    dispatchToppingErrors({ type: "update", index: index, value: error });
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
    const [toppings, dispatchToppings] = useReducer((toppings, { type, index, value }) => {
        switch (type) {
            case "add": 
                return [...toppings, ""];
            case "remove":
                // TODO: untested - remove topping field given its index
                return toppings.filter((_, id) => id !== index);
            case "update":
                // for now, only choice for modifying array
                let newToppings = [...toppings];
                newToppings[index] = value;
                return newToppings;
            default:
                return toppings;
        }
    }, []);
    const [toppingErrors, dispatchToppingErrors] = useReducer((toppingErrors, { type, index, value }) => {
        switch (type) {
            case "add": 
                return [...toppingErrors, " "];
            case "remove":
                return toppingErrors.filter((_, id) => id !== index);
            case "update":
                let newErrors = [...toppingErrors];
                newErrors[index] = value;
                return newErrors;
            default:
                return toppingErrors;
        }
    }, []);

    function handleAdd() {
        // set added to false again to handle consecutive adds on same page (no reload)
        setAdded(false);

        var titleValid = isValid(title, setTitle, setTitleError);
        var sausageValid = isValid(sausage, setSausage, setSausageError);
        var sauceValid = isValid(sauce, setSauce, setSauceError);

        var toppingsValid = true;
        for (var i = 0; i < toppings.length; i++) {
            if (!isValidTopping(toppings[i].trim(), i, dispatchToppings, dispatchToppingErrors)) {
                toppingsValid = false;
            }
        }
        console.log("toppingsValid: " + toppingsValid);
        
        // TODO: change toppings/toppingErrors data structure - each topping/error has an id
        // referencing via array index works fine if you're just adding, 
        // but removing toppings becomes a pain (toppings will have "empty" elements)

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

    // adds a topping and error state variable
    function handleAddTopping() {
        // TODO: use topping length as the id for now
        // new topping data structure (map with topping length as id, instead of a vanilla array):
        /* 
            [
                "0": "cheese"
                "1": "tomato"
            ]
        */
        const id = toppings.length;
        console.log("new topping id: " + id);
        dispatchToppings({ type: "add" });
        dispatchToppingErrors({ type: "add" });
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
            {toppings.map((topping, i) => (
                // TODO: modify formField to account for this if possible
                <TextField
                    fullWidth
                    type="text"
                    key={i}
                    label={"Topping " + (i+1)}
                    value={topping}
                    onChange={event => dispatchToppings({ type: "update", index: i, value: event.target.value })}
                    error={toppingErrors[i].trim() !== ""}
                    helperText={toppingErrors[i]}
                />
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
