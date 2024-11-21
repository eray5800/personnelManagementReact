import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const AdminEmployeeDetailShow = () => {
    const [employeeData, setEmployeeData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const token = localStorage.getItem('token');
    const location = useLocation();

    const employeeId = location.state?.employeeId; // Get employeeId from the navigation state

    useEffect(() => {
        if (!token || !employeeId) {
            console.error('Token or Employee ID is missing.');
            return;
        }

        // Fetch employee details
        axios.get(`https://localhost:7136/api/Employee/GetEmployeeById/${employeeId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                setEmployeeData(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching employee data:', error);
                setIsLoading(false);
            });
    }, [token, employeeId]);

    return (
        <div className="employee-detail-container">
            {isLoading ? (
                <div className="loading">
                    <h2>Loading employee details...</h2>
                </div>
            ) : (
                employeeData ? (
                    <div>
                        <h1 className='mt-2'>{employeeData.userName} - Details</h1>

                        {/* Profile Information */}
                        <div className="profile-info">

                            {/* Basic Information Card */}
                            <div className="info-card">
                                <h3>Basic Information</h3>
                                <p><strong>Email</strong>: {employeeData.email}</p>
                                <p><strong>Address:</strong> {employeeData.address || 'No Address Available'}</p>
                                <p><strong>BirthDate:</strong> {new Date(employeeData.birthDate).toLocaleDateString() || 'No BirthDate Available'}</p>
                                <p><strong>Position:</strong> {employeeData.position || 'No Position Available'}</p>
                                <p><strong>Department:</strong> {employeeData.department || 'No Department Available'}</p>
                                <p><strong>City:</strong> {employeeData.city || 'No City Available'}</p>
                                <p><strong>Remaining Leave Days:</strong> {employeeData.remainingLeaveDays || 'No Remaining Leave Days Avaliable'}</p>
                            </div>

                            {/* Certifications Card */}
                            <div className="info-card">
                                <h3>Certifications</h3>
                                {employeeData.certifications.length > 0 ? (
                                    <ul>
                                        {employeeData.certifications.map(cert => (
                                            <li key={cert.certificationId}>
                                                {cert.certificationName} from {cert.certificationProvider} on {new Date(cert.certificationDate).toLocaleDateString()} <span className='ms-2'>Qualification Id :{cert.qualificationId}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No Certifications Available</p>
                                )}
                            </div>

                            {/* Educations Card */}
                            <div className="info-card">
                                <h3>Educations</h3>
                                {employeeData.educations.length > 0 ? (
                                    <ul>
                                        {employeeData.educations.map(edu => (
                                            <li key={edu.educationId}>
                                                {edu.degree} in {edu.fieldOfStudy} from {edu.school} ({new Date(edu.startDate).toLocaleDateString()} - {new Date(edu.endDate).toLocaleDateString()})
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No Educations Available</p>
                                )}
                            </div>

                            {/* Experiences Card */}
                            <div className="info-card">
                                <h3>Experiences</h3>
                                {employeeData.experiences.length > 0 ? (
                                    <ul>
                                        {employeeData.experiences.map(exp => (
                                            <li key={exp.experienceId}>
                                                <strong>{exp.position}</strong> at {exp.companyName} ({new Date(exp.startDate).toLocaleDateString()} - {new Date(exp.endDate).toLocaleDateString()})
                                                <p>Description: {exp.description}</p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No Experiences Available</p>
                                )}
                            </div>

                        </div>

                    </div>
                ) : (
                    <div>
                        <h2>No employee information available.</h2>
                    </div>
                )
            )}
        </div>
    );
};

export default AdminEmployeeDetailShow;
