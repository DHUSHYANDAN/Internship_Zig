import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { baseurl } from '../url';

function AddEmployee() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    employee_code: '',
    email: '',
    phone_number: '',
    department: '',
    job_role: '',
    hire_date: '',
    status: 'Active',
    dob: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseurl}/addEmployee`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      alert(response.data.message);
      setFormData({
        first_name: '',
        last_name: '',
        employee_code: '',
        email: '',
        phone_number: '',
        department: '',
        job_role: '',
        hire_date: '',
        status: 'Active',
        dob: ''
      });

      navigate('/viewEmployees');
    } catch (error) {
      console.error('Error:', error);
      alert(error.response ? error.response.data.error : 'Unable to submit the form. Please try again later.');
    }
  };

  return (
    <>
      <div className="header">
        <h1>Add Employee Details</h1>
        <h3><Link to="/viewEmployees" className="add-user">View Employees</Link></h3>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form_in">
          <label htmlFor="first_name">First Name:</label><br />
          <input type="text" id="first_name" value={formData.first_name} onChange={handleChange} required /><br />

          <label htmlFor="last_name">Last Name:</label><br />
          <input type="text" id="last_name" value={formData.last_name} onChange={handleChange} required /><br />

          <label htmlFor="employee_code">Employee Code:</label><br />
          <input type="text" id="employee_code" value={formData.employee_code} onChange={handleChange} required /><br />

          <label htmlFor="email">Email:</label><br />
          <input type="email" id="email" value={formData.email} onChange={handleChange} required /><br />

          <label htmlFor="phone_number">Phone Number:</label><br />
          <input type="text" id="phone_number" value={formData.phone_number} onChange={handleChange} /><br />

          <label htmlFor="department">Department:</label><br />
          <input type="text" id="department" value={formData.department} onChange={handleChange} required /><br />

          <label htmlFor="job_role">Job Role:</label><br />
          <select id="job_role" value={formData.job_role} onChange={handleChange} required>
            <option value="">Select Job Role</option>
            <option value="Developer">Developer</option>
            <option value="Manager">Manager</option>
            <option value="HR">HR</option>
          </select><br />

          <label htmlFor="hire_date">Hire Date:</label><br />
          <input type="date" id="hire_date" value={formData.hire_date} onChange={handleChange} required /><br />

          <label htmlFor="status">Status:</label><br />
          <select id="status" value={formData.status} onChange={handleChange} required>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="On Leave">On Leave</option>
          </select><br />

          <label htmlFor="dob">Date of Birth:</label><br />
          <input type="date" id="dob" value={formData.dob} onChange={handleChange} required /><br /><br />

          <button type="submit">Add Employee</button><br /><br />
        </div>
      </form>
    </>
  );
}

export default AddEmployee;
