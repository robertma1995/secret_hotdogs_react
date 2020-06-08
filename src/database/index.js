// firebase setup
import config from './config';
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

// consolidating tables
import * as hotdogs from './hotdogs';
import * as users from './users';

// initialize firebase connection
firebase.initializeApp(config);

export {
    firebase,
    hotdogs,
    users
}

/*
const config = require('./config.js');
const firebase = require('firebase/app');
require('firebase/auth');
require('firebase/firestore');
// consolidate tables (TODO: add one for users)
const hotdogs = require('./hotdogs.js');
const users = require('./users.js');

// initialize firebase connection
firebase.initializeApp(config);

exports.firebase = firebase;
exports.hotdogs = hotdogs;
exports.users = users;
*/
