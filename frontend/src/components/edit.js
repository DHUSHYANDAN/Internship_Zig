import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { baseurl } from "../url";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EditEmployee() {
  const [formData, setFormData] = useState({
    name: "",
    employee_code: "",
    email: "",
    phone_number: "",
    department_id: "",
    job_role_id: "",
    hire_date: "",
    status: "",
    date_of_birth: "",
  });

  const [errors, setErrors] = useState({});
    const [departments, setDepartments] = useState([]);
    const [jobRoles, setJobRoles] = useState([]);
  const { employee_code } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseurl}/updateEmployee/${employee_code}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Unauthorized: Please log in again.");
          }
          throw new Error("You do not have access to edit or delete users!");
        }

        const data = await response.json();
        setFormData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(error.message);
        navigate("/view_Employees");
      }
    };

    if (token) {
      fetchData();
    } else {
      toast.warning("Unauthorized: Please log in first.");
      navigate("/SignIn");
    }
  }, [employee_code, token, navigate]);

    // Fetch Departments
    useEffect(() => {
      const fetchDepartments = async () => {
        try {
          const response = await fetch(`${baseurl}/getDepartments`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          if (response.ok) setDepartments(data);
          else throw new Error(data.error || "No departments available");
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
    setFormData({ ...formData, [id]: value });
  };

  const validateForm = () => {
    let newErrors = {};
    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const phoneRegex = /^\+?[0-9]{10}$/;
    

    if (!formData.name.match(nameRegex)) newErrors.first_name = " Name must only contain letters";
   
    if (!formData.email.match(emailRegex)) newErrors.email = "Invalid email format";
    if (!formData.phone_number.match(phoneRegex)) newErrors.phone_number = "Invalid phone number";
    if (formData.employee_code==="") newErrors.employee_code = "Invalid employee code";
    if (!formData.department_id) newErrors.department_id = "Department is required";
    if (!formData.job_role_id) newErrors.job_role_id = "Job role is required";
    if (!formData.hire_date) newErrors.hire_date = "Hire date is required";
    if (!formData.date_of_birth) newErrors.date_of_birth = "Date of birth is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch(`${baseurl}/updateEmployee`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong!");

      toast.success("Employee updated successfully!");
      setTimeout(() => {
        navigate("/view_Employees");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <div className="w-full max-w-3xl flex justify-between items-center bg-blue-500 text-white p-4 rounded-lg shadow-md">
        <h1 className="text-lg font-bold">Edit Employee</h1>
        <Link to="/view_Employees" className="bg-white text-blue-500 px-4 py-2 rounded-md hover:bg-gray-200 transition">
          View Employees
        </Link>
      </div>

      {/* Form */}
      <div className="w-full max-w-3xl bg-white mt-6 p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { label: "Name", id: "name", type: "text" },
           
            { label: "Employee Id", id: "employee_id", type: "text", readOnly: true },
            { label: "Email", id: "email", type: "email" },
            { label: "Phone Number", id: "phone_number", type: "number" },
            { label: "Hire Date", id: "hire_date", type: "date" },
            { label: "Date of Birth", id: "date_of_birth", type: "date" },
          ].map(({ label, id, type, readOnly }) => (
            <div key={id}>
              <label className="block text-gray-700">{label}</label>
              <input
                type={type}
                id={id}
                value={formData[id]}
                onChange={handleChange}
                readOnly={readOnly}
                max="2025-01-01"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
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
            {errors["department_id"] && <p className="text-red-500 text-sm">{errors["department_id"]}</p>}
          </div>

          {/* Job Role */}
         <div>
            <label className="block text-gray-700">Job Role</label>
            <select id="job_role_id" value={formData.job_role_id} onChange={handleChange} className="w-full p-2 border rounded-md">
              <option value="">Select Job Role</option>
              {jobRoles.map((role) => (
                <option key={role.job_role_id} value={role.job_role_id}>{role.job_role_name}</option>
              ))}
            </select>
            {errors["job_role_id"] && <p className="text-red-500 text-sm">{errors["job_role_id"]}</p>}
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
