// import * as express from 'express';
// import apiRouter from './routes';

// // api server - allows easier access to database from client (App.js)
// const app = express();

// app.use(express.static('public'));
// app.use(apiRouter);

// const port = process.env.PORT || 3000;
// app.listen(port, () => console.log(`server/server.js: Server listening on port: ${port}`));






// const express = require('express');
// const bodyParser = require('body-parser');
// const path = require('path');
// const app = express();
// app.use(express.static(path.join(__dirname, 'build')));

// app.get('/api/hello', (req, res, next) => {
// 	res.json('Hello World :)');
// });

// app.get('/', (req, res, next) => {
// 	res.sendFile('../../public/index.html');
// });

// app.listen(process.env.PORT || 3000);

// imports
const express = require('express');
const apiRouter = require('./routes.js');

const app = express();
app.use(apiRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));

// // TODO: figure out a way to "import" router.js
// // app.use(express.static(path.join(__dirname, 'build')));
// // TEST: simple api
// app.get('/api/hello', (req, res, next) => {
//     res.json('Hello World smile smile :)');
// });