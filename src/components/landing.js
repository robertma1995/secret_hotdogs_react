import React from 'react';
import { Box, Button, Container, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
// my components
import RouterLink from './routerLink';
import { PageTitle } from '../components'; 
// routing
import * as routes from '../utils/routes';

// TODO: narrow down to one option
const backgroundImageA = "https://res.cloudinary.com/noctisvirtus/image/upload/b_rgb:000000,o_30/v1590980759/hotdog_a.jpg";
const backgroundImageB = "https://res.cloudinary.com/noctisvirtus/image/upload/b_rgb:000000,o_15/v1590981061/hotdog_b.jpg";

const useStyles = makeStyles((theme) => ({
    background: {
        backgroundImage: `url(${backgroundImageB})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100%',
        backgroundSize: 'cover',
    },
    wrapper: {
        height: '100%',
    },
    // rest of styling copy-pasted from template
    button: {
      minWidth: '200px'
    },
    span: {
        width: '73px',
        height: '4px',
        marginTop: '8px',
        marginRight: 'auto',
        marginBottom: '0px',
        marginLeft: 'auto',
        display: 'block',
        backgroundColor: '#cbb09c'
    },
    // last line changes behaviour when window larger than certain size ('sm')
    message: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4),
        [theme.breakpoints.up('sm')]: {
            marginTop: theme.spacing(10),
        }
    }
}));

// TODO: fancy looking welcome page
// template preview: https://material-ui.com/premium-themes/onepirate/
// template source: https://github.com/mui-org/material-ui/blob/master/docs/src/pages/premium-themes/onepirate/Home.js
function Landing() {
    const classes = useStyles();
    return (
        <Container maxWidth={false} className={classes.background}>
            <Box
                className={classes.wrapper}
                display="flex"
                flexDirection="column"
                justifyContent="center"
            >
                <Typography align="center" color="secondary" variant="h2">
                    EXPRESS YOUR TASTE
                    <span className={classes.span}></span>
                </Typography>
                <Typography
                    className={classes.message}
                    align="center" 
                    color="secondary" 
                    variant="body1"
                >
                    Discover secret hotdog recipes from people across the world
                </Typography>
                <Box display="flex" flexDirection="row" justifyContent="center">
                    <Button
                        className={classes.button}
                        color="primary"
                        variant="contained"
                        size="large"
                    >
                        <RouterLink color="secondary" underline="none" to={routes.REGISTER}>
                            Sign Up
                        </RouterLink>
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

/*

*/

export default Landing;
