import React, { useContext } from 'react';
import { Box, Container } from '@material-ui/core';
import { HomeHotdogGrid, PageTitle } from '../components'; 
// routing
import { Redirect } from 'react-router-dom';
import * as routes from '../utils/routes';
// context
import { UserContext } from '../userContext';

function Home() {
    // redirect to login page if user not logged in
    const { userId } = useContext(UserContext);
    if (!userId) {
        return (
            <Redirect to={routes.LOGIN}/>
        );
    }

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
