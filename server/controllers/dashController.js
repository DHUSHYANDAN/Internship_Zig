const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/Employee'); // MySQL connection
const nodemailer = require('nodemailer');
require('dotenv').config();

// Signup Controller
const signup = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Check if user already exists
        const [existingUser] = await db.query("SELECT email FROM users WHERE email = ?", [email]);

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Email already exists. Please use a different email.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Set request_status based on role
        const requestStatus = role === 'Admin' ? 'Pending' : 'Approved';

        // Insert new user
        const [result] = await db.query(
            "INSERT INTO users (name, email, password, role, request_status) VALUES (?, ?, ?, ?, ?)",
            [name, email, hashedPassword, role, requestStatus]
        );

        // Send admin request email if role is Admin
        if (role === 'Admin') {
            sendAdminApprovalEmail(name, email);
        }

        res.status(200).json({ message: 'Signup successful. A wait for approval ' });

    } catch (err) {
        console.error('Error in signup:', err);
        res.status(500).json({ error: 'Error in signup' });
    }
};

// Signin Controller
const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

        if (users.length === 0) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const user = users[0];

        // Check if the account is approved
        if (user.request_status !== "Approved") {
            return res.status(403).json({ error: "Your account is not approved yet." });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { user_id: user.user_id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "5h" }
        );

        res.json({
            message: "Login successful",
            token,
            role: user.role,  
            name: user.name, 
        });

    } catch (err) {
        console.error("Error in signin:", err.message);
        res.status(500).json({ error: "Internal server error. Please try again later." });
    }
};


// Fetch Unapproved Users (Admin Only)
const getUnapprovedUsers = async (req, res) => {
    try {
        const [users] = await db.query("SELECT user_id, name, email, role, request_status FROM users WHERE request_status = 'Pending'");
        res.json(users);
    } catch (err) {
        console.error('Error fetching unapproved users:', err);
        res.status(500).json({ error: 'Error fetching unapproved users' });
    }
};

// Approve User Request (Admin Only)
const approveUser = async (req, res) => {
    const { user_id } = req.params;

    try {
        const [result] = await db.query("UPDATE users SET request_status = 'Approved' WHERE user_id = ?", [user_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found or already approved.' });
        }

        res.json({ message: 'User approved successfully.' });

    } catch (err) {
        console.error('Error approving user:', err);
        res.status(500).json({ error: 'Error approving user' });
    }
};

// Reject User Request (Admin Only)
const rejectUser = async (req, res) => {
    const { user_id } = req.params;

    try {
        const [result] = await db.query("UPDATE users SET request_status = 'Rejected' WHERE user_id = ?", [user_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found or already rejected.' });
        }

        res.json({ message: 'User rejected successfully.' });

    } catch (err) {
        console.error('Error rejecting user:', err);
        res.status(500).json({ error: 'Error rejecting user' });
    }
};

// Send Email for Admin Approval
const sendAdminApprovalEmail = async (name, email) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.ADMIN_EMAIL,
            pass: process.env.ADMIN_EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to: process.env.ADMIN_EMAIL,
        subject: 'New Admin Approval Request',
        html: `
            <h3>New Admin Request</h3>
            <p>User <b>${name}</b> (${email}) has requested Admin access.</p>
            <p>
                <a href="${process.env.BASE_URL}/approve-user/${email}">Approve</a> |
                <a href="${process.env.BASE_URL}/reject/${email}">Reject</a>
            </p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Approval email sent to admin.');
    } catch (error) {
        console.error('Error sending approval email:', error);
    }
};

module.exports = { signup, signin, getUnapprovedUsers, approveUser, rejectUser };
