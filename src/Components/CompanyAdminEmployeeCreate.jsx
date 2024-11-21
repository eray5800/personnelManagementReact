import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CompanyAdminEmployeeCreate = () => {
    const [formData, setFormData] = useState({
        userName: '',
        email: ''
    });
    const [error, setError] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token'); // Get token from localStorage
    const [employeeId, setEmployeeId] = useState(null); 


    const parseJwt = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        } catch (error) {
            return null;
        }
    };

    useEffect(() => {
        if (token) {
            const decodedToken = parseJwt(token);
            const id = decodedToken?.sub;
            setEmployeeId(id);
        }
    }, [token]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!employeeId) {
            setError(['Invalid token or employee ID not found']);
            return;
        }

        try {
            const response = await axios.post(`https://localhost:7136/api/Company/CreateCompanyAdminEmployee/${employeeId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            });
            navigate('/company');
            
        } catch (error) {
            console.log(error);

            const errorMessages = error.response?.data || [];
            setError(errorMessages.map(err => err.description));
        }
    };

    return (
        <div className="container">
            <h2>Create Employee</h2>
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
                <button type="submit" className="btn btn-primary mt-3">Create Employee</button>
            </form>
        </div>
    );
};

export default CompanyAdminEmployeeCreate;
