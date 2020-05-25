import React from 'react';
import { Avatar, Card, CardHeader, CardMedia, CardContent, CardActions, IconButton, Typography } from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';

function HotdogCard(props) {
    const { id, title, ingredients, creatorId, creatorName, ts } = props;

    var date = new Date(1970, 0, 1);
    date.setTime(ts * 1000);
    const subheader = date.getDate() + " " + (date.toLocaleString('default', {month: 'long'})) + ", " + date.getFullYear();

    // TODO: letter avatar based on creator's name
    const avatar = (
        <Avatar>
            {creatorName.charAt(0).toUpperCase()}
        </Avatar>
    );

    // TODO: use regex to separate ingredients string into array

    return (
        <Card>
            <CardHeader
                avatar={avatar}
                title={title}
                subheader={subheader}
            />
            <CardMedia
                image="https://www.svgrepo.com/show/133687/hot-dog.svg"
            />
            <CardContent>
                <Typography variant="body2" color="textSecondary">
                    {ingredients} - created by "{creatorId}" AKA "{creatorName}"
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