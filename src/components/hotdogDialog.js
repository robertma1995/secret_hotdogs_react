import React, { useState } from 'react';
import { 
    Avatar,
    Button, 
    Grid,
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
        paddingTop: '5px!important',
        padding: '5px',
        height: '700px'
    },
    image: {
        // height: 500,
        // width: 500,
        maxHeight: "100%",
        maxWidth: "100%",
    },
    card: {
        height: "100%"
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
    const { title, ingredients, creatorName, subheader } = props;
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
            <Button variant="text" color="primary" onClick={() => handleOpen()}>
                View details
            </Button>
            <Dialog 
                fullWidth
                maxWidth="md"
                open={open}
                onClose={() => handleClose()}
            >
                <DialogContent className={classes.dialog}>
                    <Grid container justify="center" alignItems="center" style={{ height: '100%', width: '100%' }}>
                        <Grid item xs={4}>
                            <img 
                                alt="hotdog" 
                                src="https://www.svgrepo.com/show/133687/hot-dog.svg" 
                                className={classes.image}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            {/* TODO: vertial grid, first section = cardheader, second section = description */}
                            <Card square className={classes.card}>
                                <CardHeader
                                    avatar={
                                        <Avatar>
                                            {creatorName.charAt(0).toUpperCase()}
                                        </Avatar>
                                    }
                                    title={title + " by " + creatorName}
                                    subheader={subheader}
                                />
                                <CardContent>
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
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={4}>
                            {/* comments go here - placeholder for now */}
                            <p> HELLO </p>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default HotdogDialog;
