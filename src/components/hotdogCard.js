import React from 'react';
import {
    Avatar, 
    IconButton, 
    Card, CardHeader, CardMedia, CardContent, CardActions, 
    List, ListItem, ListItemIcon, ListItemText, ListSubheader
} from '@material-ui/core';
import icons from '../utils/icons';
import HotdogDialog from './hotdogDialog';
import HotdogIngredientsList from './hotdogIngredientsList';

/*  
    determine ListItem properties depending on topping index
*/
/*
function Topping(props) {
    const { index, last, value } = props;
    if (index === 0) {
        return (
            <ListItem divider={index === last}>
                <ListItemIcon>
                    {icons["hotdogTopping"]}
                </ListItemIcon>
                <ListItemText primary={value}/>
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
*/

function HotdogCard(props) {
    // TODO: keep id, since will need for liking later on
    const { id, creatorName, description, ingredients, title, ts } = props;
    /* 
    // take top 3 toppings
    const maxToppings = 3;
    const toppings = ingredients["toppings"];
    const toppingsDisplay = [...ingredients["toppings"].slice(0, maxToppings)]
    
    // replace third topping with "..." if 4 or more toppings
    // push blank toppings if less than 3 toppings (visual purposes only), 
    // display all 3 if exactly 3 toppings
    if (toppings.length > maxToppings) {
        toppingsDisplay[2] = "...";
    } else if (toppings.length < maxToppings) {
        if (toppings.length === 0) {
            toppingsDisplay.push("No toppings!");
        }
        const numEmpty = maxToppings - toppingsDisplay.length;
        for (var i = 0; i < numEmpty ; i++) {
            toppingsDisplay.push("");
        }
    }

    // TODO: option 2 - divider at end of toppings on display (3 listItem's) 
    var last = toppingsDisplay.length-1;
    */
    const numToppingColumns = 1;
    const numToppingRows = 3;
    
    // format timestamp seconds into readable date
    var date = new Date(1970, 0, 1);
    date.setTime(ts * 1000);
    const subheader = date.getDate() + " " + (date.toLocaleString('default', {month: 'long'})) + ", " + date.getFullYear();

    return (
        <Card>
            <CardHeader
                avatar={
                    <Avatar>
                        {creatorName.charAt(0).toUpperCase()}
                    </Avatar>
                }
                title={title + " by " + creatorName}
                subheader={subheader}
            />
            <CardMedia image="https://www.svgrepo.com/show/133687/hot-dog.svg"/>
            <CardContent>
                {/* <List dense disablePadding subheader={<ListSubheader color="primary"> Ingredients </ListSubheader>}> */}
                {/*     <ListItem divider> */}
                {/*         <ListItemIcon> */}
                {/*             {icons["hotdogSausage"]} */}
                {/*         </ListItemIcon> */}
                {/*         <ListItemText primary={ingredients["sausage"]}/> */}
                {/*     </ListItem> */}
                {/*     <ListItem divider> */}
                {/*         <ListItemIcon> */}
                {/*             {icons["hotdogSauce"]} */}
                {/*         </ListItemIcon> */}
                {/*         <ListItemText primary={ingredients["sauce"]}/> */}
                {/*     </ListItem> */}
                {/*     { toppingsDisplay.map((topping, i) => ( */}
                {/*         <Topping  */}
                {/*             key={i} */}
                {/*             index={i} */}
                {/*             last={last} */}
                {/*             value={topping} */}
                {/*         /> */}
                {/*     ))} */}
                {/* </List> */}
                <HotdogIngredientsList 
                    sausage={ingredients["sausage"]}
                    sauce={ingredients["sauce"]}
                    toppings={ingredients["toppings"]}
                    numColumns={numToppingColumns}
                    numRows={numToppingRows}
                />
            </CardContent>
            <CardActions>
                <IconButton aria-label="like">
                    {icons["like"]}
                </IconButton>
                {/* TODO: consider using only one dialog on home that takes in hotdog id as input */}
                <HotdogDialog 
                    creatorName={creatorName}
                    description={description}
                    ingredients={ingredients}
                    title={title}
                    subheader={subheader}
                />
            </CardActions>
        </Card>
    );
}

export default HotdogCard;