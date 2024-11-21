// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import Navbar from './Components/Navbar';
import Dashboard from './Components/Dashboard';
import Employees from './Components/Employees';
import ExpenseRequest from './Components/ExpenseRequest';
import Register from './Components/Register';
import Login from './Components/Login'; 
import ProtectedRoute from './Components/AuthHelpers/ProtectedRoute';
import PublicRoute from './Components/AuthHelpers/PublicRoute';
import Profile from './Components/Profile';
import AddDetails from './Components/AddDetails';
import UpdateDetails from './Components/UpdateDetails';
import Company from './Components/Company';
import CreateCompany from './Components/CreateCompany';
import TokenCheck from './Components/AuthHelpers/TokenCheck';
import SystemAdminCheck from './Components/AuthHelpers/SystemAdminCheck';
import CompanyAdminCheck from './Components/AuthHelpers/CompanyAdminCheck';
import CompanyRequestList from './Components/CompanyRequestList';
import CompanyAdminEmployeeCreate from './Components/CompanyAdminEmployeeCreate';
import CompanyAdminUpdateDetails from './Components/CompanyAdminEmployeeDetailUpdate';
import CompanyAdminEmployeeDetailCreate from './Components/CompanyAdminEmployeeDetailCreate';
import AdminEmployeeDetailShow from './Components/AdminEmployeeDetailShow';
import EmployeeCheck from './Components/AuthHelpers/EmployeeCheck'
import CreateLeaveRequest from './Components/CreateLeaveRequest';
import MyLeaveRequests from './Components/MyLeaveRequests';
import CompanyLeaveRequestList from './Components/CompanyLeaveRequestList';
import CompanyLeaveList from './Components/CompanyLeaveList';
import CreateExpenseRequest from './Components/CreateExpenseRequest';
import CompanyExpenseRequestList from './Components/CompanyExpenseRequestList';
import CompanyExpenseList from './Components/CompanyExpenseList';
import MyExpenseRequests from './Components/MyExpenseRequests';

