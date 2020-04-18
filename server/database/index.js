// imports
const config = require('./config.js');
const firebase = require('firebase/app');
require('firebase/auth');
require('firebase/firestore');
// consolidate tables (TODO: add one for users)
const hotdogs = require('./hotdogs.js');

// initialize firebase connection
firebase.initializeApp(config);

exports.firebase = firebase;
exports.hotdogs = hotdogs;
