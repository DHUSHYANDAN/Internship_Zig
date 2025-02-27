import React, { useState, useEffect } from "react";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { baseurl } from "../url";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const AdminDashboard = () => {

  const [employeeOverview, setEmployeeOverview] = useState(null);

  const token = localStorage.getItem("token");
  

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



  return (
    <div className="flex screen-h  bg-gray-100">
      
      {/* Main Content */}
      <div className="flex-1 p-6">
       

        {/* Dashboard Body */}
        <main>
          { employeeOverview && (
            <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-6">

             { /* Total Employees Card */}
              <div className="bg-white p-6 shadow-lg rounded-lg text-center">
                <h2 className="text-lg font-semibold">Total Employees</h2>
                <p className="text-4xl font-bold mt-1">{employeeOverview.totalEmployees}</p>
                <div className="flex justify-center">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/3135/3135768.png"
                    className="w-1/2"
                    alt="Employee Management Logo"
                  />
                </div>
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

          
        
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
