const express = require('express');
const router = express.Router();

const EmployeeController = require('../controllers/Controller'); 


router.get('/viewEmployees', EmployeeController.index);


router.post('/addEmployee', EmployeeController.detailspost);

 
router.get('/updateEmployee/:employee_code', EmployeeController.detailsupdateget);


router.post('/updateEmployee', EmployeeController.detailsupdate);


router.delete('/deleteEmployee/:employee_code', EmployeeController.detailsdelete);

module.exports = router;
 