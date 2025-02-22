const express = require('express');
const router = express.Router();

// Import the Employee Controller
const {index, detailspost, detailsupdateget, detailsupdate, detailsdelete}= require('../controllers/Controller'); 

// Import the ExportDetails Controller
const { exportCSV, exportExcel, exportPDF } = require("../controllers/ExportDetails");


router.get('/viewEmployees',index);


router.post('/addEmployee', detailspost);

 
router.get('/updateEmployee/:employee_code', detailsupdateget);


router.post('/updateEmployee', detailsupdate);


router.delete('/deleteEmployee/:employee_code', detailsdelete);

// Export routes

router.get("/export/csv", exportCSV);
router.get("/export/excel", exportExcel);
router.get("/export/pdf", exportPDF);

module.exports = router;
 