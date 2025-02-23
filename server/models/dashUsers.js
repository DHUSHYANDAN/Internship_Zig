const mongoose = require('mongoose');

const DashboardUserSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    employee_code: { 
        type: String, 
        required: true,
        unique: true
    },
    job_role: { 
        type: String, 
        required: true,
        enum: ['Developer', 'Manager', 'HR', 'Admin']
    },
    password: { 
        type: String, 
        required: true,
        minlength: 6
    },
    approved: { 
        type: Boolean, 
        default: false  
    },
    approvalToken: { 
        type: String,  // Store the approval token
        default: null
    }
});

const DashboardUser = mongoose.model('DashboardUser', DashboardUserSchema);
module.exports = DashboardUser;
