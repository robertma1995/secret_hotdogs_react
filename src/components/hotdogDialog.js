import React, { useState } from 'react';
import { 
    Avatar, Box, Button, Grid, IconButton, Paper, Typography,
    Card, CardHeader, CardContent, CardMedia,
    Dialog, DialogContent 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Icon from '../utils/icons';
import HotdogIngredientsList from './hotdogIngredientsList';

const useStyles = makeStyles((theme) => ({
    dialogContent: {
        height: '700px'
    },
    // restrict size of left half and add inner padding
    card: {
        width: '370px',
        padding: '10px'
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
    TODO: consider using only one dialog on home that takes in hotdog id as input
*/
function HotdogDialog(props) {
    const { creatorName, description, ingredients, title, subheader } = props;
    const [open, setOpen] = useState(false);
    const classes = useStyles();

    function handleOpen() {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
    }

    return (
        <>
            <Button 
                variant="text" 
                color="primary" 
                onClick={() => handleOpen()}
            >
                View details
            </Button>
            <Dialog 
                fullWidth
                maxWidth="lg"
                open={open}
                onClose={() => handleClose()}
            >
                <DialogContent className={classes.dialogContent}>
                    <Box display="flex" flexDirection="row" height="100%" width="100%">
                        <Box height="100%" style={{ width: '390px' }}>
                            <Card elevation={0} className={classes.card}>
                                <CardMedia image="https://www.svgrepo.com/show/133687/hot-dog.svg" />
                                <CardContent className={classes.cardContent}>
                                    <HotdogIngredientsList 
                                        sausage={ingredients["sausage"]}
                                        sauce={ingredients["sauce"]}
                                        toppings={ingredients["toppings"]}
                                        dialog
                                    />
                                </CardContent>
                            </Card>
                        </Box>
                        <Box height="100%" flexGrow={1}>
                            <Paper square elevation={0} className={classes.paper}>
                                <Grid container direction="column" className={classes.grid}>
                                    <Grid item>
                                        <Box display="flex" flexDirection="row" width="100%">
                                            <Box flexGrow={1}>
                                                <CardHeader
                                                    avatar={
                                                        <Avatar>
                                                            {creatorName.charAt(0).toUpperCase()}
                                                        </Avatar>
                                                    }
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
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default HotdogDialog;
