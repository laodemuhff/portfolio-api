const express = require('express');
const router = express.Router();
const cors = require('cors')
const corsOptions = require('../../configs/cors.config')[process.env.NODE_ENV];

router.use('/adm', cors(corsOptions), require('./admin'));
// router.use('/web', cors(corsOptions), require('./website'));

module.exports = router;