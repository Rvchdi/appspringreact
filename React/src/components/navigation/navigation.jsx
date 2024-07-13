import React, { useState, useEffect } from 'react';
import { FiFileText, FiSettings, FiUser, FiClipboard, FiArrowRight, FiUsers, FiCheckSquare } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function Navigation() {
  const [userRole, setUserRole] = useState(localStorage.getItem('role'));

  useEffect(() => {
    const handleStorageChange = () => {
      setUserRole(localStorage.getItem('role'));
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const navigationItems = [
    {
      icon: <FiUser />,
      title: 'Change My Information',
      description: 'Update your personal and professional details',
      color: 'from-purple-500 to-pink-500',
      redirect: "/profil"
    },
    {
      icon: <FiFileText />,
      title: 'Circulars',
      description: 'Access and manage company circulars and announcements',
      color: 'from-blue-500 to-cyan-500',
      redirect: "/circular"
    },
    
    {
      icon: <FiClipboard />,
      title: 'Administrative Request',
      description: 'Submit and track administrative requests',
      color: 'from-orange-500 to-amber-500',
      redirect: "/request"
    },
  ];

  const managerItems = [
    {
      icon: <FiCheckSquare />,
      title: 'Manage Requests',
      description: 'Review and process employee requests',
      color: 'from-green-500 to-emerald-500',
      redirect: "/request/list"
    },
    {
      icon: <FiUsers />,
      title: 'Manage Employees',
      description: 'Oversee employee information and roles',
      color: 'from-red-500 to-rose-500',
      redirect: "/employee/list/"
    },
  ];

  const isManager = ["HR Manager", "IT Manager", "Marketing Manager"].includes(userRole);

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Administration Panel</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {navigationItems.map((item, index) => (
          <Link key={index} to={item.redirect} className={`bg-gradient-to-r ${item.color} rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition duration-300`}>
            <div className="flex items-center mb-4">
              {React.cloneElement(item.icon, { className: "w-10 h-10 text-white" })}
            </div>
            <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
            <p className="mb-4">{item.description}</p>
            <div className="flex items-center">
              <span>Access</span>
              <FiArrowRight className="ml-2" />
            </div>
          </Link>
        ))}
        {isManager && managerItems.map((item, index) => (
          <Link key={`manager-${index}`} to={item.redirect} className={`bg-gradient-to-r ${item.color} rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition duration-300`}>
            <div className="flex items-center mb-4">
              {React.cloneElement(item.icon, { className: "w-10 h-10 text-white" })}
            </div>
            <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
            <p className="mb-4">{item.description}</p>
            <div className="flex items-center">
              <span>Access</span>
              <FiArrowRight className="ml-2" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}