import React, { useState } from 'react';
import { 
    Avatar, Box, Button, Grid, Paper, Typography,
    Card, CardHeader, CardContent, CardMedia,
    Dialog, DialogContent 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import HotdogIngredientsList from './hotdogIngredientsList';

const useStyles = makeStyles((theme) => ({
    dialog: {
        paddingTop: '12px!important',
        padding: '5px',
        height: '700px'
    },
    // main grid + column styling
    grid: {
        height: '100%',
        width: '100%'
    },
    height: {
        height: '100%',
    },
    image: {
        maxHeight: '100%',
        maxWidth: '100%',
    },
    gridItem: {
        minWidth: '100%',
        paddingLeft: '16px',
        paddingRight: '16px',
    },
    description: {
        color: 'rgba(0, 0, 0, 0.70)',
        paddingLeft: '16px',
        paddingRight: '16px',  
    }
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
                    {/* TODO: two columns - one column = hotdogCard without header, second column = cardheader + comments list */}
                    <Grid 
                        container 
                        justify="center" 
                        alignItems="center"
                        className={classes.grid}
                        spacing={1}
                    >
                        <Grid item xs={5} className={classes.height}>
                            <Box
                                display="flex" 
                                flexDirection="column" 
                                height="100%"
                            >
                                <Card elevation={0}>
                                    <CardMedia image="https://www.svgrepo.com/show/133687/hot-dog.svg"/>
                                    <CardContent>
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
                            </Box>
                        </Grid>
                        <Grid item xs={7} className={classes.height}>
                            <Paper className={classes.height}>
                                <Grid 
                                    container 
                                    direction="column" 
                                    className={classes.grid}
                                >
                                    <Grid item>
                                        <CardHeader
                                            avatar={
                                                <Avatar>
                                                    {creatorName.charAt(0).toUpperCase()}
                                                </Avatar>
                                            }
                                            title={title + " by " + creatorName}
                                            subheader={subheader}
                                        />
                                        <Typography 
                                            variant="body2" 
                                            className={classes.description}
                                        >
                                            {description}
                                        </Typography>
                                    </Grid>
                                    <Grid item className={classes.gridItem}>
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
