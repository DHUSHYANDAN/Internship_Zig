 // const { exportCSV, exportExcel, exportPDF } = require("../controllers/ExportDetails");
// router.get("/export/csv", authenticateToken,authorizeAdminOrManager,exportCSV);
// router.get("/export/excel", authenticateToken,authorizeAdminOrManager,exportExcel);
// router.get("/export/pdf", authenticateToken,authorizeAdminOrManager,exportPDF);
const express = require('express');
const router = express.Router();
const { index, detailspost, detailsupdateget, detailsupdate, detailsdelete ,getDepartments,getJobRoles} = require('../controllers/Controller'); 
const authenticateToken = require('../Middleware/LoginMiddleware');
const authorizeAdmin = require('../Middleware/AuthorizationAdmin');

router.get('/viewEmployees', authenticateToken, index);
router.get('/getDepartments', authenticateToken, authorizeAdmin, getDepartments);
router.get('/getJobRoles', authenticateToken, authorizeAdmin, getJobRoles);
router.post('/addEmployee', authenticateToken, authorizeAdmin, detailspost);
router.get('/updateEmployee/:employee_id', authenticateToken, authorizeAdmin, detailsupdateget);
router.put('/updateEmployee', authenticateToken, authorizeAdmin, detailsupdate);
router.delete('/deleteEmployee/:employee_id', authenticateToken, authorizeAdmin, detailsdelete);

module.exports = router;
