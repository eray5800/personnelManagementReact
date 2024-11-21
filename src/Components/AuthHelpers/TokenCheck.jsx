import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TokenCheck = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const tokenExpiration = localStorage.getItem('expiration'); // Unix timestamp as a string
        
        if (!token || !tokenExpiration) {
            navigate('/login');
        } else {
            // Convert the tokenExpiration from seconds to milliseconds
            const expirationDate = new Date(parseInt(tokenExpiration, 10) * 1000); // Convert Unix timestamp to JS Date
            const currentDate = new Date();


            if (currentDate >= expirationDate) {
                localStorage.removeItem('token');
                localStorage.removeItem('expiration');
                localStorage.removeItem('role');
                navigate('/login');
            }
        }
    }, [navigate]);

    return <>{children}</>;
};

export default TokenCheck;
