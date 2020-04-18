// imports
// const mysql = require('mysql');
const config = require('./config.js');
const firebase = require('firebase/app');
require('firebase/auth');
require('firebase/firestore');

// consolidate tables (TODO: add one for users)
const hotdogs = require('./hotdogs.js');

// const connection = mysql.createConnection(config);
// connection.connect(err => {
//     if (err) console.log(err);
// });
// exports.connection = connection; 

firebase.initializeApp(config);

exports.firebase = firebase;
exports.hotdogs = hotdogs;
