import React, { useContext, useState } from 'react';
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

    // TODO
    // const [toppings, setToppings] = useState([]);
    const [state, setState] = useState([]);

    
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
        
        // TODO: check isValid for all toppings
        toppingsValid = false;
        // TODO: checking if values assigned correctly
        console.log("TOPPINGS STATE: ");
        console.log(state);

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
        var next = state.length;
        // declare new state variables
        var topping = {
            value: "",
            error: " "
        };
        setState(state => [...state, topping]);
        // TODO: revert to old method (make state just a {} as before, but no separate "toppings" state variable)
        /*
            setState(state => {
                return {...state, ["topping" + next]: ""}
            })
            setState(state => {
                return {...state, ["topping" + next + "Error"]: " "}
            })
            
        */
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
            { state.map((topping, i) => (
                // <FormField
                //     type="text"
                //     iconName="hotdogTopping"
                //     // label="Topping A"
                //     label={topping.label}
                //     // value={toppingA}
                //     value={topping.value}
                //     // setValue={setToppingA}
                //     setValue={topping.setValue}
                //     // error={toppingAError}
                //     error={topping.error}
                // />
                <TextField
                    key={i}
                    label={"Topping " + i}
                    type="text"
                    value={state[i].value}
                    onChange={(event) => {
                        var val = event.target.value;
                        // console.log("TOPPING " + i + ": " + val);
                        // setState(state => {
                        //     return {...state, [i]: {"value": val, "error": topping.error}}
                        // });
                        // TODO: revert to old method - below method is slow + inefficient
                        let newState = [...state];
                        newState[i].value = val;
                        setState(newState);
                    }}
                    error={topping.error.trim() !== ""}
                    helperText={topping.error}
                    fullWidth
                />

                // TODO: revert to old method, but use a loop instead of .map (counter = state.length/2)
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