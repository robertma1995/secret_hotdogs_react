// import * as express from 'express';
const express = require('express');


const router = express.Router();

// TODO: one route for each table (hotdogs, users)
// testing api
router.get('/api/hello', (req, res, next) => {
	res.json('Hello World penis :)');
});

// export default apiRouter;
module.exports = router;
