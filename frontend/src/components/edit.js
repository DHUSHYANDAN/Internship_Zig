import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { baseurl } from "../url";

function EditEmployee() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    employee_code: "",
    email: "",
    phone_number: "",
    department: "",
    job_role: "",
    hire_date: "",
    status: "",
    dob: "",
  });

  const { employee_code } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseurl}/updateEmployee/${employee_code}`);
        if (!response.ok) throw new Error("Failed to fetch employee details.");
        const data = await response.json();
        setFormData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [employee_code]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseurl}/updateEmployee`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong!");

      alert(data.message);
      navigate("/viewEmployees");
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      {/* Header */}
      <div className="w-full max-w-3xl flex justify-between items-center bg-blue-500 text-white p-4 rounded-lg shadow-md">
        <h1 className="text-lg font-bold">Edit Employee</h1>
        <Link to="/viewEmployees" className="bg-white text-blue-500 px-4 py-2 rounded-md hover:bg-gray-200 transition">
          View Employees
        </Link>
      </div>

      {/* Form */}
      <div className="w-full max-w-3xl bg-white mt-6 p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { label: "First Name", id: "first_name", type: "text" },
            { label: "Last Name", id: "last_name", type: "text" },
            { label: "Employee Code", id: "employee_code", type: "text", readOnly: true },
            { label: "Email", id: "email", type: "email" },
            { label: "Phone Number", id: "phone_number", type: "text" },
            { label: "Department", id: "department", type: "text" },
            { label: "Hire Date", id: "hire_date", type: "date" },
            { label: "Date of Birth", id: "dob", type: "date" },
          ].map(({ label, id, type, readOnly }) => (
            <div key={id}>
              <label className="block text-gray-700">{label}</label>
              <input
                type={type}
                id={id}
                value={formData[id]}
                onChange={handleChange}
                required
                readOnly={readOnly}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          ))}

          {/* Job Role */}
          <div>
            <label className="block text-gray-700">Job Role</label>
            <select id="job_role" value={formData.job_role} onChange={handleChange} required className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="">Select Job Role</option>
              <option value="Developer">Developer</option>
              <option value="Manager">Manager</option>
              <option value="HR">HR</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-gray-700">Status</label>
            <select id="status" value={formData.status} onChange={handleChange} required className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="sm:col-span-2 flex justify-end">
            <button type="submit" className="w-full sm:w-auto bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition">
              Update Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditEmployee;
