const express = require('express');
const router = express.Router();
const contributionController = require('../controllers/contribution.controller');

router.post('/submit', contributionController.submitContribution);

module.exports = router;