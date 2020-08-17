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


// helper: trims form input and checks validity (no special characters)
function isValid(input, setInput, setInputError) {
    var inputValid = false;
    const emptyError = "Please fill out this field";
    const invalidError = "Invalid input - special characters not allowed";

    const inputTrimmed = input.trim();
    if (!inputTrimmed) {
        setInputError(emptyError);
    } else if (!inputTrimmed.match(/^[A-Za-z0-9]+$/g)) {
        setInputError(invalidError);
    } else {
        setInputError(" ");
        inputValid = true;
    }
    setInput(inputTrimmed);

    return inputValid;
}

// TODO: add form with dynamic number of toppings
function AddFormTest() {
    const [title, setTitle] = useState("");
    const [titleError, setTitleError] = useState(" ");
    const [sausage, setSausage] = useState("");
    const [sausageError, setSausageError] = useState(" ");
    const [sauce, setSauce] = useState("");
    const [sauceError, setSauceError] = useState(" ");
    // const [toppingA, setToppingA] = useState("");
    // const [toppingAError, setToppingAError] = useState(" ");
    // const [toppingB, setToppingB] = useState("");
    // const [toppingBError, setToppingBError] = useState(" ");

    // const [state, setState] = useState([]);
    // TODO: separate toppings and toppingErrors instead of using one "state" variable
    // TODO: consider including all errors (title, sauce, sausage, toppings) in one "state" array
    // const [toppings, setToppings] = useState([]);
    // const [toppingErrors, setToppingErrors] = useState([]);
    const [toppings, dispatchToppings] = useReducer((toppings, { type, index, value }) => {
        switch (type) {
            case "add": 
                return [...toppings, ""];
            case "remove":
                // TODO: untested - remove topping field given its index
                return toppings.filter((_, id) => id !== index);
            case "update":
                // TODO: update at given id
                // same formula as before, but seems like the only choice for now
                let newToppings = [...toppings];
                newToppings[index] = value;
                return newToppings;
            default:
                return toppings;
        }
    }, []);

    const [toppingErrors, dispatchToppingErrors] = useReducer((errors, { type, index, value }) => {
        switch (type) {
            case "add": 
                return [...errors, " "];
            case "remove":
                return errors.filter((_, id) => id !== index);
            case "update":
                console.log("index: " + index);
                console.log("value: " + value);
                // TODO: update at given id
                let newErrors = [...toppingErrors];
                newErrors[index] = value;
                return newErrors;
            default:
                return errors;
        }
    }, []);


    
    const { userId, userName } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [added, setAdded] = useState(false);

    function handleAdd() {
        // set added to false again to handle consecutive adds on same page (no reload)
        setAdded(false);
        // var titleValid, sausageValid, sauceValid, toppingAValid, toppingBValid;
         var titleValid, sausageValid, sauceValid, toppingsValid;
        titleValid = sausageValid = sauceValid = toppingsValid = false;

        titleValid = isValid(title, setTitle, setTitleError);
        sausageValid = isValid(sausage, setSausage, setSausageError);
        sauceValid = isValid(sauce, setSauce, setSauceError);
        // toppingAValid = isValid(toppingA, setToppingA, setToppingAError);
        // toppingBValid = isValid(toppingB, setToppingB, setToppingBError);
        
        // TODO: checking if values assigned correctly
        console.log("TOPPINGS STATE: ");
        console.log(toppings);
        console.log("ERRORS STATE: ");
        console.log(toppingErrors);

        // TODO: check isValid for all toppings - how to pass dispatchX function like a setX function...?
        // option 1: pass additional argument to isValid to distinguish between toppings and other variables
        /*
        toppingsValid = true;
        for (var i = 0; i < toppings.length; i++) {
            if (!isValid(toppings[i], dispatchToppings(type: "update", )))
        }
        */

        // if (titleValid && sausageValid && sauceValid && toppingAValid && toppingBValid) {
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

    // adds a topping
    /*
        for each topping added, declare new state variables 

            const [topping0, setTopping0] = useState("")
            const [topping0Error, setTopping0Error] = useState(" ")
            ...no way to declare dynamic variable names within useState, so have to use classic setState

            const [state, setState] = useState({});
            setState(state => {...state, ["topping" + next]: ""})
            setState(state => {...state, ["topping" + next + "Error"]: " "})

        and push a new entry to toppings:

            "0": {
                label: "Topping 0"
                value: topping0
                setValue: setTopping0
                error: topping0Error
            }
            
            "0": {
                label: "Topping " + index
                value: state["topping" + index]
                error: state["topping" + index + "Error"]
            }
    */
    function handleAddTopping() {
        console.log("ADDED TOPPING");
        // index of new topping 
        var next = toppings.length;
        // append new topping + error variables to respective state
        // setToppings(state => [...state, ""]);
        // setToppingErrors(state => [...state, " "]);
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











function AddForm() {
    const [title, setTitle] = useState("");
    const [titleError, setTitleError] = useState(" ");
    const [sausage, setSausage] = useState("");
    const [sausageError, setSausageError] = useState(" ");
    const [sauce, setSauce] = useState("");
    const [sauceError, setSauceError] = useState(" ");
    const [toppingA, setToppingA] = useState("");
    const [toppingAError, setToppingAError] = useState(" ");
    const [toppingB, setToppingB] = useState("");
    const [toppingBError, setToppingBError] = useState(" ");
    
    const { userId, userName } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [added, setAdded] = useState(false);

    function handleAdd() {
        // set added to false again to handle consecutive adds on same page (no reload)
        setAdded(false);
        var titleValid, sausageValid, sauceValid, toppingAValid, toppingBValid;
        titleValid = sausageValid = sauceValid = toppingAValid = toppingBValid = false;

        titleValid = isValid(title, setTitle, setTitleError);
        sausageValid = isValid(sausage, setSausage, setSausageError);
        sauceValid = isValid(sauce, setSauce, setSauceError);
        toppingAValid = isValid(toppingA, setToppingA, setToppingAError);
        toppingBValid = isValid(toppingB, setToppingB, setToppingBError);

        if (titleValid && sausageValid && sauceValid && toppingAValid && toppingBValid) {
            setLoading(true);
            (async () => {
                // trim again just in case, since set<value>(<value>Trimmed) is asynchronous
                const hotdog = {
                    creatorId: userId,
                    creatorName: userName,
                    title: title.trim(),
                    ingredients: {
                        sausage: sausage.trim(),
                        sauce: sauce.trim(),
                        toppingA: toppingA.trim(),
                        toppingB: toppingB.trim(),
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
                    setToppingA("");
                    setToppingB("");
                    setAdded(true);
                }
            })();
        }
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
            <FormField
                type="text"
                iconName="hotdogTopping"
                label="Topping A"
                value={toppingA}
                setValue={setToppingA}
                error={toppingAError}
            />
            <FormField
                type="text"
                iconName="none"
                label="Topping B"
                value={toppingB}
                setValue={setToppingB}
                error={toppingBError}
            />
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

export default AddFormTest;