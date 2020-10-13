import React, { useEffect, useState } from 'react';

// note: https://stackoverflow.com/questions/54738681/how-to-change-context-value-while-using-react-hook-of-usecontext
// Provider is still needed to wrap around App.js
// if no provider is given, then useContext will simply take the default value of createContext() 
// rather than the current value

// import UserContext inside a child component
const UserContext = React.createContext();

// import UserContextProvider wrapper in App.js (parent)
function UserContextProvider(props) {
    const [userId, setUserId] = useState(null);

    function setCurrentUserId(id) {
        setUserId(userId => id);
    }
    
    // persist context if page refreshes/rerouted to different page
    useEffect(() => {
        const id = sessionStorage.getItem('userId');
        setUserId(id);
    }, []);

    // save context to session whenever variable changes, remove if set to null
    useEffect(() => {
        if (userId === null) {
            sessionStorage.removeItem('userId');
        } else {
            sessionStorage.setItem('userId', userId);
        }
    }, [userId]);

    return (
        <UserContext.Provider value={{ userId, setCurrentUserId }}>
            {props.children}
        </UserContext.Provider>
    );
}

export {
    UserContext,
    UserContextProvider,
}
