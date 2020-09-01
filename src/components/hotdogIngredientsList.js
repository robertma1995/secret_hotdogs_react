import React from 'react';
import { 
    Box, Grid, Typography,
    List, ListItem, ListItemIcon, ListItemText, ListSubheader,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import icons from '../utils/icons';

const useStyles = makeStyles((theme) => ({
    // overflow for list items - no need to specify width
    overflow: {
        textOverflow: 'ellipsis',
        overflow: 'hidden'
    },
    // copy-paste listItem divider styling for toppings grid
    bottomDivider: {
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        backgroundClip: 'padding-box',
    }
}));

/* 
    list item with overflow, adds icon/inset depending on column
*/
function Topping(props) {
    const classes = useStyles();
    const { index, value, firstColumn} = props;
    const iconName = firstColumn ? "hotdogTopping" : "none";
    return (
        <ListItem>
            {index === 0 &&
                <ListItemIcon>
                    {icons[iconName]}
                </ListItemIcon>
            }
            <ListItemText 
                inset={index !== 0}
                disableTypography 
                primary={
                    <Typography variant="body2" className={classes.overflow}>
                        {value !== "" ? value : <br/>}
                    </Typography>
                } 
            />
        </ListItem>
    );
}

/* 
    splits hotdog toppings into a table-like structure
*/
function HotdogIngredientsList(props) {
    const classes = useStyles();
    const { sausage, sauce, toppings, dialog } = props;
    // TODO: change of plan - no more numDisplay - just calculate numRows and numColumns based on toppings length
    // - divider can be added to the outside grid, so no need to determine what items need/don't need a divider
    // - still need blank spaces in the toppingsDisplay to keep everything looking consistent
    const maxRowsDialog = 5;
    const maxRowsCard = 3;
    const maxColumnsCard = 1;
    const numRows = dialog ? maxRowsDialog : maxRowsCard;
    const numColumns = dialog ? Math.max(1, Math.ceil(toppings.length/numRows)) : maxColumnsCard;

    // display only maxRowsCard number of rows if dialog, otherwise display all toppings
    const numDisplay = dialog ? toppings.length : maxRowsCard;
    var toppingsDisplay = [...toppings.slice(0, numDisplay)];

    // if ingredients list is used in card instead of dialog,
    // and the original toppings length is more than n, then replace (n-1)th element with "..."
    // otherwise, push blank toppings as needed
    if (!dialog && toppings.length > numDisplay) {
        toppingsDisplay[numDisplay-1] = "...";
    } else if (toppingsDisplay.length < numRows*numColumns) {
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
            <Grid container className={classes.bottomDivider}>
                {[...Array(numColumns)].map((e, i) => (
                    <Grid item key={i} xs={12/numColumns}>
                        { toppingsDisplay.slice(i*numRows, (i+1)*numRows).map((topping, j) => (
                            <Topping 
                                key={j}
                                index={j}
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
