// imports
import { firebase } from './index';

/* 
    return all hotdogs with id and readable timestamps
*/
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

/*
    returns details of hotdog with given id
*/
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

/*
    real-time query - returned to hotdogDetailsDialog where onSnapshot will be called
*/
async function getQuery(id) {
    return firebase.firestore().collection('hotdogs').doc(id);
}

/*
    returns all hotdogs where creator == given user id
*/
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

/*
    real-time query - returned to hotdogGrid where onSnapshot will be called
*/
async function getCreatedByQuery(id) {
    return firebase.firestore().collection('hotdogs').where("creatorId", "==", id);
}

/*
    given hotdog id, retrieves image from storage
*/
async function getImage(id) {
    var storageRef = firebase.storage().ref();
    return storageRef.child("hotdogs/" + id + ".jpg").getDownloadURL();
}

/* 
    TODO: query for getting next n hotdogs created by given user (startAfter called in hotdogGrid)
*/
async function getNextQuery(id, n) {
    return firebase.firestore().collection('hotdogs').where("creatorId", "==", id).orderBy("ts", "desc").limit(n);
}

/* 
    updates existing hotdog record
*/
async function patch(id, hotdog) {
    const { description, sauce, sausage, toppings, title } = hotdog;
    let h = {
        description, 
        ingredients: {sauce, sausage, toppings},
        title,
    }
    // remove undefined values before patching
    for (var i in h) {
        if (i !== "ingredients" && h[i] === undefined) {
            delete h[i];
        } else if (i === "ingredients") {
            for (var j in h[i]) {
                if (h[i][j] === undefined) {
                    delete h[i][j];
                }
            }
            // remove empty ingredients (i.e. "{}"), otherwise gets included in patch
            if (Object.keys(h[i]).length === 0) {
                delete h[i];
            }
        }
    }
    return firebase.firestore().collection('hotdogs').doc(id).set(h, {merge: true});
}

/* 
    returns newly created hotdog id if successful
*/
async function post(hotdog) {
    const { creatorId, description, sauce, sausage, toppings, title } = hotdog;
    let h = {
        creatorId,
        description, 
        ingredients: {sauce, sausage, toppings},
        title,
        ts: firebase.firestore.Timestamp.now()
    }
    return new Promise((resolve, reject) => {
        firebase.firestore().collection('hotdogs').add(h).then(data => {
            resolve(data.id);
        }).catch(err => {
            reject(err);
        });
    });
}

/* 
    wrapper.js returns true if new image added successfully
*/
async function postImage(id, image) {
    return firebase.storage().ref().child("hotdogs/" + id + ".jpg").put(image);
} 

/* 
    replaces or deletes existing image
*/
async function putImage(id, image) {
    var imageRef = firebase.storage().ref().child("hotdogs/" + id + ".jpg");
    return new Promise((resolve, reject) => {
        if (image) {
            console.log("image defined - replace existing");
            imageRef.put(image).then(() => {
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
    getNextQuery,
    patch,
    post,
    postImage,
    putImage,
}
