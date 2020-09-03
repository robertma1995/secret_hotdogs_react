import React from 'react';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';
import RestaurantIcon from '@material-ui/icons/Restaurant';
import EditIcon from '@material-ui/icons/Edit';
import OutdoorGrillIcon from '@material-ui/icons/OutdoorGrill';
import WavesIcon from '@material-ui/icons/Waves';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import FavoriteIcon from '@material-ui/icons/Favorite';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

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
    none: <ShoppingCartIcon style={{ color: 'transparent' }} />,
    like: <FavoriteIcon />,
    minus: <RemoveIcon />,
    plus: <AddIcon color="secondary"/>,
    close: <CloseIcon />,
    tick: <CheckCircleOutlineIcon />,
    addTopping: <AddShoppingCartIcon />,
    addToppingDisabled: <RemoveShoppingCartIcon />,
}

export default icons;
