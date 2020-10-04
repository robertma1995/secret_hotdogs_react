import React, { useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Button from '@material-ui/core/Button';
// my components
import Form from './form';
import FormField from './formField';
import FormButtonWrapper from './formButtonWrapper';
import FormMessage from './formMessage';
import ImageButton from './imageButton';
import PhotoUploadDialog from './photoUploadDialog';
import ProgressButton from './progressButton';
import SuccessSnackbar from './successSnackbar';
// utils
import Icon from '../utils/icons';
import errors from '../utils/errors';
import constants from '../utils/constants';
// context
import { UserContext } from '../userContext';
// database
import * as DB from '../database/wrapper';

/* 
    helper: checks trimmed input, returning the appropriate error message
    for now, each field can't have spaces or special characters
*/
function checkInput(inputTrimmed) {
    var error = " ";
    if (!inputTrimmed) {
        error = errors["empty"];
    } else if (!inputTrimmed.match(/^[A-Za-z0-9]+$/g)) {
        error = errors["special"];
    }
    return error;
}

/*
    helper: checks validity of input based on returned error, trims input, and sets input error
*/
function isValid(input, setInput, setInputError) {
    const trimmed = input.trim();
    const error = checkInput(trimmed);
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
    const error = checkInput(trimmed);
    updateToppings(key, trimmed);
    updateToppingErrors(key, error);
    return error.trim() === "";
}

/*
    Hotdog adding/editing form - assumes initial values passed if edit is true
*/
function HotdogForm(props) {
    const { initialDescription, initialHotdogImageUrl, initialIngredients, initialTitle, edit } = props;
    const { userId, userName } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    // details
    const [title, setTitle] = useState(edit ? initialTitle : "");
    const [description, setDescription] = useState(edit ? initialDescription : "");
    const [sausage, setSausage] = useState(edit ? initialIngredients.sausage : "");
    const [sauce, setSauce] = useState(edit ? initialIngredients.sauce : "");
    // errors
    const [titleError, setTitleError] = useState(" ");
    const [descriptionError, setDescriptionError] = useState(" ");
    const [sausageError, setSausageError] = useState(" ");
    const [sauceError, setSauceError] = useState(" ");
    // image
    const [hotdogImage, setHotdogImage] = useState(null);
    const [hotdogImageUrl, setHotdogImageUrl] = useState(initialHotdogImageUrl || constants["hotdogImageUrl"]);
    const [openPhotoDialog, setOpenPhotoDialog] = useState(false);
    function handleOpenPhotoDialog() {
        setOpenPhotoDialog(true);
    }
    // separate topping/errors Maps, since not always updating error while updating topping (i.e. textfield -> onchange)
    const [toppings, setToppings] = useState(new Map(edit ? initialIngredients.toppings.map((t, i) => [i, t]) : undefined));
    const [toppingErrors, setToppingErrors] = useState(new Map(edit ? initialIngredients.toppings.map((t, i) => [i, " "]) : undefined));
    
    function updateToppings(key, value) {
        setToppings(new Map(toppings.set(key, value)));
    }
    
    function removeTopping(key) {
        var t = new Map(toppings);
        t.delete(key);
        setToppings(t);
    }

    function updateToppingErrors(key, value) {
        setToppingErrors(new Map(toppingErrors.set(key, value)));
    }

    function removeToppingError(key) {
        var e = new Map(toppingErrors);
        e.delete(key);
        setToppingErrors(e);
    }

    function handleSubmit() {
        // set submitted to false again to handle consecutive submissions on same page (i.e. user doesn't refresh)
        setSubmitted(false);

        const titleValid = isValid(title, setTitle, setTitleError);
        const sausageValid = isValid(sausage, setSausage, setSausageError);
        const sauceValid = isValid(sauce, setSauce, setSauceError);

        var toppingsValid = true;
        for (const key of toppings.keys()) {
            var topping = toppings.get(key);
            if (!isValidTopping(topping, key, updateToppings, updateToppingErrors)) {
                toppingsValid = false;
            }
        }
        
        // check errors with local vars, since setError functions are asynchronous
        if (titleValid && sausageValid && sauceValid && toppingsValid) {
            setLoading(true);
            (async () => {
                // convert map to array - no need for topping id in backend
                var toppingsArray = [];
                for (const topping of toppings.values()) {
                    toppingsArray.push(topping);
                }
                const hotdog = {
                    creatorId: userId,
                    creatorName: userName,
                    description: description,
                    title: title,
                    ingredients: {
                        sausage: sausage,
                        sauce: sauce,
                        toppings: toppingsArray
                    }
                }
                const submitStatus = await DB.postHotdog(hotdog, hotdogImage);
                setLoading(false);

                // if post succeeds, reset all fields and give user option to go back to homepage 
                // no restrictions on field values for now, so shouldn't fail
                if (!submitStatus) {
                    console.log("hotdogForm.js: something went wrong :(");
                } else {
                    setTitle("");
                    setDescription("");
                    setSausage("");
                    setSauce("");
                    setToppings(new Map());
                    setHotdogImage(null);
                    setHotdogImageUrl(constants["hotdogImageUrl"]);
                    setSubmitted(true);
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
             <FormMessage variant="body2" color="textSecondary">
                { hotdogImageUrl === constants["hotdogImageUrl"] && "Select a new picture by clicking the hotdog below" }
                { hotdogImageUrl !== constants["hotdogImageUrl"] && "Your hotdog picture" }
            </FormMessage>
            <FormButtonWrapper style={{ borderBottom: '1px solid #cbb09c' }}>
                <ImageButton
                    imageUrl={hotdogImageUrl}
                    iconName="camera"
                    iconSize="large"
                    handleClick={handleOpenPhotoDialog}
                />
            </FormButtonWrapper>
            <PhotoUploadDialog 
                photoType="hotdog" 
                setPhoto={setHotdogImage} 
                photoUrl={hotdogImageUrl}
                setPhotoUrl={setHotdogImageUrl}
                open={openPhotoDialog}
                setOpen={setOpenPhotoDialog}
            />
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
                iconName="hotdogDescription"
                label="Description"
                value={description}
                setValue={setDescription}
                error={descriptionError}
                multiline
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
            {[...toppings.keys()].map((key, i) => (
                <FormField
                    key={key}
                    type="text"
                    iconName={i === 0 ? "hotdogTopping" : "none"}
                    label="Topping"
                    value={toppings.get(key)}
                    setValue={updateToppings}
                    error={toppingErrors.get(key)}
                    topping
                    toppingKey={key}
                    toppingRemove={handleRemoveTopping}
                />
            ))}
            <FormButtonWrapper>
                { toppings.size < constants["maxToppings"] &&
                    <Button
                        variant="text"
                        color="primary"
                        disableElevation
                        startIcon={<Icon name="addTopping" />}
                        onClick={() => handleAddTopping()}
                    >
                        Add Topping
                    </Button>
                }
                { toppings.size === constants["maxToppings"] &&
                    <Button
                        disabled
                        variant="text"
                        color="primary"
                        disableElevation
                        startIcon={<Icon name="addToppingDisabled" />}
                    >
                        Max. Toppings reached ({constants["maxToppings"]})
                    </Button>
                }
            </FormButtonWrapper>
            <FormButtonWrapper>
                <ProgressButton 
                    text="Submit" 
                    loading={loading} 
                    handleClick={handleSubmit}
                />
            </FormButtonWrapper>
            <SuccessSnackbar
                open={submitted}
                setOpen={setSubmitted}
                message="Posted new hotdog!"
            />
        </Form>
    );
} 

export default HotdogForm;
