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
    const { userId } = useContext(UserContext);
    const [hotdogs, setHotdogs] = useState([]);
    // add form
    const [openAddDialog, setOpenAddDialog] = useState(false);
    // hotdog details dialog
    const [hotdogDetailsId, setHotdogDetailsId] = useState("");
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    // TODO: improve fetching method
    const [length, setLength] = useState(0);
    const [loading, setLoading] = useState(true);
    const [lastSnapshot, setLastSnapshot] = useState(null);
    // TODO: deleting hotdog
    const [deleteId, setDeleteId] = useState("");

    function handleOpenDetailsDialog() {
        setOpenDetailsDialog(true);
    }

    function handleOpenAddDialog() {
        setOpenAddDialog(true);
    }

    // TODO: deleting hotdog
    useEffect(() => {
        if (deleteId) {
            console.log("DELETING HOTDOG " + deleteId);
        }
    }, [deleteId]);

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
        (async () => {
            // TODO: call fetchMore for initial 3 hotdogs
            fetchMore();
        })();
    }, [userId]);

    // TODO: improve fetching method
    function fetchMore() {
        const n = 3;
        console.log("FETCHING NEXT " + n + " HOTDOGS");
        (async() => {
            let query = await DB.getHotdogsNextQuery(userId, n);
            // TODO: testing startAfter query
            if (lastSnapshot) {
                console.log("fetch from last snapshot");
                query = query.startAfter(lastSnapshot);
            } else {
                console.log("initial fetch")
            }
            query.get().then(data => {
                let i = 1;
                let next = [];
                data.forEach(doc => {
                    let h = doc.data();
                    h["id"] = doc.id;
                    h["ts"] = doc.data().ts.seconds;
                    h["snapshot"] = doc;
                    next.push(h);
                    // if reached last document, set startAfter cursor
                    if (i === n) {
                        setLastSnapshot(doc);
                        console.log("update last snapshot: ");
                        console.log(doc.data());
                    }
                    i++;
                })
                console.log("next hotdogs: ");
                console.log(next);
                // TODO: get hotdog images before appending

                // append next n hotdogs
                setHotdogs(current => [...current, ...next]);
            }).catch(err => {
                console.log(err);
            })
        })();
    }

    // TODO: delete button on hotdogcard - sets state var in hotdogGrid, then hotdogGrid handles the deleting
    // useEffect depends on this id, set back to null, but only triggered if not null (i.e. set by clicking hotdogCard)
    // deleting also calls fetchMore for one hotdog to fill the "gap" created by the deleted hotdog 
    // (if no hotdogs left past the lastSnapshot, then gap remains)

    // TODO: fetchCount - if num hotdogs % 3 === 0, fetchCount = 3. Adding decreases fetchCount by 1, 
    // delete increases fetchCount by 1. 
    // Every time fetchMore is called, it uses fetchCount to determine how many hotdogs to fetch

    return (
        <Box height="100%" width="100%">
            <Grid container spacing={3} style={{ height: '100%' }}>
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
                        { (i+1) % 3 === 0 && (i+1) >= hotdogs.length && 
                            <Waypoint onEnter={() => fetchMore(i+1)}/>
                        }
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
