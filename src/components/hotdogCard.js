import React from 'react';
import {
    Avatar, 
    IconButton, 
    Card, CardHeader, CardMedia, CardContent, CardActions, 
    List, ListItem, ListItemIcon, ListItemText, ListSubheader
} from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import OutdoorGrillIcon from '@material-ui/icons/OutdoorGrill';
import WavesIcon from '@material-ui/icons/Waves';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import HotdogDialog from './hotdogDialog';

/*  
    determine ListItem properties depending on topping index
*/
function Topping(props) {
    const { index, last, value } = props;
    if (index === 0) {
        return (
            <ListItem divider={index === last}>
                <ListItemIcon>
                    <ShoppingCartIcon/>
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

function HotdogCard(props) {
    const { id, creatorName, description, ingredients, title, ts } = props;
    // take top 3 toppings
    const maxToppings = 3;
    const toppings = ingredients["toppings"];
    const toppingsDisplay = [...ingredients["toppings"].slice(0, maxToppings)]
    
    // TODO: option 1 - divider at end of actual toppings 
    // var last = toppings.length - 1;

    // replace third topping with "..." if 4 or more toppings
    // push blank toppings if less than 3 toppings (visual purposes only), 
    // display all 3 if exactly 3 toppings
    if (toppings.length > toppingsDisplay.length) {
        toppingsDisplay[2] = "...";

        // TODO: option 1 - divider at end of actual toppings 
        // last = toppingsDisplay.length-1;
    } else if (toppings.length < toppingsDisplay.length) {
        if (toppings.length === 0) {
            toppingsDisplay.push("No toppings!");
        }
        const numEmpty = maxToppings+1 - toppingsDisplay.length;
        for (var i = 0; i < numEmpty ; i++) {
            toppingsDisplay.push("");
        }
    }

    // TODO: option 2 - divider at end of toppings on display (3 listItem's) 
    var last = toppingsDisplay.length-1;
    
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
                <List dense disablePadding subheader={<ListSubheader color="primary"> Ingredients </ListSubheader>}>
                    <ListItem divider>
                        <ListItemIcon>
                            <OutdoorGrillIcon/>
                        </ListItemIcon>
                        <ListItemText primary={ingredients["sausage"]}/>
                    </ListItem>
                    <ListItem divider>
                        <ListItemIcon>
                            <WavesIcon/>
                        </ListItemIcon>
                        <ListItemText primary={ingredients["sauce"]}/>
                    </ListItem>
                    { toppingsDisplay.map((topping, i) => (
                        <Topping 
                            key={i}
                            index={i}
                            last={last}
                            value={topping}
                        />
                    ))}
                </List>
            </CardContent>
            <CardActions>
                <IconButton aria-label="like">
                    <FavoriteIcon/>
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