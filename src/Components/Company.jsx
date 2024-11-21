import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/Profile.css'; // Ensure Bootstrap CSS is included in your project

const Company = () => {
    const [companyData, setCompanyData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [requestPending, setRequestPending] = useState(false);
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role'); // Get role from localStorage
    const navigate = useNavigate();

    const parseJwt = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
            return JSON.parse(jsonPayload);
        } catch (error) {
            return null;
        }
    };

    const decodedToken = parseJwt(token);
    const userId = decodedToken?.sub;

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        if (!userId) {
            console.error('Invalid token: employeeId not found');
            navigate('/login');
            return;
        }

        // Fetch company data
        axios.get(`https://localhost:7136/api/Company/GetCompanyByEmployeeId/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                const companyId = response.data.companyId;

                if (companyId && companyId !== "00000000-0000-0000-0000-000000000000") {
                    setCompanyData(response.data);
                    setIsLoading(false);
                } else {
                    return axios.get(`https://localhost:7136/api/CompanyRequest/GetCompanyRequestByEmployeeId/${userId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                }
            })
            .then(response => {
                if (response) {
                    const requestExists = response.data && response.data.companyId !== "00000000-0000-0000-0000-000000000000";
                    setRequestPending(requestExists);
                    setIsLoading(false);
                }
            })
            .catch(error => {
                console.error('Error fetching company data:', error);
                setIsLoading(false);
            });
    }, [token, navigate]);

    const handleCreateCompany = () => {
        navigate('/create-company'); // Navigate to the create company page
    };

    const handleCreateCompanyEmployee = () => {
        navigate('/companyadmin-add-employee');
    };

    const handleDetailCreateEmployee = (employeeId) => {
        navigate('/companyadmin-employeedetail-create', { state: { employeeId } });
    };

    const handleDetailUpdateEmployee = (employeeId) => {
        navigate('/companyadmin-employeedetail-update', { state: { employeeId } });
    };

    const handleShowEmployeeDetails = (employeeId) => {
        navigate('/companyadmin-employeedetail', { state: { employeeId } });
    };

    const handleCreateLeaveRequest = () => {
        navigate('/company-leaverequest-create'); // Navigate to the Create Leave Request page
    };

    const handleMyLeaveRequests = () => {
        navigate('/my-leaverequests');
    };

    const handleShowCompanyLeaveRequests = (companyId) => {
        navigate('/company-leaverequests', { state: { companyId } });
    };

    const handleShowCompanyLeaves = (companyId) => {
        navigate('/company-leaves', {state : {companyId}});
    }

    const handleCreateExpenseRequest = () => {
        navigate('/company-expenserequest-create');
    }

    const handleShowCompanyExpenseRequests = (companyId) => {
        navigate('/company-expenserequests',{state : {companyId}})
    }

    const handleShowCompanyExpenses = (companyId) => {
        navigate('/company-expenses',{state : {companyId}});
    }

    const handleMyExpenseRequests = () => {
        navigate('/my-expenserequests');
    }

    const handleFireEmployee = (employeeId) => {
        if (!token) {
            alert('Unauthorized! Please log in again.');
            navigate('/login');
            return;
        }

        if (window.confirm("Are you sure you want to fire this employee?")) {
            axios.delete(`https://localhost:7136/api/Company/FireEmployee/${employeeId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(response => {
                    alert('Employee fired successfully.');
                    // Refresh company data
                    setCompanyData((prevData) => ({
                        ...prevData,
                        employees: prevData.employees.filter(emp => emp.employeeId !== employeeId),
                    }));
                })
                .catch(error => {
                    console.error('Error firing employee:', error);
                    alert('Failed to fire employee. Please try again.');
                });
        }
    };

    return (
        <div className="container mt-5">
            {isLoading ? (
                <div className="loading text-center">
                    <h2>Loading company data...</h2>
                </div>
            ) : (
                companyData ? (
                    <div className="card">
                        <div className="card-header">
                            <h3>Company Information</h3>
                        </div>
                        <div className="card-body">
                            <ul className="list-group">
                                <li className="list-group-item"><strong>Company Name:</strong> {companyData.name}</li>
                                <li className="list-group-item"><strong>Company Phone:</strong> {companyData.phoneNumber}</li>
                                <li className="list-group-item"><strong>Company Email:</strong> {companyData.email}</li>
                                <li className="list-group-item"><strong>Company Address:</strong> {companyData.address}</li>
                            </ul>

                            {/* Conditionally render buttons for leave requests */}
                            {role === 'Employee' && (
                                <div className="mt-4 d-flex flex-column flex-md-row justify-md-content-between">
                                    <button className="btn btn-primary me-2 mt-2 mt-md-0" onClick={handleCreateLeaveRequest}>
                                        Create Leave Request
                                    </button>
                                    <button className="btn btn-secondary  me-2 mt-2 mt-md-0" onClick={handleMyLeaveRequests}>
                                        My Leave Requests
                                    </button>
                                    <button className='btn btn-dark me-2 mt-2 mt-md-0' onClick={handleCreateExpenseRequest}>
                                        Create Expense Request
                                    </button>
                                    <button className='btn btn-danger me-2 mt-2 mt-md-0' onClick={handleMyExpenseRequests}>
                                        My Expense Requests
                                    </button>
                                </div>
                            )}

                            {/* Display employee information */}
                            <div className='d-flex flex-column flex-md-row justify-content-between mb-2'>
                                <h4 className="mt-4">Employees:</h4>
                                {role === 'CompanyAdministrator' && (
                                    <div className="text-md-center mt-4">
                                        <button className="btn btn-success me-2" onClick={handleCreateCompanyEmployee}>
                                            Add Employee
                                        </button>
                                        <button className="btn btn-secondary me-2" onClick={() => handleShowCompanyLeaveRequests(companyData.companyId)}>
                                            Company Leave Requests
                                        </button>
                                        <button className="btn btn-danger mt-2 me-2 mt-md-0" onClick={() => handleShowCompanyLeaves(companyData.companyId)}>
                                            Company Leaves
                                        </button>
                                        <button className='btn btn-dark mt-2 me-2 mt-md-0' onClick={() => handleShowCompanyExpenseRequests(companyData.companyId)}>
                                            Company Expense Requests
                                        </button>
                                        <button className='btn btn-info mt-2 mt-md-0' onClick={() => handleShowCompanyExpenses(companyData.companyId)}>
                                            Company Expenses
                                        </button>
                                        
                                    </div>
                                )}
                            </div>

                            {companyData.employees && companyData.employees.length > 0 ? (
                                <ul className="list-group">
                                    {companyData.employees.map((employee) => (
                                        <li key={employee.employeeId} className="list-group-item">
                                            <strong>Name:</strong> {employee.userName}<br />
                                            <strong>System Role:</strong> {employee.role}<br />
                                            <strong>Email:</strong> {employee.email}<br />
                                            <strong>Status:</strong> {employee.isActive ? 'Active' : 'Inactive'}<br />

                                            {role === 'CompanyAdministrator' && userId !== employee.employeeId && (
                                                <>
                                                    {employee.isActive ? (
                                                        <button className="btn btn-warning mt-2 me-2" onClick={() => handleDetailUpdateEmployee(employee.employeeId)}>
                                                            Update Details
                                                        </button>
                                                    ) : (
                                                        <button className="btn btn-success mt-2 me-2" onClick={() => handleDetailCreateEmployee(employee.employeeId)}>
                                                            Add Details
                                                        </button>
                                                    )}
                                                    <button className="btn btn-danger mt-2 me-2" onClick={() => handleFireEmployee(employee.employeeId)}>
                                                        Fire
                                                    </button>
                                                    <button className="btn btn-info mt-2" onClick={() => handleShowEmployeeDetails(employee.employeeId)}>
                                                        Show Details
                                                    </button>
                                                </>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No employees found for this company.</p>
                            )}
                        </div>
                    </div>
                ) : requestPending ? (
                    <div className="alert alert-warning text-center">
                        <h2>Your request is pending approval from the system administrator. Please wait.</h2>
                    </div>
                ) : (
                    <div className="text-center">
                        <h2>No company information available.</h2>
                        <button className="btn btn-primary mt-3" onClick={handleCreateCompany}>
                            Create a Company
                        </button>
                    </div>
                )
            )}
        </div>
    );
};

export default Company;
