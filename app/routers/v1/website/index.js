const express = require('express');
const router = express.Router();

router.use("/auth", require('./auth.v1.website.router'));

module.exports = router;
