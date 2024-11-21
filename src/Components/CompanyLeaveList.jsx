import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';

const CompanyLeaveList = () => {
    const [futureLeaves, setFutureLeaves] = useState([]);
    const [pastLeaves, setPastLeaves] = useState([]);
    const [ongoingLeaves, setOngoingLeaves] = useState([]);
    const [error, setError] = useState('');

    const location = useLocation();
    const companyId = location.state?.companyId;

    useEffect(() => {
        const fetchLeaveRequests = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Unauthorized. Please login.');
                return;
            }

            try {
                const response = await axios.get(`https://localhost:7136/api/Leave/GetLeavesByCompanyId/${companyId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                console.log(response.data);

                const today = new Date();

                // Gelecek izinler (bugün tarihinden sonra başlayacak olanlar)
                const future = response.data.filter(leave => new Date(leave.startDate) > today);

                // Geçmiş izinler (bugün tarihinden önce bitmiş olanlar)
                const past = response.data.filter(leave => new Date(leave.endDate) < today);

                // Bugünle örtüşen izinler (bugün devam eden ya da bugün başlayanlar)
                const ongoing = response.data.filter(leave => new Date(leave.startDate) <= today && new Date(leave.endDate) >= today);

                setFutureLeaves(future);
                setPastLeaves(past);
                setOngoingLeaves(ongoing);
            } catch (error) {
                console.error(error);
                setError('Failed to fetch leave requests');
            }
        };

        fetchLeaveRequests();
    }, [companyId]);

    const columns = [
        {
            name: 'Employee Name',
            selector: row => row.employee ? `${row.employee.userName}` : 'N/A',
            sortable: true,
        },
        {
            name: 'Start Date',
            selector: row => new Date(row.startDate).toLocaleDateString(),
            sortable: true,
        },
        {
            name: 'End Date',
            selector: row => new Date(row.endDate).toLocaleDateString(),
            sortable: true,
        },
        {
            name: 'Total Days',
            selector: row => row.totalDays,
            sortable: true,
        },
        {
            name: 'Leave Type',
            selector: row => row.leaveType,
            sortable: true,
        },
        {
            name: 'Reason',
            selector: row => row.reason,
        },
    ];

    const futureTableData = {
        columns,
        data: futureLeaves,
        exportHeaders: true,
    };

    const pastTableData = {
        columns,
        data: pastLeaves,
        exportHeaders: true,
    };

    const ongoingTableData = {
        columns,
        data: ongoingLeaves,
        exportHeaders: true,
    };

    return (
        <div className="container mt-2 mb-3">
            <div className="mb-3 d-flex justify-content-between align-items-center">
                <h3 className="m-0">Company Leave List</h3>
            </div>

            {error && <p className="text-danger">{error}</p>}

            {/* Ongoing Leaves Table */}
            <div className="mb-4">
                <h4>Ongoing Leaves</h4>
                <DataTableExtensions {...ongoingTableData} export={true}>
                    <DataTable
                        title="Ongoing Leaves"
                        columns={columns}
                        data={ongoingLeaves}
                        pagination
                        striped
                        highlightOnHover
                    />
                </DataTableExtensions>
            </div>

            {/* Future Leaves Table */}
            <div className="mb-4">
                <h4>Future Leaves</h4>
                <DataTableExtensions {...futureTableData} export={true}>
                    <DataTable
                        title="Future Leaves"
                        columns={columns}
                        data={futureLeaves}
                        pagination
                        striped
                        highlightOnHover
                    />
                </DataTableExtensions>
            </div>

            {/* Past Leaves Table */}
            <div>
                <h4>Past Leaves</h4>
                <DataTableExtensions {...pastTableData} export={true}>
                    <DataTable
                        title="Past Leaves"
                        columns={columns}
                        data={pastLeaves}
                        pagination
                        striped
                        highlightOnHover
                    />
                </DataTableExtensions>
            </div>
        </div>
    );
};

export default CompanyLeaveList;
