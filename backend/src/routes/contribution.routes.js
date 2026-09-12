const express = require('express');
const router = express.Router();
const contributionController = require('../controllers/contribution.controller');

// Handle both '/submit' and '/' (Dono paths add kar diye hain taaki route path mismatch na ho)
router.post('/submit', contributionController.submitContribution);
router.post('/', contributionController.submitContribution);

module.exports = router;