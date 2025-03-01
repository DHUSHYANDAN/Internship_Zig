import React, { useState } from 'react';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePassword = (password) => {
        return password.length >= 6;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let valid = true;

        if (!email) {
            setEmailError('Email is required');
            valid = false;
        } else if (!validateEmail(email)) {
            setEmailError('Invalid email format');
            valid = false;
        } else {
            setEmailError('');
        }

        if (!password) {
            setPasswordError('Password is required');
            valid = false;
        } else if (!validatePassword(password)) {
            setPasswordError('Password must be at least 6 characters long');
            valid = false;
        } else {
            setPasswordError('');
        }

        if (valid) {
            // Add your sign-in logic here
            console.log('Email:', email);
            console.log('Password:', password);
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (!validateEmail(e.target.value)) {
            setEmailError('Invalid email format');
        } else {
            setEmailError('');
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (!validatePassword(e.target.value)) {
            setPasswordError('Password must be at least 6 characters long');
        } else {
            setPasswordError('');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-black">Sign In</h2>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-black">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={email}
                            onChange={handleEmailChange}
                        />
                        {emailError && <p className="text-red-500">{emailError}</p>}
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-black">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                        {passwordError && <p className="text-red-500">{passwordError}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Sign In
                    </button>
                </form>
                <div className="text-center">
                    <p className="text-sm text-black">
                        Don't have an account?{' '}
                        <a href="/signup" className="font-medium text-blue-500 hover:text-blue-700">
                            Sign Up
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignIn;