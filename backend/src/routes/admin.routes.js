const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

router.get('/clusters', adminController.getClusteredContributions);
router.delete('/delete/:id', adminController.deleteContribution);

module.exports = router;