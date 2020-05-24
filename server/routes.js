// imports
// note - when require is given path of a folder, it looks for an index.js in that folder. 
// If there is one, it uses it. If there isn't, the require fails.
// https://stackoverflow.com/questions/5364928/node-js-require-all-files-in-a-folder
const express = require('express');
const DB = require('./database');

const router = express.Router();
// testing api
router.get('/api/hello', (req, res, next) => {
    res.json('Hello World :)');
});

// gets all hotdogs of every user
router.get('/api/hotdogs/all', async (req, res) => {
    try {
        let hotdogs = await DB.hotdogs.all();
        res.json(hotdogs);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// gets all hotdogs belonging to a specific user
router.get('/api/hotdogs/createdBy/:id', async (req, res) => {
    const id = req.params.id;
    try {
        let hotdogs = await DB.hotdogs.getCreatedBy(id);
        res.json(hotdogs);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});

// TODO: add a new hotdog
/*
router.post('/api/hotdogs/add', async (req, res) => {
    
});
*/

// TODO (when hotdogs get likes and comments): gets hotdog given hotdog id 
/*
router.get('/api/hotdogs/:id', async (req, res) => {
    ...DB.hotdogs.get(id);
});
*/

// gets details of user from "users" collection (not firebase.auth)
router.get('/api/users/:id', async (req, res) => {
    const id = req.params.id;
    try {
        let user = await DB.users.get(id);
        res.json(user);
    } catch(e) {
        console.log(e);
        res.json(false);
    }
});

// login: returns user id if successful, false otherwise
router.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        let userId = await DB.users.login(email, password);
        res.json(userId);
    } catch(e) {
        console.log(e);
        res.json(false);
    }
});

// registration: returns true if successful, logs user id for backend debugging
router.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let userId = await DB.users.register(name, email, password);
        console.log("User with id " + userId + " successfully created");
        res.json(true);
    } catch(e) {
        console.log(e);
        res.json(false);
    }
});

module.exports = router;
