import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        password: ''
    });

    const [error, setError] = useState([]);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://localhost:7136/api/Employee/AddEmployee', formData);
            console.log(response.data);
            if (response.data.employeeId) { 
                navigate('/login'); 
            }
        } catch (error) {
            const errorMessages = error.response?.data || [];
            setError(errorMessages.map(err => err.description));
        }
    };

    return (
        <div className="container">
            <h2>Register</h2>
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
                    <label htmlFor="userName">Full Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="userName"
                        value={formData.userName}
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
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        className="form-control"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-3">Register</button>
            </form>
        </div>
    );
};

export default Register;
