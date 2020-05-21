import React, { useContext, useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { UserContext } from '../userContext';
import HotdogCard from './hotdogCard';

function HomeHotdogGrid() {
    // context + state variables
    const { userId } = useContext(UserContext);
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
                <Grid item key={hotdog.id} xs={4}>
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
