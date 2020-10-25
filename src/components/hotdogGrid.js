import React, { useContext, useEffect, useState } from 'react';
import { Box, Fab, Grid, CircularProgress, LinearProgress, Typography } from '@material-ui/core';
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
    given array of hotdogs, gets hotdog images, creator's profile image and name
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
    const { userId } = useContext(UserContext);
    const [hotdogs, setHotdogs] = useState([]);
    // add form
    const [openAddDialog, setOpenAddDialog] = useState(false);
    // hotdog details dialog
    const [hotdogDetailsId, setHotdogDetailsId] = useState("");
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    // TODO: improve fetching method
    const maxColumns = 3;
    const [fetchCount, setFetchCount] = useState(maxColumns);
    const [lastSnapshot, setLastSnapshot] = useState(null);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [changeLoading, setChangeLoading] = useState(false);
    // TODO: deleting hotdog
    const [deleteId, setDeleteId] = useState("");

    function handleOpenDetailsDialog() {
        setOpenDetailsDialog(true);
    }

    function handleOpenAddDialog() {
        setOpenAddDialog(true);
    }

    // TODO: improve fetching method
    async function fetchMore() {
        setFetchLoading(true);
        console.log("FETCHING NEXT " + fetchCount + " HOTDOGS");
        let q = await DB.getHotdogsNextQuery(userId, fetchCount);
        if (lastSnapshot) {
            console.log("fetch from last snapshot");
            console.log(lastSnapshot.data());
            q = q.startAfter(lastSnapshot);
        } else {
            console.log("initial fetch");
        }
        q.get().then(query => {
            let next = [];
            query.forEach(doc => {
                let h = doc.data();
                h["id"] = doc.id;
                h["ts"] = doc.data().ts.seconds;
                h["snapshot"] = doc;
                next.push(h);
            });
            // set startAfter cursor for next fetch call
            setLastSnapshot(next[next.length-1].snapshot);

            // prevent fetch calls if reached end
            if (next.length < fetchCount) {
                setFetchCount(0);
            }
            
            // append
            getImages(next).then(res => {
                setHotdogs(current => [...current, ...next]);
                setFetchLoading(false);
            })
        }).catch(err => {
            console.log(err);
        });
    }

    // display hotdogs created by current user (reverse chronology)
    /* 
        TODO: change loading behaviour
        - use one hotdog array instead of two, only need to use fetchMore
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
        fetchMore();
        // TODO: prevent onSnapshot from getting initial state 
        // currently no way to do this with firebase
        // option 1: use state variable to track if initial snapshot or not
        //  res: doesn't work - setInitialChange(false) is asynchronous - possible to not get set to false for next snapshot call
        // option 2: only listen after timestamp (i.e. now) - will need edits to update "ts"
        //  res: works, but change type will always be "added" since initial snapshot has nothing
        // option 2.1: don't use docChange.type, if change id doesn't exist, then "added"
        //  can't disntinguish between "modified" and "removed",
        //  don't track "modified" at all
        // option 3: fetchMore 1 snapshot listener per 3 hotdogs, then 1 snapshot listener here for all new adds/modifies/removes
        //  editing old hotdogs - might be weird to see newer hotdogs when scrolling down - doesn't preserve reverse chronology
        //  revert to old edit that doesn't change timestamp
        //  + prevent users from changing title (something "constant" - if users could edit everything in old posts, then somewhat removes the need to make new posts)
        (async () => {
            let q = await DB.getHotdogsCreatedByQuery(userId);
            q.onSnapshot(snapshot => {
                // ignore initial snapshot with 0 docs
                if (!snapshot.empty) {
                    setChangeLoading(true);
                    // onSnapshot returns a QuerySnapshot, docChanges gets all items on initial snapshot
                    const docChange = (snapshot.docChanges())[0];
                    let type = docChange.type;
                    let change = docChange.doc.data();
                    change["id"] = docChange.doc.id;
                    change["ts"] = change.ts.seconds;
                    console.log("change: hotdog id = " + change.id);
                    if (type === "added" || type === "modified") {
                        getImages([change]).then(res => {
                            const hotdog = res[0];
                            // TODO: only handling add for now
                            console.log(type);
                            if (type === "added") {
                                setHotdogs(current => [res[0], ...current]);
                            } else if (type === "modified") {
                                setHotdogs(current => current.map(h => h.id === hotdog.id ? {...hotdog} : h));
                            } else if (type === "removed") {
                                setHotdogs(current => current.filter(h => h.id !== hotdog.id));
                            }
                            setChangeLoading(false);
                        });
                    }
                }
            });
        })();
    }, [userId]);

    // TODO: fetchCount - if num hotdogs % 3 === 0, fetchCount = 3. 
    // Adding decreases fetchCount by 1, delete increases fetchCount by 1
    // Every time fetchMore is called, it uses fetchCount to determine how many hotdogs to fetch
    // (and therefore also how many loading spinners to render)
    // note: will always need waypoint at the end of hotdogs array, unless user has no more hotdogs to render
    // only call if haven't rendered all user's hotdogs
    useEffect(() => {
        if (fetchCount !== 0) {
            setFetchCount(maxColumns - (hotdogs.length % maxColumns));
        }
    }, [hotdogs]);

    // TODO: testing fetchCount
    useEffect(() => {
        console.log("new fetch count: " + fetchCount);
    }, [fetchCount]);

    // TODO: deleting hotdog
    useEffect(() => {
        if (deleteId) {
            console.log("DELETING HOTDOG " + deleteId);
            if (deleteId === lastSnapshot.id) {
                console.log("deleting last hotdog - find previous");
                let previousSnapshot = null;
                for (let i = 0; i < hotdogs.length; i++) {
                    let h = hotdogs[i];
                    if (h.id === deleteId) {
                        if (i !== 0) {
                            previousSnapshot = hotdogs[i-1].snapshot;
                        }
                        break;
                    }
                }
                // TODO: testing
                if (previousSnapshot) {
                    console.log(previousSnapshot.data());
                }
                setLastSnapshot(previousSnapshot);
            }
            // TODO: call backend delete (after real-time working)
        }
    }, [deleteId]);

    return (
        <Box height="100%" width="100%">
            <Grid container spacing={3} style={{ height: '100%' }}>
                { changeLoading &&
                    <Grid item xs={4}>
                        <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            height="100%"
                            width="100%"
                        >
                            <LinearProgress color="primary" style={{ height: '5px', width: '80%' }}/>
                        </Box>
                    </Grid>
                }
                { hotdogs.length !== 0 && hotdogs.map((hotdog, i) => (
                    <Grid item key={hotdog.id} xs={4}>
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
                            setDeleteId={setDeleteId}
                        />
                        { fetchCount !== 0 && (i+1) === hotdogs.length &&
                            <Waypoint onEnter={() => fetchMore()}/>
                        }
                    </Grid>
                ))}
                {/* TODO: separate loading state for real-time + fetching */}
                { fetchLoading && 
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                        width="100%"
                        style={hotdogs.length === 0 ? { height: '100%' } : { height: '50px' }}
                    >
                        <LinearProgress color="primary" style={{ height: '5px', width: '80%' }}/>
                    </Box>
                }
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