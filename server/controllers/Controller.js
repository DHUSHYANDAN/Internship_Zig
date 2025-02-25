const moment = require('moment');
const Employee = require('../models/Users'); 

// Get Employee Details (Get Method)
const index = async (req, res) => {
    try {
        const employees = await Employee.find({});

        const formattedEmployees = employees.map(employee => ({
            ...employee.toObject(),
            dob: moment(employee.dob).format('DD-MM-YYYY'),
            hire_date: moment(employee.hire_date).format('DD-MM-YYYY')
        }));

        res.json(formattedEmployees);
    } catch (err) {
        console.error('Error in listing employees', err);
        res.status(500).send('Error in listing employees');
    }
};

// Create Employee (POST Method)
const detailspost = async (req, res) => {
    const { first_name, last_name, email, phone_number, department, job_role, dob, hire_date, status } = req.body;

    try {
        // Check for duplicate email
        const existingEmployeeEmail = await Employee.findOne({ email });
        if (existingEmployeeEmail) {
            return res.status(400).json({ error: 'Duplicate email. Please use a different email.' });
        }

        // Create new employee
        const newEmployee = new Employee({
            first_name,
            last_name,
            email,
            phone_number,
            department,
            job_role,
            dob: new Date(dob),
            hire_date: new Date(hire_date),
            status
        });

        await newEmployee.save();

        res.status(200).json({ message: 'Employee created successfully', employee_code: newEmployee.employee_code });

    } catch (err) {
        console.error('Error saving employee', err);
        res.status(500).json({ error: 'Error saving employee' });
    }
};


// View Employee for Editing (GET Method)
const detailsupdateget = async (req, res) => {
    let employee_code = req.params.employee_code;

    try {
        const employee = await Employee.findOne({ employee_code });

        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        const formattedEmployee = {
            ...employee.toObject(),
            dob: moment(employee.dob).format('YYYY-MM-DD'),
            hire_date: moment(employee.hire_date).format('YYYY-MM-DD')
        };

        res.json(formattedEmployee);
    } catch (err) {
        console.error('Error in fetching employee details', err);
        res.status(500).json({ error: 'Error in fetching employee details' });
    }
};

// Update Employee Details (PUT Method)
const detailsupdate = async (req, res) => {
    const { first_name, last_name, employee_code, email, phone_number, department, job_role, dob, hire_date, status } = req.body;

    try {
        const updatedEmployee = await Employee.findOneAndUpdate(
            { employee_code },
            {
                first_name,
                last_name,
                employee_code,
                email,
                phone_number,
                department,
                job_role,
                dob: new Date(dob),
                hire_date: new Date(hire_date),
                status
            },
            { new: true, runValidators: true }
        );

        if (!updatedEmployee) {
            return res.status(404).json({ error: 'No employee found with the provided employee code.' });
        } else {
            res.status(200).json({ message: 'Employee updated successfully' });
        }

    } catch (err) {
        console.log('Error in updating employee data', err);
        res.status(500).json({ error: 'Error in updating employee data' });
    }
};
 
// Delete Employee (DELETE Method)
const detailsdelete = async (req, res) => {
    const { employee_code } = req.params;                                                                                                                                                                           

    try {
        const result = await Employee.findOneAndDelete({ employee_code });

        if (!result) {
            return res.status(404).json({ error: 'No employee found with the provided employee code.' });
        } else {                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
            res.status(200).json({ message: 'Employee deleted successfully' });
        }

    } catch (err) {
        console.log('Error in deleting employee data', err);
        res.status(500).json({ error: 'Error in deleting employee data' });
    }
};

module.exports = { index, detailspost, detailsupdateget, detailsupdate, detailsdelete };