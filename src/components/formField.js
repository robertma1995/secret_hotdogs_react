import React from 'react';
import { Box, IconButton, TextField } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';
import RestaurantIcon from '@material-ui/icons/Restaurant';
import EditIcon from '@material-ui/icons/Edit';
import OutdoorGrillIcon from '@material-ui/icons/OutdoorGrill';
import WavesIcon from '@material-ui/icons/Waves';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import RemoveIcon from '@material-ui/icons/Remove';

// "none" = white "invisible" icon with ShoppingCart as a placeholder
const icons = {
    user: <AccountCircleIcon />,
    email: <EmailIcon />,
    password: <LockIcon />,
    hotdogTitle: <RestaurantIcon />,
    hotdogDescription: <EditIcon />,
    hotdogSausage: <OutdoorGrillIcon />,
    hotdogSauce: <WavesIcon />,
    hotdogTopping: <ShoppingCartIcon />,
    none: <ShoppingCartIcon color="secondary" />,
}

/* 
    Text field with icon - to be wrapped in a Form
    To display errors correctly, set error as " " if there is no error
    If FormField is used for a topping, then adds a remove topping button, and setValue function takes in a key
*/
function FormField(props) {
    const { type, iconName, label, value, setValue, error, multiline, topping, toppingKey, toppingRemove } = props;

    function handleChange(val) {
        topping ? setValue(toppingKey, val) : setValue(val)
    }

    return (
        <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center" p={0.5}>
            <Box mr={0.5}>
                {icons[iconName]}
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
                        fullWidth
                    />
                </Box>
                { topping &&
                    <Box display="flex" flexDirection="column" justifyContent="center">
                        <IconButton onClick={() => toppingRemove(toppingKey)}>
                            <RemoveIcon />
                        </IconButton>
                    </Box>
                }
            </Box>
        </Box>
    );
}

export default FormField;
