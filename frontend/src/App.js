import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";

import Adduser from "./pages/AddEmployee";
import Viewuser from "./pages/ManageEmpl";
import Edit from "./pages/EditEmployee";
import Dashboard from "./pages/DashboardPage";
import SignIn from "./pages/SignInPages";
import SignUp from "./pages/SignupPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Requestedempl from "./pages/Requested_empl";
import ErrorPage from "./components/er404Page";
import ManageDept from "./pages/ManageDept";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/SignUp" element={<SignUp />} />
       
        

        {/* Protected Routes */}
      
        <Route path="/addUsers" element={<ProtectedRoute element={<Adduser />} />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />}/>} />
        <Route path="/" element={<ProtectedRoute element={<Dashboard />}/>} />
        <Route path="/view_Employees" element={<ProtectedRoute element={<Viewuser />} />} />
        <Route path="/UpdateUsers/:employee_code" element={<ProtectedRoute element={<Edit />} />} />
        <Route path="/requested-Employees" element={<ProtectedRoute element={<Requestedempl />} />} />
        <Route path="/manage-Departments" element={<ProtectedRoute element={<ManageDept />} />} />
        
        

        {/* Fallback Route */}
        <Route path="*" element={<ErrorPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
