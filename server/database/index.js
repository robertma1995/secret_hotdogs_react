// imports
const mysql = require('mysql');
const config = require('./config.js');

// consolidate tables (TODO: add one for users)
const hotdogs = require('./hotdogs.js');

// TODO: set database connection from ./config.js, and consolidate all tables here (hotdogs, users)
const connection = mysql.createConnection(config);
connection.connect(err => {
    if (err) console.log(err);
});

exports.connection = connection; 
exports.hotdogs = hotdogs;
