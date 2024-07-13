import React, { useState, useEffect } from "react";
import axios from "axios";

export default function EmployeeForm() {
  const [employeeData, setEmployeeData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    status: "",
    hireDate: "",
    departmentId: ""
  });

  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/departments");
        setDepartments(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération:", error);
      }
    };
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", employeeData);
  };

  return (
    <main className="container mx-auto p-4 mt-12 bg-white flex flex-col items-center justify-center text-gray-700">
      <div className="w-10/12 sm:w-8/12 md:w-6/12 lg:w-5/12 xl:w-4/12 mb-4">
        <h1 className="text-4xl font-semibold">Add Employee</h1>
      </div>
      <div className="w-10/12 sm:w-8/12 md:w-6/12 lg:w-5/12 xl:w-4/12 mb-6">
        <form onSubmit={handleSubmit}>
          <input
            className="mb-4 p-2 appearance-none block w-full bg-gray-200 placeholder-gray-900 rounded border focus:border-teal-500"
            type="text"
            name="name"
            value={employeeData.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
          <input
            className="mb-4 p-2 appearance-none block w-full bg-gray-200 placeholder-gray-900 rounded border focus:border-teal-500"
            type="email"
            name="email"
            value={employeeData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <input
            className="mb-4 p-2 appearance-none block w-full bg-gray-200 placeholder-gray-900 rounded border focus:border-teal-500"
            type="text"
            name="phone"
            value={employeeData.phone}
            onChange={handleChange}
            placeholder="Phone"
          />
          <input
            className="mb-4 p-2 appearance-none block w-full bg-gray-200 placeholder-gray-900 rounded border focus:border-teal-500"
            type="text"
            name="role"
            value={employeeData.role}
            onChange={handleChange}
            placeholder="Role"
          />
          <input
            className="mb-4 p-2 appearance-none block w-full bg-gray-200 placeholder-gray-900 rounded border focus:border-teal-500"
            type="text"
            name="status"
            value={employeeData.status}
            onChange={handleChange}
            placeholder="Status"
          />
          <input
            className="mb-4 p-2 appearance-none block w-full bg-gray-200 placeholder-gray-900 rounded border focus:border-teal-500"
            type="date"
            name="hireDate"
            value={employeeData.hireDate}
            onChange={handleChange}
            placeholder="Hire Date"
          />
          <select
            className="mb-4 p-2 appearance-none block w-full bg-gray-200 placeholder-gray-900 rounded border focus:border-teal-500"
            name="departmentId"
            value={employeeData.departmentId}
            onChange={handleChange}
            required
          >
            <option value="">Select Department</option>
            {departments.map(department => (
              <option key={department.DepartmentID} value={department.DepartmentID}>
                {department.DepartmentName}
              </option>
            ))}
          </select>
          <button
            className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </main>
  );
}