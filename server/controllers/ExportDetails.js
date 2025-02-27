// const fs = require("fs");
// const path = require("path");
// const { Parser } = require("json2csv");
// const ExcelJS = require("exceljs");
// const PDFDocument = require("pdfkit");
// const Employee = require("../models/Employee"); 

// // Export as CSV
// const exportCSV = async (req, res) => {
//     try {
//         const employees = await Employee.find();
//         const fields = ["first_name", "last_name", "email", "dob", "phone_number", "employee_code", "department", "job_role", "status"];
//         const json2csvParser = new Parser({ fields });
//         const csvData = json2csvParser.parse(employees);

//         res.setHeader("Content-Type", "text/csv");
//         res.setHeader("Content-Disposition", "attachment; filename=Employee_List.csv");
//         res.status(200).end(csvData);
//     } catch (error) {
//         console.error("Error exporting CSV:", error);
//         res.status(500).json({ message: "Error exporting CSV" });
//     }
// };

// // Export as Excel
// const exportExcel = async (req, res) => {
//     try {
//         const employees = await Employee.find();
//         const workbook = new ExcelJS.Workbook();
//         const worksheet = workbook.addWorksheet("Employees");

//         // Add headers
//         worksheet.addRow(["First Name", "Last Name", "Email", "DOB", "Phone", "Employee Code", "Department", "Job Role", "Status"]);

//         // Add data rows
//         employees.forEach((emp) => {
//             worksheet.addRow([emp.first_name, emp.last_name, emp.email, emp.dob, emp.phone_number, emp.employee_code, emp.department, emp.job_role, emp.status]);
//         });

//         // Set headers for download
//         res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
//         res.setHeader("Content-Disposition", "attachment; filename=Employee_List.xlsx");

//         // Write the workbook data
//         await workbook.xlsx.write(res);
//         res.end();
//     } catch (error) {
//         console.error("Error exporting Excel:", error);
//         res.status(500).json({ message: "Error exporting Excel" });
//     }
// };

// // Export as PDF
// const exportPDF = async (req, res) => {
//     try {
//         const employees = await Employee.find();
//         const doc = new PDFDocument();
//         const filePath = path.join(__dirname, "../exports/Employee_List.pdf");

//         // Pipe the PDF to the response
//         res.setHeader("Content-Type", "application/pdf");
//         res.setHeader("Content-Disposition", "attachment; filename=Employee_List.pdf");

//         doc.pipe(fs.createWriteStream(filePath));
//         doc.pipe(res);

//         doc.fontSize(14).text("Employee List", { align: "center" });
//         doc.moveDown();

//         employees.forEach((emp, index) => {
//             doc.fontSize(10).text(
//                 `${index + 1}. ${emp.first_name} ${emp.last_name} | ${emp.email} | ${emp.dob} | ${emp.phone_number} | ${emp.employee_code} | ${emp.department} | ${emp.job_role} | ${emp.status}`
//             );
//             doc.moveDown();
//         });

//         doc.end();
//     } catch (error) {
//         console.error("Error exporting PDF:", error);
//         res.status(500).json({ message: "Error exporting PDF" });
//     }
// };

// // Routes for exporting
// module.exports = { exportCSV, exportExcel, exportPDF };
