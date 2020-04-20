import React, { useState } from 'react';

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
	const [userId, setUserId] = useState("initial id");

	function setCurrentUserId(id) {
		setUserId(userId => id);
	}

	return (
		<UserContext.Provider value={{ userId, setCurrentUserId }}>
			{props.children}
		</UserContext.Provider>
	);
}

export {
	UserContext,
	UserContextProvider,
};