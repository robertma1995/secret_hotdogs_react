import React from 'react';
import { 
    Box, Grid, Typography,
    List, ListItem, ListItemIcon, ListItemText, ListSubheader,
} from '@material-ui/core';
import icons from '../utils/icons';

/* 
    adds icons or dividers to ListItem depending on index and column
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
                <ListItemText 
                    disableTypography 
                    primary={
                        <Typography
                            variant="body2" 
                            style={{
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                width: '170px'
                            }}
                        >
                            {value !== "" ? value : <br/>}
                        </Typography>
                    } 
                />
            </ListItem>
        );
    } else {
        return (
            <ListItem divider={index === last}>
                <ListItemText 
                    inset
                    disableTypography 
                    primary={
                        <Typography
                            variant="body2" 
                            style={{
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                width: '170px'
                            }}
                        >
                            {value !== "" ? value : <br/>}
                        </Typography>
                    } 
                />
            </ListItem>
        );
    }
}

/* 
    splits hotdog toppings into a table-like structure
*/
function HotdogIngredientsList(props) {
    const { sausage, sauce, toppings, numDisplay, dialog } = props;
    // TODO: calculate numColumns and numRows dynamically based on numDisplay (max rows will still be 5)
    // TODO: max columns 
    const maxRows = 5;
    const numColumns = Math.ceil(numDisplay/maxRows);
    const numRows = numDisplay < maxRows ? numDisplay : maxRows;
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
        const numBlank = numColumns*numRows - toppingsDisplay.length;
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

export default HotdogIngredientsList;
