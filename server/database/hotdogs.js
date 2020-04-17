// imports
const dbindex = require('./index.js');

const all = async () => {
    return new Promise((resolve, reject) => {
        dbindex.connection.query("SELECT * FROM hotdogs", (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
}

exports.all = all;
// TODO: define all hotdog table stuff here (i.e. get, insert, update, etc.)