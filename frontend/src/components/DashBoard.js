import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { baseurl } from "../url";

const AdminDashboard = () => {
  const [employeeOverview, setEmployeeOverview] = useState(null);
  const token = localStorage.getItem("token");

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
              acc[emp.department_name] = (acc[emp.department_name] || 0) + 1;
              return acc;
            }, {}),
            jobRoles: data.reduce((acc, emp) => {
              acc[emp.job_role_name] = (acc[emp.job_role_name] || 0) + 1;
              return acc;
            }, {}),
            status: data.reduce((acc, emp) => {
              acc[emp.status] = (acc[emp.status] || 0) + 1;
              return acc;
            }, {}),
          };
          setEmployeeOverview(overview);
        })
        .catch(err => console.error("Error fetching employee overview:", err));
    }
  }, [token]);

  return (
    <div className="flex  bg-gray-100">
      <div className="flex-1 p-6">
        {employeeOverview && (
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Total Employees Card */}
            <div className="bg-white p-6 shadow-lg rounded-lg text-center">
              <h2 className="text-lg font-semibold">Total Employees</h2>
              <p className="text-4xl mb-2 font-bold mt-1">{employeeOverview.totalEmployees}</p>
              <div className="flex justify-center">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/3135/3135768.png"
                    className="w-1/2"
                    alt="Employee Management Logo"
                  />
                </div>
            </div>

            {/* Departments Chart - Bar Chart */}
            <div className="bg-white p-6 shadow-lg rounded-lg">
              <h2 className="text-lg font-semibold text-center mb-4">Departments</h2>
              <Chart
                type="bar"
                height={250}
                series={[{ data: Object.values(employeeOverview.departments) }]}
                options={{
                  chart: { toolbar: { show: false } },
                  xaxis: { categories: Object.keys(employeeOverview.departments) },
                }}
              />
            </div>

               {/* Job Roles Chart - Donut Chart */}
               <div className="bg-white pt-6   shadow-lg  rounded-lg">
              <h2 className="text-lg font-semibold text-center mb-4">Job Roles</h2>
              <Chart
                type="donut"
                height={250}
                
                series={Object.values(employeeOverview.jobRoles)}
                options={{
                  labels: Object.keys(employeeOverview.jobRoles),
                }}
              />
            </div>

             {/* Employee Status Chart - Pie Chart */}
             <div className="bg-white p-6 shadow-lg rounded-lg">
              <h2 className="text-lg font-semibold text-center mb-4">Employee Status</h2>
              <Chart
                type="pie"
                height={250}
                series={Object.values(employeeOverview.status)}
                options={{
                  labels: Object.keys(employeeOverview.status),
                }}
              />
            </div>

         

           
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
