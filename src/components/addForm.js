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

function AddForm() {
    const [title, setTitle] = useState("");
    const [titleError, setTitleError] = useState(" ");
    const [ing, setIng] = useState("");
    const [ingError, setIngError] = useState(" ");
    
    const [loading, setLoading] = useState(false);
    const [added, setAdded] = useState(false);
    const emptyError = "Please fill out this field";

    function handleAdd() {
        console.log("SUBMITTED NEW HOTDOG :)");
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
                iconName="ingredients"
                label="Ingredients"
                value={ing}
                setValue={setIng}
                error={ingError}
            />
            <FormButton
                text="Submit"
                loading={loading}
                handleClick={handleAdd}
            />
            <SuccessSnackbar
                parentOpen={added}
                message="Posted new hotdog!"
                action="HOME"
                actionRoute={routes.HOME}
            />
        </Form>
    );
} 

export default AddForm;