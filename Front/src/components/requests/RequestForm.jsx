import React, { useState } from "react";
import axios from "axios";
import { FiSend, FiAlertCircle } from "react-icons/fi";

const API_BASE_URL = "http://localhost:8080/api/administrative-requests";
console.log(localStorage.getItem("employeeId"));

const RequestForm = () => {
  const [formData, setFormData] = useState({
    type: "",
    description: "",
    priority: "3",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      const requestData = {
        ...formData,
        date: new Date().toISOString(),
        status: "pending",
        employeeId: localStorage.getItem("employeeId")
      };
  
      const response = await axios.post(API_BASE_URL, requestData);
  
      setSuccess(true);
      setFormData({ type: "", description: "", priority: "3" });
      console.log("Request created:", response.data);
    } catch (err) {
      setError("Failed to submit request. Please try again.");
      console.error("Error submitting request:", err);
      if (err.response) {
        console.error("Error response data:", err.response.data);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Submit Administrative Request
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Request Type
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Select a request type</option>
            <option value="Leave Application">Leave Application</option>
            <option value="Equipment Request">Equipment Request</option>
            <option value="Training Request">Training Request</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          ></textarea>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="1">High</option>
            <option value="2">Medium</option>
            <option value="3">Low</option>
          </select>
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isSubmitting ? (
              "Submitting..."
            ) : (
              <>
                <FiSend className="mr-2 h-5 w-5" />
                Submit Request
              </>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {success && (
        <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> Your request has been submitted successfully.</span>
        </div>
      )}

      <div className="mt-8 bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <FiAlertCircle className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Please note that all requests are subject to review and approval by the administrative team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestForm;