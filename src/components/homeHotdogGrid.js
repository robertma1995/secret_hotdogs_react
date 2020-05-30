import React, { useContext, useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { UserContext } from '../userContext';
import HotdogCard from './hotdogCard';
import { apiGet } from '../utils/apiHelper';

function HomeHotdogGrid() {
    // context + state variables
    const { userId } = useContext(UserContext);
    const [hotdogs, setHotdogs] = useState([]);

    // display hotdogs created by current user
    useEffect(() => {
        (async () => {
            const hotdogsJson = await apiGet("hotdogs/creator/" + userId);
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