const App = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar'ın açık/kapalı durumu

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen); 
    };

    return (
        <Router>
            <div className={`wrapper ${isSidebarOpen ? 'active' : ''}`}>
                <Sidebar isOpen={isSidebarOpen} />
                <div id="body" className={isSidebarOpen ? 'active' : ''}>
                    <Navbar toggleSidebar={toggleSidebar} />
                    <div className="content">
                        <Routes>
                            {/* Public route: only accessible if the user is not logged in */}
                            <Route path="/login" element={
                                <PublicRoute>
                                    <Login />
                                </PublicRoute>
                            } />
                            <Route path="/register" element={
                                <PublicRoute>
                                    <Register />
                                </PublicRoute>
                            } />

                            <Route path="/dashboard" element={
                                    <Dashboard />
                            } />
                            
                            {/* Protected routes: accessible only if the user is logged in */}
                            
                            <Route path="/my-expenserequests" element={
                                <TokenCheck>
                                    <ProtectedRoute>
                                        <EmployeeCheck>
                                        <MyExpenseRequests />
                                        </EmployeeCheck>
                                    </ProtectedRoute>
                                </TokenCheck>
                            } /> 


                            <Route path="/company-expenses" element={
                                <TokenCheck>
                                    <ProtectedRoute>
                                        <CompanyAdminCheck>
                                        <CompanyExpenseList />
                                        </CompanyAdminCheck>
                                    </ProtectedRoute>
                                </TokenCheck>
                            } /> 

                            <Route path="/company-expenserequests" element={
                                <TokenCheck>
                                    <ProtectedRoute>
                                        <CompanyAdminCheck>
                                        <CompanyExpenseRequestList />
                                        </CompanyAdminCheck>
                                    </ProtectedRoute>
                                </TokenCheck>
                            } /> 

                            <Route path="/company-expenserequest-create" element={
                                <TokenCheck>
                                    <ProtectedRoute>
                                        <EmployeeCheck>
                                        <CreateExpenseRequest />
                                        </EmployeeCheck>
                                    </ProtectedRoute>
                                </TokenCheck>
                            } /> 

                            <Route path="/company-leaves" element={
                                <TokenCheck>
                                    <ProtectedRoute>
                                        <CompanyAdminCheck>
                                        <CompanyLeaveList />
                                        </CompanyAdminCheck>
                                    </ProtectedRoute>
                                </TokenCheck>
                            } /> 

                            <Route path="/company-leaverequests" element={
                                <TokenCheck>
                                    <ProtectedRoute>
                                        <CompanyAdminCheck>
                                        <CompanyLeaveRequestList />
                                        </CompanyAdminCheck>
                                    </ProtectedRoute>
                                </TokenCheck>
                            } /> 

                            <Route path="/my-leaverequests" element={
                                <TokenCheck>
                                    <ProtectedRoute>
                                        <EmployeeCheck>
                                        <MyLeaveRequests />
                                        </EmployeeCheck>
                                    </ProtectedRoute>
                                </TokenCheck>
                            } /> 

                            <Route path="/company-leaverequest-create" element={
                                <TokenCheck>
                                    <ProtectedRoute>
                                        <EmployeeCheck>
                                        <CreateLeaveRequest />
                                        </EmployeeCheck>
                                    </ProtectedRoute>
                                </TokenCheck>
                            } /> 

                            <Route path="/companyadmin-employeedetail" element={
                                <TokenCheck>
                                    <ProtectedRoute>
                                        <CompanyAdminCheck>
                                        <AdminEmployeeDetailShow />
                                        </CompanyAdminCheck>
                                    </ProtectedRoute>
                                </TokenCheck>
                            } /> 


                            <Route path="/companyadmin-employeedetail-create" element={
                                <TokenCheck>
                                    <ProtectedRoute>
                                        <CompanyAdminCheck>
                                        <CompanyAdminEmployeeDetailCreate />
                                        </CompanyAdminCheck>
                                    </ProtectedRoute>
                                </TokenCheck>
                            } /> 

                            <Route path="/companyadmin-employeedetail-update" element={
                                <TokenCheck>
                                    <ProtectedRoute>
                                        <CompanyAdminCheck>
                                        <CompanyAdminUpdateDetails />
                                        </CompanyAdminCheck>
                                    </ProtectedRoute>
                                </TokenCheck>
                            } />    
                        
                            <Route path="/companyadmin-add-employee" element={
                                <TokenCheck>
                                    <ProtectedRoute>
                                        <CompanyAdminCheck>
                                        <CompanyAdminEmployeeCreate />
                                        </CompanyAdminCheck>
                                    </ProtectedRoute>
                                </TokenCheck>
                            } />

                            <Route path="/company-request-list" element={
                                <TokenCheck>
                                    <ProtectedRoute>
                                        <SystemAdminCheck>
                                        <CompanyRequestList />
                                        </SystemAdminCheck>
                                    </ProtectedRoute>
                                </TokenCheck>
                            } />

                            <Route path="/company" element={
                                <TokenCheck>
                                    <ProtectedRoute>
                                        <Company />
                                    </ProtectedRoute>
                                </TokenCheck>
                            } />
                            <Route path="/create-company" element={
                                <TokenCheck>
                                    <ProtectedRoute>
                                        <CreateCompany />
                                    </ProtectedRoute>
                                </TokenCheck>
                            } />
                            <Route path="/add-details" element={
                                <TokenCheck>
                                    <ProtectedRoute>
                                        <AddDetails />
                                    </ProtectedRoute>
                                </TokenCheck>
                            } />
                            <Route path="/update-details" element={
                                <TokenCheck>
                                    <ProtectedRoute>
                                        <UpdateDetails />
                                    </ProtectedRoute>
                                </TokenCheck>
                            } />
                            <Route path="/profile" element={
                                <TokenCheck>
                                    <ProtectedRoute>
                                        <Profile />
                                    </ProtectedRoute>
                                </TokenCheck>
                            } />

                            <Route path="/employees" element={
                                <TokenCheck>
                                    <ProtectedRoute>
                                        <SystemAdminCheck>
                                        <Employees />
                                        </SystemAdminCheck>

                                    </ProtectedRoute>
                                </TokenCheck>
                            } />
                            <Route path="/expense-requests" element={
                                <TokenCheck>
                                    <ProtectedRoute>
                                        <ExpenseRequest />
                                    </ProtectedRoute>
                                </TokenCheck>
                            } />
                            
                            <Route path="/" element={<Navigate to="/login" />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </Router>
    );
};

export default App;
