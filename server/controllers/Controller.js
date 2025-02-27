const moment = require('moment');
const db = require('../models/Employee'); // MySQL Connection

// Get Employee Details (GET Method)
const index = async (req, res) => {
    try {
        const [employees] = await db.query("SELECT * FROM employees");

        // Format date fields
        const formattedEmployees = employees.map(employee => ({
            ...employee,
            date_of_birth: moment(employee.date_of_birth).format('DD-MM-YYYY'),
            hire_date: moment(employee.hire_date).format('DD-MM-YYYY')
        }));

        res.json(formattedEmployees);
    } catch (err) {
        console.error('Error in listing employees', err);
        res.status(500).json({ error: 'Error in listing employees' });
    }
};

// Create Employee (POST Method)
const detailspost = async (req, res) => {
    const { employee_id, name, email, phone_number, department_id, job_role_id, date_of_birth, hire_date, status } = req.body;

    try {
        // Check for duplicate email
        const [existingEmployee] = await db.query("SELECT email FROM employees WHERE email = ?", [email]);

        if (existingEmployee.length > 0) {
            return res.status(400).json({ error: 'Duplicate email. Please use a different email.' });
        }

        // Insert new employee
        await db.query(
            "INSERT INTO employees (employee_id, name, email, phone_number, department_id, job_role_id, date_of_birth, hire_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [employee_id, name, email, phone_number, department_id, job_role_id, date_of_birth, hire_date, status]
        );

        res.status(200).json({ message: 'Employee created successfully', employee_id });

    } catch (err) {
        console.error('Error saving employee', err);
        res.status(500).json({ error: 'Error saving employee' });
    }
};

// View Employee for Editing (GET Method)
const detailsupdateget = async (req, res) => {
    let employee_id = req.params.employee_id;

    try {
        const [employee] = await db.query("SELECT * FROM employees WHERE employee_id = ?", [employee_id]);

        if (employee.length === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        const formattedEmployee = {
            ...employee[0],
            date_of_birth: moment(employee[0].date_of_birth).format('YYYY-MM-DD'),
            hire_date: moment(employee[0].hire_date).format('YYYY-MM-DD')
        };

        res.json(formattedEmployee);
    } catch (err) {
        console.error('Error in fetching employee details', err);
        res.status(500).json({ error: 'Error in fetching employee details' });
    }
};

// Update Employee Details (PUT Method)
const detailsupdate = async (req, res) => {
    const { employee_id, name, email, phone_number, department_id, job_role_id, date_of_birth, hire_date, status } = req.body;

    try {
        const [result] = await db.query(
            "UPDATE employees SET name = ?, email = ?, phone_number = ?, department_id = ?, job_role_id = ?, date_of_birth = ?, hire_date = ?, status = ? WHERE employee_id = ?",
            [name, email, phone_number, department_id, job_role_id, date_of_birth, hire_date, status, employee_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'No employee found with the provided employee ID.' });
        }

        res.status(200).json({ message: 'Employee updated successfully' });

    } catch (err) {
        console.error('Error in updating employee data', err);
        res.status(500).json({ error: 'Error in updating employee data' });
    }
};

// Delete Employee (DELETE Method)
const detailsdelete = async (req, res) => {
    const { employee_id } = req.params;

    try {
        const [result] = await db.query("DELETE FROM employees WHERE employee_id = ?", [employee_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'No employee found with the provided employee ID.' });
        }

        res.status(200).json({ message: 'Employee deleted successfully' });

    } catch (err) {
        console.error('Error in deleting employee data', err);
        res.status(500).json({ error: 'Error in deleting employee data' });
    }
};

module.exports = { index, detailspost, detailsupdateget, detailsupdate, detailsdelete };
