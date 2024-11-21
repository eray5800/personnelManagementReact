import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // axios'u içe aktar
import '../assets/css/Profile.css'; // CSS dosyasını ekle

const Profile = () => {
    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Loading state
    const token = localStorage.getItem('token'); // Get token from localStorage
    const navigate = useNavigate();

    // Helper function to decode JWT token and get employeeId
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
        if (!token) {
            navigate('/login');
            return;
        }

        const decodedToken = parseJwt(token);
        const employeeId = decodedToken?.sub;

        if (!employeeId) {
            console.error('Invalid token: employeeId not found');
            navigate('/login');
            return;
        }

        // Axios ile profile verilerini getir
        axios.get(`https://localhost:7136/api/Employee/GetEmployeeById/${employeeId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                console.log(response.data);
                setProfileData(response.data); // response.data ile verileri al
                setIsLoading(false); // Yükleme tamamlandı
            })
            .catch(error => {
                console.error('Error fetching profile data:', error);
                setIsLoading(false); // Hata durumunda da yüklemeyi durdur
            });
    }, [token, navigate]);

    const handleAddDetails = () => {
        navigate('/add-details'); // Navigate to add details page
    };

    const handleUpdateDetails = () => {
        navigate('/update-details'); // Navigate to update details page
    };

    // Check if specific fields are empty or null
    const isProfileIncomplete = () => {
        if (!profileData) return true;

        const fieldsToCheck = [
            profileData.department,
            profileData.city,
            profileData.address,
            profileData.position,
            
        ];

        return fieldsToCheck.some(field => !field || field.trim() === '');
    };

    return (
        <div className="profile-container">
            {isLoading ? (
                <div className="loading">
                    <h2>Loading profile data...</h2> {/* Loading message */}
                </div>
            ) : (
                profileData ? (
                    <div>
                        <h1>{profileData.userName} - Profile</h1>

                        {/* Profile Information */}
                        <div className="profile-info">

                            {/* Basic Information Card */}
                            <div className="info-card">
                                <h3>Basic Information</h3>
                                <p><strong>Email</strong>: {profileData.email}</p>
                                <p><strong>Address:</strong> {profileData.address || 'No Address Available'}</p>
                                <p><strong>BirthDate:</strong> {new Date(profileData.birthDate).toLocaleDateString() || 'No BirthDate Available'}</p>
                                <p><strong>Position:</strong> {profileData.position || 'No Position Available'}</p>
                                <p><strong>Department:</strong> {profileData.department || 'No Department Available'}</p>
                                <p><strong>City:</strong> {profileData.city || 'No City Available'}</p>
                                <p><strong>Remaining Leave Days : </strong> {profileData.remainingLeaveDays}</p>
                            </div>

                            {/* Certifications Card */}
                            <div className="info-card">
                                <h3>Certifications</h3>
                                {profileData.certifications.length > 0 ? (
                                    <ul>
                                    {profileData.certifications.map(cert => (
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
                                {profileData.educations.length > 0 ? (
                                    <ul>
                                        {profileData.educations.map(edu => (
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
                                {profileData.experiences.length > 0 ? (
                                    <ul>
                                        {profileData.experiences.map(exp => (
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

                        {isProfileIncomplete() ? (
                            <button className="btn btn-primary" onClick={handleAddDetails}>
                                Would you like to add your details?
                            </button>
                        ) : (
                            <button className="btn btn-secondary" onClick={handleUpdateDetails}>
                                Would you like to update your details?
                            </button>
                        )}
                    </div>
                ) : (
                    <div>
                        <h2>No profile information available.</h2>
                        <button className="btn btn-primary" onClick={handleAddDetails}>
                            Would you like to add your details?
                        </button>
                    </div>
                )
            )}
        </div>
    );
};

export default Profile;
