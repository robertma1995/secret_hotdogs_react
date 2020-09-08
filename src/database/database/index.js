// firebase setup
import config from './config';
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

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
