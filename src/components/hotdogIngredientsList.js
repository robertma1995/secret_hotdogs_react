import React from 'react';
import { 
    Box, Grid, Typography,
    List, ListItem, ListItemIcon, ListItemText, ListSubheader,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import icons from '../utils/icons';

/*
const useStyles = makeStyles((theme, styleProps) => ({
    // TODO: different width depending on num columns 
    overflow: styleProps => ({
        textOverflow: 'ellipsis',
        overflow: 'hidden',
    }),
}));
*/

const useStyles = makeStyles((theme) => ({
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
    adds icons or dividers to ListItem depending on index and column
*/
function Topping(props) {
    const { index, value, firstColumn} = props;
    const iconName = firstColumn ? "hotdogTopping" : "none";

    // TODO: different width depending on num columns
    // const styleProps = { width: width }
    // const classes = useStyles(styleProps);
    const classes = useStyles();

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
    const { sausage, sauce, toppings, numDisplay, dialog } = props;
    // TODO: change of plan - no more numDisplay - just calculate numRows and numColumns based on toppings length
    // - divider can be added to the outside grid, so no need to determine what items need/don't need a divider
    // - still need blank spaces in the toppingsDisplay to keep everything looking consistent
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
