import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiEdit2, FiTrash2, FiSearch, FiX, FiPlus } from "react-icons/fi";

export const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [notification, setNotification] = useState("");
  const [notificationColor, setNotificationColor] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeeResponse, departmentResponse] = await Promise.all([
          axios.get("http://localhost:8080/api/employees/"),
          axios.get("http://localhost:8080/api/departments/")
        ]);
        setEmployees(employeeResponse.data);
        setDepartments(departmentResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        showNotification("Failed to fetch data", "bg-red-500");
      }
    };
    fetchData();
  }, []);

  const showNotification = (message, color) => {
    setNotification(message);
    setNotificationColor(color);
    setTimeout(() => setNotification(""), 5000);
  };

  const handleStatusChange = async (employeeID) => {
    try {
      const employee = employees.find(emp => emp.id === employeeID);
      if (!employee) return;

      const newStatus = employee.status === "Active" ? "Inactive" : "Active";

      await axios.patch(`http://localhost:8080/api/employees/status/${employeeID}?status=${newStatus}`);

      const updatedEmployees = employees.map(emp =>
        emp.id === employeeID ? { ...emp, status: newStatus } : emp
      );
      setEmployees(updatedEmployees);

      const notifColor = newStatus === "Active" ? "bg-green-500" : "bg-red-500";
      showNotification(`${employee.name} is now ${newStatus}`, notifColor);
    } catch (error) {
      console.error("Error updating employee status:", error);
      showNotification("Failed to update employee status", "bg-red-500");
    }
  };

  const handleEdit = (employee) => {
    setSelectedEmployee({ ...employee, password: "" });
    setIsModalOpen(true);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setSelectedEmployee({
      name: "",
      email: "",
      phone: "",
      position: "",
      status: "Active",
      department: { id: "", name: "" },
      password: ""
    });
    setIsModalOpen(true);
    setIsCreating(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'department') {
      setSelectedEmployee(prev => ({
        ...prev,
        department: { id: value, name: e.target.options[e.target.selectedIndex].text }
      }));
    } else {
      setSelectedEmployee(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      let response;
      if (isCreating) {
        response = await axios.post("http://localhost:8080/api/employees/", selectedEmployee);
        setEmployees([...employees, response.data]);
        showNotification("Employee created successfully", "bg-green-500");
      } else {
        response = await axios.put(`http://localhost:8080/api/employees/${selectedEmployee.id}`, selectedEmployee);
        const updatedEmployees = employees.map(emp =>
          emp.id === response.data.id ? response.data : emp
        );
        setEmployees(updatedEmployees);
        showNotification("Employee updated successfully", "bg-green-500");
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving employee:", error);
      showNotification(`Failed to ${isCreating ? 'create' : 'update'} employee`, "bg-red-500");
    }
  };

  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee);
  };

  const handleDeleteConfirm = async () => {
    if (!employeeToDelete) return;

    try {
      await axios.delete(`http://localhost:8080/api/employees/${employeeToDelete.id}`);
      setEmployees(employees.filter(emp => emp.id !== employeeToDelete.id));
      showNotification("Employee deleted successfully", "bg-green-500");
    } catch (error) {
      console.error("Error deleting employee:", error);
      showNotification("Failed to delete employee", "bg-red-500");
    }
    setEmployeeToDelete(null);
  };

  const handleDeleteCancel = () => {
    setEmployeeToDelete(null);
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={handleCreate}
              >
                <FiPlus className="mr-2" /> New Employee
              </button>
            </div>
            <div className="mb-4">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search employees"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{employee.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{employee.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{employee.phone || "N/A"}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{employee.position || "N/A"}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          employee.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {employee.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{employee.department?.name || "N/A"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button onClick={() => handleEdit(employee)} className="text-indigo-600 hover:text-indigo-900">
                          <FiEdit2 />
                        </button>
                        <button onClick={() => handleDeleteClick(employee)} className="text-red-600 hover:text-red-900 ml-4">
                          <FiTrash2 />
                        </button>
                        <button onClick={() => handleStatusChange(employee.id)} className="ml-4">
                          {employee.status === "Active" ? (
                            <span className="text-red-600 hover:text-red-900">Deactivate</span>
                          ) : (
                            <span className="text-green-600 hover:text-green-900">Activate</span>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {notification && (
          <div className={`fixed bottom-4 right-4 p-4 rounded ${notificationColor} text-white`}>
            {notification}
          </div>
        )}
        {isModalOpen && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{isCreating ? "Create Employee" : "Edit Employee"}</h3>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="name"
                        value={selectedEmployee.name}
                        onChange={handleInputChange}
                        placeholder="Name"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                      <input
                        type="email"
                        name="email"
                        value={selectedEmployee.email}
                        onChange={handleInputChange}
                        placeholder="Email"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                      <input
                        type="text"
                        name="phone"
                        value={selectedEmployee.phone}
                        onChange={handleInputChange}
                        placeholder="Phone"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                      <input
                        type="text"
                        name="position"
                        value={selectedEmployee.position}
                        onChange={handleInputChange}
                        placeholder="Position"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                      <select
                        name="department"
                        value={selectedEmployee.department.id}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      >
                        <option value="">Select Department</option>
                        {departments.map(department => (
                          <option key={department.id} value={department.id}>
                            {department.name}
                          </option>
                        ))}
                      </select>
                      {isCreating && (
                        <input
                          type="password"
                          name="password"
                          value={selectedEmployee.password}
                          onChange={handleInputChange}
                          placeholder="Password"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {employeeToDelete && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Employee</h3>
                    <div className="mt-2">
                      <p>Are you sure you want to delete {employeeToDelete.name}?</p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleDeleteConfirm}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={handleDeleteCancel}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeList;
