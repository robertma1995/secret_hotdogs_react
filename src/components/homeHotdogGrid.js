import React, { useContext, useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { UserContext } from '../userContext';
import HotdogCard from './hotdogCard';

function HomeHotdogGrid() {
    // context + state variables
    const { userId } = useContext(UserContext);
    const [hotdogs, setHotdogs] = useState([]);

    // console.log("home.js: userId = " + userId);

    // display hotdogs created by current user
    useEffect(() => {
        (async () => {
            const response = await fetch('/api/hotdogs/createdBy/' + userId);
            const hotdogsJson = await response.json();
            setHotdogs(hotdogsJson);
        })();
    });

    return (
        <Grid container spacing={3}>
            {hotdogs.map((hotdog) => (
                <Grid item key={hotdog.id} xs={4}>
                    <HotdogCard
                        id={hotdog.id}
                        title={hotdog.title}
                        // TODO: might not be able to pass json object through props
                        ingredients={hotdog.ingredients}
                        creatorId={hotdog.creatorId}
                        creatorName={hotdog.creatorName}
                        ts={hotdog.ts}
                    />
                </Grid>
            ))}
        </Grid>
    );
}

export default HomeHotdogGrid;
