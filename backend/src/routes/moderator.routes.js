const express = require('express');
const router = express.Router();
const moderatorController = require('../controllers/moderator.controller');

router.get('/pending', moderatorController.getPendingContributions);
router.patch('/review/:id', moderatorController.reviewContribution);

// Ye route add kiya hai taaki moderator edit karke save kare toh 404 error na aaye
router.patch('/update/:id', moderatorController.updateWord);

module.exports = router;