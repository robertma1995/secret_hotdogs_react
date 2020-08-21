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
    redundant to send both the input and index of the input, but saves from having to pass toppings each call
    cheaper to pass an index and the dispatch functions instead
*/
// function isValidTopping(topping, index, dispatchToppings, dispatchToppingErrors) {
//     const toppingTrimmed = topping.trim();
//     var error = checkInput(toppingTrimmed);
//     dispatchToppings({ type: "update", index: index, value: toppingTrimmed });
//     dispatchToppingErrors({ type: "update", index: index, value: error });
//     return error.trim() === "";
// }
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
    // separate topping/errors arrays, since not always updating error while updating topping, and vice-versa
    /*  
    const [toppings, dispatchToppings] = useReducer((toppings, { type, id, value }) => {
        switch (type) {
            case "add": 
                // return [...toppings, ""];
                // TODO: changing data structure
                console.log("toppings length: " + toppings.length);
                var newToppings = [...toppings];
                newToppings[id] = "";
                return newToppings;
            case "remove":
                // TODO: untested - remove topping field given its index
                return toppings.filter((_, toppingId) => toppingId !== id);
            case "update":
                // for now, only choice for modifying state array
                var newToppings = [...toppings];
                newToppings[id] = value;
                return newToppings;
            default:
                return toppings;
        }
    }, [new Map()]);
    */
    const [toppings, setToppings] = useState(new Map());
    function updateToppings(key, value) {
        setToppings(new Map(toppings.set(key, value)));
    }

    /* 
    const [toppingErrors, dispatchToppingErrors] = useReducer((toppingErrors, { type, id, value }) => {
        switch (type) {
            case "add": 
                // return [...toppingErrors, " "];
                // TODO: changing data structure
                var newErrors = [...toppingErrors];
                newErrors[id] = " ";
                return newErrors;
            case "remove":
                return toppingErrors.filter((_, errorId) => errorId !== id);
            case "update":
                var newErrors = [...toppingErrors];
                newErrors[id] = value;
                return newErrors;
            default:
                return toppingErrors;
        }
    }, [new Map()]);
    */
    const [toppingErrors, setToppingErrors] = useState(new Map());
    function updateToppingErrors(key, value) {
        setToppingErrors(new Map(toppingErrors.set(key, value)));
    }

    function handleAdd() {
        // set added to false again to handle consecutive adds on same page (no reload)
        setAdded(false);

        var titleValid = isValid(title, setTitle, setTitleError);
        var sausageValid = isValid(sausage, setSausage, setSausageError);
        var sauceValid = isValid(sauce, setSauce, setSauceError);

        var toppingsValid = true;
        // for (var i = 0; i < toppings.length; i++) {
        //     if (!isValidTopping(toppings[i].trim(), i, dispatchToppings, dispatchToppingErrors)) {
        //         toppingsValid = false;
        //     }
        // }
        // TODO: changing data structure
        console.log(toppings);
        console.log(toppingErrors);
        for (const key of toppings.keys()) {
            var topping = toppings.get(key);
            if (!isValidTopping(topping, key, updateToppings, updateToppingErrors)) {
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
        // TODO: new topping data structure (map with actual id's, instead of a vanilla array):
        /* 
            [
                "uuid-0": "cheese"
                "uuid-1": "tomato"
            ]
        */
        const id = uuidv4();
        // dispatchToppings({ type: "add", id: id });
        // dispatchToppingErrors({ type: "add", id: id });
        updateToppings(id, "");
        updateToppingErrors(id, " ");
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
                <TextField
                    fullWidth
                    type="text"
                    key={key}
                    label={"Topping " + key}
                    value={toppings.get(key)}
                    onChange={event => updateToppings(key, event.target.value)}
                    error={toppingErrors.get(key).trim() !== ""}
                    helperText={toppingErrors.get(key)}
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

/*  
{toppings.map((id, topping) => (
    // TODO: modify formField to account for this if possible
    <TextField
        fullWidth
        type="text"
        key={id}
        label={"Topping " + id}
        value={topping}
        onChange={event => dispatchToppings({ type: "update", id: id, value: event.target.value })}
        error={toppingErrors[id].trim() !== ""}
        helperText={toppingErrors[id]}
    />
))}
*/

export default AddForm;
