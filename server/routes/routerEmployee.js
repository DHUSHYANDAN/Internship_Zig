const express = require('express');
const router = express.Router();
const { index, detailspost, detailsupdateget, detailsupdate, detailsdelete } = require('../controllers/Controller'); 
const { exportCSV, exportExcel, exportPDF } = require("../controllers/ExportDetails");
const authenticateToken = require('../Middleware/LoginMiddleware');

router.get('/viewEmployees', authenticateToken, index);
router.post('/addEmployee', authenticateToken, detailspost);
router.get('/updateEmployee/:employee_code', authenticateToken, detailsupdateget);
router.post('/updateEmployee', authenticateToken, detailsupdate);
router.delete('/deleteEmployee/:employee_code', authenticateToken, detailsdelete);

router.get("/export/csv", authenticateToken,exportCSV);
router.get("/export/excel", authenticateToken,exportExcel);
router.get("/export/pdf", authenticateToken,exportPDF);

module.exports = router;
