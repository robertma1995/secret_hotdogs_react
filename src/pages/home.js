import React, { useContext } from 'react';
import { Box, Container } from '@material-ui/core';
import { HomeHotdogGrid, Landing, PageTitle } from '../components'; 
// routing
import * as routes from '../utils/routes';
// context
import { UserContext } from '../userContext';

// if not logged in, show welcome page; show hotdog grid otherwise
function Home() {
    const { userId } = useContext(UserContext);
    if (!userId) {
        return (
            <Landing/>
        );
    } else if (userId) {
        return (
            <Container maxWidth="md">
                <Box p={2}>
                    <PageTitle text="Your Hotdogs"/>
                </Box>
                <HomeHotdogGrid/>
            </Container>
        );
    }
}

export default Home;
