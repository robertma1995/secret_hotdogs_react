import React from 'react';
import { 
    Avatar, 
    IconButton, 
    Typography,
    Card, CardHeader, CardMedia, CardContent, CardActions, 
    List, ListItem, ListItemIcon, ListItemText, ListSubheader
} from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import OutdoorGrillIcon from '@material-ui/icons/OutdoorGrill';
import WavesIcon from '@material-ui/icons/Waves';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

function HotdogCard(props) {
    const { id, title, ingredients, creatorId, creatorName, ts } = props;

    // format timestamp seconds to readable date
    var date = new Date(1970, 0, 1);
    date.setTime(ts * 1000);
    const subheader = date.getDate() + " " + (date.toLocaleString('default', {month: 'long'})) + ", " + date.getFullYear();

    // letter avatar based on creator's name
    const avatar = (
        <Avatar>
            {creatorName.charAt(0).toUpperCase()}
        </Avatar>
    ); 

    return (
        <Card>
            <CardHeader
                avatar={avatar}
                title={title + " by " + creatorName}
                subheader={subheader}
            />
            <CardMedia
                image="https://www.svgrepo.com/show/133687/hot-dog.svg"
            />
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
                    <ListItem>
                        <ListItemIcon>
                            <ShoppingCartIcon/>
                        </ListItemIcon>
                        <ListItemText primary={ingredients["toppingA"]}/>
                    </ListItem>
                    <ListItem divider>
                        <ListItemText inset primary={ingredients["toppingB"]}/>
                    </ListItem>
                </List>
            </CardContent>
            <CardActions>
                <IconButton>
                    <FavoriteIcon/>
                </IconButton>
            </CardActions>
        </Card>
    );
}

export default HotdogCard;