const express = require('express');
const router = express.Router();
const moderatorController = require('../controllers/moderator.controller');

router.get('/pending', moderatorController.getPendingContributions);
router.patch('/review/:id', moderatorController.reviewContribution);

module.exports = router;