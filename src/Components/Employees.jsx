import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEmployees = async () => {
            const token = localStorage.getItem('token');
            
            if (!token) {
                setError('Unauthorized. Please login.');
                return;
            }

            try {
                const response = await axios.get('https://localhost:7136/api/Employee/GetAllEmployees', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setEmployees(response.data);
            } catch (error) {
                console.error(error);
                setError('Failed to fetch employees');
            }
        };

        fetchEmployees();
    }, []);

    const handleDelete = (id) => {
        console.log(`Delete employee with ID: ${id}`);
    };

    const columns = [
        {
            name: 'Employee Name',
            selector: row => row.userName,
            sortable: true,
            cellExport: row => row.userName, 
        },
        {
            name: 'Position',
            selector: row => row.position,
            sortable: true,
            cellExport: row => row.position,
        },
        {
            name: 'Email',
            selector: row => row.email,
            cellExport: row => row.email,
        },
        {
            name: 'Is Active',
            selector: row => (row.isActive ? "Yes" : "No"),
            sortable: true,
            cellExport: row => (row.isActive ? "Yes" : "No"), 
        },
        {
            name: 'Options',
            cell: row => (
                <div className="d-flex">
                    <a href={`/update-employee/${row.employeeId}`} className="btn btn-sm btn-primary me-1">Update</a>
                    <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(row.employeeId)}
                    >
                        Delete
                    </button>
                </div>
            ),
            cellExport: false
        },
    ];
    

    console.log(employees);
    const tableData = {
        columns,
        data: employees,
        exportHeaders: true, 
    };

    return (
        <div className="container mt-2 mb-3">
            <div className="mb-3 d-flex justify-content-between align-items-center">
                <h3 className="m-0">Employees</h3>
                <a href="/create-employee" className="btn btn-sm btn-primary p-2">Create Employee</a>
            </div>
            {error && <p className="text-danger">{error}</p>}
            <DataTableExtensions
                {...tableData}
                export={true} // Enable CSV Export
            >
                <DataTable
                    title="Employee List"
                    columns={columns}
                    data={employees}
                    pagination
                    striped
                    highlightOnHover
                    searchable // Enable the search box
                />
            </DataTableExtensions>
        </div>
    );
};

export default Employees;
