import React from 'react';
import {
    Avatar, Button, IconButton, 
    Card, CardHeader, CardMedia, CardContent, CardActions, 
} from '@material-ui/core';
// my components
import Icon from '../utils/icons';
import HotdogIngredientsList from './hotdogIngredientsList';
import { secondsToDate } from '../utils/functions';

/*
    has to be a wrapped in a memo to prevent useless re-rendering of existing cards in homehotdoggrid
*/
const HotdogCard = React.memo((props) => {
    // TODO: keep id, since will need for liking later on
    const { 
        id, creatorId, creatorName, creatorImageUrl, 
        description, hotdogImageUrl, ingredients, title, ts,
        setHotdogDetailsId, setOpenDetailsDialog,
    } = props;
    // TODO: keep below console log to check for useless rendering
    console.log("Hotdog " + id + " rendered");

    // format timestamp seconds into readable date
    const subheader = secondsToDate(ts);

    // set hotdog details dialog
    function handleSetHotdogDetailsId() {
        setOpenDetailsDialog(true);
        setHotdogDetailsId(id);
    }

    return (
        <Card>
            <CardHeader
                avatar={<Avatar src={creatorImageUrl} />}
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
                <Button 
                    variant="text" 
                    color="primary"
                    disableRipple 
                    onClick={() => handleSetHotdogDetailsId()}
                >
                    View details
                </Button>
            </CardActions>
        </Card>
    );
});

export default HotdogCard;
