import React from 'react';
import { Box, Container, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { PageTitle } from '../components'; 
// routing
import * as routes from '../utils/routes';

// TODO: narrow down to one option
const backgroundImageA = "https://res.cloudinary.com/noctisvirtus/image/upload/b_rgb:000000,o_30/v1590980759/hotdog_a.jpg";
const backgroundImageB = "https://res.cloudinary.com/noctisvirtus/image/upload/b_rgb:000000,o_30/v1590981061/hotdog_b.jpg";

const useStyles = makeStyles((theme) => ({
    background: {
        backgroundImage: `url(${backgroundImageB})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100%',
        width: '100%',
        backgroundSize: 'cover',
        position: 'absolute',
    },
}));

// TODO: fancy looking welcome page
// template preview: https://material-ui.com/premium-themes/onepirate/
// template source: https://github.com/mui-org/material-ui/blob/master/docs/src/pages/premium-themes/onepirate/Home.js
function Landing() {
    const classes = useStyles();
    return (
       <Box>
            <Box className={classes.background}>
                <Container maxWidth="xs">
                    <Box 
                        display="flex" 
                        flexDirection="column"
                        justifyContent="center"
                        p={2}
                    >
                        <Typography align="center" color="secondary" variant="h2">
                            HELLO
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
}

/*

*/

export default Landing;
