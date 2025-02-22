const express = require('express');
const router = express.Router();
const authenticateToken = require('../Middleware/LoginMiddleware');
const { signup, signin } = require('../controllers/dashController');

router.get('/dashboard', authenticateToken, (req, res) => {
    res.status(200).json({ message: 'Welcome to the dashboard' });
});

router.post('/signup', signup);
router.post('/signin', signin);

module.exports = router;
