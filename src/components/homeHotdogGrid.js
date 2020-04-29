import React, { useContext, useEffect, useState } from 'react';
import { Box, Grid } from '@material-ui/core';
import { UserContext } from '../userContext';
import HotdogCard from './hotdogCard';

function HomeHotdogGrid() {
    // context + state variables
    const { userId, setCurrentUserId } = useContext(UserContext);
    const [hotdogs, setHotdogs] = useState([]);

    // console.log("home.js: userId = " + userId);

    // similar to componentDidMount
    useEffect(() => {
        async function callBackendApi () {
            const response = await fetch('/api/hotdogs');
            const hotdogs = await response.json();
            setHotdogs(hotdogs);
        }
        callBackendApi();
    });

    return (
        <Grid container spacing={3}>
            {hotdogs.map((hotdog) => (
                <Grid item xs={6}>
                    <HotdogCard
                        id={hotdog.id}
                        title={hotdog.title}
                        ingredients={hotdog.ingredients}
                        creator={hotdog.creator}
                        ts={hotdog.ts}
                    />
                </Grid>
            ))}
        </Grid>
    );
}

export default HomeHotdogGrid;
