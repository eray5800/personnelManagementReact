import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';

const CompanyExpenseList = () => {
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDescription, setSelectedDescription] = useState('');

    const location = useLocation();
    const companyId = location.state?.companyId;
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchExpenses = async () => {
            if (!token) {
                setError('Unauthorized. Please login.');
                setIsLoading(false);
                return;
            }

            try {
                const response = await axios.get(`https://localhost:7136/api/Expense/GetExpensesByCompanyId/${companyId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log(response.data);
                setExpenses(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching expenses:", error);
                setError('Failed to fetch expense data');
                setIsLoading(false);
            }
        };

        fetchExpenses();
    }, [companyId, token]);

    const handleDownloadPdf = async (expenseId) => {
        try {
            const response = await axios.get(`https://localhost:7136/api/Expense/GetExpenseDocument/${expenseId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${expenseId}.pdf`);
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
        },
        {
            name: 'Amount',
            selector: row => row.amount, // Use raw amount for sorting
            sortable: true,
            cell: row => `$${row.amount.toFixed(2)}`, // Format for display
        },
        {
            name: 'Date',
            selector: row => new Date(row.date), // Return Date object for sorting
            sortable: true,
            cell: row => new Date(row.date).toLocaleDateString(), // Format for display
        },
        {
            name: 'Description',
            selector: row => (
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setSelectedDescription(row.description);
                        setModalVisible(true);
                    }}>
                    View Description
                </button>
            ),
        },
        {
            name: 'Document',
            cell: row => (
                <button className="btn btn-primary" onClick={() => handleDownloadPdf(row.expenseId)}>
                    Download PDF
                </button>
            ),
        },
    ];

    const tableData = {
        columns,
        data: expenses,
        exportHeaders: true,
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-2 mb-3">
            <h3 className="mb-4">Company Expense List</h3>
            {error && <p className="text-danger">{error}</p>}
            <DataTableExtensions {...tableData} export={true}>
                <DataTable
                    title="Expenses"
                    columns={columns}
                    data={expenses}
                    pagination
                    striped
                    highlightOnHover
                    searchable
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

export default CompanyExpenseList;
