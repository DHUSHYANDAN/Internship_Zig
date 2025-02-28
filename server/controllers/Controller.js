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


// Departments CRUD
// ────────────────────────────────────────────────

// Get all departments
const getDepartments = async (req, res) => {
    try {
        const [departments] = await db.query("SELECT * FROM departments");
        res.json(departments);
    } catch (err) {
        console.error('Error in listing departments', err);
        res.status(500).json({ error: 'Error in listing departments' });
    }
};

// Create a new department
const createDepartment = async (req, res) => {
    try {
        const { department_name } = req.body;
        if (!department_name) return res.status(400).json({ error: "Department name is required" });

        // Check if department already exists
        const [existingDepartment] = await db.query("SELECT * FROM departments WHERE department_name = ?", [department_name]);

        if (existingDepartment.length > 0) {
            return res.status(400).json({ error: "Department name already exists" });
        }

        await db.query("INSERT INTO departments (department_name) VALUES (?)", [department_name]);
        res.status(201).json({ message: "Department added successfully" });
    } catch (error) {
        console.error("Error adding department:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// Update a department
const updateDepartment = async (req, res) => {
    try {
        const { department_id } = req.params;
        const { department_name } = req.body;

        if (!department_name) return res.status(400).json({ error: "New department name is required" });

        // Check if another department with the same name exists
        const [existingDepartment] = await db.query(
            "SELECT * FROM departments WHERE department_name = ? AND department_id != ?",
            [department_name, department_id]
        );

        if (existingDepartment.length > 0) {
            return res.status(400).json({ error: "Department name already exists" });
        }

        const [result] = await db.query(
            "UPDATE departments SET department_name = ? WHERE department_id = ?",
            [department_name, department_id]
        );

        if (result.affectedRows === 0) return res.status(404).json({ error: "Department not found" });

        res.json({ message: "Department updated successfully" });
    } catch (error) {
        console.error("Error updating department:", error);
        res.status(500).json({ error: "Server error" });
    }
};


// Delete a department
const deleteDepartment = async (req, res) => {
    try {
        const { department_id } = req.params;

        const [result] = await db.query("DELETE FROM departments WHERE department_id = ?", [department_id]);

        if (result.affectedRows === 0) return res.status(404).json({ error: "Department not found" });

        res.json({ message: "Department deleted successfully" });
    } catch (error) {
        console.error("Error deleting department:", error);
        res.status(500).json({ error: "Server error" });
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

// Create a new job role
const createJobRole = async (req, res) => {
    try {
        const { job_role_name, department_id } = req.body;
        if (!job_role_name || !department_id) return res.status(400).json({ error: "Job role name and department ID are required" });

        // Check if job role already exists within the same department
        const [existingJobRole] = await db.query(
            "SELECT * FROM job_roles WHERE job_role_name = ? AND department_id = ?", 
            [job_role_name, department_id]
        );

        if (existingJobRole.length > 0) {
            return res.status(400).json({ message: "Job role already exists in this department" });
        }

        await db.query("INSERT INTO job_roles (job_role_name, department_id) VALUES (?, ?)", [job_role_name, department_id]);
        res.status(201).json({ message: "Job role added successfully" });
    } catch (error) {
        console.error("Error adding job role:", error);
        res.status(500).json({ error: "Server error" });
    }
};


// Update a job role
const updateJobRole = async (req, res) => {
    try {
        const { job_role_id } = req.params;
        const { job_role_name, department_id } = req.body;

        if (!job_role_name || !department_id) return res.status(400).json({ error: "Job role name and department ID are required" });

        // Check if another job role with the same name exists in the same department
        const [existingJobRole] = await db.query(
            "SELECT * FROM job_roles WHERE job_role_name = ? AND department_id = ? AND job_role_id != ?",
            [job_role_name, department_id, job_role_id]
        );

        if (existingJobRole.length > 0) {
            return res.status(400).json({ error: "Job role already exists in this department" });
        }

        const [result] = await db.query(
            "UPDATE job_roles SET job_role_name = ?, department_id = ? WHERE job_role_id = ?",
            [job_role_name, department_id, job_role_id]
        );

        if (result.affectedRows === 0) return res.status(404).json({ error: "Job role not found" });

        res.json({ message: "Job role updated successfully" });
    } catch (error) {
        console.error("Error updating job role:", error);
        res.status(500).json({ error: "Server error" });
    }
};


// Delete a job role
const deleteJobRole = async (req, res) => {
    try {
        const { job_role_id } = req.params;

        const [result] = await db.query("DELETE FROM job_roles WHERE job_role_id = ?", [job_role_id]);

        if (result.affectedRows === 0) return res.status(404).json({ error: "Job role not found" });

        res.json({ message: "Job role deleted successfully" });
    } catch (error) {
        console.error("Error deleting job role:", error);
        res.status(500).json({ error: "Server error" });
    }
};


// Create Employee (POST Method)
const detailspost = async (req, res) => {
    const { name, email, phone_number, department_id, job_role_id, date_of_birth, hire_date, status } = req.body;

    try {
        const currentYear = new Date().getFullYear();

        // Fetch the last employee ID for the current year
        const [lastEmployee] = await db.query(
            "SELECT employee_id FROM employees WHERE employee_id LIKE ? ORDER BY employee_id DESC LIMIT 1",
            [`EMP${currentYear}%`]
        );

        let newSequence = 1;
        if (lastEmployee.length > 0) {
            const lastId = lastEmployee[0].employee_id;
            const lastSequence = parseInt(lastId.substring(7));
            newSequence = lastSequence + 1;
        }

        const employee_id = `EMP${currentYear}${String(newSequence).padStart(3, '0')}`;


        // Check for duplicate email
        const [existingEmployee] = await db.query("SELECT email FROM employees WHERE email = ?", [email]);
        if (existingEmployee.length > 0) {
            return res.status(400).json({ error: 'This email is already registered.' });
        }

        // Check for duplicate phone number
        const [existingPhoneNumber] = await db.query("SELECT phone_number FROM employees WHERE phone_number = ?", [phone_number]);
        if (existingPhoneNumber.length > 0) {
            return res.status(400).json({ error: 'This phone number is already registered.' });
        }

        // Insert new employee
        await db.query(
            "INSERT INTO employees (employee_id, name, email, phone_number, department_id, job_role_id, date_of_birth, hire_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [employee_id, name, email, phone_number, department_id, job_role_id, date_of_birth, hire_date, status]
        );

        res.status(201).json({ message: 'Employee added successfully!', employee_id });

    } catch (err) {
        console.error('Error saving employee:', err);
        res.status(500).json({ error: 'Something went wrong. Please try again later.' });
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
        // Check for duplicate email
        const [existingEmployee] = await db.query("SELECT email FROM employees WHERE email = ? AND employee_id != ?", [email, employee_id]);
        if (existingEmployee.length > 0) {
            return res.status(400).json({ error: 'This email is already registered.' });
        }

        // Check for duplicate phone number
        const [existingPhoneNumber] = await db.query("SELECT phone_number FROM employees WHERE phone_number = ? AND employee_id != ?", [phone_number, employee_id]);
        if (existingPhoneNumber.length > 0) {
            return res.status(400).json({ error: 'This phone number is already registered.' });
        }

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

module.exports = { index, detailspost, detailsupdateget, detailsupdate, detailsdelete, getDepartments, getJobRoles, createDepartment, updateDepartment, deleteDepartment, createJobRole, updateJobRole, deleteJobRole };
