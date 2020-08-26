import React from 'react';
import { Button } from '@material-ui/core';
/* 
    TODO: consider using only one dialog on home that takes in hotdog id as input
*/
function HotdogDialog(props) {
    return (
        <>
            <Button variant="text" color="primary">
                View details
            </Button>
        </>
    );
}

export default HotdogDialog;
