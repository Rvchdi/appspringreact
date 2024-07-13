import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import Login from "./components/login/login";
import EmployeeForm from "./components/employee/EmployeeForm";
import EmployeeTable from "./components/employee/EmployeeList";
import Notes from "./components/note/noteList";
import Navigation from "./components/navigation/navigation";
import HrStatistics from "./components/hr/HrStatistics";
import EmployeeInfoUpdate from "./components/employee/EmployeeInfoUpdate";
import RequestList from './components/requests/RequestList';
import RequestForm from './components/requests/RequestForm';
import EmployeeList from './components/employee/EmployeeList';

const MANAGER_ROLES = ["HR Manager", "IT Manager", "Marketing Manager"];

const isAuthenticated = () => !!localStorage.getItem('token');
const isManager = () => MANAGER_ROLES.includes(localStorage.getItem('role'));
const isHrManager = () => localStorage.getItem('role') === "HR Manager";

const ProtectedRoute = ({ requireManager, requireHrManager, redirectTo }) => {
  if (!isAuthenticated()) return <Navigate to="/login" />;
  if (requireManager && !isManager()) return <Navigate to={redirectTo} />;
  if (requireHrManager && !isHrManager()) return <Navigate to={redirectTo} />;
  return <Outlet />;
};

const PublicRoute = () => {
  return isAuthenticated() ? <Navigate to="/navigation" /> : <Outlet />;
};

const AppRoutes = () => {
  const userRole = localStorage.getItem('role');

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route element={<ProtectedRoute />}>
          <Route path="/navigation" element={<Navigation userRole={userRole} />} />
          <Route path="/profil" element={<EmployeeInfoUpdate />} />
          <Route path="/circular" element={<Notes />} />
          <Route path="/request" element={<RequestForm />} />
          <Route element={<ProtectedRoute requireManager redirectTo="/navigation" />}>
            <Route path="/employee/list" element={<EmployeeList />} />

            <Route path="/request/list" element={<RequestList />} />
          </Route>
          <Route element={<ProtectedRoute requireHrManager redirectTo="/navigation" />}>
            <Route path="/hr/statistics" element={<HrStatistics />} />
          </Route>
        </Route>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/employee/form" element={<EmployeeForm />} />
        </Route>
        <Route path="*" element={<Navigate to="/navigation" replace />} />
      </Route>
    </Routes>
  );
};

const App = () => (
  <Router>
    <AppRoutes />
  </Router>
);

export default App;