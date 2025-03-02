import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import baseUrl from "../URL";

const Navbars = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${baseUrl}/profile`, {
          withCredentials: true,
        });
        setUser(response.data.user);
      } catch (error) {
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  // Logout function
  const handleLogout = async () => {
    try {
      await axios.post(`${baseUrl}/logout`, {}, { withCredentials: true });
      setUser(null);
      toast.success("Logged out successfully!");
      setTimeout(() => {
        navigate("/signIn");
      }, 2000);
    } catch (error) {
      toast.error("Error logging out!");
    }
  };

  return (
    <nav className="bg-white shadow-md sticky w-full z-10 top-0 border-b border-gray-200">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135768.png"
              className="h-8"
              alt="Employee Management Logo"
            />
            <span className="text-lg font-semibold">
              {user ? `Welcome, ${user.name}!` : "Please Sign in..."}
            </span>
          </Link>

          {/* Desktop Menu (Hidden on Small Screens) */}
          <div className="hidden md:flex space-x-6">
            {!user ? (
              <>
                <button
                  className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
                  onClick={() => navigate("/signUp")}
                >
                  Sign Up
                </button>
                <button
                  className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
                  onClick={() => navigate("/signIn")}
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                <button
                  className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-1 rounded-lg"
                  onClick={() => navigate("/home")}
                >
                  Home
                </button>
                <button
                  className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
                  onClick={handleLogout}
                >
                  Log Out
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-500 hover:bg-gray-100 p-2 rounded-lg focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu (Dropdown) */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-4 pb-3 space-y-2   ">
            {!user ? (
              <>
                <div className="flex justify-center">
                  <button
                    className="w-1/2 hover:text-white text-blue-600 font-bold bg-gray-300  hover:bg-blue-600 px-4 py-2 rounded-md"
                    onClick={() => navigate("/signUp")}
                  >
                    Sign Up
                  </button>
                </div>
                <div className="flex justify-center">
                  <button
                    className="w-1/2 hover:text-white text-blue-600 font-bold  bg-gray-300 hover:bg-blue-600 px-4 py-2 rounded-md"
                    onClick={() => navigate("/signIn")}
                  >
                    Sign In
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-center">
                  <button
                    className="w-1/2  hover:text-white text-blue-600 font-bold bg-gray-300 hover:bg-blue-600 px-4 py-2 rounded-lg"
                    onClick={() => navigate("/home")}
                  >
                    Home
                  </button>
                </div>
                <div className="flex justify-center">
                  <button
                    className="w-1/2  hover:text-white text-red-600 font-bold bg-gray-300 hover:bg-red-600 px-4 py-2 rounded-lg"
                    onClick={handleLogout}
                  >
                    Log Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbars;
