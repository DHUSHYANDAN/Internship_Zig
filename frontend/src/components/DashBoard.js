import React from "react";

const AdminDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-5 shadow rounded-lg">
          <h2 className="text-lg font-semibold">View Employees</h2>
          <button className="mt-3 w-full bg-blue-500 text-white py-2 rounded">View</button>
        </div>
        <div className="bg-white p-5 shadow rounded-lg">
          <h2 className="text-lg font-semibold">Approve Users</h2>
          <button className="mt-3 w-full bg-green-500 text-white py-2 rounded">Approve</button>
        </div>
        <div className="bg-white p-5 shadow rounded-lg">
          <h2 className="text-lg font-semibold">Manage Employees</h2>
          <button className="mt-3 w-full bg-red-500 text-white py-2 rounded">Manage</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
