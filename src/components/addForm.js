import React, { useContext, useState } from 'react';
// my components
import Form from './form';
import FormField from './formField';
import FormButton from './formButton';
import SuccessSnackbar from './successSnackbar';
// routing
import * as routes from '../utils/routes';
// context
import { UserContext } from '../userContext';
// helper for accessing api
import { apiPost } from '../utils/apiHelper';


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

        // TODO: backend for add hotdog
        if (titleValid && sausageValid && sauceValid && toppingAValid && toppingBValid) {
            setLoading(true);
            (async () => {
                // trim again just in case, since set<value>(<value>Trimmed) is asynchronous
                const bodyJson = {
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
                const addStatus = await apiPost('hotdogs/add', bodyJson);
                console.log("addStatus: " + addStatus);
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
                action="HOME"
                actionRoute={routes.HOME}
            />
        </Form>
    );
} 

export default AddForm;