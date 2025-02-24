import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";

import Adduser from "./components/addUser";
import Viewuser from "./components/ViewUser";
import Edit from "./components/edit";
import Dashboard from "./components/DashBoard";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Protected Routes */}
      
        <Route path="/addUsers" element={<ProtectedRoute element={<Adduser />} />} />
        <Route path="/view_Employees" element={<ProtectedRoute element={<Viewuser />} />} />
        <Route path="/UpdateUsers/:employee_code" element={<ProtectedRoute element={<Edit />} />} />
        

        {/* Fallback Route */}
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
