import React, { useContext, useEffect, useState } from 'react';
import { Box, Fab, Grid, CircularProgress, Typography } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { Waypoint } from 'react-waypoint';
// my components
import HotdogCard from './hotdogCard';
import AddFormDialog from './addFormDialog';
import Icon from '../utils/icons';
// context
import { UserContext } from '../userContext';
// database
import * as DB from '../database/wrapper';

/*
    given array of hotdogs, gets hotdog images and creator's profile image urls (in parallel)
*/
async function getImages(hotdogs) {
    var hd = [...hotdogs];
    await Promise.all(hd.map(async (formattedRow) => {
        const hotdogImageUrl = await DB.getHotdogImage(formattedRow.id);
        const profileImageurl = await DB.getUserProfileImage(formattedRow.creatorId);
        formattedRow["hotdogImageUrl"] = hotdogImageUrl;
        formattedRow["creatorProfileImageUrl"] = profileImageurl;
    }));
    return hd;
}

function HomeHotdogGrid() {
    // hotdogs: all hotdogs created by current user
    // hd: subset of hotdogs currently in view (infinite scroll)
    const { userId } = useContext(UserContext);
    const [hotdogs, setHotdogs] = useState([]);
    const [hd, setHd] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    // TODO: changing load behaviour
    const [changeType, setChangeType] = useState("added");
    const [length, setLength] = useState(0);

    function handleOpenAddDialog() {
        setOpenAddDialog(true);
    }

    // display hotdogs created by current user (reverse chronology)
    useEffect(() => {
        // console.log("CALLED");
        (async () => {
            let query = await DB.getHotdogsCreatedByQuery(userId);
            // set up snapshot listener
            query.onSnapshot(snapshot => {
                setLoading(true);
                // TODO: changing load behaviour
                setLength(Math.min(3, snapshot.docChanges().length));

                // onSnapshot returns a QuerySnapshot, docChanges gets all items on initial snapshot
                var changes = [];
                var type = "";
                for (const change of snapshot.docChanges()) {
                    var formattedRow = change.doc.data();
                    formattedRow["id"] = change.doc.id;
                    formattedRow["ts"] = change.doc.data().ts.seconds;
                    changes.push(formattedRow);
                    type = change.type;
                    // TODO: changing load behaviour
                    if (change.type === "removed") setChangeType(change.type);
                }

                // get all hotdog images and creator profile images (returns when all promises resolved)            
                getImages(changes)
                .then(res => {
                    // console.log(res);
                    // sort only on first render
                    // prepend new hotdog(s), or filter out deleted hotdog based on id
                    if (res.length > 1) {
                        res.sort((a, b) => {
                            return b.ts - a.ts;
                        });
                        setHotdogs(res);
                        setHd(res.slice(0, 3));
                    } else if (res.length === 1) {
                        if (type === "added") {
                            setHotdogs(oldHotdogs => [...res, ...oldHotdogs]);
                            setHd(oldHotdogs => [...res, ...oldHotdogs]);
                        } else if (type === "removed") {
                            setHotdogs(oldHotdogs => oldHotdogs.filter(hotdog => hotdog.id !== res[0].id));
                            setHd(oldHotdogs => oldHotdogs.filter(hotdog => hotdog.id !== res[0].id));
                        }
                    }
                    setLoading(false);
                });
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
            <Grid container spacing={3} style={{ height: '100%' }}>
                {/* loading finished, but no hotdogs yet */}
                { !loading && hd.length === 0 &&
                    <Grid item xs={12}>
                        <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            height="100%"
                            width="100%"
                        >
                            <Typography variant="h6" color="primary">
                                No hotdogs yet! Click on the bottom right <AddCircleIcon /> to post your first hotdog
                            </Typography>
                        </Box>
                    </Grid>
                }
                {/* adds a spinner loader for each hotdog before the creator avatars are retrieved */}
                { loading && changeType === "added" && [...Array(length)].map((e, i) => (
                    <Grid item key={i} xs={4}>
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
                    </Grid>
                ))}
                {/* 
                    NOTE: adding !loading condition below will allow spinner to show on removal of hotdog, 
                    but old cards will be (uselessly) re-rendered,
                    hence still need the type === "added" condition in above section
                */}
                { hd.length !== 0 && hd.map((hotdog, i) => (
                    <Grid item key={hotdog.id} xs={4}>
                        {/* 
                            TODO: the above spinner loader breaks the waypoints - loads everything at once, 
                            so need to improve fetching method (react-visualizer maybe)
                        */}
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
                            hotdogImageUrl={hotdog.hotdogImageUrl}
                            ingredients={hotdog.ingredients}
                            title={hotdog.title}
                            ts={hotdog.ts}
                        />
                    </Grid>
                ))}
            </Grid>
            <Fab
                aria-label="Add a hotdog"
                color="primary"
                onClick={() => handleOpenAddDialog()}
                style={{ 
                    position: 'fixed', 
                    bottom: '15px', 
                    right: '15px' 
                }} 
            >
                <Icon name="plus" color="secondary" />
            </Fab>
            <AddFormDialog open={openAddDialog} setOpen={setOpenAddDialog} />
        </Box>
    );
}

export default HomeHotdogGrid;
