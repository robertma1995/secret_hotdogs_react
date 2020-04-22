// imports
const express = require('express');
const bodyParser = require('body-parser');
const apiRouter = require('./routes.js');

// initialize app to use defined routes
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(apiRouter);

// start server at localhost:5000 (proxy added to ../../package.json)
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
