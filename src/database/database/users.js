// imports
import { firebase } from './index';

/*
    return user details if login successful, otherwise return firebase error
    "credential" is a UserCredential: https://firebase.google.com/docs/reference/js/firebase.auth#usercredential
*/
async function login(email, password) {
    return new Promise((resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(email, password).then(credential => {
            resolve(credential.user.uid);
        }).catch(err => {
            reject(err);
        });
    });
}

/*  
    get user details given firebase auth id
*/
async function get(id) {
    return new Promise((resolve, reject) => {
        firebase.firestore().collection('users').doc(id).get().then(snapshot => 
            resolve(snapshot.data())
        ).catch(err => 
            reject(err)
        );
    });
}

/*  
    get user profile image url given firebase auth id 
    TODO: consider combining this with get user function
*/
async function getImage(id) {
    var storageRef = firebase.storage().ref();
    return storageRef.child("users/" + id + ".jpg").getDownloadURL();
}

/* 
    returns user id if registration successful - set name in users collection
*/
async function post(name, email, password) {
    return new Promise((resolve, reject) => {
        firebase.auth().createUserWithEmailAndPassword(email, password).then(credential => {
            const id = credential.user.uid;
            firebase.firestore().collection('users').doc(id).set({name: name}).then(() => {
                resolve(id);
            }).catch(err => {
                reject(err);
            });
        }).catch(err => {
            reject(err);
        });
    });
}

/* 
    wrapper.js returns true if new image added successfully
*/
async function postImage(id, image) {
    return firebase.storage().ref().child("users/" + id + ".jpg").put(image);
}

/* 
    deletes existing profile image blob record if no profile image, updates image otherwise  
    wrapper.js resolves with storage url if image defined, otherwise it resolves to empty string
*/
async function putImage(id, image) {
    return new Promise((resolve, reject) => {
        let imageRef = firebase.storage().ref().child("users/" + id + ".jpg");
        let action = image ? imageRef.put(image) : imageRef.delete();
        action.then(() => {
            return imageRef.getDownloadURL();
        }).then(url => {
            resolve(url);
        }).catch(err => {
            reject(err);
        });
    });   
}

export {
    login,
    get,
    getImage,
    post, 
    postImage,
    putImage,
}
