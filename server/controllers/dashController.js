const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const DashboardUser = require('../models/dashUsers');
const Employee = require('../models/Users');

exports.signup = async (req, res) => {
    try {
        const { email, employee_code, password } = req.body;

        // Validate employee existence
        const employeeExists = await Employee.findOne({ email, employee_code });
        if (!employeeExists) {
            return res.status(400).json({ message: 'Invalid employee details. Registration not allowed.' });
        }

        // Check if user is already registered
        const userExists = await DashboardUser.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already registered. Please sign in.' });
        }

        // **Ensure password is hashed before saving**
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new DashboardUser({ email, employee_code, password: hashedPassword });
        await newUser.save();

        // **No need to return a JWT token here**
        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await DashboardUser.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Email ID' });
        }

        // **Compare entered password with hashed password**
        const isMatch = await bcrypt.compare(password, user.password);
       
        
        if (!isMatch) {
            return res.status(400).json({ message: 'Enter the Registered password' });
        }

        // Generate JWT token (valid for 2 minutes)
        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '3d' });

        res.json({ token, message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

