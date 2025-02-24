import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { baseurl } from "../url";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("viewEmployees");
  const [onLeaveEmployees, setOnLeaveEmployees] = useState([]);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const token = localStorage.getItem("token");

  // Fetch On-Leave Employees
  useEffect(() => {
    if (token) {
      fetch(`${baseurl}/viewEmployees`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const filteredEmployees = data.filter(
            (employee) =>
              employee.status === "On Leave" || employee.status === "Inactive"
          );
          setOnLeaveEmployees(filteredEmployees);
        })
        .catch((error) => console.error("Error fetching employees:", error));
    }
  }, [token]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>
        <nav>
          <ul className="space-y-4">
            <li>
              <button
                onClick={() => setActiveSection("viewEmployees")}
                className={`w-full text-left px-4 py-2 rounded ${
                  activeSection === "viewEmployees"
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                Manage Employees
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection("requestedUsers")}
                className={`w-full text-left px-4 py-2 rounded ${
                  activeSection === "requestedUsers"
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                Requested Employees
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Navbar */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <nav className="space-x-4">
            <button className="px-4 py-2 bg-blue-500 text-white font-medium hover:bg-blue-700 rounded">
              <Link to="/signup">Sign Up</Link>
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white font-medium hover:bg-blue-700 rounded">
              <Link to="/signIn">Sign In</Link>
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white font-medium hover:bg-red-700 rounded"
              onClick={() => {
                if (window.confirm("Are you sure you want to logout?")) {
                  localStorage.removeItem("token");
                }
              }}
            >
              <Link to="/">Log Out</Link>
            </button>
          </nav>
        </header>

        {/* Dashboard Body */}
        <main>
          {activeSection === "viewEmployees" && (
            <div className="grid grid-cols-2 gap-6">
              {/* View Employees Card */}
              <div className="bg-white p-5 shadow rounded-lg">
                <h2 className="text-lg font-semibold">View Employees</h2>
                <button className="mt-3 w-full bg-blue-500 text-white py-2 rounded">
                  <Link to="/view_Employees">View</Link>
                </button>
              </div>

              {/* Employees On Leave Card */}
              <div className="bg-white p-5 shadow rounded-lg">
                <h2 className="text-lg font-semibold">Employees On Leave</h2>
                <button
                  className="mt-3 w-full bg-blue-500 text-white py-2 rounded"
                  onClick={() => setShowEmployeeModal(true)}
                >
                  View
                </button>
              </div>
            </div>
          )}

          {activeSection === "requestedUsers" && (
            <div className="bg-white p-5 shadow rounded-lg">
              <h2 className="text-lg font-semibold">Requested Employees</h2>
              <button className="mt-3 w-full bg-yellow-500 text-white py-2 rounded">
                Review Requests
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Employee Modal */}
      {showEmployeeModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h2 className="text-lg font-semibold mb-4">Employees On Leave</h2>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowEmployeeModal(false)}
            >
              ✖
            </button>
            {onLeaveEmployees.length > 0 ? (
              <table className="min-w-full bg-white border">
                <thead>
                  <tr>
                    <th className="py-2 border">Email</th>
                    <th className="py-2 border">Name</th>
                    <th className="py-2 border">Today's Date</th>
                    <th className="py-2 border">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {onLeaveEmployees.map((employee) => (
                    <tr key={employee.id} className="text-center border">
                      <td className="border px-4 py-2">{employee.email}</td>
                      <td className="border px-4 py-2">
                        {employee.first_name} {employee.last_name}
                      </td>
                      <td className="border px-4 py-2">
                        {new Date().toLocaleDateString()}
                      </td>
                      <td className="border px-4 py-2">{employee.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 mt-2">No employees on leave</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
