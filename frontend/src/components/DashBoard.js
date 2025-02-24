import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { baseurl } from "../url";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [employeeOverview, setEmployeeOverview] = useState(null);
  const [approvalRequests, setApprovalRequests] = useState([]);
  const token = localStorage.getItem("token");
  const jobrole=localStorage.getItem("job_role")

  // Fetch Employee Overview
  useEffect(() => {
    if (token) {
      fetch(`${baseurl}/viewEmployees`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          const overview = {
            totalEmployees: data.length,
            departments: data.reduce((acc, emp) => {
              acc[emp.department] = (acc[emp.department] || 0) + 1;
              return acc;
            }, {}),
            jobRoles: data.reduce((acc, emp) => {
              acc[emp.job_role] = (acc[emp.job_role] || 0) + 1;
              return acc;
            }, {}),
            status: [
              { name: "Active", value: data.filter(emp => emp.status === "Active").length },
              { name: "Inactive", value: data.filter(emp => emp.status === "Inactive").length },
              { name: "On Leave", value: data.filter(emp => emp.status === "On Leave").length }
            ]
          };
          setEmployeeOverview(overview);
        })
        .catch(err => console.error("Error fetching employee overview:", err));
    }
  }, [token]);

  // Fetch Requested Employees
  useEffect(() => {
    if (token) {
      fetch(`${baseurl}/get-unapproved-users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setApprovalRequests(data))
        .catch((err) => console.error("Error fetching approvals:", err));
    }
  }, [token]);

  return (
    <div className="flex  bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>
        <nav>
          <ul className="space-y-4">
            <li>
              <button
                onClick={() => setActiveSection("overview")}
                className={`w-full text-left px-4 py-2 rounded ${
                  activeSection === "overview"
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                Employees Overview
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection("viewEmployees")}
                className={`w-full text-left px-4 py-2 rounded ${
                  activeSection === "viewEmployees"
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                {jobrole==='Admin'||jobrole==='Manager'?<span>Manage</span>: <span>View</span> } Employees
              </button>
            </li>
            <li>
            { jobrole==='Admin'||jobrole==='Manager' ?  <button
                onClick={() => setActiveSection("requestedUsers")}
                className={`w-full text-left px-4 py-2 rounded ${
                  activeSection === "requestedUsers"
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                Requested Employees
              </button>:null}
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold"> {jobrole==='Admin'||jobrole==='Manager'? <span>Admin</span>: <span>Employee</span> }   Dashboard</h1>
          {token ? (
            <button
              className="px-4 py-2 bg-red-500 text-white font-medium hover:bg-red-700 rounded"
              onClick={() => {
                if (window.confirm("Are you sure you want to logout?")) {
                  localStorage.removeItem("token");
                  window.location.href = "/signin";
                }
              }}
            >
              Log Out
            </button>
          ) : (
            <div className="space-x-4">
              <Link to="/signin" className="px-4 py-2 bg-blue-500 text-white rounded">
                Sign In
              </Link>
              <Link to="/signup" className="px-4 py-2 bg-blue-500 text-white rounded">
                Sign Up
              </Link>
            </div>
          )}
        </header>

        {/* Dashboard Body */}
        <main>
          {activeSection === "overview" && employeeOverview && (
            <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Total Employees Card */}
              <div className="bg-white p-6 shadow-lg rounded-lg text-center">
                <h2 className="text-lg font-semibold">Total Employees</h2>
                <p className="text-4xl font-bold mt-2">{employeeOverview.totalEmployees}</p>
              </div>

               {/* Departments Chart */}
               <div className="bg-white p-6 shadow-lg rounded-lg">
                <h2 className="text-lg font-semibold text-center mb-4">Departments</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={Object.entries(employeeOverview.departments).map(([name, value]) => ({ name, value }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {Object.entries(employeeOverview.departments).map(([_, value], index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Employee Status Chart */}
              <div className="bg-white p-6 shadow-lg rounded-lg">
                <h2 className="text-lg font-semibold text-center mb-4">Employee Status</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={employeeOverview.status}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {employeeOverview.status.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* job_role */}
              <div className="bg-white p-6 shadow-lg rounded-lg">
                <h2 className="text-lg font-semibold text-center mb-4">Job Roles</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={Object.entries(employeeOverview.jobRoles).map(([name, value]) => ({ name, value }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {Object.entries(employeeOverview.jobRoles).map(([_, value], index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
          

             
            </div>
          )}

          {activeSection === "viewEmployees" && (
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white p-5 shadow rounded-lg">
                <h2 className="text-lg font-semibold">View Employees</h2>
                <button className="mt-3 w-full bg-blue-500 text-white py-2 rounded">
                  <Link to="/view_Employees">View</Link>
                </button>
              </div>
            </div>
          )}

          {activeSection === "requestedUsers" && (
            <div className="bg-white p-6 shadow-lg rounded-lg">
              <h3 className="text-xl font-bold mb-3">Approval Requests</h3>
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">S. NO</th>
                    <th className="border p-2">Email</th>
              
                    <th className="border p-2 ">Status</th>
                  </tr>
                </thead>
                <tbody>
  {approvalRequests && approvalRequests.length > 0 ? (
    approvalRequests.map((user, index) => (
      <tr key={index} className="border">
        <td className="border text-center p-2">{index + 1}</td>
      
        <td className="border p-2">{user.email}</td>
        <td className="border p-2 text-red-500 font-bold">Pending</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="4" className="border p-2 text-center text-gray-500">
        No approval requests found
      </td>
    </tr>
  )}
</tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
