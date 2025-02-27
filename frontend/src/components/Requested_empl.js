import React, { useState, useEffect } from "react";
import { baseurl } from "../url";

const RequestedEmpl = () => {
  const [approvalRequests, setApprovalRequests] = useState([]);
  const token = localStorage.getItem("token");

  // Fetch Requested Employees
  useEffect(() => {
    if (token) {
      fetch(`${baseurl}/get-unapproved-users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setApprovalRequests(data))
        .catch((err) => console.error("Error fetching approvals:", err));
    }
  }, [token]);

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg">
      <h3 className="text-xl font-bold mb-3">Approval Requests</h3>
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">S. NO</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {approvalRequests.length > 0 ? (
            approvalRequests.map((user, index) => (
              <tr key={index} className="border">
                <td className="border text-center p-2">{index + 1}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{user.job_role}</td>
                <td className="border p-2 text-red-500 font-bold">Pending</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="border p-2 text-center text-gray-500">
                No approval requests found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RequestedEmpl;
