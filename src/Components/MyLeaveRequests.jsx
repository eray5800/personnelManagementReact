import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';

const MyLeaveRequests = () => {
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [error, setError] = useState('');

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

    useEffect(() => {
        const fetchLeaveRequests = async () => {
            const token = localStorage.getItem('token');
            const decodedToken = parseJwt(token);
            const employeeId = decodedToken?.sub;

            if (!token) {
                setError('Unauthorized. Please login.');
                return;
            }

            try {
                const response = await axios.get(`https://localhost:7136/api/LeaveRequest/GetLeaveRequestsByEmployeeId/${employeeId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setLeaveRequests(response.data);
            } catch (error) {
                console.error(error);
                setError('Failed to fetch leave requests');
            }
        };

        fetchLeaveRequests();
    }, []);

    const columns = [
        {
            name: 'Start Date',
            selector: row => new Date(row.startDate).toLocaleDateString(),
            sortable: true,
            cellExport: row => new Date(row.startDate).toLocaleDateString(),
        },
        {
            name: 'End Date',
            selector: row => new Date(row.endDate).toLocaleDateString(),
            sortable: true,
            cellExport: row => new Date(row.endDate).toLocaleDateString(),
        },
        {
            name: 'Total Days',
            selector: row => row.totalDays,
            sortable: true,
            cellExport: row => row.totalDays,
        },
        {
            name: 'Leave Type',
            selector: row => row.leaveType,
            sortable: true,
            cellExport: row => row.leaveType,
        },
        {
            name: 'Status',
            selector: row => row.status,
            sortable: true,
            cellExport: row => row.status,
        },
        {
            name: 'Reason',
            selector: row => row.reason,
            cellExport: row => row.reason,
        },
    ];

    const tableData = {
        columns,
        data: leaveRequests,
        exportHeaders: true, // If you want headers in the CSV file
    };

    return (
        <div className="container mt-2 mb-3">
            <div className="mb-3 d-flex justify-content-between align-items-center">
                <h3 className="m-0">My Leave Requests</h3>
                {/* Add any button for creating a leave request if necessary */}
            </div>
            {error && <p className="text-danger">{error}</p>}
            <DataTableExtensions
                {...tableData}
                export={true} // Enable CSV Export
            >
                <DataTable
                    title="Leave Requests List"
                    columns={columns}
                    data={leaveRequests}
                    pagination
                    striped
                    highlightOnHover
                    searchable // Enable the search box
                />
            </DataTableExtensions>
        </div>
    );
};

export default MyLeaveRequests;
