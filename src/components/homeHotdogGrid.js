import React, { useContext, useEffect, useState } from 'react';
import { Box, Grid, CircularProgress } from '@material-ui/core';
// my components
import HotdogCard from './hotdogCard';
import AddFormDialog from './addFormDialog';
// context
import { UserContext } from '../userContext';
// database
import * as DB from '../database/wrapper';

function HomeHotdogGrid() {
    const { userId } = useContext(UserContext);
    const [hotdogs, setHotdogs] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // display hotdogs created by current user (reverse chronology)
    // TODO: only renders once, so adding hotdogs won't update the grid anymore
    // - experiment with firestore realtime updates: https://firebase.google.com/docs/firestore/query-data/listen
    useEffect(() => {
        console.log("CALLED");
        (async () => {
            let query = await DB.getHotdogsCreatedByQuery(userId);
            // set up snapshot listener
            query.onSnapshot(snapshot => {
                // onSnapshot returns a QuerySnapshot, docChanges gets all items on initial snapshot
                var changes = [];
                var changeType = "";
                snapshot.docChanges().forEach(change => {
                    var formattedRow = change.doc.data();
                    formattedRow["id"] = change.doc.id;
                    formattedRow.ts = change.doc.data().ts.seconds;
                    changeType = change.type;
                    changes.push(formattedRow);
                });
                console.log("CHANGES:");
                console.log(changes);
                // sort on the first render - only one hotdog added/removed at a time for successive renders
                if (changes.length > 1) {
                    changes.sort((a, b) => {
                        return b.ts - a.ts;
                    });
                }
                // prepend new hotdog(s), or filter out deleted hotdog based on id
                if (changeType === "added") {
                    setHotdogs(oldHotdogs => [...changes, ...oldHotdogs]);
                } else if (changeType === "removed") {
                    setHotdogs(oldHotdogs => oldHotdogs.filter(hotdog => hotdog.id !== changes[0].id))
                }
                setLoading(false);
            });
        })();
    }, [userId]);

    // TODO: infinite side scrolling cards instead of vertical scroll
    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="100%"
            width="100%"
        >
            { loading && 
                <CircularProgress color="primary" size={100}/>
            }
            { !loading && 
                <Grid container spacing={3}>
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
*/
export default HomeHotdogGrid;
