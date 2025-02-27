const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const DashboardUser = require('../models/dashUsers');
const Employee = require('../models/Users');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();





exports.signup = async (req, res) => {
    try {
        const { email, employee_code, password } = req.body;

        const employeeExists = await Employee.findOne({ email, employee_code });
        if (!employeeExists) {
            return res.status(400).json({ message: 'Invalid User Registeration. Email or employee Id is wrong ' });
        }

        const userExists = await DashboardUser.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already registered. Please sign in.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const approvalToken = crypto.randomBytes(32).toString('hex'); // Generate a random token
        
        const newUser = new DashboardUser({
            first_name: employeeExists.first_name,
            last_name: employeeExists.last_name,
            email,
            employee_code,
            job_role: employeeExists.job_role,
            password: hashedPassword,
            approved: false,  // User needs admin approval
            approvalToken,    // Save token for approval link
        });

        await newUser.save();

        // Fetch admin and manager emails
        const adminsAndManagers = await DashboardUser.find({ job_role: { $in: ['Admin', 'Manager'] } });
        const adminEmails = adminsAndManagers.map(user => user.email);

        // Send approval request email
        if (adminEmails.length > 0) {
            sendApprovalEmail(adminEmails, email, approvalToken);
        }

        res.status(201).json({ message: 'User registered successfully. Wait for admin approval to login.' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Function to send an email with an approval link
const sendApprovalEmail = (adminEmails, newUserEmail, approvalToken) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // Your email
            pass: process.env.EMAIL_PASS  // Your email password or app password
        }
    });

    const approvalLink = `${process.env.BASE_URL}/approve-user?email=${newUserEmail}&token=${approvalToken}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: adminEmails.join(','),
        subject: 'New User Approval Required',
        html: `
            <p>A new user with email <strong>${newUserEmail}</strong> has registered.</p>
            <p>Click the button below to approve access:</p>
            <a href="${approvalLink}" style="display:inline-block; padding:10px 20px; color:white; background-color:green; text-decoration:none; border-radius:5px;">Approve User</a>
            <p>If you did not request this, please ignore this email.</p>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Approval email sent:', info.response);
        }
    });
};

exports.approveUser = async (req, res) => {
    try {
        const { email, token } = req.query;

        const user = await DashboardUser.findOne({ email, approvalToken: token });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired approval link.' });
        }

        user.approved = true;
        user.approvalToken = null; // Clear token after approval
        await user.save();

        res.status(200).json({ message: 'User approved successfully. They can now log in.' });
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

      

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect password' });
        }

        if (!user.approved) {
            return res.status(403).json({ message: 'Access denied. Waiting for admin approval.' });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email, job_role: user.job_role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '3d' }
        );
        

        res.json({ token, job_role: user.job_role,email: user.email, 
            first_name: user.first_name,last_name:user.last_name,  message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getUnapprovedUsers = async (req, res) => {
    try {
        const unapprovedUsers = await DashboardUser.find({ approved: false });

        if (unapprovedUsers.length === 0) {
            return res.status(404).json({ message: 'No unapproved users found.' });
        }

        res.status(200).json(unapprovedUsers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

