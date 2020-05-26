import React from 'react';
import { Box, TextField } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import RestaurantIcon from '@material-ui/icons/Restaurant';
import OutdoorGrillIcon from '@material-ui/icons/OutdoorGrill';
import WavesIcon from '@material-ui/icons/Waves';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

const icons = {
    user: <AccountCircleIcon/>,
    email: <EmailIcon/>,
    password: <LockIcon/>,
    passwordConfirm: <LockOpenIcon/>,
    hotdogTitle: <RestaurantIcon/>,
    hotdogSausage: <OutdoorGrillIcon/>,
    hotdogSauce: <WavesIcon/>,
    hotdogTopping: <ShoppingCartIcon/>,
    none: <ShoppingCartIcon color="secondary"/>,
}

// Text field with icon - to be wrapped in a Form
// To display errors correctly, set error as " " if there is no error
function FormField(props) {
    const { type, iconName, label, value, setValue, error } = props;
    return (
        <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center" p={1}>
            <Box mr={0.5}>
                {icons[iconName]}
            </Box>
            <Box flexGrow={1} p={1}>
                <TextField
                    label={label}
                    type={type}
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    error={error.trim() !== ""}
                    helperText={error}
                    fullWidth
                />
            </Box>
        </Box>
    );
}

export default FormField;
