import React, { useContext, useEffect, useState } from 'react';
import { Box, Fab, Grid, CircularProgress, LinearProgress, Typography } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { Waypoint } from 'react-waypoint';
import { makeStyles } from '@material-ui/core/styles';
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

const useStyles = makeStyles((theme) => ({
    // allow card overlay to use position:absolute
    cardWrapper: {
        position:'relative'
    },
    // covers card image and text, fades out after 10s
    cardOverlay: {
        position: 'absolute',
        top: '0',
        left: '0',
        height: '100%',
        width: '100%',
        zIndex: 2,
        borderRadius: '4px',
        boxSizing: 'border-box',
        animation: `$fadeOut 10s linear`,
    }, 
    "@keyframes fadeOut": {
        "0%": {
            border: '2px solid rgba(0, 230, 118, 1)',
            backgroundColor: 'rgba(0, 230, 118, 0.3)',
        },
        "100%": {
            border: '2px solid rgba(0, 230, 118, 0)',
            backgroundColor: 'transparent'
        }
    },
    // add hotdog button covers cardOverlay
    fab: {
        position: 'fixed', 
        bottom: '15px', 
        right: '15px',
        zIndex: 3
    },
    // loading bar + wrapper
    progressWrapper: {
        height: '50px'
    },
    progress: {
        height: '5px', 
        width: '85%'
    },
    // lines left and right of end text
    endTextWrapper: {
        width: '85%',
        lineHeight: '0.1em', 
        borderBottom: '1px solid', 
    },
    // same color as background, padding to prevent line from passing through text
    endText: {
        background: '#f5f5f5', 
        padding: '0 10px'
    },
    fullHeight: {
        height: '100%'
    }
}));

/*
    given array of hotdogs, gets hotdog images, creator's profile image and name
*/
async function getImages(hotdogs) {
    let hd = [...hotdogs];
    await Promise.all(hd.map(async (h) => {
        const hotdogImageUrl = await DB.getHotdogImage(h.id);
        const creatorImageUrl = await DB.getUserImage(h.creatorId);
        const creator = await DB.getUser(h.creatorId);
        h["hotdogImageUrl"] = hotdogImageUrl || constants.hotdogImageUrl;
        h["creatorImageUrl"] = creatorImageUrl;
        h["creatorName"] = creator.name;
    }));
    return hd;
}

