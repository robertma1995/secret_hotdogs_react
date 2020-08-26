import React from 'react';
import { Button } from '@material-ui/core';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';

function AddToppingButton(props) {
    const { handleClick } = props;
    return (
        <Button
            variant="text"
            color="primary"
            disableElevation
            startIcon={<AddShoppingCartIcon />}
            onClick={() => handleClick()}
        >
            Add Topping
        </Button>
    );
}

export default AddToppingButton;
