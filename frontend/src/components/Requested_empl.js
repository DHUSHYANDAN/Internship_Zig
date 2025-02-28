import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { baseurl } from "../url";

const RequestedEmpl = () => {
  const [approvalRequests, setApprovalRequests] = useState([]);
  const [loading, setLoading] = useState(null);
  const token = localStorage.getItem("token");
  const job_role = localStorage.getItem("job_role");

  if(job_role !== "Admin" || !token) {
    window.location.href = "*";
  }

  // Fetch Requested Employees
  const fetchApprovalRequests = useCallback(() => {
    if (token) {
      fetch(`${baseurl}/get-unapproved-users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setApprovalRequests(data))
        .catch((err) => console.error("Error fetching approvals:", err));
    }
  }, [token]);

  useEffect(() => {
    fetchApprovalRequests();
  }, [fetchApprovalRequests]);

  // Handle Approve & Reject with Alert
  const handleAction = async (userId, action) => {
    const confirmMessage =
      action === "approve"
        ? "Are you sure you want to approve this user?"
        : "Are you sure you want to reject this user?";

    if (!window.confirm(confirmMessage)) return;

    setLoading(userId); // Disable buttons for this user
    const endpoint =
      action === "approve"
        ? `${baseurl}/approve-user/${userId}`
        : `${baseurl}/reject-user/${userId}`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `Failed to ${action} user`);

      toast.success(`User ${action}d successfully!`);
      fetchApprovalRequests(); // Refresh the list after action
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(null);
    }
  };

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
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {approvalRequests.length > 0 ? (
            approvalRequests.map((user, index) => (
              <tr key={user.user_id} className="border">
                <td className="border text-center p-2">{index + 1}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{user.role}</td>
                <td className="border p-2 text-red-500 font-bold">Pending</td>
                <td className="border p-2 text-center">
                  <button
                    className={` text-white  rounded mr-2 ${
                      loading === user.user_id ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() => handleAction(user.user_id, "approve")}
                    disabled={loading === user.user_id}
                  >
                    {loading === user.user_id ? "Processing..." : <svg className="h-8 w-8 text-green-500"  width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <path d="M7 12l5 5l10 -10" />  <path d="M2 12l5 5m5 -5l5 -5" /></svg>}
                  </button>
                  <button
                    className={` text-white p-1 rounded ${
                      loading === user.user_id ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() => handleAction(user.user_id, "reject")}
                    disabled={loading === user.user_id}
                  >
                    {loading === user.user_id ? "Processing..." : <svg className="h-8 w-8 text-red-500"  width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <line x1="18" y1="6" x2="6" y2="18" />  <line x1="6" y1="6" x2="18" y2="18" /></svg>}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="border p-2 text-center text-gray-500">
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
