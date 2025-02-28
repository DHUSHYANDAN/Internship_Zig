import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { baseurl } from "../url";

const AdminPanel = () => {
  const token = localStorage.getItem("token");
  const job_role = localStorage.getItem("job_role");

  if (job_role !== "Admin" || !token) {
    window.location.href = "*";
  }

  // Departments State
  const [departments, setDepartments] = useState([]);
  const [departmentName, setDepartmentName] = useState("");
  const [editDepartment, setEditDepartment] = useState(null);

  // Job Roles State
  const [jobRoles, setJobRoles] = useState([]);
  const [jobRoleName, setJobRoleName] = useState("");
  const [editJobRole, setEditJobRole] = useState(null);

  // Fetch Departments
  const fetchDepartments = useCallback(async () => {
    try {
      const response = await axios.get(`${baseurl}/getDepartments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepartments(response.data);
    } catch (error) {
      toast.error("Unable to load departments. Please try again later.");
    }
  }, [token]);

  // Fetch Job Roles
  const fetchJobRoles = useCallback(async () => {
    if (!editDepartment) {
      setJobRoles([]); // Clear job roles if no department is selected
      return;
    }
  
    try {
      const response = await axios.get(
        `${baseurl}/getJobRoles?department_id=${editDepartment.department_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setJobRoles(response.data);
    } catch (error) {
      toast.error("Unable to load job roles. Please try again later.");
    }
  }, [token, editDepartment]);
  

  useEffect(() => {
    fetchDepartments();
    fetchJobRoles();
  }, [fetchDepartments, fetchJobRoles]);

  // Add or Update Department
  const handleAddOrUpdateDepartment = async (e) => {
    e.preventDefault();
    if (!departmentName.trim()) {
      toast.error("Please enter a department name.");
      return;
    }
    try {
      if (editDepartment) {
        await axios.put(
          `${baseurl}/departments/${editDepartment.department_id}`,
          { department_name: departmentName },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Department updated successfully!");
      } else {
        await axios.post(
          `${baseurl}/departments`,
          { department_name: departmentName },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Department added successfully!");
      }
      setDepartmentName("");
      setEditDepartment(null);
      fetchDepartments();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.error);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };
  

  // Delete Department
  const handleDeleteDepartment = async (department_id) => {
    if (!window.confirm("Are you sure you want to delete this department?")) return;
    try {
      await axios.delete(`${baseurl}/departments/${department_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Department deleted successfully!");
      fetchDepartments();
    }catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.error);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

// Add or Update Job Role
const handleAddOrUpdateJobRole = async (e) => {
  e.preventDefault();
  if (!jobRoleName.trim()) {
    toast.error("Please enter a job role name.");
    return;
  }
  if (!editDepartment?.department_id) {
    toast.error("Please select a department before adding a job role.");
    return;
  }
  try {
    if (editJobRole) {
      await axios.put(
        `${baseurl}/jobRoles/${editJobRole.job_role_id}`,
        { 
          job_role_name: jobRoleName,
          department_id: editDepartment?.department_id // Ensure department_id is sent
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Job role updated successfully!");
    } else {
      await axios.post(
        `${baseurl}/jobRoles`,
        { 
          job_role_name: jobRoleName, 
          department_id: editDepartment?.department_id 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Job role added successfully!");
    }
    setJobRoleName("");
    setEditJobRole(null);
    fetchJobRoles();
  } catch (error) {
    toast.error("Failed to process request. Please try again.");
  }
};

  // Delete Job Role
  const handleDeleteJobRole = async (job_role_id) => {
    if (!window.confirm("Are you sure you want to delete this job role?")) return;
    try {
      await axios.delete(`${baseurl}/jobRoles/${job_role_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Job role deleted successfully!");
      fetchJobRoles();
    } catch (error) {
      toast.error("Unable to delete job role. Please try again later.");
    }
  };

  return (
    <div className="text-gray-900 bg-gray-200 min-h-screen p-4">
      {/* Departments Section */}
      <div className="p-4 flex">
        <h1 className="text-3xl">Departments</h1>
      </div>
      <div className="px-3 py-4 flex justify-center">
        <table className="w-5/6 text-md bg-white shadow-md rounded mb-4">
          <tbody>
            <tr className="border-b bg-gray-300">
              <th className="text-left p-3 px-10">Name</th>
              <th className="text-right p-3 px-14">Actions</th>
            </tr>
            {departments.map((dept) => (
              <tr key={dept.department_id} className="border-b hover:bg-orange-100 bg-gray-100">
                <td className="p-3 px-5">{dept.department_name}</td>
                <td className="p-3 px-5 flex justify-end">
                  <button onClick={() => { setEditDepartment(dept); setDepartmentName(dept.department_name); }} className="mr-3 text-sm text-blue-700"><svg className="h-6 w-6 text-blue-700" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />  <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />  <line x1="16" y1="5" x2="19" y2="8" /></svg></button>
                  <button onClick={() => handleDeleteDepartment(dept.department_id)} className="text-sm text-red-500"><svg className="h-6 w-6 text-red-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <line x1="4" y1="7" x2="20" y2="7" />  <line x1="10" y1="11" x2="10" y2="17" />  <line x1="14" y1="11" x2="14" y2="17" />  <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />  <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg></button>
                </td>
              </tr>
            ))}
            <tr className="border-b hover:bg-orange-100">
              <td className="p-3 px-5">
                <input type="text" placeholder="Enter department name" value={departmentName} onChange={(e) => setDepartmentName(e.target.value)} className="border-b-2 outline-none border-gray-300 py-2 w-full" />
              </td>
              <td className="p-3 px-5 flex justify-end">
                <button onClick={handleAddOrUpdateDepartment} className="bg-green-500 text-white py-1 px-2 rounded">{editDepartment ? "Update" : "Add"}</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Job Roles Section */}
      <div className="p-4 flex">
        <h1 className="text-3xl">Job Roles</h1>
      </div>
      <div className="px-3 py-4 flex justify-center">
        <table className="w-5/6 text-md bg-white shadow-md rounded mb-4">
          <tbody>
            <tr className="border-b bg-gray-300">
              <th className="text-left p-3 px-10">Job Role</th>
              <th className="text-right p-3 px-14">Actions</th>
            </tr>
            {jobRoles.map((role) => (
              <tr key={role.job_role_id} className="border-b hover:bg-orange-100 bg-gray-100">
                <td className="p-3 px-5">{role.job_role_name}</td>
                <td className="p-3 px-5 flex justify-end">
                  <button onClick={() => { setEditJobRole(role); setJobRoleName(role.job_role_name); }} className="mr-3 text-sm text-blue-700"><svg className="h-6 w-6 text-blue-700" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />  <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />  <line x1="16" y1="5" x2="19" y2="8" /></svg></button>
                  <button onClick={() => handleDeleteJobRole(role.job_role_id)} className="text-sm text-red-500"><svg className="h-6 w-6 text-red-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <line x1="4" y1="7" x2="20" y2="7" />  <line x1="10" y1="11" x2="10" y2="17" />  <line x1="14" y1="11" x2="14" y2="17" />  <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />  <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg></button>
                </td>
              </tr>
            ))}
            <tr className="border-b hover:bg-orange-100">
              <td className="p-3 px-5">
                <input type="text" placeholder="Enter job role" value={jobRoleName} onChange={(e) => setJobRoleName(e.target.value)} className="border-b-2 outline-none border-gray-300 py-2 w-full" />
              </td>
              <td className="p-3 px-5 flex justify-end">
                <button onClick={handleAddOrUpdateJobRole} className="bg-green-500 text-white py-1 px-2 rounded">{editJobRole ? "Update" : "Add"}</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
