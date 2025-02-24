const express = require('express');
const router = express.Router();
const authenticateToken = require('../Middleware/LoginMiddleware');
const authorizeAdminOrManager = require('../Middleware/AuthorizedAdorMag');
const { signup, signin,approveUser,getUnapprovedUsers } = require('../controllers/dashController');


router.post('/signup', signup);
router.post('/signin', signin);
router.get('/approve-user', approveUser);

router.get('/get-unapproved-users', authenticateToken,authorizeAdminOrManager, getUnapprovedUsers);


module.exports = router;
