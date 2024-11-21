import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen }) => {
    
    const role = localStorage.getItem('role');
    const isAdmin = role == 'SystemAdministrator';

    return (
        <nav id="sidebar" className={isOpen ? 'active' : ''}>
            <div className="sidebar-header">
                <img src="./img/pmalogo_transparent.png" alt="bootraper logo" className="app-logo" />
            </div>
            <ul className="list-unstyled components text-secondary">
                <li>
                    <Link to="/dashboard"><i className="fas fa-home"></i> Dashboard</Link>
                </li>
                {isAdmin && ( // Conditionally render the Company Requests link
                <>
                <li>
                    <Link to="/employees"><i className="fas fa-users"></i> Employees</Link>
                </li>
                <li>
                    <Link to="/company-request-list"><i className="fas fa-file-alt"></i> Company Requests</Link>
                </li>
                </>

                )}
            </ul>
        </nav>
    );
};

export default Sidebar;
