import React from 'react';
import {
    Avatar, IconButton, 
    Card, CardHeader, CardMedia, CardContent, CardActions, 
} from '@material-ui/core';
// my components
import Icon from '../utils/icons';
import HotdogDetailsDialog from './hotdogDetailsDialog';
import HotdogIngredientsList from './hotdogIngredientsList';

/*
    has to be a wrapped in a memo to prevent useless re-rendering of existing cards in homehotdoggrid
*/
const HotdogCard = React.memo((props) => {
    // TODO: keep id, since will need for liking later on
    const { 
        id, creatorId, creatorName, creatorProfileImageUrl, 
        description, hotdogImageUrl, ingredients, title, ts 
    } = props;
    // TODO: keep below console log to check for useless rendering
    console.log("Hotdog " + id + " rendered");

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
            <CardMedia image={hotdogImageUrl} />
            <CardContent>
                <HotdogIngredientsList 
                    sausage={ingredients["sausage"]}
                    sauce={ingredients["sauce"]}
                    toppings={ingredients["toppings"]}
                />
            </CardContent>
            <CardActions>
                <IconButton aria-label="like">
                    <Icon name="like" />
                </IconButton>
                <HotdogDetailsDialog 
                    id={id}
                    creatorName={creatorName}
                    creatorProfileImageUrl={creatorProfileImageUrl}
                    description={description}
                    hotdogImageUrl={hotdogImageUrl}
                    ingredients={ingredients}
                    title={title}
                    subheader={subheader}
                />
            </CardActions>
        </Card>
    );
});

export default HotdogCard;
