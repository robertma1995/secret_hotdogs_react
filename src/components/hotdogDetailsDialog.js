import React, { useEffect, useState } from 'react';
import { 
    Avatar, Box, Button, CircularProgress, Grid, IconButton, Paper, Typography,
    Card, CardHeader, CardContent, CardMedia,
    Dialog, DialogContent 
} from '@material-ui/core';
import ButtonBase from '@material-ui/core/ButtonBase';
import { makeStyles } from '@material-ui/core/styles';
// my components
import HotdogFormDialog from './hotdogFormDialog';
import HotdogIngredientsList from './hotdogIngredientsList';
import Icon from '../utils/icons';
import constants from '../utils/constants';
import { secondsToDate } from '../utils/functions';
// database
import * as DB from '../database/wrapper';

const useStyles = makeStyles((theme) => ({
    dialogContent: {
        height: '700px'
    },
    // card darkens and shows icon on hover (i.e. same as imagebutton, but with a card)
    buttonBase: {
        width: '100%', 
        height: '100%',
        color: '#cbb09c'
    },
    cardWrapper : {
        position: 'relative',
        padding: 'unset',
        width: '100%', 
        height: '100%'
    },
    cardIcon: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: '-18px',
        marginLeft: '-18px',
        '&:hover': {
            cursor: 'pointer',    
        }
    },
    hover: {
        cursor: 'pointer',
        '-webkit-filter': 'brightness(35%)',
    },
    // restrict size of left half
    card: {
        width: '380px', 
        height: '100%'
    },
    // remove extra padding from bottom of mui's CardContent
    cardContent: {
        '&:last-child': {
            paddingBottom: 'unset'
        },
    },
    // add background to right half
    paper: {
        backgroundColor: '#f5f5f5',
        height: '100%'
    },
    grid: {
        height: '100%',
    },
    // description + comment section same padding as mui's CardHeader
    description: {
        color: 'rgba(0, 0, 0, 0.70)',
        paddingLeft: '16px',
        paddingRight: '30px',
    },
    comments: {
        paddingLeft: '16px',
        paddingRight: '30px',
    },
}));


