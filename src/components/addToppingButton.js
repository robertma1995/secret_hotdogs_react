import React from 'react';
import { Button } from '@material-ui/core';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    button: {
        color: 'rgba(0, 0, 0, 0.54)',
        textTransform: 'none',
        '&:hover': {
            color: '#cbb09c',
            backgroundColor: 'transparent'
        }
    }
}));

function AddToppingButton(props) {
    const { handleClick } = props;
    const classes = useStyles();
    return (
        <Button
            className={classes.button}
            variant="text"
            disableElevation
            startIcon={<AddShoppingCartIcon />}
            onClick={() => handleClick()}
        >
            Add topping
        </Button>
    );
}

export default AddToppingButton;
