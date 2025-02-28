import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const SlideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const job_role = localStorage.getItem("job_role");

  return (
    <>
      {/* Overlay - only appears when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar Container */}
      <div className="fixed top-0 left-0 h-screen z-20 flex items-center">
        {/* Drag Handle / Toggle Button */}
        <div
          className="w-8 h-16 bg-gray-700 opacity-80 cursor-pointer flex items-center justify-center rounded-r-lg"
          onClick={() => setIsOpen(true)}
        >
          <span className="text-white text-xl">☰</span>
        </div>

        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 h-screen bg-white shadow-lg overflow-y-auto w-64 p-4 transition-transform duration-300 ease-in-out z-30 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Close Button */}
          <button
            className="text-gray-600 absolute top-4 right-4 text-2xl"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>

          <h2 className="text-xl mt-2 font-bold text-blue-500 mb-6">
            {job_role === "Admin" 
              ? "Admin Dashboard"
              : "Employee Dashboard"}
          </h2>
          <ul className="space-y-2 font-medium">
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `block p-2 rounded-lg ${
                    isActive ? "bg-blue-500 text-white" : "text-gray-900 hover:bg-gray-200"
                  }`
                }
              >
                Employees Overview
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/view_Employees"
                className={({ isActive }) =>
                  `block p-2 rounded-lg ${
                    isActive ? "bg-blue-500 text-white" : "text-gray-900 hover:bg-gray-200"
                  }`
                }
              >
                Manage Employees
              </NavLink>
            </li>
            {job_role === "Admin"  ? (
              <li>
                <NavLink
                  to="/manage-departments"
                  className={({ isActive }) =>
                    `block p-2 rounded-lg ${
                      isActive ? "bg-blue-500 text-white" : "text-gray-900 hover:bg-gray-200"
                    }`
                  }
                >
                 Manage Departments
                </NavLink>
              </li>
            ) : null}
            {job_role === "Admin"  ? (
              <li>
                <NavLink
                  to="/requested-Employees"
                  className={({ isActive }) =>
                    `block p-2 rounded-lg ${
                      isActive ? "bg-blue-500 text-white" : "text-gray-900 hover:bg-gray-200"
                    }`
                  }
                >
                  Requested Employees
                </NavLink>
              </li>
            ) : null}
            <li>
              <NavLink
                to="/signin"
                className={({ isActive }) =>
                  `block p-2 rounded-lg ${
                    isActive ? "bg-blue-500 text-white" : "text-gray-900 hover:bg-gray-200"
                  }`
                }
              >
                Sign In
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  `block p-2 rounded-lg ${
                    isActive ? "bg-blue-500 text-white" : "text-gray-900 hover:bg-gray-200"
                  }`
                }
              >
                Sign Up
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default SlideBar;
