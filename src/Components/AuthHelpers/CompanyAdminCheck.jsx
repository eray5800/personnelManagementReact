import React from 'react';
import { Navigate } from 'react-router-dom';

const SystemAdminCheck = ({ children }) => {
    const role = localStorage.getItem('role'); 
    return role != 'CompanyAdministrator' ? <Navigate to="/dashboard" /> : children; 
};

export default SystemAdminCheck;