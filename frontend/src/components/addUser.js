import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { baseurl } from "../url";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddEmployee() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    department: "",
    job_role: "",
    hire_date: "",
    status: "Active",
    dob: "",
  });

  const token = localStorage.getItem("token");
  const job_role = localStorage.getItem("job_role");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Restrict access to Admin and Manager
  useEffect(() => {
    if (job_role !== "Admin" && job_role !== "Manager") {
      toast.error("You do not have access to add employees!");
      navigate("/view_Employees");
    }
  }, [job_role, navigate]);

  // Handle input change
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // Validate individual fields onBlur
  const validateField = (id, value) => {
    let errorMsg = "";
    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const phoneRegex = /^\+?[0-9]{10}$/;

    switch (id) {
      case "first_name":
      case "last_name":
        if (!value.match(nameRegex)) errorMsg = "Must contain only letters";
        break;
      case "email":
        if (!value.match(emailRegex)) errorMsg = "Invalid email format";
        break;
      case "phone_number":
        if (!value.match(phoneRegex)) errorMsg = "Invalid phone number";
        break;
      case "department":
      case "job_role":
      case "hire_date":
      case "dob":
        if (!value) errorMsg = "This field is required";
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [id]: errorMsg }));
  };

  // Validate form before submission
  const validateForm = () => {
    let newErrors = {};
    Object.keys(formData).forEach((key) => {
      validateField(key, formData[key]);
    });
    return Object.values(newErrors).every((error) => !error);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch(`${baseurl}/addEmployee`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error adding employee");

    
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        department: "",
        job_role: "",
        hire_date: "",
        status: "Active",
        dob: "",
      });
      toast.success("Employee added successfully!");
      setTimeout(() => {
        navigate("/view_Employees");
      }, 1000);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <ToastContainer />

      {/* Header Section */}
      <div className="w-full max-w-3xl flex justify-between items-center bg-blue-500 text-white p-4 rounded-lg shadow-md">
        <h1 className="text-lg font-bold">Add Employee</h1>
        <Link
          to="/view_Employees"
          className="bg-white text-blue-500 px-4 py-2 rounded-md hover:bg-gray-200 transition"
        >
          View Employees
        </Link>
      </div>

      {/* Form Section */}
      <div className="w-full max-w-3xl bg-white mt-6 p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { label: "First Name", id: "first_name", type: "text" },
            { label: "Last Name", id: "last_name", type: "text" },
            { label: "Email", id: "email", type: "email" },
            { label: "Phone Number", id: "phone_number", type: "number" },
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
                max="2025-01-01"
                onBlur={(e) => validateField(id, e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors[id] && <p className="text-red-500 text-sm">{errors[id]}</p>}
            </div>
          ))}

          {/* Job Role Dropdown */}
          <div>
            <label className="block text-gray-700">Job Role</label>
            <select
              id="job_role"
              value={formData.job_role}
              onChange={handleChange}
              onBlur={(e) => validateField("job_role", e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Job Role</option>
              <option value="Developer">Developer</option>
              <option value="Manager">Manager</option>
              <option value="HR">HR</option>
            </select>
            {errors.job_role && <p className="text-red-500 text-sm">{errors.job_role}</p>}
          </div>

          {/* Status Dropdown */}
          <div>
            <label className="block text-gray-700">Status</label>
            <select
              id="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Add Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEmployee;
