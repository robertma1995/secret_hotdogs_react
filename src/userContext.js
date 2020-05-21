import React, { useEffect, useState } from 'react';

// User context - currently only holds the id of the currently logged in user
// id is set to null if not logged in

// note: https://stackoverflow.com/questions/54738681/how-to-change-context-value-while-using-react-hook-of-usecontext
// Provider is still needed to wrap around App.js
// if no provider is given, then useContext will simply take the default value of createContext() 
// rather than the current value

// import UserContext inside a child component
const UserContext = React.createContext();

// import UserContextProvider wrapper in App.js (parent)
function UserContextProvider(props) {
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState(null);

    function setCurrentUserId(id) {
        setUserId(userId => id);
    }

    function setCurrentUserName(name) {
        setUserName(userName => name);
    }
    
    // persist context if page refreshes/rerouted to different page
    useEffect(() => {
        const id = sessionStorage.getItem('userId');
        const name = sessionStorage.getItem('userName');
        setUserId(id);
        setUserName(name);
    }, []);

    // save context to session whenever variable changes, remove if set to null
    useEffect(() => {
        if (userId === null) {
            sessionStorage.removeItem('userId');
        } else {
            sessionStorage.setItem('userId', userId);
        }
    }, [userId]);

    useEffect(() => {
        if (userName === null) {
            sessionStorage.removeItem('userName');
        } else {
            sessionStorage.setItem('userName', userName);
        }
    }, [userName]);

    return (
        <UserContext.Provider value={{ userId, setCurrentUserId, userName, setCurrentUserName }}>
            {props.children}
        </UserContext.Provider>
    );
}

export {
    UserContext,
    UserContextProvider,
};