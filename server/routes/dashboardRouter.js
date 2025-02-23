const express = require('express');
const router = express.Router();
const authenticateToken = require('../Middleware/LoginMiddleware');
const { signup, signin,approveUser } = require('../controllers/dashController');

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/approve-user', approveUser);

module.exports = router;
