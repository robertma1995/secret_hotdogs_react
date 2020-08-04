import React, { useContext, useEffect, useState } from 'react';
import { Box, Grid, CircularProgress, Typography } from '@material-ui/core';
import { Waypoint } from 'react-waypoint';
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
    const [hd, setHd] = useState([]);

    // display hotdogs created by current user (reverse chronology)
    useEffect(() => {
        // console.log("CALLED");
        (async () => {
            let query = await DB.getHotdogsCreatedByQuery(userId);
            // set up snapshot listener
            query.onSnapshot(snapshot => {
                setLoading(true);
                // onSnapshot returns a QuerySnapshot, docChanges gets all items on initial snapshot
                var changes = [];
                var changeType = "";
                snapshot.docChanges().forEach(change => {
                    var formattedRow = change.doc.data();
                    formattedRow["id"] = change.doc.id;
                    formattedRow.ts = change.doc.data().ts.seconds;
                    changes.push(formattedRow);
                    changeType = change.type;
                });
                // console.log("CHANGES:");
                // console.log(changes);
                // sort on the first render - only one hotdog added/removed at a time for successive renders
                if (changes.length > 1) {
                    changes.sort((a, b) => {
                        return b.ts - a.ts;
                    });
                }
                // prepend new hotdog(s), or filter out deleted hotdog based on id
                if (changeType === "added") {
                    setHotdogs(oldHotdogs => [...changes, ...oldHotdogs]);
                    setHd(oldHotdogs => [...changes, ...oldHotdogs].slice(0, 3));
                } else if (changeType === "removed") {
                    setHotdogs(oldHotdogs => oldHotdogs.filter(hotdog => hotdog.id !== changes[0].id));
                    setHd(oldHotdogs => oldHotdogs.filter(hotdog => hotdog.id !== changes[0].id));
                }
                setLoading(false);
            });
        })();
    }, [userId]);

    // adds 3 more items from hotdogs list given index of next hotdog to render
    // TODO: improve fetching method - two sets of hotdog state vars is confusing
    function fetchMore(last) {
        // console.log("LAST: " + last);
        // prevent overflow if last row of hotdogs
        var numItems = 3;
        if (last + numItems > hotdogs.length) {
            numItems = hotdogs.length - last;
        }
        var next = hotdogs.slice(last, last + numItems);
        // console.log(next);
        setHd(oldHotdogs => [...oldHotdogs, ...next]);
    }

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
            { !loading && hotdogs.length === 0 &&
                <Typography variant="h6" color="primary" align="center">
                    No hotdogs yet! Click the bottom right plus icon to post your first hotdog
                </Typography>
            }
            { !loading && hotdogs.length !== 0 &&
                <Grid container spacing={3}>
                    { hd.map((hotdog, i) => (
                        <Grid item key={hotdog.id} xs={4}>
                            { (i+1) % 3 === 0 && 
                              hd.length < hotdogs.length &&
                                <Waypoint onEnter={() => fetchMore(i+1)} />
                            }
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

export default HomeHotdogGrid;
