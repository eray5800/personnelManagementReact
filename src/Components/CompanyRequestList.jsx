import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../assets/css/Profile.css';

const CompanyRequestList = () => {
    const [companyRequests, setCompanyRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchCompanyRequests = async () => {
            try {
                const response = await axios.get('https://localhost:7136/api/CompanyRequest/GetAllCompanyRequests', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCompanyRequests(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching company requests:", error);
                setIsLoading(false);
            }
        };

        fetchCompanyRequests();
    }, [token]);

    const handleApprove = async (companyId) => {
        try {
            await axios.post(`https://localhost:7136/api/CompanyRequest/ApproveCompanyRequest/${companyId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert("Request approved!");
            setCompanyRequests((prevRequests) => prevRequests.filter(req => req.companyId !== companyId));
        } catch (error) {
            console.error("Error approving request:", error);
        }
    };

    const handleReject = async (companyId) => {
        try {
            await axios.post(`https://localhost:7136/api/CompanyRequest/RejectCompanyRequest/${companyId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert("Request rejected.");
            setCompanyRequests((prevRequests) => prevRequests.filter(req => req.companyId !== companyId));
        } catch (error) {
            console.error("Error rejecting request:", error);
        }
    };

    const handleDownloadPdf = async (companyId) => {
        try {
            const response = await axios.get(`https://localhost:7136/api/CompanyRequest/GetCompanyDocument/${companyId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: 'blob', // Important to handle binary data
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${companyId}.pdf`); // Set a default filename
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
            <h2>Company Requests</h2>
            {companyRequests.length === 0 ? (
                <div>No requests found.</div>
            ) : (
                <div className="row">
                    {companyRequests.map((companyRequest) => (
                        <div className="col-md-4 mb-4" key={companyRequest.companyId}>
                            <div className="card h-100 mb-4 mb-md-0">
                                <div className="card-header">
                                    <h5>{companyRequest.companyName}</h5>
                                </div>
                                <div className="card-body">
                                    <p><strong>Address:</strong> {companyRequest.address}</p>
                                    <p><strong>Email:</strong> {companyRequest.email}</p>
                                    <p><strong>Phone:</strong> {companyRequest.phoneNumber}</p>
                                    <button className="btn btn-primary" onClick={() => handleDownloadPdf(companyRequest.companyId)}>
                                        Download Company Document (PDF)
                                    </button>
                                </div>
                                <div className="card-footer d-flex">
                                    <button className="btn btn-success me-2" onClick={() => handleApprove(companyRequest.companyId)}>
                                        Approve
                                    </button>
                                    <button className="btn btn-danger" onClick={() => handleReject(companyRequest.companyId)}>
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

export default CompanyRequestList;
