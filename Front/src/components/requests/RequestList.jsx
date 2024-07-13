import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FiFilter,
  FiChevronDown,
  FiCheck,
  FiX,
  FiEye,
  FiAlertCircle,
} from "react-icons/fi";
import { format } from "date-fns";

const API_BASE_URL = "http://localhost:8080/api/administrative-requests";

const RequestList = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, [filter, sortBy]);

  const fetchRequests = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_BASE_URL, {
        params: {
          status: filter !== "all" ? filter : undefined,
          sortBy: sortBy,
        },
      });
      setRequests(response.data);
      console.log(response.data);
    } catch (err) {
      setError("Failed to fetch requests. Please try again later.");
      console.error("Error fetching requests:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`${API_BASE_URL}/${id}`, null, {
        params: { status: newStatus },
      });
      fetchRequests();
    } catch (err) {
      setError("Failed to update request status. Please try again.");
      console.error("Error updating request status:", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 1:
        return "bg-red-100 text-red-800";
      case 2:
        return "bg-orange-100 text-orange-800";
      case 3:
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Administrative Requests
      </h1>

      <div className="mb-6 flex justify-between items-center">
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="bg-white border border-gray-300 rounded-md px-4 py-2 inline-flex items-center text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FiFilter className="mr-2 h-5 w-5 text-gray-400" />
            Filter
            <FiChevronDown className="ml-2 h-5 w-5 text-gray-400" />
          </button>
          {isFilterOpen && (
            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div
                className="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                <button
                  onClick={() => {
                    setFilter("all");
                    setIsFilterOpen(false);
                  }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                  role="menuitem"
                >
                  All Requests
                </button>
                <button
                  onClick={() => {
                    setFilter("pending");
                    setIsFilterOpen(false);
                  }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                  role="menuitem"
                >
                  Pending
                </button>
                <button
                  onClick={() => {
                    setFilter("approved");
                    setIsFilterOpen(false);
                  }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                  role="menuitem"
                >
                  Approved
                </button>
                <button
                  onClick={() => {
                    setFilter("rejected");
                    setIsFilterOpen(false);
                  }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                  role="menuitem"
                >
                  Rejected
                </button>
              </div>
            </div>
          )}
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="date">Sort by Date</option>
          <option value="priority">Sort by Priority</option>
        </select>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" className="divide-y divide-gray-200">
          {requests.map((request) => (
            <li key={request.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-indigo-600 truncate">
                    {request.type}
                  </p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {request.status.charAt(0).toUpperCase() +
                        request.status.slice(1)}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    {request.employee ? (
                      <>
                        <p className="flex items-center text-sm text-gray-500">
                          <FiAlertCircle className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          {request.employee.name
                            ? request.employee.name.toString()
                            : "N/A"}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          <FiEye className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          {request.employee.department
                            ? request.employee.department.name.toString()
                            : "N/A"}
                        </p>
                      </>
                    ) : (
                      <p>Employee information not available</p>
                    )}
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>{format(new Date(request.date), "PPP")}</p>
                    <p
                      className={`ml-4 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(
                        request.priority
                      )}`}
                    >
                      Priority: {request.priority}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  {request.status === "pending" && (
                    <>
                      <button
                        onClick={() =>
                          handleStatusChange(request.id, "approved")
                        }
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <FiCheck className="mr-2 h-4 w-4" />
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(request.id, "rejected")
                        }
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <FiX className="mr-2 h-4 w-4" />
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RequestList;
