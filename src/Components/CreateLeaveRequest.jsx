import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateLeaveRequest = () => {
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        leaveType: '',
        reason: ''
    });

    const [error, setError] = useState([]);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = [];

        // Validate start and end dates
        const startDate = new Date(formData.startDate);
        const endDate = new Date(formData.endDate);

        // Check if the end date is before the start date or if they are the same
        if (endDate < startDate) {
            validationErrors.push("End date must be after start date.");
        }

        if (!formData.leaveType) {
            validationErrors.push("Please select a leave type.");
        }

        if (validationErrors.length > 0) {
            setError(validationErrors);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            console.log(formData);
            const response = await axios.post('https://localhost:7136/api/LeaveRequest/CreateLeaveRequest', formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            navigate('/company');
        } catch (error) {
            console.log(error.response);
            const errorMessages = (error.response?.data.errors || error.response.data) || [];
            
            const formattedErrors = Object.entries(errorMessages).flatMap(([key, messages]) => 
                messages.map(msg => `${key}: ${msg}`)
            );
            setError(formattedErrors);
        }
    };

    return (
        <div className="container">
            <h2>Create Leave Request</h2>
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
                    <label htmlFor="startDate">Start Date:</label>
                    <input
                        type="date"
                        className="form-control"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="endDate">End Date:</label>
                    <input
                        type="date"
                        className="form-control"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="leaveType">Leave Type:</label>
                    <select
                        className="form-control"
                        name="leaveType"
                        value={formData.leaveType}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Please select leave type</option>
                        <option value="0">Annual</option>
                        <option value="1">Sick</option>
                        <option value="2">Maternity</option>
                        <option value="3">Paternity</option>
                        <option value="4">Bereavement</option>
                        <option value="5">Unpaid</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="reason">Reason:</label>
                    <textarea
                        className="form-control"
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-3">Submit Leave Request</button>
            </form>
        </div>
    );
};

export default CreateLeaveRequest;
