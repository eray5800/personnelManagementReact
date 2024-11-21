import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import '../assets/css/Profile.css';

const CompanyLeaveRequestList = () => {
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const token = localStorage.getItem('token');
    const location = useLocation();
    const companyId = location.state?.companyId;

    useEffect(() => {
        const fetchLeaveRequests = async () => {
            if (!companyId) {
                console.error("Company ID is not available.");
                setIsLoading(false);
                return;
            }

            try {
                const response = await axios.get(`https://localhost:7136/api/LeaveRequest/GetLeaveRequestsByCompanyId/${companyId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(response.data);
                setLeaveRequests(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching leave requests:", error);
                setIsLoading(false);
            }
        };

        fetchLeaveRequests();
    }, [token, companyId]);

    const handleApprove = async (leaveRequestId) => {
        try {
            await axios.put(`https://localhost:7136/api/LeaveRequest/ApproveLeaveRequest/${leaveRequestId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert("Leave request approved!");
            setLeaveRequests((prevRequests) => prevRequests.filter(req => req.leaveRequestId !== leaveRequestId));
        } catch (error) {
            alert(error.response?.data);
        }
    };

    const handleReject = async (leaveRequestId) => {
        try {
            await axios.put(`https://localhost:7136/api/LeaveRequest/RejectLeaveRequest/${leaveRequestId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert("Leave request rejected.");
            setLeaveRequests((prevRequests) => prevRequests.filter(req => req.leaveRequestId !== leaveRequestId));
        } catch (error) {
            alert(error.response?.data);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <h2>Leave Requests</h2>
            {leaveRequests.length === 0 ? (
                <div>No requests found.</div>
            ) : (
                <div className="row">
                    {leaveRequests.map((leaveRequest) => (
                        <div className="col-md-4 mb-4" key={leaveRequest.leaveRequestId}>
                            <div className="card h-100 mb-4 mb-md-0">
                                <div className="card-header d-flex align-items-center">
                                    <h5 className='mb-0'>{leaveRequest.employee.userName} : {leaveRequest.leaveType} Leave</h5> {/* Corrected to use userName */}
                                </div>
                                <div className="card-body">
                                    <p><strong>Leave Type:</strong> {leaveRequest.leaveType}</p>
                                    <p><strong>Start Date:</strong> {new Date(leaveRequest.startDate).toLocaleDateString()}</p>
                                    <p><strong>End Date:</strong> {new Date(leaveRequest.endDate).toLocaleDateString()}</p>
                                    <p><strong>Total Days:</strong> {leaveRequest.totalDays}</p>
                                    <p><strong>Status:</strong> {leaveRequest.status}</p>
                                    <p><strong>Reason:</strong> {leaveRequest.reason}</p>
                                </div>
                                <div className="card-footer d-flex">
                                    <button className="btn btn-success me-2" onClick={() => handleApprove(leaveRequest.leaveRequestId)}>
                                        Approve
                                    </button>
                                    <button className="btn btn-danger" onClick={() => handleReject(leaveRequest.leaveRequestId)}>
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

export default CompanyLeaveRequestList;
