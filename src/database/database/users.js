// imports
import { firebase } from './index';

/*
    return user details if login successful, otherwise return firebase error
    "credential" is a UserCredential: https://firebase.google.com/docs/reference/js/firebase.auth#usercredential
*/
const login = async (email, password) => {
    return new Promise((resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(credential => resolve(credential.user.uid))
        .catch(err => reject(err));
    });
}

/*
    return true if register successful, otherwise return firebase error
    inserting with custom id: https://stackoverflow.com/questions/48541270/how-to-add-document-with-custom-id-to-firestore
*/
const register = async (name, email, password, profileImage) => {
    return new Promise((resolve, reject) => {
        firebase.auth().createUserWithEmailAndPassword(email, password).then(credential => {
            // add to users collection and set name if register successful
            const userId = credential.user.uid;
            firebase.firestore().collection('users').doc(userId).set({
                name: name
            })
            .catch(err => reject(err));

            // if user set profile image on register, create reference in firebase storage
            if (profileImage) {
                var storageRef = firebase.storage().ref();
                storageRef.child("users/" + userId + ".jpg").put(profileImage).then(() => {
                    console.log("Uploaded a file!");
                    resolve(userId);
                })
                .catch(err => reject(err));
            } else {
                resolve(userId);
            }
        })
        .catch(err => reject(err));
    });
}

/*  
    get user details given firebase auth id
*/
const get = async (id) => {
    return new Promise((resolve, reject) => {
        firebase.firestore().collection('users').doc(id).get()
        .then(snapshot => resolve(snapshot.data()))
        .catch(err => reject(err));
    });
}

/*  
    get user profile image url given firebase auth id 
    TODO: consider combining this with get user function
*/
const getProfileImage = async (id) => {
    return new Promise((resolve, reject) => {
        var storageRef = firebase.storage().ref();
        storageRef.child("users/" + id + ".jpg").getDownloadURL()
        .then(url => resolve(url))
        .catch(err => reject(err));
    });
}

export {
    login,
    register,
    get,
    getProfileImage,
}
