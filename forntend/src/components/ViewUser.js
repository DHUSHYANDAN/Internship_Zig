import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pagination } from "flowbite-react";
import { baseurl } from "../url"; 
function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("All"); 
  const employeesPerPage = 10;


  // Fetch Employees 
  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${baseurl}/viewEmployees`);
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);
  // Delete Employee
  const handleDelete = async (employee_code) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;

    try {
      await fetch(`${baseurl}/deleteEmployee/${employee_code}`, { method: "DELETE" });
      alert("Employee deleted successfully!");
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Failed to delete employee. Try again.");
    }
  };

  // Filtered employees based on selected category
  const filteredEmployees = employees.filter((employee) => {
    if (!searchTerm) return true;

    switch (searchCategory) {
      case "All":
        return (
          `${employee.first_name} ${employee.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.employee_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.job_role.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case "name":
        return `${employee.first_name} ${employee.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
      case "email":
        return employee.email.toLowerCase().includes(searchTerm.toLowerCase());
      case "employee_code":
        return employee.employee_code.toLowerCase().includes(searchTerm.toLowerCase());
      case "job_role":
        return employee.job_role.toLowerCase().includes(searchTerm.toLowerCase());
      default:
        return true;
    }
    
  });

  // Pagination Logic
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  return (
    <div className="container mx-auto  p-6">
      {/* Search Section with Dropdown */}
      <div className="flex mb-4 space-x-4">
        <select
          className="p-2 border border-blue-300 bg-blue-300 rounded-md"
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
        >
           <option value="All">All</option>
          <option value="name">Name</option>
          <option value="email">Email</option>
          <option value="employee_code">Employee Code</option>
          <option value="job_role">Job Role</option>
        </select>
        <input
          type="text"
          placeholder={`Search by ${searchCategory.replace("_", " ")}`}
          className="p-2 w-full border-2 border-gray-300 rounded-md outline-none focus:border-blue-400 "
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Employee Table */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg border border-gray-300">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-900 uppercase bg-blue-300">
            <tr>
              {/* <th className="px-6 py-3">S. No</th> */}
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Date of Birth</th>
              <th className="px-6 py-3">Phone Number</th>
              <th className="px-6 py-3">Employee Code</th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Job Role</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentEmployees.map((employee,index) => (
              <tr key={employee.employee_code} className="bg-white border-b text-gray-900/90 hover:bg-gray-100">
              
                <td className="px-6 py-4">
                  {employee.first_name} {employee.last_name}
                </td>
                <td className="px-6 py-4">{employee.email}</td>
                <td className="px-6 py-4">{employee.dob}</td>
                <td className="px-6 py-4">{employee.phone_number}</td>
                <td className="px-6 py-4">{employee.employee_code}</td>
                <td className="px-6 py-4">{employee.department}</td>
                <td className="px-6 py-4">{employee.job_role}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block w-2 h-2 mr-2 rounded-full ${
                      employee.status === "Active" ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></span>
                  {employee.status}
                </td>
                <td className="px-6 py-4">
                  <Link
                    to={`/editEmployee/${employee.employee_code}`}
                    className="text-blue-600 hover:underline mr-4"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(employee.employee_code)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 mb-5 ">
      <Pagination  
  currentPage={currentPage}   
  totalPages={totalPages}  
  onPageChange={setCurrentPage}  
  theme={{
    pages: {
      base: "xs:mt-0 mt-2  inline-flex items-center -space-x-px",
      showIcon: "inline-flex",
      previous: {
        base: "ml-0 rounded-l-lg border border-gray-300 bg-blue-200 px-4 py-3 leading-tight text-gray-800 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
        icon: "h-5 w-5"
      },
      next: {
        base: "rounded-r-lg border border-gray-300 bg-blue-200 px-4 py-3 leading-tight text-gray-800 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
        icon: "h-5 w-5"
      },
      selector: {
        base: "w-12 px-4 py-3 border border-gray-300 bg-white leading-tight text-gray-900 enabled:hover:bg-gray-100 enabled:hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
        active: "bg-cyan-50 text-cyan-600 hover:bg-cyan-100 hover:text-cyan-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white",
        disabled: "cursor-not-allowed opacity-50"
      }
    }
  }} 
/>

</div>

    </div>
  );
}

export default EmployeeList;
