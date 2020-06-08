// imports
import { firebase } from './index';

// return all hotdogs with id and readable timestamps
const all = async () => {
    return new Promise((resolve, reject) => {
        firebase.firestore().collection('hotdogs').get()
        .then(data => {
            // note: each "row" is a "DocumentSnapshot": https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentSnapshot
            let hotdogs = [];
            data.forEach(row => {
                // add document id
                var formattedRow = row.data();
                formattedRow["id"] = row.id;
                formattedRow.ts = row.data().ts.seconds;
                hotdogs.push(formattedRow);
            });
            resolve(hotdogs);
        })
        .catch(err => reject(err))
    });
}

// returns all hotdogs where creator == given user id
const getCreatedBy = async (id) => {
    return new Promise((resolve, reject) => {
        firebase.firestore().collection('hotdogs').where("creatorId", "==", id).get()
        .then(data => {
            let hotdogs = [];
            data.forEach(row => {
                // add document id
                var formattedRow = row.data();
                formattedRow["id"] = row.id;
                formattedRow.ts = row.data().ts.seconds;
                hotdogs.push(formattedRow);
            });
            resolve(hotdogs);
        })
        .catch(err => reject(err))
    });
}

// insert - returns newly created hotdog id if successful
const add = async (hotdog) => {
    hotdog["ts"] = firebase.firestore().Timestamp.now();
    return new Promise((resolve, reject) => {
        // add returns a "DocumentReference"
        firebase.firestore().collection('hotdogs').add(hotdog)
        .then(data => resolve(data.id))
        .catch(err => reject(err))
    });
}

export {
    all,
    getCreatedBy,
    add
}
