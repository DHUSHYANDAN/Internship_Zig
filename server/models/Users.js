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
        unique: true
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
            values: ['Developer', 'Manager', 'HR', 'Admin'],  
            message: 'Job role must be either Developer, Manager, HR, or Admin' 
        }
    },
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

// Auto Increment Plugin for `id`
EmployeeSchema.plugin(AutoIncrement, { inc_field: 'id' });

// Pre-save middleware to generate employee_code
EmployeeSchema.pre('save', async function (next) {
    if (!this.employee_code) {
        const currentYear = new Date().getFullYear().toString();
        const lastEmployee = await mongoose.model('Employee').findOne().sort({ id: -1 });

        let nextNumber = "001"; // Default for first employee of the year

        if (lastEmployee && lastEmployee.employee_code) {
            const lastCode = lastEmployee.employee_code;
            const lastYear = lastCode.substring(3, 7);
            const lastSequence = parseInt(lastCode.substring(7), 10);

            if (lastYear === currentYear) {
                nextNumber = String(lastSequence + 1).padStart(3, "0");
            }
        }

        this.employee_code = `EMP${currentYear}${nextNumber}`;
    }
    next();
});

// Create a model based on the schema
const Employee = mongoose.model('Employee', EmployeeSchema);

module.exports = Employee;
