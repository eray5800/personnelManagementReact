import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';

const MyExpenseRequests = () => {
    const [expenseRequests, setExpenseRequests] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDescription, setSelectedDescription] = useState('');

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

    const token = localStorage.getItem('token');
    const decodedToken = parseJwt(token);
    const employeeId = decodedToken?.sub;

    useEffect(() => {
        const fetchExpenseRequests = async () => {
            if (!token) {
                setError('Unauthorized. Please login.');
                setIsLoading(false);
                return;
            }

            try {
                const response = await axios.get(`https://localhost:7136/api/ExpenseRequest/GetExpenseRequestsByEmployeeId/${employeeId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setExpenseRequests(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching expense requests:", error);
                setError('Failed to fetch expense request data');
                setIsLoading(false);
            }
        };

        fetchExpenseRequests();
    }, [employeeId, token]);

    const handleDownloadPdf = async (expenseRequestId) => {
        try {
            const response = await axios.get(`https://localhost:7136/api/ExpenseRequest/GetExpenseRequestDocument/${expenseRequestId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${expenseRequestId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error downloading document:", error);
        }
    };

    const columns = [
        {
            name: 'Employee Name',
            selector: row => row.employee ? row.employee.userName : 'N/A',
            sortable: true,
            cell: row => row.employee ? row.employee.userName : 'N/A'
        },
        {
            name: 'Amount',
            selector: row => row.amount,
            sortable: true,
            cell: row => `$${row.amount.toFixed(2)}`
        },
        {
            name: 'Date',
            selector: row => new Date(row.date),
            sortable: true,
            cell: row => new Date(row.date).toLocaleDateString()
        },
        {
            name: 'Status',
            selector: row => row.status,
            sortable: true,
            cell: row => row.status
        },
        {
            name: 'Description',
            cell: row => (
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setSelectedDescription(row.description);
                        setModalVisible(true);
                    }}>
                    View Description
                </button>
            )
        },
        {
            name: 'Document',
            cell: row => (
                <button className="btn btn-primary" onClick={() => handleDownloadPdf(row.expenseRequestId)}>
                    Download PDF
                </button>
            )
        },
    ];

    const tableData = {
        columns,
        data: expenseRequests,
        exportHeaders: true,
        filterHidden: true, // Enable this to hide the filter/search input
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-2 mb-3">
            <h3 className="mb-4">My Expense Requests</h3>
            {error && <p className="text-danger">{error}</p>}
            <DataTableExtensions {...tableData} export={true}>
                <DataTable
                    title="Expense Requests"
                    columns={columns}
                    data={expenseRequests}
                    pagination
                    striped
                    highlightOnHover
                    searchable // Enable the search box
                />
            </DataTableExtensions>

            {/* Bootstrap Modal for displaying the full description */}
            <div className={`modal ${modalVisible ? 'show' : ''}`} style={{ display: modalVisible ? 'block' : 'none' }} role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Expense Description</h5>
                            <button type="button" className="btn-close" onClick={closeModal}></button>
                        </div>
                        <div className="modal-body">
                            <p className='text-break'>{selectedDescription}</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
            {modalVisible && <div className="modal-backdrop fade show"></div>}
        </div>
    );
};

export default MyExpenseRequests;
