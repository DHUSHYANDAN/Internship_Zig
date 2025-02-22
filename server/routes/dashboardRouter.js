const express = require('express');
const router = express.Router();
const authenticateToken = require('../Middleware/LoginMiddleware');
const { signup, signin, approveUser, getPendingApprovals } = require('../controllers/dashController');

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/approve-user', authenticateToken, approveUser); // Admin or Manager approval route
router.get('/pending-approvals', authenticateToken, getPendingApprovals); // Get pending approval requests

module.exports = router;
