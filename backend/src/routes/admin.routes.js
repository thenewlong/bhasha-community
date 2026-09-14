const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

// GET routes
router.get('/', adminController.getAllContributions);
router.get('/contributions', adminController.getAllContributions);
router.get('/clusters', adminController.getClusteredContributions);

// PUT routes (Approve / Reject)
router.put('/contributions/:id/status', adminController.updateContributionStatus);
router.put('/:id/status', adminController.updateContributionStatus);

// DELETE routes
router.delete('/contributions/:id', adminController.deleteContribution);
router.delete('/:id', adminController.deleteContribution);

module.exports = router;