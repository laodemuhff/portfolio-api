/* Declare Express Router */
const express = require('express');
const router = express.Router();
const authController = require('../../../controllers/v1/admin/auth.v1.admin.controller')

/* API Collections */
router.get('/profile', authController.getProfile);

/* Export Router */
module.exports = router;