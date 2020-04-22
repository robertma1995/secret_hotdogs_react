// imports
const dbindex = require('./index.js');

// return user details if login successful, otherwise return firebase error
const login = async (email, password) => {
	return new Promise((resolve, reject) => {
		dbindex.firebase.auth().signInWithEmailAndPassword(email, password)
		.then(credential => {
			// credential is a UserCredential: https://firebase.google.com/docs/reference/js/firebase.auth#usercredential
			// TODO: send user details on successful login
			console.log("users.js: userId = " + credential.user.uid);
			resolve(credential.user.uid);
		})
		.catch(err => reject(err));
	});
}

exports.login = login;