/* 
    Given hotdog id, retrieves hotdog details, supports real-time edits
    setEditId used by HotdogGrid for fake real-time updates - passed down to HotdogFormDialog
*/
function HotdogDetailsDialog(props) {
    const { id, open, setOpen, setEditId } = props;
    // initial values to pass to hotdogformdialog
    const [creatorName, setCreatorName] = useState("");
    const [description, setDescription] = useState("");
    const [ingredients, setIngredients] = useState(null);
    const [title, setTitle] = useState("");
    const [subheader, setSubheader] = useState("");
    const [dialogHotdogImageUrl, setDialogHotdogImageUrl] = useState("");
    const [creatorImageUrl, setCreatorImageUrl] = useState("");
    const [loading, setLoading] = useState(true);
    // edit form 
    const [openForm, setOpenForm] = useState(false);
    const [hover, setHover] = useState(false);
    // snapshot listener - detach on dialog close by calling again
    const [unsubscribe, setUnsubscribe] = useState(null);

    const classes = useStyles();

    function handleOpenForm() {
        setOpenForm(true);
    }

    function handleMouseEnter() {
        setHover(true);
    }

    function handleMouseLeave() {
        setHover(false);
    }

    function handleClose() {
        setOpen(false);
        unsubscribe();
    }
    
    // get details on dialog open - allows consecutive opening of same hotdog (unlike id)
    useEffect(() => {
        if (open) {
            setLoading(true);
            (async () => {
                // non-realtime data (except hotdogImageUrl - still need to retrieve on initial open)
                let hotdogInitial = await DB.getHotdog(id);
                let hotdogUrl = await DB.getHotdogImage(id);
                let creatorUrl = await DB.getUserImage(hotdogInitial.creatorId);
                let creator = await DB.getUser(hotdogInitial.creatorId);
                setCreatorName(creator.name);
                setCreatorImageUrl(creatorUrl);
                setSubheader(secondsToDate(hotdogInitial.ts));
                setDialogHotdogImageUrl(hotdogUrl || constants.hotdogImageUrl);

                // get description, ingredients, and title in real-time
                // note: no need to get hotdog image url - pass setter down to hotdogFormDialog > hotdogForm
                // note: deletes from hotdogGrid will be caught by this listener - so ignore them
                /*
                let query = await DB.getHotdogQuery(id);
                query.onSnapshot(snapshot => {
                    console.log("hotdog snapshot changed!");
                    if (snapshot.exists) {
                        let hotdog = snapshot.data();
                        setDescription(hotdog.description);
                        setIngredients(hotdog.ingredients);
                        setTitle(hotdog.title);
                        setLoading(false);
                    } else {
                        console.log("deleted hotdog - ignore");
                    }
                });
                */
                const listener = DB.getHotdogQuery(id).onSnapshot(snapshot => {
                    console.log("hotdog snapshot changed!");
                    let hotdog = snapshot.data();
                    setDescription(hotdog.description);
                    setIngredients(hotdog.ingredients);
                    setTitle(hotdog.title);
                    setLoading(false);
                });
                // NOTE: have to wrap in anonymous function - https://medium.com/swlh/how-to-store-a-function-with-the-usestate-hook-in-react-8a88dd4eede1
                setUnsubscribe(() => listener);
            })();
        }
    }, [open]);

    return (
        <>
            <Dialog 
                fullWidth
                maxWidth="lg"
                open={open}
                onClose={() => handleClose()}
            >
                <DialogContent className={classes.dialogContent}>
                    <Box display="flex" flexDirection="row" height="100%" width="100%">
                        { loading && 
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
                        { !loading && 
                            <>
                                <Box height="100%">
                                    <ButtonBase className={classes.buttonBase}>
                                        <Box
                                            onMouseEnter={() => handleMouseEnter()}
                                            onMouseLeave={() => handleMouseLeave()} 
                                            onClick={() => handleOpenForm()}
                                            className={classes.cardWrapper}
                                        >
                                            <Card 
                                                elevation={0}
                                                square 
                                                className={
                                                    `${classes.card} ` +
                                                    (hover ? `${classes.hover}` : undefined)
                                                }
                                            >
                                                <CardMedia image={dialogHotdogImageUrl} />
                                                <CardContent className={classes.cardContent}>
                                                    { !loading && 
                                                        <HotdogIngredientsList 
                                                            sausage={ingredients["sausage"]}
                                                            sauce={ingredients["sauce"]}
                                                            toppings={ingredients["toppings"]}
                                                            dialog
                                                        />
                                                    }
                                                </CardContent>
                                            </Card>
                                            { hover &&
                                                <Icon color="primary" name="edit" size="large" className={classes.cardIcon} /> 
                                            }
                                        </Box>
                                    </ButtonBase>
                                    <HotdogFormDialog
                                        open={openForm}
                                        setOpen={setOpenForm}
                                        id={id}
                                        description={description}
                                        ingredients={ingredients}
                                        title={title}
                                        dialogHotdogImageUrl={dialogHotdogImageUrl}
                                        setDialogHotdogImageUrl={setDialogHotdogImageUrl}
                                        edit
                                        setEditId={setEditId}
                                    />
                                </Box>
                                <Box height="100%" flexGrow={1}>
                                    <Paper square elevation={0} className={classes.paper}>
                                        <Grid container direction="column" className={classes.grid}>
                                            <Grid item>
                                                <Box display="flex" flexDirection="row" width="100%">
                                                    <Box flexGrow={1}>
                                                        <CardHeader
                                                            avatar={<Avatar src={creatorImageUrl} />}
                                                            title={title + " by " + creatorName}
                                                            subheader={subheader}
                                                        />
                                                    </Box>
                                                    <Box>
                                                        <IconButton aria-label="close" onClick={() => handleClose()}>
                                                            <Icon name="close" />
                                                        </IconButton>
                                                    </Box>
                                                </Box>
                                                <Typography variant="body2" className={classes.description}>
                                                    {description}
                                                </Typography>
                                            </Grid>
                                            <Grid item className={classes.comments}>
                                                <p> COMMENTS GO HERE </p>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Box>

                            </>
                        }
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default HotdogDetailsDialog;
