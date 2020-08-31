import React, { useState } from 'react';
import { 
    Avatar, Box, Button, Grid, IconButton, Paper, Typography,
    Card, CardHeader, CardContent, CardMedia,
    Dialog, DialogContent 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import icons from '../utils/icons';
import HotdogIngredientsList from './hotdogIngredientsList';

const useStyles = makeStyles((theme) => ({
    dialog: {
        paddingTop: 'unset!important',
        padding: 'unset',
        height: '700px'
    },
    // main grid + column styling
    grid: {
        height: '100%',
        width: '100%'
    },
    // only want padding on left half of dialog
    gridLeft: {
        padding: '10px',
        height: '100%'
    },
    gridRight: {
        backgroundColor: '#f5f5f5',
        height: '100%'
    },
    image: {
        maxHeight: '100%',
        maxWidth: '100%',
    },
    // remove extra padding from bottom of mui's CardContent
    cardContent: {
        '&:last-child': {
            paddingBottom: 'unset'
        },
    },
    // description + comment section same padding as mui's CardHeader
    description: {
        color: 'rgba(0, 0, 0, 0.70)',
        paddingLeft: '16px',
        paddingRight: '16px',  
    },
    comments: {
        paddingLeft: '16px',
        paddingRight: '16px',
    },
}));

/* 
    TODO: consider using only one dialog on home that takes in hotdog id as input
*/
function HotdogDialog(props) {
    const { creatorName, description, ingredients, title, subheader } = props;
    const numToppingColumns = 2;
    const numToppingRows = 5;
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
                maxWidth="md"
                open={open}
                onClose={() => handleClose()}
            >
                <DialogContent className={classes.dialog}>
                    <Grid container alignItems="center" className={classes.grid}>
                        <Grid item xs={5} className={classes.gridLeft}>
                            <Card elevation={0}>
                                <CardMedia image="https://www.svgrepo.com/show/133687/hot-dog.svg"/>
                                <CardContent className={classes.cardContent}>
                                    <HotdogIngredientsList 
                                        sausage={ingredients["sausage"]}
                                        sauce={ingredients["sauce"]}
                                        toppings={ingredients["toppings"]}
                                        numColumns={numToppingColumns}
                                        numRows={numToppingRows}
                                        dialog
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={7} className={classes.gridRight}>
                            <Paper square elevation={0} className={classes.gridRight}>
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
                                                    {icons["close"]}
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
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default HotdogDialog;
