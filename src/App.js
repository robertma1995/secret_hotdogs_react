import React from 'react';
import './App.css';
// material ui
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
// routing
import { Switch, Route } from 'react-router-dom';
import * as routes from './utils/routes';
// context
import { UserContextProvider } from './userContext';
// my components/pages
import brandTheme from './utils/theme';
import { NavBar } from './components';
import { Home, Login, Register } from './pages';

const theme = createMuiTheme(brandTheme);

function App() {
    return (
        <UserContextProvider>
            <ThemeProvider theme={theme}>
                <NavBar/>
                <Switch>
                    <Route exact path={routes.HOME} component={Home}></Route>
                    <Route exact path={routes.LOGIN} component={Login}></Route>
                    <Route exact path={routes.REGISTER} component={Register}></Route>
                </Switch>
            </ThemeProvider>
        </UserContextProvider>
    );
}

export default App;
