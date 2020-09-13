import React, { useState } from 'react';
import {
    Avatar, 
    IconButton, 
    Card, CardHeader, CardMedia, CardContent, CardActions, 
} from '@material-ui/core';
// my components
import icons from '../utils/icons';
import HotdogDialog from './hotdogDialog';
import HotdogIngredientsList from './hotdogIngredientsList';
// database
import * as DB from '../database/wrapper';

function HotdogCard(props) {
    // TODO: keep id, since will need for liking later on
    const { id, creatorId, creatorName, creatorProfileImageUrl, description, ingredients, title, ts } = props;
    console.log(props);
    // const [avatarUrl, setAvatarUrl] = useState("");
    
    // get creator's avatar
    // (async () => {
    //     const url = await DB.getUserProfileImage(creatorId);
    //     setAvatarUrl(url);
    // })();

    // format timestamp seconds into readable date
    var date = new Date(1970, 0, 1);
    date.setTime(ts * 1000);
    const subheader = date.getDate() + " " + (date.toLocaleString('default', {month: 'long'})) + ", " + date.getFullYear();

    return (
        <Card>
            <CardHeader
                avatar={<Avatar src={creatorProfileImageUrl} />}
                title={title + " by " + creatorName}
                subheader={subheader}
            />
            <CardMedia image="https://www.svgrepo.com/show/133687/hot-dog.svg"/>
            <CardContent>
                <HotdogIngredientsList 
                    sausage={ingredients["sausage"]}
                    sauce={ingredients["sauce"]}
                    toppings={ingredients["toppings"]}
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