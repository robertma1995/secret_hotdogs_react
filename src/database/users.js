// imports
import { firebase } from './index';

// return user details if login successful, otherwise return firebase error
// "credential" is a UserCredential: https://firebase.google.com/docs/reference/js/firebase.auth#usercredential
const login = async (email, password) => {
    return new Promise((resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(credential => resolve(credential.user.uid))
        .catch(err => reject(err));
    });
}

// return true if register successful, otherwise return firebase error
// inserting with custom id: https://stackoverflow.com/questions/48541270/how-to-add-document-with-custom-id-to-firestore
const register = async (name, email, password) => {
    return new Promise((resolve, reject) => {
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(credential => {
            // add to users collection and set name if register successful
            const userId = credential.user.uid;
            firebase.firestore().collection('users')
            .doc(userId).set({
                name: name
            })
            .then(() => resolve(userId))
            .catch(err => reject(err));
        })
        .catch(err => reject(err));
    });
}

// get user details given firebase auth id
const get = async (id) => {
    return new Promise((resolve, reject) => {
        firebase.firestore().collection('users').doc(id).get()
        .then(snapshot => resolve(snapshot.data()))
        .catch(err => reject(err));
    });
}

export {
    login,
    register,
    get
}
