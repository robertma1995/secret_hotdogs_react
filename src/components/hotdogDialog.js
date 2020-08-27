import React, { useState } from 'react';
import { 
    Avatar, Box, Button, Grid, Paper, Typography,
    Card, CardHeader, CardContent,
    Dialog, DialogContent, DialogContentText, DialogTitle, 
    List, ListItem, ListItemIcon, ListItemText, ListSubheader,
} from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import OutdoorGrillIcon from '@material-ui/icons/OutdoorGrill';
import WavesIcon from '@material-ui/icons/Waves';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { makeStyles } from '@material-ui/core/styles';

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
    // column 1 = "image", column 2 = 3 * "gridItem", 
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
        color: 'rgba(0, 0, 0, 0.70)'
    }
}));

/*
    TODO: for now, make center column look exactly like hotdogCard
*/
function Topping(props) {
    const { index, last, value } = props;
    if (index === 0) {
        return (
            <ListItem divider={index === last}>
                <ListItemIcon>
                    <ShoppingCartIcon/>
                </ListItemIcon>
                <ListItemText primary={value}/>
            </ListItem>
        );
    } else {
        return (
            <ListItem divider={index === last}>
                <ListItemText inset primary={value !== "" ? value : <br/>}/>
            </ListItem>
        );
    }
}

/* 
    TODO: consider using only one dialog on home that takes in hotdog id as input
*/
function HotdogDialog(props) {
    const { creatorName, description, ingredients, title, subheader } = props;
    const toppings = ingredients["toppings"];
    const classes = useStyles();
    const [open, setOpen] = useState(true);

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
                    <Grid 
                        container 
                        justify="space-between" 
                        alignItems="center"
                        className={classes.grid}
                        spacing={1}
                    >
                        <Grid item xs={4} className={classes.height}>
                            <Box 
                                display="flex" 
                                flexDirection="column" 
                                justifyContent="center" 
                                height="100%"
                            >
                                <img 
                                    alt="hotdog" 
                                    src="https://www.svgrepo.com/show/133687/hot-dog.svg" 
                                    className={classes.image}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={4} className={classes.height}>
                            {/* TODO: vertial grid, first section = cardheader, second section = description, third section = ingredients */}
                            <Paper className={classes.height}>
                                <Grid 
                                    container 
                                    direction="column" 
                                    justify="flex-start"
                                    className={classes.grid}
                                >
                                    <Grid item style={{ minWidth: '100%' }}>
                                        <CardHeader
                                            avatar={
                                                <Avatar>
                                                    {creatorName.charAt(0).toUpperCase()}
                                                </Avatar>
                                            }
                                            title={title + " by " + creatorName}
                                            subheader={subheader}
                                        />
                                    </Grid>
                                    <Grid item className={classes.gridItem}>
                                        <Typography variant="body2" className={classes.description}>
                                            {description}
                                        </Typography>
                                    </Grid>
                                    <Grid item className={classes.gridItem}>
                                        <List dense disablePadding subheader={<ListSubheader color="primary"> Ingredients </ListSubheader>}>
                                            <ListItem divider>
                                                <ListItemIcon>
                                                    <OutdoorGrillIcon/>
                                                </ListItemIcon>
                                                <ListItemText primary={ingredients["sausage"]}/>
                                            </ListItem>
                                            <ListItem divider>
                                                <ListItemIcon>
                                                    <WavesIcon/>
                                                </ListItemIcon>
                                                <ListItemText primary={ingredients["sauce"]}/>
                                            </ListItem>
                                            { toppings.map((topping, i) => (
                                                <Topping 
                                                    key={i}
                                                    index={i}
                                                    last={toppings.length-1}
                                                    value={topping}
                                                />
                                            ))}
                                        </List>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid item xs={4} className={classes.height}>
                            <Paper className={classes.height}>
                                {/* TODO: comments go here - placeholder for now */}
                                <Grid 
                                    container 
                                    direction="column" 
                                    justify="flex-start"
                                    className={classes.grid}
                                >
                                    <Grid item className={classes.gridItem}>
                                        <p> HELLO </p>
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
