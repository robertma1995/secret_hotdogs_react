// imports
const dbindex = require('./index.js');

const all = async () => {
    return new Promise((resolve, reject) => {
        dbindex.firebase.firestore().collection('hotdogs').get()
        .then(data => {
            // note: each "row" is a "DocumentSnapshot": https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentSnapshot
            let hotdogs = [];
            data.forEach(row => {
                // add document id and convert timestamp to a Date
                formattedRow = row.data();
                formattedRow["id"] = row.id;
                formattedRow.ts = row.data().ts.toDate();
                hotdogs.push(formattedRow);
            });
            return resolve(hotdogs);
        })
        .catch(err => {
            console.log(err);
            return reject(err);
        })
    });
}

exports.all = all;
// TODO: define all hotdog table stuff here (i.e. get, insert, update, etc.)