import React, { useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import Button from '@material-ui/core/Button';
// my components
import Form from './form';
import FormField from './formField';
import FormButtonWrapper from './formButtonWrapper';
import FormMessage from './formMessage';
import ImageButtonDouble from './imageButtonDouble';
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
    helper: removes fields from changes that match initial values - ignores order
*/
function removeMatching(changes, initial) {
    var res = changes;
    for (var k in res) {
        if (k !== "toppings" && res[k] === initial[k]) {
            delete res[k];
        } else if (k === "toppings") {
            if (isEqual(res[k].sort(), initial[k].sort())) {
                delete res[k];
            }
        }
    }
    return res;
}

/*
    Hotdog adding/editing form 
        assumes initial values + hotdog id passed if edit is true:
            used exclusively in HotdogDetailsDialog (> HotdogFormDialog)
        setAddId, setEditId:
            used exclusively for HotdogGrid to fake real-time updates
*/
function HotdogForm(props) {
    const { 
        id, initialDescription, initialHotdogImageUrl, initialIngredients, initialTitle, edit, setDialogHotdogImageUrl,
        setAddId, setEditId
    } = props;
    const { userId } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    // input details
    const [title, setTitle] = useState(edit ? initialTitle : "");
    const [description, setDescription] = useState(edit ? initialDescription : "");
    const [sausage, setSausage] = useState(edit ? initialIngredients["sausage"] : "");
    const [sauce, setSauce] = useState(edit ? initialIngredients["sauce"]: "");
    // input errors
    const [titleError, setTitleError] = useState(" ");
    const [descriptionError, setDescriptionError] = useState(" ");
    const [sausageError, setSausageError] = useState(" ");
    const [sauceError, setSauceError] = useState(" ");
    // image
    const [hotdogImage, setHotdogImage] = useState(null);
    const [hotdogImageUrl, setHotdogImageUrl] = useState(edit ? initialHotdogImageUrl : constants["hotdogImageUrl"]);
    const [openPhotoDialog, setOpenPhotoDialog] = useState(false);
    // separate topping/errors Maps, since not always updating error while updating topping (i.e. textfield -> onchange)
    const initialToppings = edit ? initialIngredients["toppings"].map((t, i) => [i, t]) : undefined;
    const initialToppingErrors = edit ? initialIngredients["toppings"].map((t, i) => [i, " "]) : undefined;
    const [toppings, setToppings] = useState(new Map(initialToppings));
    const [toppingErrors, setToppingErrors] = useState(new Map(initialToppingErrors));

    function removeTopping(key) {
        var t = new Map(toppings);
        t.delete(key);
        setToppings(t);
    }

    function removeToppingError(key) {
        var e = new Map(toppingErrors);
        e.delete(key);
        setToppingErrors(e);
    }

    function updateToppings(key, value) {
        setToppings(new Map(toppings.set(key, value)));
    }
    
    function updateToppingErrors(key, value) {
        setToppingErrors(new Map(toppingErrors.set(key, value)));
    }

    // adds a topping and error state variables
    function handleAddTopping() {
        const toppingId = uuidv4();
        updateToppings(toppingId, "");
        updateToppingErrors(toppingId, " ");
    }

    // removes given topping and error state variables
    function handleRemoveTopping(toppingId) {
        removeTopping(toppingId);
        removeToppingError(toppingId);
    }

    function handleOpenPhotoDialog() {
        setOpenPhotoDialog(true);
    }

    function handleResetPhoto() {
        setHotdogImage(null);
        setHotdogImageUrl(constants["hotdogImageUrl"]);
    }


    function handleSubmit() {
        // handle consecutive submits on same form
        setOpenSnackbar(false);
        
        const titleValid = isValid(title, setTitle, setTitleError);
        const sausageValid = isValid(sausage, setSausage, setSausageError);
        const sauceValid = isValid(sauce, setSauce, setSauceError);
        let toppingsValid = true;
        for (const key of toppings.keys()) {
            let topping = toppings.get(key);
            if (!isValidTopping(topping, key, updateToppings, updateToppingErrors)) {
                toppingsValid = false;
            }
        }

        // check errors with local vars, since setError functions are asynchronous
        if (titleValid && sausageValid && sauceValid && toppingsValid) {
            // strip topping ids
            setLoading(true);
            let toppingsArray = [];
            for (const topping of toppings.values()) {
                toppingsArray.push(topping);
            }
            
            let hotdog = { 
                description: description, 
                sauce: sauce, 
                sausage: sausage, 
                toppings: toppingsArray, 
                title: title 
            };

            if (edit) {
                // remove fields from changes if same as initial - ignore title
                const initial = {
                    description: initialDescription,
                    sauce: initialIngredients["sauce"],
                    sausage: initialIngredients["sausage"],
                    toppings: initialIngredients["toppings"],
                };
                delete hotdog["title"];
                const changes = removeMatching(hotdog, initial);
                
                // update hotdog details (triggers real-time update of details dialog)
                (async () => {
                    let editSuccess = false;
                    if (!isEmpty(changes)) {
                        editSuccess = await DB.patchHotdog(id, changes);
                    }
                    // update details dialog image to simulate "real-time" since storage doesn't support it
                    if (hotdogImageUrl !== initialHotdogImageUrl) {
                        let url = await DB.putHotdogImage(id, hotdogImage);
                        editSuccess = url !== false;
                        if (editSuccess) {
                            const finalUrl = url || constants["hotdogImageUrl"];
                            setHotdogImageUrl(finalUrl);
                            setDialogHotdogImageUrl(finalUrl);
                        }
                    }
                    if (editSuccess) {
                        setEditId(id);
                    } else {
                        console.log("something went wrong with editing...");
                    }
                    setLoading(false);
                    setOpenSnackbar(true);
                })();
            } else {
                hotdog["creatorId"] = userId;
                (async () => {
                    let id = await DB.postHotdog(hotdog);
                    let addSuccess = id !== false;
                    if (addSuccess && hotdogImage) {
                        addSuccess = await DB.postHotdogImage(id, hotdogImage);
                    }
                    if (addSuccess) {
                        setTitle("");
                        setDescription("");
                        setSausage("");
                        setSauce("");
                        setToppings(new Map());
                        setHotdogImage(null);
                        setHotdogImageUrl(constants["hotdogImageUrl"]);   
                        setAddId(id);
                    } else {
                        console.log("something went wrong with adding...");
                    }
                    setLoading(false);
                    setOpenSnackbar(true);
                })();
            }
        }
    }

    return (
        <Form>
            <FormMessage variant="body2" color="textSecondary" style={{ paddingBottom: 'unset' }}>
                { hotdogImageUrl === constants["hotdogImageUrl"] && "Select a new picture by clicking the hotdog below" }
                { hotdogImageUrl !== constants["hotdogImageUrl"] && "Your hotdog picture" }
            </FormMessage>
            <FormButtonWrapper style={{ borderBottom: '1px solid #cbb09c' }}>
                <ImageButtonDouble
                    imageUrl={hotdogImageUrl}
                    iconNameOne="camera"
                    iconNameTwo="delete"
                    handleClickOne={handleOpenPhotoDialog}
                    handleClickTwo={handleResetPhoto}
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
                disabled={edit}
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
                    color="primary"
                    variant="contained"
                    loading={loading} 
                    handleClick={handleSubmit}
                >
                    Submit
                </ProgressButton>
            </FormButtonWrapper>
            <SuccessSnackbar
                open={openSnackbar}
                setOpen={setOpenSnackbar}
                message={edit ? "Updated hotdog" : "Posted new hotdog!"}
            />
        </Form>
    );
} 

export default HotdogForm;
