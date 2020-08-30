import React from 'react';
import { 
    Grid,
    List, ListItem, ListItemIcon, ListItemText, ListSubheader,
} from '@material-ui/core';
import icons from '../utils/icons';

/* 
    same as hotdogCard, but accounts for column
*/
function Topping(props) {
    const { index, last, value, firstColumn } = props;
    const iconName = firstColumn ? "hotdogTopping" : "none";

    if (index === 0) {
        return (
            <ListItem divider={index === last}>
                <ListItemIcon>
                    {icons[iconName]}
                </ListItemIcon>
                <ListItemText primary={value !== "" ? value : <br/>}/>
            </ListItem>
        );
    } else {
        return (
            <ListItem divider={index === last}>
                <ListItemText inset primary={value !== "" ? value : <br/>}/>
            </ListItem>
        );
    }
}

/* 
    hotdog ingredients list split into 2 columns
    TODO: for now, only used for hotdogDialog, but should try extend to hotdogCard (logic is only slightly different)
*/
function HotdogIngredientsList(props) {
    const { sausage, sauce, toppings } = props;
    // TODO: addform should also have max 10 toppings
    const maxToppings = 10;
    var toppingsDisplay = [...toppings];
    // if less than 10 ingredients, push missing spaces
    if (toppings.length < maxToppings) {
        if (toppings.length === 0) {
            toppingsDisplay.push("No toppings!");
        }
        const numEmpty = maxToppings - toppingsDisplay.length;
        for (var i = 0; i < numEmpty ; i++) {
            toppingsDisplay.push("");
        }
    }

    // make divider at the end of first and second column
    var last = toppingsDisplay.length/2 - 1;

    return (
        <List dense disablePadding subheader={<ListSubheader color="primary"> Ingredients </ListSubheader>}>
            <ListItem divider>
                <ListItemIcon>
                    {icons["hotdogSausage"]}
                </ListItemIcon>
                <ListItemText primary={sausage}/>
            </ListItem>
            <ListItem divider>
                <ListItemIcon>
                    {icons["hotdogSauce"]}
                </ListItemIcon>
                <ListItemText primary={sauce}/>
            </ListItem>
            <Grid container>
                <Grid item xs={6}>
                    { toppingsDisplay.slice(0, maxToppings/2).map((topping, i) => (
                        <Topping 
                            key={i}
                            index={i}
                            last={last}
                            value={topping}
                            firstColumn
                        />
                    ))}
                </Grid>
                <Grid item xs={6}>
                    { toppingsDisplay.slice(maxToppings/2, toppingsDisplay.length).map((topping, i) => (
                        <Topping 
                            key={i}
                            index={i}
                            last={last}
                            value={topping}
                        />
                    ))}
                </Grid>
            </Grid>
        </List>
    ); 
}

export default HotdogIngredientsList;
