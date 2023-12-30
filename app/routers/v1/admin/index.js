const express = require('express');
const router = express.Router();

router.use("/auth", require('./auth.v1.admin.router'));

module.exports = router;
