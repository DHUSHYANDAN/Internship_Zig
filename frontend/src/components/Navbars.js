import React, { useState } from "react";
import { Link } from "react-router-dom";


const Navbars = () => {
    const [isOpen, setIsOpen] = useState(false);
   
    const token = localStorage.getItem("token");
    const job_role = localStorage.getItem("job_role");
    const first_name=localStorage.getItem("first_name");
    const last_name=localStorage.getItem("last_name");


    
    return (
        <nav className="bg-white  sticky w-full z-10 top-0 start-0 border-b border-gray-200 ">
            <div className=" flex flex-wrap items-center justify-between mx-auto p-4">
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-3">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/3135/3135768.png"
                        className="h-8"
                        alt="Employee Management Logo"
                    />
                    <span className="self-center  font-semibold whitespace-nowrap ">
                      
                        {token ? `Welcome, ${first_name} ${last_name} !` : "Please Sign in..."}
                    </span>
                </Link>

                {/* Right Section */}
                <div className="flex md:order-2 space-x-3 md:space-x-2">
                    {(!token) && (
                        <>
                            <button
                                type="button"
                                className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                onClick={() => window.location.href = "/signUp"}
                            >
                                Sign Up
                            </button>
                            <button
                                type="button"
                                className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                onClick={() => window.location.href = "/signIn"}
                            >
                                Sign In
                            </button>
                        </>
                    )}
                    {token &&
                    <button
                        type="button"
                        className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                        onClick={() => {
                            localStorage.removeItem("token");
                            window.location.href = "/signIn";
                        }}
                    >
                        Log Out
                    </button>}

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        aria-controls="navbar-sticky"
                        aria-expanded={isOpen}
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg
                            className="w-5 h-5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 17 14"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M1 1h15M1 7h15M1 13h15"
                            />
                        </svg>
                    </button>
                </div>

                {/* Navbar Links */}
                <div className={`items-center justify-between ${isOpen ? "block" : "hidden"} w-full md:flex md:w-auto md:order-1`} id="navbar-sticky">
                    <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 md:flex-row md:mt-0 md:border-0 md:bg-white text-2xl">
                    {job_role === "Admin" || job_role === "Manager" ? "Admin Dashboard" : "Employee Dashboard"}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbars;
