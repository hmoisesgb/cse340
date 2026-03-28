const express = require('express');
const router = express.Router();
const testErrorController = require('../controllers/testErrorController')

router.get('/intentionalError', testErrorController.throwError);

module.exports = router;