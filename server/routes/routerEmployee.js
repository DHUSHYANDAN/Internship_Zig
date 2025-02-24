const express = require('express');
const router = express.Router();
const { index, detailspost, detailsupdateget, detailsupdate, detailsdelete } = require('../controllers/Controller'); 
const { exportCSV, exportExcel, exportPDF } = require("../controllers/ExportDetails");
const  authenticateToken  = require('../Middleware/LoginMiddleware');
const authorizeAdminOrManager = require('../Middleware/AuthorizedAdorMag');

router.get('/viewEmployees', authenticateToken, index);
router.post('/addEmployee', authenticateToken,authorizeAdminOrManager, detailspost);
router.get('/updateEmployee/:employee_code', authenticateToken,authorizeAdminOrManager, detailsupdateget);
router.post('/updateEmployee', authenticateToken,authorizeAdminOrManager, detailsupdate);
router.delete('/deleteEmployee/:employee_code', authenticateToken,authorizeAdminOrManager, detailsdelete);

router.get("/export/csv", authenticateToken,authorizeAdminOrManager,exportCSV);
router.get("/export/excel", authenticateToken,authorizeAdminOrManager,exportExcel);
router.get("/export/pdf", authenticateToken,authorizeAdminOrManager,exportPDF);

module.exports = router;
