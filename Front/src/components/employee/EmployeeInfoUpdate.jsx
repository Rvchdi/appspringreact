import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiUser, FiMail, FiPhone, FiSave } from 'react-icons/fi';

export default function EmployeeInfoUpdate() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const fetchEmployeeData = async () => {
    try {
      const employeeId = localStorage.getItem('token'); // Assuming the token is the employee ID
      const response = await axios.get(`http://localhost:8080/api/employees/${employeeId}`);
      setFormData({
        name: response.data.name,
        email: response.data.email,
        phone: response.data.phone,
      });
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const employeeId = localStorage.getItem('token');
      await axios.put(`http://localhost:8080/api/employees/${employeeId}`, formData);
      alert('Information updated successfully!');
    } catch (error) {
      console.error('Error updating information:', error);
      alert('Failed to update information. Please try again.');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-blue-600 to-indigo-700">
          <h3 className="text-lg leading-6 font-medium text-white">My Information</h3>
          <p className="mt-1 max-w-2xl text-sm text-blue-100">Update your personal details below</p>
        </div>
        <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-4">
              <label htmlFor="name" className="flex items-center text-sm font-medium text-gray-700">
                <FiUser className="mr-2" /> Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>

            <div className="col-span-6 sm:col-span-4">
              <label htmlFor="email" className="flex items-center text-sm font-medium text-gray-700">
                <FiMail className="mr-2" /> Email address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>

            <div className="col-span-6 sm:col-span-4">
              <label htmlFor="phone" className="flex items-center text-sm font-medium text-gray-700">
                <FiPhone className="mr-2" /> Phone number
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FiSave className="mr-2" /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}