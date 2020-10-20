import React, { useContext, useEffect, useState } from 'react';
import { Box, Fab, Grid, CircularProgress, Typography } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { Waypoint } from 'react-waypoint';
// my components
import HotdogCard from './hotdogCard';
import HotdogDetailsDialog from './hotdogDetailsDialog';
import HotdogFormDialog from './hotdogFormDialog';
import Icon from '../utils/icons';
import constants from '../utils/constants';
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
        const hotdogImageUrl = await DB.getHotdogImage(formattedRow["id"]);
        const creatorImageUrl = await DB.getUserImage(formattedRow["creatorId"]);
        const creator = await DB.getUser(formattedRow["creatorId"]);
        formattedRow["hotdogImageUrl"] = hotdogImageUrl || constants["hotdogImageUrl"];
        formattedRow["creatorImageUrl"] = creatorImageUrl;
        formattedRow["creatorName"] = creator["name"];
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
    // add form
    const [openAddDialog, setOpenAddDialog] = useState(false);
    // TODO: changing load behaviour
    const [changeType, setChangeType] = useState("added");
    const [length, setLength] = useState(0);
    // hotdog details dialog
    const [hotdogDetailsId, setHotdogDetailsId] = useState("");
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

    function handleOpenDetailsDialog() {
        setOpenDetailsDialog(true);
    }

    function handleOpenAddDialog() {
        setOpenAddDialog(true);
    }

    // display hotdogs created by current user (reverse chronology)
    /* 
        TODO: change loading behaviour
        - use one hotdog array instead of two
        - fetchmore should make a firebase call to fetch the next 3 results
            = less reads = less expensive on user data + less expensive on database
            currently reads all hotdogs created by user, then slices those results
        - new firebase function - get next X hotdogs: collection.where().orderBy().limit(X)
        - in fetchmore: ... .startAfter(lastDocumentSnapshot).get().then(data => foreach(doc): add hotdog to list, set lastDocumentSnapshot to last doc)
        - real-time: 
            adding: should be fine since only prepending 
                don't need to set lastDocumentSnapshot unless there's only one hotdog
            editing: should also be fine since not changing order of documents
                BUT if edited hotdog = startAfter cursor, then need to set lastDocumentSnapshot again
                since editing changes the fields (and therefore the document snapshot)
            deleting: will mess up the startAfter query cursor if correct hotdog deleted
                i.e. if happen to delete the hotdog document that startAfter cursor is pointing to
                (OR store documentSnapshot for each hotdog - if deleting the same hotdog as cursor, 
                then set lastDocumentSnapshot)
    */
    useEffect(() => {
        (async () => {
            let query = await DB.getHotdogsCreatedByQuery(userId);
            // set up snapshot listener
            query.onSnapshot(snapshot => {
                // TODO: either prevent this from triggering per edit, or use that somehow
                // console.log("CALLED");

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
                
                // TODO: temporary solution for adding new hotdog not immediately showing image
                // sleep allows hotdogForm more time to complete postHotdogImage database call
                // alternative: pass flag variable from grid to hotdogForm, hotdogForm sets flag,
                // and grid only starts getImages() call if the flag is true
                // will work, but makes code confusing
                const sleep = (ms) => {
                    return new Promise(resolve => setTimeout(resolve, ms));
                };
                sleep(500).then(() => {    
                    // get all hotdog images and creator profile images (returns when all promises resolved)            
                    getImages(changes).then(res => {
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
                            } else if (type === "modified") {
                                // TODO: temporary solution for editing in real-time
                                // remove unedited hotdog from old, then add newly edited hotdog
                                // doesn't work if editing image only, since query snapshot doesn't include image
                                setHotdogs(oldHotdogs => oldHotdogs.filter(hotdog => hotdog.id !== res[0].id));
                                setHd(oldHotdogs => oldHotdogs.filter(hotdog => hotdog.id !== res[0].id));
                                setHotdogs(oldHotdogs => [...res, ...oldHotdogs]);
                                setHd(oldHotdogs => [...res, ...oldHotdogs]);
                            }
                        }
                        setLoading(false);
                    });
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
                            so need to improve fetching method (react-virtualizer maybe)
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
                            creatorImageUrl={hotdog.creatorImageUrl}
                            description={hotdog.description}
                            hotdogImageUrl={hotdog.hotdogImageUrl}
                            ingredients={hotdog.ingredients}
                            title={hotdog.title}
                            ts={hotdog.ts}
                            setHotdogDetailsId={setHotdogDetailsId}
                            setOpenDetailsDialog={setOpenDetailsDialog}
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
            <HotdogFormDialog open={openAddDialog} setOpen={setOpenAddDialog} />
            { hotdogDetailsId && 
                <HotdogDetailsDialog 
                    id={hotdogDetailsId}
                    open={openDetailsDialog}
                    setOpen={setOpenDetailsDialog}
                />
            }
        </Box>
    );
}

export default HomeHotdogGrid;
