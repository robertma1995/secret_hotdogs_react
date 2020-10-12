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

// TODO: returns details of hotdog with given id
async function get(id) {
    return new Promise((resolve, reject) => {
        firebase.firestore().collection('hotdogs').doc(id).get().then(snapshot => {
            var hotdog = snapshot.data();
            hotdog["ts"] = hotdog["ts"].seconds;
            resolve(hotdog);
        }).catch(err => {
            reject(err);
        })
    });
}

// real-time query - returned to hotdogDetailsDialog where onSnapshot will be called
async function getQuery(id) {
    return firebase.firestore().collection('hotdogs').doc(id);
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

// patch - updates hotdog with changes
async function patch(id, hotdog) {
    return firebase.firestore().collection('hotdogs').doc(id).set(hotdog, {merge: true});
}


// post - returns newly created hotdog id if successful
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

// put image - replaces or deletes existing image
async function putImage(id, hotdogImage) {
    var imageRef = firebase.storage().ref().child("hotdogs/" + id + ".jpg");
    return new Promise((resolve, reject) => {
        if (hotdogImage) {
            console.log("image defined - replace existing");
            imageRef.put(hotdogImage).then(() => {
                return imageRef.getDownloadURL();
            }).then(url => {
                resolve(url);
            }).catch(err => {
                reject(err);
            })
        } else {
            console.log("image not defined - delete existing");
            imageRef.delete().then(() => {
                resolve("");
            }).catch(err => {
                reject(err);
            })
        }
    });
} 

export {
    all,
    get,
    getQuery,
    getCreatedBy,
    getCreatedByQuery,
    getImage,
    patch,
    post,
    putImage,
}
