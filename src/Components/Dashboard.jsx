import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [welcomeMessage, setWelcomeMessage] = useState('Welcome, User');
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    useEffect(() => {

        
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

        if (role === 'CompanyAdministrator') {
            setWelcomeMessage('Welcome, Company Administrator!');
            const fetchAdminStats = async () => {
                try {
                    const config = {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    };

                    const response = await axios.get('https://localhost:7136/api/Company/GetCompanyAdminStats', config);
                    setStats(response.data);
                } catch (err) {
                    setError('Failed to fetch stats');
                } finally {
                    setLoading(false);
                }
            };
            fetchAdminStats();
        } else if (role === 'Employee') {
            setWelcomeMessage('Welcome, Employee!');
            const fetchEmployeeStats = async () => {
                try {
                    const config = {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    };

                    const response = await axios.get(`https://localhost:7136/api/Company/GetEmployeeDashboardStats/${userId}`, config);
                    setStats(response.data);
                } catch (err) {
                    setError('Failed to fetch employee stats');
                } finally {
                    setLoading(false);
                }
            };
            fetchEmployeeStats();
        } else {
            setLoading(false); 
        }
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12 page-header">
                    <div className="page-pretitle">Overview</div>
                    <h2 className="page-title">Dashboard</h2>
                    <h4 className='mt-4'>{welcomeMessage}</h4> 
                </div>
            </div>
            {stats ? (
                <div className="row">
                    {/* Expense Count */}
                    <div className="col-sm-6 col-md-6 col-lg-3 mt-3">
                        <div className="card h-100">
                            <div className="content">
                                <div className="row">
                                    <div className="col-sm-4">
                                        <div className="icon-big text-center">
                                            <i className="teal fas fa-shopping-cart"></i>
                                        </div>
                                    </div>
                                    <div className="col-sm-8">
                                        <div className="detail">
                                            <p className="detail-subtitle">{role === 'Employee' ? 'My Expense Count' : 'Expense Count'}</p>
                                            <span className="number">{stats.expenseCount}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="footer">
                                    <hr />
                                    <div className="stats">
                                        <i className="fas fa-calendar"></i> For this Year
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Total Expenses */}
                    <div className="col-sm-6 col-md-6 col-lg-3 mt-3">
                        <div className="card h-100">
                            <div className="content">
                                <div className="row">
                                    <div className="col-sm-4">
                                        <div className="icon-big text-center">
                                            <i className="olive fas fa-money-bill-alt"></i>
                                        </div>
                                    </div>
                                    <div className="col-sm-8">
                                        <div className="detail">
                                            <p className="detail-subtitle">{role === 'Employee' ? 'My Expense Total' : 'Total Expenses'}</p>
                                            <span className="number">${stats.totalExpenses}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="footer">
                                    <hr />
                                    <div className="stats">
                                        <i className="fas fa-calendar"></i> For this Year
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Leave Requests */}
                    <div className="col-sm-6 col-md-6 col-lg-3 mt-3">
                        <div className="card h-100">
                            <div className="content">
                                <div className="row">
                                    <div className="col-sm-4">
                                        <div className="icon-big text-center">
                                            <i className="violet fas fa-envelope"></i>
                                        </div>
                                    </div>
                                    <div className="col-sm-8">
                                        <div className="detail">
                                            <p className="detail-subtitle">{role === 'Employee' ? 'My Active Leave Requests' : 'Leave Requests'}</p>
                                            <span className="number">{stats.leaveRequestCount}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="footer">
                                    <hr />
                                    <div className="stats">
                                        <i className="fas fa-envelope-open-text"></i> Total Count
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Expense Requests */}
                    <div className="col-sm-6 col-md-6 col-lg-3 mt-3">
                        <div className="card h-100">
                            <div className="content">
                                <div className="row">
                                    <div className="col-sm-4">
                                        <div className="icon-big text-center">
                                            <i className="orange fas fa-envelope"></i>
                                        </div>
                                    </div>
                                    <div className="col-sm-8">
                                        <div className="detail">
                                            <p className="detail-subtitle">{role === 'Employee' ? 'My Active Expense Requests' : 'Expense Requests'}</p>
                                            <span className="number">{stats.expenseRequestCount}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="footer">
                                    <hr />
                                    <div className="stats">
                                        <i className="fas fa-envelope-open-text"></i> Total Count
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </div>
    );
};

export default Dashboard;
