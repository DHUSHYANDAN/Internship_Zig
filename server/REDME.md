//mysql queries

create database Employee_Management;
show databases;
use Employee_Management;
select * from departments;
CREATE TABLE departments (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE job_roles (
    job_role_id INT AUTO_INCREMENT PRIMARY KEY,
    job_role_name VARCHAR(100) NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE CASCADE,
    UNIQUE (job_role_name, department_id)
);
select * from job_roles;

INSERT INTO departments (department_name) VALUES
('Human Resources'),
('Finance'),
('Engineering'),
('Marketing'),
('Sales');

INSERT INTO job_roles (job_role_name, department_id) VALUES
-- Human Resources
('HR Manager', 1),
('Recruiter', 1),

-- Finance
('Accountant', 2),
('Financial Analyst', 2),

-- Engineering
('Software Engineer', 3),
('DevOps Engineer', 3),
('QA Engineer', 3),

-- Marketing
('Marketing Manager', 4),
('SEO Specialist', 4),

-- Sales
('Sales Executive', 5),
('Business Development Manager', 5);


CREATE TABLE employees (
    employee_id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    date_of_birth DATE NOT NULL,
    phone_number VARCHAR(15) NOT NULL UNIQUE,
    department_id INT NOT NULL,
    job_role_id INT NOT NULL,
hire_date DATE DEFAULT (CURRENT_DATE),

    status ENUM('Active', 'On Leave', 'Inactive') DEFAULT 'Active',
    
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE CASCADE,
    FOREIGN KEY (job_role_id) REFERENCES job_roles(job_role_id) ON DELETE CASCADE
);

select * from employees;

SELECT j.job_role_name, d.department_name 
FROM job_roles j
JOIN departments d ON j.department_id = d.department_id;



CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Employee') DEFAULT 'Employee',
    request_status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Approved',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
select * from users;
SELECT * FROM users WHERE user_id = 1;

DELETE FROM users WHERE user_id=1;

UPDATE users SET user_id=1 WHERE name='Dhushyandan';
