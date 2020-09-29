// imports
import { firebase } from './index';

// return all hotdogs with id and readable timestamps
const all = async () => {
    return new Promise((resolve, reject) => {
        firebase.firestore().collection('hotdogs').get().then(data => {
            // note: each "row" is a "DocumentSnapshot": https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentSnapshot
            let hotdogs = [];
            data.forEach(row => {
                // add document id
                var formattedRow = row.data();
                formattedRow["id"] = row.id;
                formattedRow["ts"] = row.data().ts.seconds;
                hotdogs.push(formattedRow);
            });
            resolve(hotdogs);
        }).catch(err => 
            reject(err)
        );
    });
}

// returns all hotdogs where creator == given user id
const getCreatedBy = async (id) => {
    return new Promise((resolve, reject) => {
        firebase.firestore().collection('hotdogs').where("creatorId", "==", id).get().then(data => {
            let hotdogs = [];
            data.forEach(row => {
                // add document id
                var formattedRow = row.data();
                formattedRow["id"] = row.id;
                formattedRow["ts"] = row.data().ts.seconds;
                hotdogs.push(formattedRow);
            });
            resolve(hotdogs);
        }).catch(err => 
            reject(err)
        );
    });
}

// real-time query - returned to hotdogGrid where onSnapshot will be called
const getCreatedByQuery = async (id) => {
    return firebase.firestore().collection('hotdogs').where("creatorId", "==", id);
}

// given hotdog id, retrieves image from storage
async function getImage(id) {
    console.log("getting hotdog image for: " + id);
    var storageRef = firebase.storage().ref();
    // return storageRef.child("hotdogs/" + id + ".jpg").getDownloadURL().then(url => { 
    //     return url;
    // }).catch(err => {
    //     return err;
    // });
    return storageRef.child("hotdogs/" + id + ".jpg").getDownloadURL();
}

// insert - returns newly created hotdog id if successful
const add = async (hotdog, hotdogImage) => {
    hotdog["ts"] = firebase.firestore.Timestamp.now();
    return new Promise((resolve, reject) => {
        // add returns a "DocumentReference"
        firebase.firestore().collection('hotdogs').add(hotdog).then(data => {
            const hotdogId = data.id;
            // if hotdog image on register, create reference in firebase storage
            if (hotdogImage) {
                var storageRef = firebase.storage().ref();
                storageRef.child("hotdogs/" + hotdogId + ".jpg").put(hotdogImage).then(() => {
                    console.log("created new hotdog with image");
                    resolve(hotdogId);
                }).catch(err => 
                    reject(err)
                );
            } else {
                console.log("created new hotdog with no image");
                resolve(hotdogId);
            }
            resolve(hotdogId);
        }).catch(err => 
            reject(err)
        );
    });
}

export {
    all,
    getCreatedBy,
    getCreatedByQuery,
    getImage,
    add,
}
