import React from 'react';
import { Box, Container } from '@material-ui/core';
import { HomeHotdogGrid, PageTitle } from '../components'; 

function Home() {    
    return (
        <Container>
            <Box p={2}>
                <PageTitle text="Your Hotdogs"/>
            </Box>
            <HomeHotdogGrid/>
        </Container>
    );
}

export default Home;