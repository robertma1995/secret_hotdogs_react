import React, { useContext } from 'react';
import { Box, Container } from '@material-ui/core';
import { AddForm, PageTitle } from '../components';
// routing
import { Redirect } from 'react-router-dom';
import * as routes from '../utils/routes';
// context
import { UserContext } from '../userContext';

function Add() {
    // redirect to login page if not logged in
    const { userId } = useContext(UserContext);
    if (!userId) {
        return (
            <Redirect to={routes.LOGIN}/>
        );
    }

    return (
        <Container maxWidth="xs">
            <Box p={2}>
                <PageTitle text="Create a new hotdog"/>
            </Box>
            <AddForm/>
        </Container>
    );
}

export default Add;