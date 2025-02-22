const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const DashboardUser = require('../models/dashUsers');
const Employee = require('../models/Users');
exports.signup = async (req, res) => {
    try {
        const { email, employee_code, password } = req.body;

        const employeeExists = await Employee.findOne({ email, employee_code });
        if (!employeeExists) {
            return res.status(400).json({ message: 'Invalid employee details. Registration not allowed.' });
        }

        const userExists = await DashboardUser.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already registered. Please sign in.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new DashboardUser({
            email,
            employee_code,
            job_role: employeeExists.job_role,
            password: hashedPassword,
            approved: false  // New users need approval
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully. Waiting for admin approval.' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await DashboardUser.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Email ID' });
        }

        if (!user.approved) {
            return res.status(403).json({ message: 'Access denied. Waiting for admin approval.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect password' });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email, job_role: user.job_role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '3d' }
        );
        

        res.json({ token, message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.approveUser = async (req, res) => {
    try {
        const { userId } = req.body;
        
        const approver = await DashboardUser.findById(req.user.userId);
        if (!approver || (approver.job_role !== 'Admin' && approver.job_role !== 'Manager')) {
            return res.status(403).json({ message: 'Access denied. Only Admin or Manager can approve users.' });
        }

        const user = await DashboardUser.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.approved = true;
        await user.save();

        res.json({ message: `User ${user.email} has been approved.` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPendingApprovals = async (req, res) => {
    try {
        console.log("User from token:", req.user); // Debugging

        // Fetch the approver based on their _id
        const approver = await DashboardUser.findById(req.user.userId);

        if (!approver) {
            return res.status(404).json({ message: 'No request found' });
        }

        console.log("Approver job role:", approver.job_role); // Debugging

        if (approver.job_role !== 'Admin' && approver.job_role !== 'Manager') {
            return res.status(403).json({ message: 'Access denied. Only Admins or Managers can view pending approvals.' });
        }

        // Fetch users whose 'approved' status is false
        const pendingUsers = await DashboardUser.find({ approved: false }, 'email employee_code job_role');

        res.json({ pendingUsers });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
