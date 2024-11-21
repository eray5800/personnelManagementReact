import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateCompany = () => {
    const [formData, setFormData] = useState({
        companyName: '',
        address: '',
        email: '',
        phoneNumber: '',
        companyDocument: null // This will hold the Base64 string
    });

    const [error, setError] = useState([]);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        // For file input
        if (name === 'companyDocument') {
            const file = e.target.files[0]; // Get the first file
            if (file) {
                // Read the file and convert to Base64
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFormData((prevState) => ({
                        ...prevState,
                        companyDocument: reader.result // Set the Base64 string here
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

        const { companyDocument, ...dataToSend } = formData;

        try {
            // Retrieve the token from localStorage
            const token = localStorage.getItem('token'); // Make sure 'jwtToken' is the key you used to store the token
            console.log(token);

            const response = await axios.post('https://localhost:7136/api/CompanyRequest/CreateCompanyRequest', {
                ...dataToSend,
                companyDocument // This will be the Base64 string
            }, {
                headers: {
                    'Content-Type': 'application/json', // Ensure the content type is JSON
                    Authorization: `Bearer ${token}` // Add the token to the Authorization header
                }
            });
            // Redirect or show a success message if needed
            navigate('/company'); // Redirect to the company page after successful creation
        } catch (error) {
            console.log(error.response);
            const errorMessages = error.response?.data || [];
            setError(errorMessages.map(err => err.description));
        }
    };

    return (
        <div className="container">
            <h2>Create Company</h2>
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
                    <label htmlFor="companyName">Company Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="address">Address:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="phoneNumber">Phone Number:</label>
                    <input
                        type="tel"
                        className="form-control"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="companyDocument">Company Document (PDF):</label>
                    <input
                        type="file"
                        className="form-control"
                        name="companyDocument"
                        accept=".pdf"
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-3">Send Create Company Request</button>
            </form>
        </div>
    );
};

export default CreateCompany;
