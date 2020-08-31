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
    const { sausage, sauce, toppings, numColumns, numRows, dialog } = props;
    // TODO: addform should also have max toppings (10 for now)
    const numDisplay = numColumns * numRows;
    var toppingsDisplay = [...toppings.slice(0, numDisplay)];

    // if ingredients list is used in card instead of dialog,
    // and the original toppings length is more than n, then replace (n-1)th element with "..."
    // otherwise, push blank toppings as needed
    if (!dialog && toppings.length > numDisplay) {
        toppingsDisplay[numDisplay-1] = "...";
    } else if (toppingsDisplay.length < numDisplay) {
        if (toppingsDisplay.length === 0) {
            toppingsDisplay.push("No toppings!");
        }
        const numBlank = numDisplay - toppingsDisplay.length;
        for (var i = 0; i < numBlank ; i++) {
            toppingsDisplay.push("");
        }
    }

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
                {[...Array(numColumns)].map((e, i) => (
                    <Grid item key={i} xs={12/numColumns}>
                        { toppingsDisplay.slice(i*numRows, (i+1)*numRows).map((topping, j) => (
                            <Topping 
                                key={j}
                                index={j}
                                last={numRows-1}
                                value={topping}
                                firstColumn={i === 0}
                            />
                        ))}
                    </Grid>
                ))}
            </Grid>
        </List>
    ); 
}

/* 
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
*/

export default HotdogIngredientsList;
