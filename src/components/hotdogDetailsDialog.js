import React, { useState } from 'react';
import { 
    Avatar, Box, Button, Grid, IconButton, Paper, Typography,
    Card, CardHeader, CardContent, CardMedia,
    Dialog, DialogContent 
} from '@material-ui/core';
import ButtonBase from '@material-ui/core/ButtonBase';
import { makeStyles } from '@material-ui/core/styles';
// my components
import HotdogFormDialog from './hotdogFormDialog';
import HotdogIngredientsList from './hotdogIngredientsList';
import Icon from '../utils/icons';

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
    TODO: consider using only one dialog on home that takes in hotdog id as input
*/
function HotdogDetailsDialog(props) {
    const { 
        id, creatorId, creatorName, creatorProfileImageUrl,
        description, hotdogImageUrl, ingredients, title, subheader
    } = props;
    const [openForm, setOpenForm] = useState(false);
    const [hover, setHover] = useState(false);
    const [open, setOpen] = useState(false);
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
                disableRipple 
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
                                        <CardMedia image={hotdogImageUrl || "https://www.svgrepo.com/show/133687/hot-dog.svg"} />
                                        <CardContent className={classes.cardContent}>
                                            <HotdogIngredientsList 
                                                sausage={ingredients["sausage"]}
                                                sauce={ingredients["sauce"]}
                                                toppings={ingredients["toppings"]}
                                                dialog
                                            />
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
                                hotdogImageUrl={hotdogImageUrl}
                                ingredients={ingredients}
                                title={title}
                                edit
                            />
                        </Box>
                        <Box height="100%" flexGrow={1}>
                            <Paper square elevation={0} className={classes.paper}>
                                <Grid container direction="column" className={classes.grid}>
                                    <Grid item>
                                        <Box display="flex" flexDirection="row" width="100%">
                                            <Box flexGrow={1}>
                                                <CardHeader
                                                    avatar={<Avatar src={creatorProfileImageUrl} />}
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

export default HotdogDetailsDialog;
