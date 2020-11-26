import React, { useContext } from 'react';
import { Box, Container } from '@material-ui/core';
import { HomeHotdogGrid, Landing, PageTitle } from '../components';
// context
import { UserContext } from '../userContext';
import { HotdogGrid } from '../components'; 

// if not logged in, show welcome page; show hotdog grid otherwise
function Home() {
    const { userId } = useContext(UserContext);
    if (!userId) {
        return (
            <Landing/>
        );
    } else if (userId) {
        return (
            <Container maxWidth="lg">
                <Box display="flex" flexDirection="column" height="100%">
                    <Box p={5} display="flex" flexDirection="row" justifyContent="center">
                        <PageTitle text="Your Hotdogs"/>
                    </Box>
                    <Box display="flex" flexDirection="row" justifyContent="center" flexGrow={1} width="100%">
                        <HotdogGrid/>
                    </Box>
                </Box>
            </Container>
        );
    }
}

export default Home;
