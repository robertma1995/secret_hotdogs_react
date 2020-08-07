import React, { useContext, useEffect, useState } from 'react';
import { Box, Grid, CircularProgress, Typography } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { Waypoint } from 'react-waypoint';
// my components
import HotdogCard from './hotdogCard';
import AddFormDialog from './addFormDialog';
// context
import { UserContext } from '../userContext';
// database
import * as DB from '../database/wrapper';

function HomeHotdogGrid() {
    // hotdogs: all hotdogs created by current user
    // hd: subset of hotdogs currently in view (infinite scroll)
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
                // sort and set initial hotdog list on the first render - only one hotdog added/removed at a time for successive renders
                // changeType is always "added" on first render, so no need to check here
                if (changes.length > 1) {
                    changes.sort((a, b) => {
                        return b.ts - a.ts;
                    });
                    // TODO: does this need to be a state variable? only changes once, also not used directly for rendering
                    setHotdogs(oldHotdogs => [...changes, ...oldHotdogs]);
                }
                // prepend new hotdog(s), or filter out deleted hotdog based on id
                // TODO: only need to assign setHotdogs on initial call - following calls only need to be added/removed from "hd"
                if (changeType === "added") {
                    setHd(oldHd => [...changes, ...oldHd].slice(0, 3));
                } else if (changeType === "removed") {
                    setHd(oldHd => oldHd.filter(hotdog => hotdog.id !== changes[0].id));
                }
                setLoading(false);
            });
        })();
    }, [userId]);

    // adds 3 more items from hotdogs list given index of next hotdog to render
    // TODO: improve fetching method - two sets of hotdog state vars is confusing
    // option 1: make db call to get all hotdogs of user, sort, get the slice 
    //  - counter-intuitive, more complex than double state var method, still have to get all hotdogs
    function fetchMore(last) {
        console.log("LAST: " + last);
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
        <Box height="100%" width="100%">
            { loading && 
                // loading circle in center of section under page title
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    height="100%"
                    width="100%"
                >
                    <CircularProgress color="primary" size={100}/>
                </Box>
            }
            { !loading && hotdogs.length === 0 &&
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    height="100%"
                    width="100%"
                >
                    <Typography variant="h6" color="primary">
                        No hotdogs yet! Click on the bottom right <AddCircleIcon/> to post your first hotdog
                    </Typography>
                </Box>
            }
            { !loading && hotdogs.length !== 0 &&
                // for every third hotdog scrolled past, fetch the next 3
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
