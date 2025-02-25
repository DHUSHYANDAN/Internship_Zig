import React, { useState } from "react";
import { Link } from "react-router-dom";

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
          className={`fixed top-0 left-0 h-screen bg-white  shadow-lg overflow-y-auto w-64 p-4 transition-transform duration-300 ease-in-out z-30 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Close Button */}
          <button
            className="text-gray-600  absolute top-4 right-4 text-2xl"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>

          <h2 className="text-xl mt-2 font-bold text-blue-500 mb-6">
            {job_role === "Admin" || job_role === "Manager"
              ? "Admin Dashboard"
              : "Employee Dashboard"}
          </h2>
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                to="/dashboard"
                className="block p-2 text-gray-900 rounded-lg hover:bg-gray-200"
              >
                Employees Overview
              </Link>
            </li>
            <li>
              <Link
                to="/view_Employees"
                className="block p-2 text-gray-900 rounded-lg hover:bg-gray-200"
              >
                Manage Employees
              </Link>
            </li>
            <li>
             { job_role==='Admin'|| job_role==='Manager' ? <Link
                to="/requested-Employees"
                className="block p-2 text-gray-900 rounded-lg hover:bg-gray-200"
              >
                Requested Employees
              </Link>:null}
            </li>
            <li>
              <Link
                to="/signin"
                className="block p-2 text-gray-900 rounded-lg hover:bg-gray-200"
              >
                Sign In
              </Link>
            </li>
            <li>
              <Link
                to="/signup"
                className="block p-2 text-gray-900 rounded-lg hover:bg-gray-200"
              >
                Sign Up
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default SlideBar;
