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
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart';
import PhotoCameraOutlinedIcon from '@material-ui/icons/PhotoCameraOutlined';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import DeleteIcon from '@material-ui/icons/Delete';
import SettingsIcon from '@material-ui/icons/Settings';

// "none" = transparent with ShoppingCartIcon as a placeholder
const iconsTest = {
    user: AccountCircleIcon,
    email: EmailIcon,
    password: LockIcon,
    hotdogTitle: RestaurantIcon,
    hotdogDescription: EditIcon,
    hotdogSausage: OutdoorGrillIcon,
    hotdogSauce: WavesIcon,
    hotdogTopping: ShoppingCartIcon,
    none: ShoppingCartIcon,
    like: FavoriteIcon,
    minus: RemoveIcon,
    plus: AddIcon,
    close: CloseIcon,
    tick: CheckCircleOutlineIcon,
    addTopping: AddShoppingCartIcon,
    addToppingDisabled: RemoveShoppingCartIcon,
    camera: PhotoCameraOutlinedIcon,
    logout: ExitToAppIcon,
    delete: DeleteIcon,
    settings: SettingsIcon,
}

function Icon(props) {
    const { name, size, color, className, style } = props;
    const Icon = iconsTest[name];
    var iconStyle = name === "none" ? { color: 'transparent' } : style;
    return <Icon fontSize={size} color={color} className={className} style={iconStyle} />;
}

export default Icon;
