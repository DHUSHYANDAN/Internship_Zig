const express = require('express');
const router = express.Router();
const authenticateToken = require('../Middleware/LoginMiddleware');
const authorizeAdmin = require('../Middleware/AuthorizationAdmin');
const { signup, signin, getUnapprovedUsers, approveUser, rejectUser } = require('../controllers/dashController');

router.post('/signup', signup);
router.post('/signin', signin);

// Admin routes to manage user requests
router.get('/get-unapproved-users', authenticateToken, authorizeAdmin, getUnapprovedUsers);
router.post('/approve-user/:user_id', authenticateToken, authorizeAdmin, approveUser);
router.post('/reject-user/:user_id', authenticateToken, authorizeAdmin, rejectUser);

module.exports = router;
