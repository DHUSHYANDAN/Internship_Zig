const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

// Define the Employee Schema
const EmployeeSchema = new mongoose.Schema({
    id: { type: Number },
    first_name: { 
        type: String, 
        required: [true, 'First name is required'],
        match: [/^[A-Za-z\s]+$/, 'First name must only contain letters ']

    },
    last_name: { 
        type: String, 
        required: [true, 'Last name is required'],
        match: [/^[A-Za-z\s]+$/, 'Last name must only contain letters']
    },
    employee_code: { 
        type: String, 
        required: [true, 'Employee code is required'],
        unique: true,
        match: [/^[A-Za-z0-9\-]+$/, 'Employee code must contain only alphanumeric characters or hyphens']
    },
    email: { 
        type: String, 
        required: [true, 'Email is required'],
        unique: true,
        match: [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, 'Please enter a valid email address']
    },
    phone_number: { 
        type: String, 
        match: [/^\+?[0-9]{10}$/, 'Please enter a valid phone number']
    },
    department: { 
        type: String, 
        required: [true, 'Department is required']
    },
    job_role: { 
        type: String, 
        required: [true, 'Job role is required'],
        enum: {
            values: ['Developer', 'Manager', 'HR'],  
            message: 'Job role must be either Developer, Manager, or HR' 
        }
    }
    ,
    hire_date: { 
        type: Date, 
        required: [true, 'Hire date is required'],
        validate: {
            validator: function(v) {
                return v instanceof Date && !isNaN(v); 
            },
            message: 'Invalid hire date'
        }
    },
    status: { 
        type: String, 
        enum: {
            values: ['Active', 'Inactive', 'On Leave'],
            message: 'Status must be either Active, Inactive, or On Leave'
        },
        default: 'Active' 
    },
    dob: { 
        type: Date, 
        required: [true, 'Date of birth is required'],
        validate: {
            validator: function(v) {
                return v instanceof Date && !isNaN(v); 
            },
            message: 'Invalid date of birth'
        }
    }
});

// Add AutoIncrement Plugin
EmployeeSchema.plugin(AutoIncrement, { inc_field: 'id' });

// Create a model based on the schema
const Employee = mongoose.model('Employee', EmployeeSchema);

module.exports = Employee;
