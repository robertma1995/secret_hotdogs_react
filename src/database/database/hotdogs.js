// imports
import { firebase } from './index';

// return all hotdogs with id and readable timestamps
async function all() {
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
        }).catch(err => {
            reject(err);
        });
    });
}

// returns all hotdogs where creator == given user id
async function getCreatedBy(id) {
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
        }).catch(err => {
            reject(err);
        });
    });
}

// real-time query - returned to hotdogGrid where onSnapshot will be called
async function getCreatedByQuery(id) {
    return firebase.firestore().collection('hotdogs').where("creatorId", "==", id);
}

// given hotdog id, retrieves image from storage
async function getImage(id) {
    var storageRef = firebase.storage().ref();
    return storageRef.child("hotdogs/" + id + ".jpg").getDownloadURL();
}

/*  
    TODO: patch - updates hotdog with whatever has been changed - use DocumentReference.set functionality
    TODO: convert to same promise flow as post - more control over what's returned/error handling
*/
async function patch(id, hotdog, hotdogImage, imageChanged) {
    firebase.firestore().collection('hotdogs').doc(id).set(hotdog, {merge: true}).then(() => {
        if (imageChanged) {
            var imageRef = firebase.storage().ref().child("hotdogs/" + id + ".jpg");
            if (hotdogImage) {
                console.log("image changed and image defined, so replace");
                return imageRef.put(hotdogImage);
            } else {
                // delete existing image - should only evaluate to this if originally had an image, but was reset
                console.log("image changed but no image, so delete");
                return imageRef.delete();
            }
        }
    }).then(() => {
        return id;
    }).catch(err => {
        return err;
    });
}

/* 
    post - returns newly created hotdog id if successful
*/
async function post(hotdog, hotdogImage) {
    // add timestamp and remove image field before calling add()
    hotdog["ts"] = firebase.firestore.Timestamp.now();
    return new Promise((resolve, reject) => {
        // add returns a "DocumentReference"
        firebase.firestore().collection('hotdogs').add(hotdog).then(data => {
            const hotdogId = data.id;
            // if user chose a hotdog image, create reference in firebase storage
            if (hotdogImage) {
                var storageRef = firebase.storage().ref();
                storageRef.child("hotdogs/" + hotdogId + ".jpg").put(hotdogImage).then(() => {
                    resolve(hotdogId);
                }).catch(err => {
                    reject(err)
                });
            } else {
                resolve(hotdogId);
            }
            resolve(hotdogId);
        }).catch(err => {
            reject(err)
        });
    });
}


export {
    all,
    getCreatedBy,
    getCreatedByQuery,
    getImage,
    patch,
    post,
}
