import React from 'react';
import './App.css';
// material ui
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { Box, Container } from '@material-ui/core';
// routing
import { Switch, Route } from 'react-router-dom';
import * as routes from './utils/routes';
// my components/pages
import brandTheme from './utils/theme';
import { NavBar } from './components';
import { Home, Login } from './pages';

const theme = createMuiTheme(brandTheme);

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Box bgcolor="secondary.main">
                <Container maxWidth="md">
                    <NavBar/>
                </Container>
            </Box>
            <Box>
                <Container maxWidth="md">
                    <Route exact path={routes.HOME} component={Home}></Route>
                    <Route exact path={routes.LOGIN} component={Login}></Route>
                </Container>
            </Box>
        </ThemeProvider>
    );
}

export default App;
