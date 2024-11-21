import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/Profile.css';

const CompanyExpenseRequestList = () => {
    const [expenseRequests, setExpenseRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const token = localStorage.getItem('token');
    const location = useLocation();
    const companyId = location.state?.companyId;

    useEffect(() => {
        const fetchExpenseRequests = async () => {
            try {
                const response = await axios.get(`https://localhost:7136/api/ExpenseRequest/GetExpenseRequestsByCompanyId/${companyId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(response.data);
                setExpenseRequests(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching expense requests:", error);
                setIsLoading(false);
            }
        };

        fetchExpenseRequests();
    }, [token]);

    const handleApprove = async (expenseRequestId) => {
        try {
            await axios.put(`https://localhost:7136/api/ExpenseRequest/ApproveExpenseRequest/${expenseRequestId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert("Expense request approved!");
            setExpenseRequests((prevRequests) => prevRequests.filter(req => req.expenseRequestId !== expenseRequestId));
        } catch (error) {
            console.error("Error approving expense request:", error);
        }
    };

    const handleReject = async (expenseRequestId) => {
        try {
            await axios.put(`https://localhost:7136/api/ExpenseRequest/RejectExpenseRequest/${expenseRequestId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert("Expense request rejected.");
            setExpenseRequests((prevRequests) => prevRequests.filter(req => req.expenseRequestId !== expenseRequestId));
        } catch (error) {
            console.error("Error rejecting expense request:", error);
        }
    };

    const handleDownloadPdf = async (expenseRequestId) => {
        try {
            const response = await axios.get(`https://localhost:7136/api/ExpenseRequest/GetExpenseRequestDocument/${expenseRequestId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: 'blob', // Important to handle binary data
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${expenseRequestId}.pdf`); // Set a default filename
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error downloading document:", error);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <h2>Expense Requests</h2>
            {expenseRequests.length === 0 ? (
                <div>No expense requests found.</div>
            ) : (
                <div className="row">
                    {expenseRequests.map((expenseRequest) => (
                        <div className="col-md-4 mb-4" key={expenseRequest.expenseRequestId}>
                            <div className="card h-100 mb-4 mb-md-0">
                                <div className="card-header">
                                    <h5>{expenseRequest.name}</h5>
                                </div>
                                <div className="card-body">
                                    <p><strong>Employee Name:</strong> {expenseRequest.employee.userName}</p>
                                    <p><strong>Amount:</strong> ${expenseRequest.amount}</p>
                                    <p><strong>Date:</strong> {new Date(expenseRequest.date).toLocaleDateString()}</p>
                                    <p><strong>Description:</strong> {expenseRequest.description}</p>
                                    <button className="btn btn-primary" onClick={() => handleDownloadPdf(expenseRequest.expenseRequestId)}>
                                        Download Expense Document (PDF)
                                    </button>
                                </div>
                                <div className="card-footer d-flex">
                                    <button className="btn btn-success me-2" onClick={() => handleApprove(expenseRequest.expenseRequestId)}>
                                        Approve
                                    </button>
                                    <button className="btn btn-danger" onClick={() => handleReject(expenseRequest.expenseRequestId)}>
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CompanyExpenseRequestList;
