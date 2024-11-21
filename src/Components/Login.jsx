import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    // Function to parse the JWT token
    const parseJwt = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        } catch (error) {
            return null;
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://localhost:7136/api/Employee/Login', {
                Email: email,
                Password: password
            });

            if (response.data.success) {
                const token = response.data.token;

                // Use the parseJwt function to extract the token's details
                const decodedToken = parseJwt(token);
                const expiration = decodedToken ? decodedToken.exp : null; // Get exp from the decoded token
                const role = decodedToken ? decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] : null; // Get role claim

                // Store the token, expiration, and role in localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('expiration', expiration); // Save the expiration time
                localStorage.setItem('role', role); // Save the role

                setSuccess('Login successful! Redirecting to dashboard...');
                navigate('/dashboard'); // Redirect after successful login
            }
        } catch (err) {
            if (err.response && err.response.data) {
                const errorData = err.response.data;

                if (Array.isArray(errorData)) {
                    const errorMessages = errorData.map(error => error.message);
                    setErrors(errorMessages);
                } else {
                    setErrors([errorData.message]);
                }
            } else {
                setErrors(['Login failed. Please try again.']);
            }
        }
    };

    return (
        <div className="container">
            <h2>Login</h2>
            {errors.length > 0 && (
                <div className="error" style={{ color: 'red' }}>
                    <ul>
                        {errors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}
            {success && <p className="success" style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-3">Login</button>
            </form>
        </div>
    );
};

export default Login;
