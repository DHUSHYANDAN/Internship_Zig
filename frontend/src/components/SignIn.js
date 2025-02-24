import React, { useState } from 'react';
import { baseurl } from '../url';

const SignIn = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  

  const validateForm = () => {
    let newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch(`${baseurl}/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Sign-in failed');
      }
      alert('Login successful!');
      localStorage.setItem('token', data.token);
      localStorage.setItem('job_role', data.job_role);
      setTimeout(() => window.location.href = '/dashboard', 1000);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen pt-6">
      <div className="w-full bg-white rounded-lg shadow border sm:max-w-md p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-4">Sign In</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="johndoe@example.com" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
            <input type="password" name="password" id="password" value={formData.password} onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="••••••••" />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
          <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Sign In</button>
          <p className="text-sm text-gray-700">Don't have an account? <a className="font-medium text-blue-600 hover:underline" href="/signup">Sign up here</a></p>
        </form>
      </div>
    </section>
  );
};

export default SignIn;
