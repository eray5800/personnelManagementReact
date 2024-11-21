import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateExpenseRequest = () => {
    const [formData, setFormData] = useState({
        amount: '',
        date: '',
        name: '',
        description: '',
        expenseDocument: null, // This will hold the Base64 string for the document
    });

    const [error, setError] = useState([]);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        // For file input
        if (name === 'expenseDocument') {
            const file = e.target.files[0]; // Get the first file
            if (file) {
                // Read the file and convert to Base64
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFormData((prevState) => ({
                        ...prevState,
                        expenseDocument: reader.result // Set the Base64 string here
                    }));
                };
                reader.readAsDataURL(file); // Read the file as a Data URL
            }
        } else {
            setFormData((prevState) => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { expenseDocument, ...dataToSend } = formData;

        try {
            // Retrieve the token from localStorage
            const token = localStorage.getItem('token');

            const response = await axios.post('https://localhost:7136/api/ExpenseRequest/CreateExpenseRequest', {
                ...dataToSend,
                expenseDocument // This will be the Base64 string
            }, {
                headers: {
                    Authorization: `Bearer ${token}` // Add the token to the Authorization header
                }
            });

            // Redirect or show a success message if needed
            navigate('/company'); // Redirect to the expense list page after successful creation
        } catch (error) {
            console.log(error.response);
            const errorMessages = error.response?.data || [];
            setError(errorMessages.map(err => err.description));
        }
    };

    return (
        <div className="container">
            <h2>Create Expense Request</h2>
            {error.length > 0 && (
                <div className="error" style={{ color: 'red' }}>
                    <ul>
                        {error.map((err, index) => (
                            <li key={index}>{err}</li>
                        ))}
                    </ul>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="amount">Amount:</label>
                    <input
                        type="number"
                        className="form-control"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="date">Date:</label>
                    <input
                        type="date"
                        className="form-control"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="name">Expense Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        className="form-control"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="expenseDocument">Expense Document (PDF):</label>
                    <input
                        type="file"
                        className="form-control"
                        name="expenseDocument"
                        accept=".pdf"
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-3">Submit Expense Request</button>
            </form>
        </div>
    );
};

export default CreateExpenseRequest;
