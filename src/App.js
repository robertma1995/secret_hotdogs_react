import React from 'react';
import './App.css';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { Box, Container } from '@material-ui/core';
import NavBar from './components/navbar';
import Home from './components/home';
import { Switch, Route } from 'react-router-dom';
import * as routes from './routes';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#cbb09c'
        },
        secondary: {
            main: '#ffffff'
        },
        text: {
            primary: '#9e9e9e',
        },
    },
    overrides: {
        // white button text - contained Button "color" only changes background color
        MuiButton: {
            containedPrimary: {
                color: '#ffffff'
            }
        }
    }
});

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
                </Container>
            </Box>
        </ThemeProvider>
    );
}

export default App;
