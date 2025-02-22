const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const DashboardUserSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, 'Please enter a valid email address']
    },
    employee_code: { 
        type: String, 
        required: [true, 'Employee code is required'],
        unique: true,
        match: [/^[A-Za-z0-9\-]+$/, 'Employee code must contain only alphanumeric characters or hyphens']
    },
    password: { 
        type: String, 
        required: [true, 'Password is required'],
        minlength: 6
    }
});


const DashboardUser = mongoose.model('DashboardUser', DashboardUserSchema);

module.exports=DashboardUser;