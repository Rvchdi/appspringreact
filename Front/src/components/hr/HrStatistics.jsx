import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiUsers, FiBriefcase, FiUserCheck, FiUserX } from "react-icons/fi";

const HrStatistics = () => {
  const [statistics, setStatistics] = useState({
    totalEmployees: 0,
    activeDepartments: 0,
    activeEmployees: 0,
    inactiveEmployees: 0,
  });

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/hr/statistics");
      setStatistics(response.data);
    } catch (error) {
      console.error("Error fetching HR statistics:", error);
    }
  };

  const StatCard = ({ title, value, icon: Icon }) => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className="h-8 w-8 text-indigo-600" />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd>
              <div className="text-lg font-medium text-gray-900">{value}</div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">HR Statistics Dashboard</h1>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Employees"
                value={statistics.totalEmployees}
                icon={FiUsers}
              />
              <StatCard
                title="Active Departments"
                value={statistics.activeDepartments}
                icon={FiBriefcase}
              />
              <StatCard
                title="Active Employees"
                value={statistics.activeEmployees}
                icon={FiUserCheck}
              />
              <StatCard
                title="Inactive Employees"
                value={statistics.inactiveEmployees}
                icon={FiUserX}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HrStatistics;