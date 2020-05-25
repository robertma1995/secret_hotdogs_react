import React from 'react';
import { Avatar, Card, CardHeader, CardMedia, CardContent, CardActions, IconButton, Typography } from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';

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

    // TODO: 

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
                <Typography variant="body2" color="textSecondary">
                    {ingredients["sausage"]}, {ingredients["sauce"]}, {ingredients["toppingA"]}, {ingredients["toppingB"]}
                </Typography>
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