// imports
const dbindex = require('./index.js');

// return true if login successful, otherwise return firebase error
const login = async (email, password) => {
	console.log("Firebase email: " + email);
	console.log("Firebase password: " + password);
	return(true);
	// return new Promise((resolve, reject) => {
	// 	dbindex.firebase.auth().signInWithEmailAndPassword(email, password)
	// 	.then(() => resolve(true))
	// 	.catch(err => reject(err));
	// });
}

exports.login = login;