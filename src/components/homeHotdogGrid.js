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

/*
*/
async function getImages(c) {
    var changes = [...c];
    await Promise.all(changes.map(async (formattedRow) => {
        const url = await DB.getUserProfileImage(formattedRow.creatorId);
        formattedRow["creatorProfileImageUrl"] = url;
    }));
    return changes;
}

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
                
                /*
                */
                snapshot.docChanges().forEach(change => {
                    var formattedRow = change.doc.data();
                    formattedRow["id"] = change.doc.id;
                    formattedRow["ts"] = change.doc.data().ts.seconds;
                    changes.push(formattedRow);
                    changeType = change.type;
                });
                
                // TODO: PREVENTS EMPTY AVATAR, BUT SLOW - first, prevent re-rendering of old hotdog cards when a new one is added/removed
                /*
                (async () => {
                    for (const change of snapshot.docChanges()) {
                        var formattedRow = change.doc.data();
                        formattedRow["id"] = change.doc.id;
                        formattedRow["ts"] = change.doc.data().ts.seconds;
                        const url = await DB.getUserProfileImage(formattedRow.creatorId);
                        formattedRow["creatorProfileImageUrl"] = url;
                        changes.push(formattedRow);
                        changeType = change.type;
                    }
                    if (changes.length > 1) {
                        changes.sort((a, b) => {
                            return b.ts - a.ts;
                        });
                        setHotdogs(changes);
                        setHd(changes.slice(0, 3));
                    } else if (changes.length === 1) {
                        if (changeType === "added") {
                            setHotdogs(oldHotdogs => [...changes, ...oldHotdogs]);
                            setHd(oldHotdogs => [...changes, ...oldHotdogs]);
                        } else if (changeType === "removed") {
                            setHotdogs(oldHotdogs => oldHotdogs.filter(hotdog => hotdog.id !== changes[0].id));
                            setHd(oldHotdogs => oldHotdogs.filter(hotdog => hotdog.id !== changes[0].id));
                        }
                    }
                    // prepend new hotdog(s), or filter out deleted hotdog based on id
                    setLoading(false);
                })();
                */


                // get all creator profile images (returns when all promises resolved)
                // TODO: PREVENTS EMPTY AVATAR, BUT SLOW - first, prevent re-rendering of old hotdog cards when a new one is added/removed
                
                getImages(changes)
                .then(res => {
                    console.log(res);
                    if (res.length > 1) {
                        res.sort((a, b) => {
                            return b.ts - a.ts;
                        });
                        setHotdogs(res);
                        setHd(res.slice(0, 3));
                    } else if (res.length === 1) {
                        if (changeType === "added") {
                            setHotdogs(oldHotdogs => [...res, ...oldHotdogs]);
                            setHd(oldHotdogs => [...res, ...oldHotdogs]);
                        } else if (changeType === "removed") {
                            setHotdogs(oldHotdogs => oldHotdogs.filter(hotdog => hotdog.id !== res[0].id));
                            setHd(oldHotdogs => oldHotdogs.filter(hotdog => hotdog.id !== res[0].id));
                        }
                    }
                    // prepend new hotdog(s), or filter out deleted hotdog based on id
                    setLoading(false);
                });
               
               
                // console.log("CHANGES:");
                // console.log(changes);
                // sort on the first render - only one hotdog added/removed at a time for successive renders
                /* 
                if (changes.length > 1) {
                    changes.sort((a, b) => {
                        return b.ts - a.ts;
                    });
                    setHotdogs(changes);
                    setHd(changes.slice(0, 3));
                } else if (changes.length === 1) {
                    if (changeType === "added") {
                        setHotdogs(oldHotdogs => [...changes, ...oldHotdogs]);
                        setHd(oldHotdogs => [...changes, ...oldHotdogs]);
                    } else if (changeType === "removed") {
                        setHotdogs(oldHotdogs => oldHotdogs.filter(hotdog => hotdog.id !== changes[0].id));
                        setHd(oldHotdogs => oldHotdogs.filter(hotdog => hotdog.id !== changes[0].id));
                    }
                }
                // prepend new hotdog(s), or filter out deleted hotdog based on id
                setLoading(false);
                */
            });
        })();
    }, [userId]);

    // adds 3 more items from hotdogs list given index of next hotdog to render
    // TODO: improve fetching method - two sets of hotdog state vars is confusing
    // (currently no better solution if want infinite scrolling )
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
            {/* { !loading && hotdogs.length === 0 && */}
            {/*     <Box */}
            {/*         display="flex" */}
            {/*         flexDirection="column" */}
            {/*         justifyContent="center" */}
            {/*         alignItems="center" */}
            {/*         height="100%" */}
            {/*         width="100%" */}
            {/*     > */}
            {/*         <Typography variant="h6" color="primary"> */}
            {/*             No hotdogs yet! Click on the bottom right <AddCircleIcon/> to post your first hotdog */}
            {/*         </Typography> */}
            {/*     </Box> */}
            {/* } */}
            {/* { !loading && hotdogs.length !== 0 && */}
            {/*     // for every third hotdog scrolled past, fetch the next 3 */}
            {/*     // only fetch more if waypoint index is greater than the current length of hd */}
            {/*     <Grid container spacing={3}> */}
            {/*         { hd.map((hotdog, i) => ( */}
            {/*             <Grid item key={hotdog.id} xs={4}> */}
            {/*                 { (i+1) % 3 === 0 &&  */}
            {/*                   (i+1) >= hd.length &&  */}
            {/*                   hd.length < hotdogs.length && */}
            {/*                     <Waypoint onEnter={() => fetchMore(i+1)}/> */}
            {/*                 } */}
            {/*                 <HotdogCard */}
            {/*                     id={hotdog.id} */}
            {/*                     creatorId={hotdog.creatorId} */}
            {/*                     creatorName={hotdog.creatorName} */}
            {/*                     creatorProfileImageUrl={hotdog.creatorProfileImageUrl} */}
            {/*                     description={hotdog.description} */}
            {/*                     ingredients={hotdog.ingredients} */}
            {/*                     title={hotdog.title} */}
            {/*                     ts={hotdog.ts} */}
            {/*                 /> */}
            {/*             </Grid> */}
            {/*         ))} */}
            {/*     </Grid> */}
            {/* } */}
            { hotdogs.length !== 0 && 
                <Grid container spacing={3}>
                    { hd.map((hotdog, i) => (
                        <Grid item key={hotdog.id} xs={4}>
                            { (i+1) % 3 === 0 && 
                              (i+1) >= hd.length && 
                              hd.length < hotdogs.length &&
                                <Waypoint onEnter={() => fetchMore(i+1)}/>
                            }
                            <HotdogCard
                                id={hotdog.id}
                                creatorId={hotdog.creatorId}
                                creatorName={hotdog.creatorName}
                                creatorProfileImageUrl={hotdog.creatorProfileImageUrl}
                                description={hotdog.description}
                                ingredients={hotdog.ingredients}
                                title={hotdog.title}
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
