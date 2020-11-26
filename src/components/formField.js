import React from 'react';
import { Box, IconButton, TextField } from '@material-ui/core';
import Icon from '../utils/icons';

/* 
    Text field with icon - to be wrapped in a Form
    To display errors correctly, set error as " " if there is no error
    If formfield used for description, textfield becomes multiline
    If FormField used for a topping, adds a remove topping button, and setValue function takes in a key
*/
function FormField(props) {
    const { 
        type, iconName, label, value, setValue, error, multiline, disabled,
        topping, toppingKey, toppingRemove
    } = props;

    function handleChange(val) {
        topping ? setValue(toppingKey, val) : setValue(val);
    }

    return (
        <Box width="100%" display="flex" flexDirection="row" justifyContent="center" alignItems="center" p={0.5}>
            <Box mr={0.5}>
                <Icon name={iconName} />
            </Box>
            <Box flexGrow={1} p={1} display="flex" flexDirection="row">
                <Box flexGrow={1}>
                    <TextField
                        label={label}
                        type={type}
                        value={value}
                        onChange={(event) => handleChange(event.target.value)}
                        error={error.trim() !== ""}
                        helperText={error}
                        multiline={multiline}
                        disabled={disabled}
                        fullWidth
                    />
                </Box>
                { topping &&
                    <Box display="flex" flexDirection="column" justifyContent="center">
                        <IconButton onClick={() => toppingRemove(toppingKey)}>
                            <Icon name="minus" />
                        </IconButton>
                    </Box>
                }
            </Box>
        </Box>
    );
}

export default FormField;
