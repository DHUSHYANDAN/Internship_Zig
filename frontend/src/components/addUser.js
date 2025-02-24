import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { baseurl } from "../url";

function AddEmployee() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    employee_code: "",
    email: "",
    phone_number: "",
    department: "",
    job_role: "",
    hire_date: "",
    status: "Active",
    dob: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const job_role = localStorage.getItem("job_role");
  useEffect(() => {
    if (job_role !== "Admin" && job_role!=="Manager" )
       {alert("You not have the acess to Add users!");
        navigate("/view_Employees")};
  }, [job_role,navigate]);


  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const validateForm = () => {
    let newErrors = {};
    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const phoneRegex = /^\+?[0-9]{10}$/;
    const employeeCodeRegex = /^[A-Za-z0-9-]+$/;

    if (!formData.first_name.match(nameRegex)) newErrors.first_name = "First name must only contain letters";
    if (!formData.last_name.match(nameRegex)) newErrors.last_name = "Last name must only contain letters";
    if (!formData.email.match(emailRegex)) newErrors.email = "Invalid email format";
    if (!formData.phone_number.match(phoneRegex)) newErrors.phone_number = "Invalid phone number";
    if (!formData.employee_code.match(employeeCodeRegex)) newErrors.employee_code = "Invalid employee code";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.job_role) newErrors.job_role = "Job role is required";
    if (!formData.hire_date) newErrors.hire_date = "Hire date is required";
    if (!formData.dob) newErrors.dob = "Date of birth is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch(`${baseurl}/addEmployee`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "You not have the acess to Add users!");

      alert(data.message);
      setFormData({
        first_name: "",
        last_name: "",
        employee_code: "",
        email: "",
        phone_number: "",
        department: "",
        job_role: "",
        hire_date: "",
        status: "Active",
        dob: "",
      });

      navigate("/view_Employees");
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <div className="w-full max-w-3xl flex justify-between items-center bg-blue-500 text-white p-4 rounded-lg shadow-md">
        <h1 className="text-lg font-bold">Add Employee</h1>
        <Link to="/view_Employees" className="bg-white text-blue-500 px-4 py-2 rounded-md hover:bg-gray-200 transition">
          View Employees
        </Link>
      </div>

      <div className="w-full max-w-3xl bg-white mt-6 p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { label: "First Name", id: "first_name", type: "text" },
            { label: "Last Name", id: "last_name", type: "text" },
            { label: "Employee Code", id: "employee_code", type: "text" },
            { label: "Email", id: "email", type: "email" },
            { label: "Phone Number", id: "phone_number", type: "text" },
            { label: "Department", id: "department", type: "text" },
            { label: "Hire Date", id: "hire_date", type: "date" },
            { label: "Date of Birth", id: "dob", type: "date" },
          ].map(({ label, id, type }) => (
            <div key={id}>
              <label className="block text-gray-700">{label}</label>
              <input
                type={type}
                id={id}
                value={formData[id]}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors[id] && <p className="text-red-500 text-sm">{errors[id]}</p>}
            </div>
          ))}

          <div>
            <label className="block text-gray-700">Job Role</label>
            <select id="job_role" value={formData.job_role} onChange={handleChange} className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="">Select Job Role</option>
              <option value="Developer">Developer</option>
              <option value="Manager">Manager</option>
              <option value="HR">HR</option>
            </select>
            {errors.job_role && <p className="text-red-500 text-sm">{errors.job_role}</p>}
          </div>

          <div>
            <label className="block text-gray-700">Status</label>
            <select id="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>

          <div className="sm:col-span-2 flex justify-end">
            <button type="submit" className="w-full sm:w-auto bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition">
              Add Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEmployee;