function HomeHotdogGrid() {
    const { userId } = useContext(UserContext);
    const [hotdogs, setHotdogs] = useState([]);
    const classes = useStyles();
    // add form
    const [openAddDialog, setOpenAddDialog] = useState(false);
    // hotdog details dialog
    const [hotdogDetailsId, setHotdogDetailsId] = useState("");
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    // pagination/fetching
    const maxColumns = 3;
    const [fetchCount, setFetchCount] = useState(maxColumns);
    const [lastSnapshot, setLastSnapshot] = useState(null);
    const [fetchLoading, setFetchLoading] = useState(true);
    // add (HotdogFormDialog > HotdogForm), 
    // delete (HotdogCard), 
    // edit (HotdogDetailsDialog > HotdogFormDialog > HotdogForm) hotdog in fake real-time
    const [addId, setAddId] = useState("");
    const [addLoading, setAddLoading] = useState(false);
    const [editId, setEditId] = useState("");
    const [deleteId, setDeleteId] = useState("");

    function handleOpenDetailsDialog() {
        setOpenDetailsDialog(true);
    }

    function handleOpenAddDialog() {
        setOpenAddDialog(true);
    }

    // hovering over hotdog unsets editId to allow consecutive edits of same hotdog 
    // note: hovering over a newly added hotdog will also unset editId - fine for now
    function handleCardHover(event) {
        event.target["className"] = "";
        setEditId("");
    }

    function fetchMore() {
        setFetchLoading(true);
        let q = DB.getHotdogsNextQuery(userId, fetchCount);
        if (lastSnapshot) {
            q = q.startAfter(lastSnapshot);
            console.log("FETCHING FROM LAST SNAPSHOT: " + lastSnapshot.data().title);
        }
        (async () => {
            q.get().then(query => {
                // prevent next fetch call if reached end
                if (query.size < fetchCount) {
                    setFetchCount(0);
                }
                if (!query.empty) {
                    let next = [];
                    query.forEach(doc => {
                        let h = doc.data();
                        h["id"] = doc.id;
                        h["ts"] = doc.data().ts.seconds;
                        h["snapshot"] = doc;
                        next.push(h);
                    });
                    console.log("tried to fetch: " + fetchCount + ", returned: " + query.size);
                    // set startAfter cursor for next fetch call, append current
                    setLastSnapshot(next[next.length-1].snapshot);
                    getImages(next).then(res => {
                        setHotdogs(current => [...current, ...next]);
                        setFetchLoading(false);
                    });
                } else {
                    setFetchLoading(false);
                }
            }).catch(err => {
                console.log(err);
            });
        })();
    }

    /* 
        initial fetch call
    */
    useEffect(() => {
        fetchMore();
    }, [userId]);

    /* 
        used by fetchMore to always fill a row with 3 hotdog cards
        unless fetchCount === 0, i.e. rendered all user's hotdogs (set by fetchMore)
    */
    useEffect(() => {
        if (fetchCount !== 0) {
            setFetchCount(maxColumns - (hotdogs.length % maxColumns));
        }
    }, [hotdogs]);

    /* 
        fake real-time add
    */
    useEffect(() => {
        if (addId) {
            (async () => {
                setAddLoading(true);
                let h = await DB.getHotdogWithSnapshot(addId);
                h["id"] = addId;
                getImages([h]).then(res => {
                    setHotdogs(current => [res[0], ...current]);
                    setAddLoading(false);
                });
            })();
        }
    }, [addId]);

    /* 
        fake real-time edit - hover over edited hotdog to unset editId to allow consecutive edits
        note: startAfter seems to only look at the snapshot's id - doesn't look at the data at all,
        so no need to set a new lastSnapshot
    */
    useEffect(() => {
        if (editId) {
            (async () => {
                let h = await DB.getHotdogWithSnapshot(editId);
                h["id"] = editId;
                getImages([h]).then(res => {
                    setHotdogs(current => current.map(hotdog => hotdog.id === res[0].id ? res[0] : hotdog));
                });
            })();
        }
    }, [editId]);

    /*
        fake real-time delete
        finds previous snapshot if deleting last and there are still more hotdogs to fetch
    */
    useEffect(() => {
        if (deleteId) {
            if (deleteId === lastSnapshot.id && fetchCount !== 0) {
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
                setLastSnapshot(previousSnapshot);
            }
            (async () => {
                await DB.deleteHotdog(deleteId);
                await DB.deleteHotdogImage(deleteId);
                setHotdogs(current => current.filter(h => h.id !== deleteId));
            })();
        }
    }, [deleteId]);

    return (
        <Box height="100%" width="100%">
            <Grid container spacing={3} className={classes.fullHeight}>
                {/* load bar for newly added hotdog */}
                { addLoading &&
                    <Grid item xs={4}>
                        <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            height="100%"
                            width="100%"
                        >
                            <LinearProgress color="primary" className={classes.progress} />
                        </Box>
                    </Grid>
                }
                { hotdogs.length !== 0 && hotdogs.map((hotdog, i) => (
                    <Grid item key={hotdog.id} xs={4}>
                        <Box className={classes.cardWrapper}>
                            {/* overlay on adding/editing, disappears on hover or after a few seconds */}
                            {(hotdog.id === editId || hotdog.id === addId) &&
                                <div 
                                    className={classes.cardOverlay}
                                    onMouseEnter={(event) => handleCardHover(event)}
                                />
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
                                setDeleteId={setDeleteId}
                            />
                        </Box>
                        { fetchCount !== 0 && (i+1) === hotdogs.length &&
                            <Waypoint onEnter={() => fetchMore()}/>
                        }
                    </Grid>
                ))}
                {/* load bar for fetching next hotdogs */}
                { fetchLoading && 
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                        width="100%"
                        className={hotdogs.length === 0 ? classes.fullHeight : classes.progressWrapper}
                    >
                        <LinearProgress color="primary" className={classes.progress} />
                    </Box>
                }
                {/* show message if reached end of hotdogs */}
                { !fetchLoading && fetchCount === 0 && hotdogs.length !== 0 &&
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                        width="100%"
                        className={classes.progressWrapper}
                    >
                        <Typography color="textSecondary" align="center" className={classes.endTextWrapper}>
                            <span className={classes.endText}>
                                End
                            </span>
                        </Typography>
                    </Box>
                }
                {/* TODO: user has no hotdogs to begin with */}
                { !fetchLoading && fetchCount === 0 && hotdogs.length === 0 &&
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                        width="100%"
                        height="100%"
                    >
                        <Typography variant="h6" color="primary">
                            No hotdogs yet! Click on the bottom right <Icon name="plus" /> to post your first hotdog
                        </Typography>
                    </Box>
                }
            </Grid>
            <Fab
                aria-label="Add a hotdog"
                color="primary"
                onClick={() => handleOpenAddDialog()}
                className={classes.fab}
            >
                <Icon name="plus" color="secondary" />
            </Fab>
            <HotdogFormDialog 
                open={openAddDialog} 
                setOpen={setOpenAddDialog} 
                setAddId={setAddId}
            />
            { hotdogDetailsId && 
                <HotdogDetailsDialog 
                    id={hotdogDetailsId}
                    open={openDetailsDialog}
                    setOpen={setOpenDetailsDialog}
                    setEditId={setEditId}
                />
            }
        </Box>
    );
}

export default HomeHotdogGrid;
