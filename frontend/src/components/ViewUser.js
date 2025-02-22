import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pagination } from "flowbite-react";
import { baseurl } from "../url";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";



function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("All");
  const employeesPerPage = 10;

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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, searchCategory]);

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

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Employee List", 14, 10);
    doc.autoTable({
      head: [["Name", "Email", "DOB", "Phone", "Code", "Department", "Job Role", "Status"]],
      body: employees.map(emp => [
        `${emp.first_name} ${emp.last_name}`, emp.email, emp.dob, emp.phone_number, emp.employee_code, emp.department, emp.job_role, emp.status
      ])
    });
    doc.save("Employee_List.pdf");
  };

  // Export Excel
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(employees);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
    XLSX.writeFile(workbook, "Employee_List.xlsx");
  };

  // Export CSV
  const exportCSV = () => {
    const csvData = XLSX.utils.json_to_sheet(employees);
    const csv = XLSX.utils.sheet_to_csv(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "Employee_List.csv");
  };

  
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-wrap gap-4 mb-4">
        <button onClick={exportPDF} className="bg-red-500 text-white px-4 py-2 rounded">Export PDF</button>
        <button onClick={exportExcel} className="bg-green-500 text-white px-4 py-2 rounded">Export Excel</button>
        <button onClick={exportCSV} className="bg-yellow-500 text-white px-4 py-2 rounded">Export CSV</button>
      </div>
      
      {/* Search Section with Dropdown */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
  {/* Dropdown for Search Category */}
  <select
    className="p-2 border border-blue-300 bg-blue-500  cursor-pointer text-white font-bold outline-none rounded-md w-full sm:w-auto"
    value={searchCategory}
    onChange={(e) => setSearchCategory(e.target.value)}
  >
    <option  value="All">All Categories</option>
    <option  value="name">Name</option>
    <option  value="email">Email</option>
    <option  value="employee_code">Employee Code</option>
    <option  value="job_role">Job Role</option>
  </select>

  {/* Search Input */}
  <input
    type="text"
    placeholder={`Search by ${searchCategory}`}
    className="p-2 w-full sm:w-1/3 md:w-1/2 lg:w-2/4 xl:w-4/6  border-2 border-gray-300 rounded-md outline-none focus:border-blue-500"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />

  {/* Add Employee Button */}
  <Link
    to={'/addUsers'}
    className="bg-blue-500 md:w-2/6 w-full lg:w-1/6 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition-all"
  >
    + Add Employee
  </Link>
</div>


      {/* Employee Table */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg border border-gray-300">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className="overflow-x-auto">
  <table className="w-full text-sm text-left text-gray-500 border border-gray-300 shadow-md rounded-lg">
    {/* Table Head */}
    <thead className="text-xs  uppercase bg-blue-400 text-white sticky top-0">
      <tr>
        <th className="px-4 py-3">Name</th>
        <th className="px-4 py-3">Email</th>
        <th className="px-4 py-3">Date of Birth</th>
        <th className="px-4 py-3">Phone Number</th>
        <th className="px-4 py-3">Employee Code</th>
        <th className="px-4 py-3">Department</th>
        <th className="px-4 py-3">Job Role</th>
        <th className="px-4 py-3">Status</th>
        <th className="px-4 py-3">Actions</th>
      </tr>
    </thead>

    {/* Table Body */}
    <tbody>
      {currentEmployees.map((employee, index) => (
        <tr
          key={employee.employee_code}
          className="bg-white border-b text-gray-900 hover:bg-gray-100 even:bg-gray-50"
        >
          <td className="px-4 py-4 whitespace-nowrap">
            {employee.first_name} {employee.last_name}
          </td>
          <td className="px-4 py-4">{employee.email}</td>
          <td className="px-4 py-4">{employee.dob}</td>
          <td className="px-4 py-4">{employee.phone_number}</td>
          <td className="px-4 py-4">{employee.employee_code}</td>
          <td className="px-4 py-4">{employee.department}</td>
          <td className="px-4 py-4">{employee.job_role}</td>
          <td className="px-4 py-4">
            <span
              className={`inline-block w-2 h-2 mr-2 rounded-full ${
                employee.status === "Active" ? "bg-green-500" : employee.status === "On Leave" ? "bg-yellow-500" : "bg-red-500"
              }`}
            ></span>
            {employee.status}
          </td>
          <td className="px-4 py-4 flex space-x-2">
            <Link
              to={`/UpdateUsers/${employee.employee_code}`}
              className="text-blue-600 hover:underline"
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

</div>

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
        base: "ml-0 rounded-l-lg border border-gray-300 bg-blue-200 px-4 py-3 leading-tight text-gray-800 enabled:hover:bg-gray-200 enabled:hover:text-gray-700   ",
        icon: "h-5 w-5"
      },
      next: {
        base: "rounded-r-lg border border-gray-300 bg-blue-200 px-4 py-3 leading-tight text-gray-800 enabled:hover:bg-gray-200 enabled:hover:text-gray-700   ",
        icon: "h-5 w-5"
      },
      selector: {
        base: "w-12 px-4 py-3 border border-gray-300 bg-white leading-tight text-gray-900 enabled:hover:bg-gray-200 enabled:hover:text-gray-700   ",
        active: "bg-cyan-50 text-cyan-600 hover:bg-cyan-100 hover:text-cyan-700  dark:bg-gray-700 dark:text-white",
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
