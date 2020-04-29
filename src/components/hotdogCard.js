import React from 'react';
import { Card, CardHeader, CardMedia, CardContent, CardActions } from '@material-ui/core';

function HotdogCard(props) {
    const { id, title, ingredients, creator, ts } = props;

    return (
        <div>
            <p> {id} </p>
            <p> {title} </p>
            <p> {ingredients} </p>
            <p> {creator} </p>
            <p> {ts} </p>
        </div>
    );
}

export default HotdogCard;