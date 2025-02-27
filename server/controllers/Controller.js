const moment = require('moment');
const db = require('../models/Employee'); // MySQL Connection

// Get Employee Details (GET Method)
const index = async (req, res) => {
    try {
        const [employees] = await db.query(`
            SELECT 
                e.employee_id, 
                e.name, 
                e.email, 
                e.phone_number, 
                DATE_FORMAT(e.date_of_birth, '%d-%m-%Y') AS date_of_birth,
                DATE_FORMAT(e.hire_date, '%d-%m-%Y') AS hire_date,
                e.status, 
                d.department_name, 
                j.job_role_name
            FROM employees e
            JOIN departments d ON e.department_id = d.department_id
            JOIN job_roles j ON e.job_role_id = j.job_role_id
        `);

        res.json(employees);
    } catch (err) {
        console.error('Error in listing employees', err);
        res.status(500).json({ error: 'Error in listing employees' });
    }
};


const getDepartments = async (req, res) => {
    try {
        const [departments] = await db.query("SELECT * FROM departments");
        res.json(departments);
    } catch (err) {
        console.error('Error in listing departments', err);
        res.status(500).json({ error: 'Error in listing departments' });
    }
};

// Ensure you import your database connection

const getJobRoles = async (req, res) => {
    try {
        const { department_id } = req.query; // Expecting department_id from frontend

        if (!department_id) {
            return res.status(400).json({ error: "Department ID is required" });
        }

        const sql = `
            SELECT job_role_id, job_role_name 
            FROM job_roles 
            WHERE department_id = ?
        `;

        const [rows] = await db.execute(sql, [department_id]);

        res.json(rows); // Send back the job roles
    } catch (error) {
        console.error("Error fetching job roles:", error);
        res.status(500).json({ error: "Server error" });
    }
};


// Create Employee (POST Method)
const detailspost = async (req, res) => {
    const { name, email, phone_number, department_id, job_role_id, date_of_birth, hire_date, status } = req.body;

    try {
        // Extract current year
        const currentYear = new Date().getFullYear();

        // Fetch the last employee ID for the current year
        const [lastEmployee] = await db.query(
            "SELECT employee_id FROM employees WHERE employee_id LIKE ? ORDER BY employee_id DESC LIMIT 1",
            [`EMP${currentYear}%`]
        );

        // Generate new employee ID
        let newSequence = 1; // Default if no employees exist for the year
        if (lastEmployee.length > 0) {
            const lastId = lastEmployee[0].employee_id; // e.g., "EMP2025005"
            const lastSequence = parseInt(lastId.substring(7)); // Extract last sequence (e.g., "005" → 5)
            newSequence = lastSequence + 1; // Increment
        }

        // Format new employee ID (e.g., EMP2025001)
        const employee_id = `EMP${currentYear}${String(newSequence).padStart(3, '0')}`;

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

module.exports = { index, detailspost, detailsupdateget, detailsupdate, detailsdelete ,getDepartments, getJobRoles};
