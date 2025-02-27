import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { baseurl } from "../url";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddEmployee() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    department_id: "",
    job_role_id: "",
    hire_date: "",
    status: "Active",
    date_of_birth: "",
  });

  const [departments, setDepartments] = useState([]);
  const [jobRoles, setJobRoles] = useState([]);
  const [errors, setErrors] = useState({});
  const token = localStorage.getItem("token");
  const job_role = localStorage.getItem("job_role");
  const navigate = useNavigate();

  // Redirect non-admin users
  useEffect(() => {
    if (job_role !== "Admin") {
      toast.error("You do not have access to add employees!");
      navigate("/view_Employees");
    }
  }, [job_role, navigate]);

  // Fetch Departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch(`${baseurl}/getDepartments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) setDepartments(data);
        else throw new Error(data.error || "Failed to load departments");
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchDepartments();
  }, [token]);

  // Fetch Job Roles dynamically based on department selection
  useEffect(() => {
    if (!formData.department_id) {
      setJobRoles([]);
      return;
    }

    const fetchJobRoles = async () => {
      try {
        const response = await fetch(`${baseurl}/getJobRoles?department_id=${formData.department_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) setJobRoles(data);
        else throw new Error(data.error || "Failed to load job roles");
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchJobRoles();
  }, [formData.department_id, token]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    validateField(id, value);
  };

  const validateField = (id, value) => {
    let errorMsg = "";
    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const phoneRegex = /^\+?[0-9]{10}$/;

    switch (id) {
      case "name":
        if (!value.match(nameRegex)) errorMsg = "Name must contain only letters";
        break;
      case "email":
        if (!value.match(emailRegex)) errorMsg = "Invalid email format";
        break;
      case "phone_number":
        if (!value.match(phoneRegex)) errorMsg = "Invalid phone number";
        break;
      case "department_id":
        if (!value) errorMsg = "Please select a department";
        break;
      case "job_role_id":
        if (!value) errorMsg = "Please select a job role";
        break;
      case "hire_date":
      case "date_of_birth":
        if (!value) errorMsg = "This field is required";
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [id]: errorMsg }));
  };

  const validateForm = () => {
    let newErrors = {};
    Object.keys(formData).forEach((key) => {
      validateField(key, formData[key]);
      if (!formData[key]) {
        newErrors[key] = "This field is required";
      }
    });

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill all fields correctly");
      return;
    }

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

      toast.success("Employee added successfully!");
      setTimeout(() => navigate("/view_Employees"), 1000);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <ToastContainer />
      <div className="w-full max-w-3xl flex justify-between items-center bg-blue-500 text-white p-4 rounded-lg shadow-md">
        <h1 className="text-lg font-bold">Add Employee</h1>
        <Link to="/view_Employees" className="bg-white text-blue-500 px-4 py-2 rounded-md hover:bg-gray-200 transition">
          View Employees
        </Link>
      </div>

      <div className="w-full max-w-3xl bg-white mt-6 p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { label: "Name", id: "name", type: "text" },
            { label: "Email", id: "email", type: "email" },
            { label: "Phone Number", id: "phone_number", type: "text" },
            { label: "Hire Date", id: "hire_date", type: "date" },
            { label: "Date of Birth", id: "date_of_birth", type: "date" },
          ].map(({ label, id, type }) => (
            <div key={id}>
              <label className="block text-gray-700">{label}</label>
              <input type={type} id={id} value={formData[id]} onChange={handleChange} className="w-full p-2 border rounded-md" />
              {errors[id] && <p className="text-red-500 text-sm">{errors[id]}</p>}
            </div>
          ))}

          <div>
            <label className="block text-gray-700">Department</label>
            <select id="department_id" value={formData.department_id} onChange={handleChange} className="w-full p-2 border rounded-md">
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.department_id} value={dept.department_id}>{dept.department_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700">Job Role</label>
            <select id="job_role_id" value={formData.job_role_id} onChange={handleChange} className="w-full p-2 border rounded-md">
              <option value="">Select Job Role</option>
              {jobRoles.map((role) => (
                <option key={role.job_role_id} value={role.job_role_id}>{role.job_role_name}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Add Employee</button>
        </form>
      </div>
    </div>
  );
}

export default AddEmployee;
