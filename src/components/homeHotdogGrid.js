import React, { useContext, useCallback, useEffect, useState } from 'react';
import { Grid, Fab } from '@material-ui/core';
// my components
import HotdogCard from './hotdogCard';
import AddFormDialog from './addFormDialog';
// context
import { UserContext } from '../userContext';
// helper for accessing api
import { apiGet } from '../utils/apiHelper';

function HomeHotdogGrid() {
    const { userId } = useContext(UserContext);
    const [hotdogs, setHotdogs] = useState([]);

    // display hotdogs created by current user
    // TODO: only renders once, so adding hotdogs won't update the grid anymore
    // - experiment with firestore realtime updates: https://firebase.google.com/docs/firestore/query-data/listen
    useEffect(() => {
        console.log("CALLED");
        (async () => {
            const hotdogsJson = await apiGet("hotdogs/creator/" + userId);
            hotdogsJson.sort((a, b) => {
                return b.ts - a.ts;
            });
            setHotdogs(hotdogsJson);
        })();
    }, [userId]);

    // TODO: floating action button for adding hotdogs - opens AddFormDialog on click
    // think about FAB + addform dialog in one component rather than two as it is now

    return (
        <div>
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
            <AddFormDialog/>
        </div>
    );
}

export default HomeHotdogGrid;
