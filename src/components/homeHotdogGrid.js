import React, { useContext, useEffect, useState } from 'react';
import { Box, Grid, CircularProgress } from '@material-ui/core';
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
    const [loading, setLoading] = useState(false);
    
    // display hotdogs created by current user
    // TODO: only renders once, so adding hotdogs won't update the grid anymore
    // - experiment with firestore realtime updates: https://firebase.google.com/docs/firestore/query-data/listen
    useEffect(() => {
        setLoading(true);
        console.log("CALLED");
        (async () => {
            const hotdogsJson = await apiGet("hotdogs/creator/" + userId);
            hotdogsJson.sort((a, b) => {
                return b.ts - a.ts;
            });
            setHotdogs(hotdogsJson);
            setLoading(false);
        })();
    }, [userId]);

    // TODO: infinite side scrolling cards instead of vertical scroll
    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            // alignItems="center"
            height="100%"
        >
            { loading && 
                <CircularProgress color="primary" size={100}/>
            }
            { !loading && 
                <Grid container spacing={3} style={{ height: '81vh', overflowY: 'auto'}}>
                    {hotdogs.map((hotdog) => (
                        <Grid item key={hotdog.id} xs={4}>
                            <HotdogCard
                                id={hotdog.id}
                                title={hotdog.title}
                                ingredients={hotdog.ingredients}
                                creatorName={hotdog.creatorName}
                                ts={hotdog.ts}
                            />
                        </Grid>
                    ))}
                </Grid>
            }
            <AddFormDialog/>
        </Box>
    );
}

/*
            { hotdogs && 
            }
*/
export default HomeHotdogGrid;
