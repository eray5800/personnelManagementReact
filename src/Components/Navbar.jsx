import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ toggleSidebar }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token'); // Get token from localStorage

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove token on logout
        localStorage.removeItem('expiration');
        localStorage.removeItem('role');
        navigate('/login'); // Navigate to login page after logout
    };

    const handleLogin = () => {
        navigate('/login'); // Navigate to login page
    };

    const handleRegister = () => {
        navigate('/register'); // Navigate to register page
    };

    const handleProfile = () => {
        navigate('/profile'); // Navigate to profile page
    };

    const handleCompany = () => {
        navigate('/company'); // Navigate to company page
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-white bg-white">
            <button type="button" id="sidebarCollapse" className="btn btn-light" onClick={toggleSidebar}>
                <i className="fas fa-bars"></i><span></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="nav navbar-nav ms-auto">
                    {token ? (
                        <>
                            {/* Profil Butonu */}
                            <li className="nav-item">
                                <button className="btn btn-info me-2" onClick={handleProfile}>
                                    <i className="fas fa-user"></i> Profil
                                </button>
                            </li>

                            {/* Company Butonu */}
                            <li className="nav-item">
                                <button className="btn btn-success me-2" onClick={handleCompany}>
                                    <i className="fas fa-building"></i> Company
                                </button>
                            </li>

                            <li className="nav-item">
                                <button className="btn btn-danger" onClick={handleLogout}>
                                    <i className="fas fa-sign-out-alt"></i> Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="nav-item">
                                <button className="btn btn-primary me-2" onClick={handleLogin}>
                                    <i className="fas fa-sign-in-alt"></i> Login
                                </button>
                            </li>
                            <li className="nav-item">
                                <button className="btn btn-secondary" onClick={handleRegister}>
                                    <i className="fas fa-user-plus"></i> Register
                                </button>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
