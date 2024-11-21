// src/Components/ExpenseRequests.jsx
import React from 'react';

// Dummy data for expense requests
const expenseRequests = [
    {
        expenseRequestId: 1,
        employee: { name: "John Doe" },
        amount: 150.75,
        date: new Date("2023-07-15"),
        status: "Approved",
    },
    {
        expenseRequestId: 2,
        employee: { name: "Jane Smith" },
        amount: 75.50,
        date: new Date("2023-08-22"),
        status: "Pending",
    },
];

const ExpenseRequests = () => {
    const handleDelete = (id) => {
        // Logic for deleting the expense request goes here
        console.log(`Delete expense request with ID: ${id}`);
    };

    return (
        <div className="container mt-2 mb-3">
            <div className="mb-3 d-flex justify-content-between align-items-center">
                <h3 className="m-0">Expense Requests</h3>
                <a href="/create-expense-request" className="btn btn-sm btn-primary p-2">Create Expense Request</a>
            </div>
            <div className="row">
                <div className="col-md-12 col-lg-12">
                    <div className="card">
                        <div className="card-header">Expense Requests List</div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Request ID</th>
                                            <th>Employee Name</th>
                                            <th>Amount</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th>Options</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {expenseRequests.map((request) => (
                                            <tr key={request.expenseRequestId}>
                                                <td>{request.expenseRequestId}</td>
                                                <td>{request.employee.name}</td>
                                                <td>${request.amount.toFixed(2)}</td>
                                                <td>{request.date.toLocaleDateString()}</td>
                                                <td>{request.status}</td>
                                                <td className="d-flex">
                                                    <a href={`/update-expense-request/${request.expenseRequestId}`} className="btn btn-sm btn-primary me-1">Update</a>
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleDelete(request.expenseRequestId)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpenseRequests;
