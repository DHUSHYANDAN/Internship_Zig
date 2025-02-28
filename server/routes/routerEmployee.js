 // const { exportCSV, exportExcel, exportPDF } = require("../controllers/ExportDetails");
// router.get("/export/csv", authenticateToken,authorizeAdminOrManager,exportCSV);
// router.get("/export/excel", authenticateToken,authorizeAdminOrManager,exportExcel);
// router.get("/export/pdf", authenticateToken,authorizeAdminOrManager,exportPDF);
const express = require('express');
const router = express.Router();
const { index, detailspost, detailsupdateget, detailsupdate, detailsdelete ,getDepartments,getJobRoles,createDepartment,updateDepartment,deleteDepartment,createJobRole,updateJobRole,deleteJobRole} = require('../controllers/Controller'); 
const authenticateToken = require('../Middleware/LoginMiddleware');
const authorizeAdmin = require('../Middleware/AuthorizationAdmin');

router.get('/viewEmployees', authenticateToken, index);

router.post('/addEmployee', authenticateToken, authorizeAdmin, detailspost);
router.get('/updateEmployee/:employee_id', authenticateToken, authorizeAdmin, detailsupdateget);
router.put('/updateEmployee', authenticateToken, authorizeAdmin, detailsupdate);
router.delete('/deleteEmployee/:employee_id', authenticateToken, authorizeAdmin, detailsdelete);

//get departments crud
router.get('/getDepartments', authenticateToken, authorizeAdmin, getDepartments);
router.post('/departments', authenticateToken, authorizeAdmin, createDepartment);
router.put('/departments/:department_id', authenticateToken, authorizeAdmin, updateDepartment);
router.delete('/departments/:department_id', authenticateToken, authorizeAdmin, deleteDepartment);

//get job roles
router.get('/getJobRoles', authenticateToken, authorizeAdmin, getJobRoles);
router.post('/jobRoles', authenticateToken, authorizeAdmin, createJobRole);
router.put('/jobRoles/:job_role_id', authenticateToken, authorizeAdmin, updateJobRole);
router.delete('/jobRoles/:job_role_id', authenticateToken, authorizeAdmin, deleteJobRole);


module.exports = router;
