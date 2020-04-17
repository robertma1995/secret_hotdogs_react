import * as express from 'express';

const router = express.Router();

// testing api
router.get('/api/hello', (req, res, next) => {
	res.json('Hello World :)');
});

export default apiRouter;
// TODO: one route for each table (hotdogs, users)