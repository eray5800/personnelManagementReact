import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';

const MAX_FIELDS = 10; // Maximum field count

const AddDetails = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        address: '',
        position: '',
        department: '',
        city: '',
        birthDate: '',
        educations: [{ school: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' }],
        certifications: [{ certificationName: '', certificationProvider: '', certificationDate: '', QualificationId: '' }],
        experiences: [{ companyName: '', position: '', description: '', startDate: '', endDate: '' }]
    });

    const [errors, setErrors] = useState({}); // State to hold error messages

    // Function to decode JWT token and retrieve employeeId
    const parseJwt = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
            return JSON.parse(jsonPayload);
        } catch (error) {
            return null;
        }
    };

    const token = localStorage.getItem('token');
    const decodedToken = parseJwt(token);
    const employeeId = decodedToken?.sub;

    const handleInputChange = (e, index, type) => {
        const { name, value } = e.target;
        setFormData(prevData => {
            const updatedData = { ...prevData };
            if (type === 'education') {
                updatedData.educations[index][name] = value;
            } else if (type === 'certification') {
                updatedData.certifications[index][name] = value;
            } else if (type === 'experience') {
                updatedData.experiences[index][name] = value;
            } else {
                updatedData[name] = value;
            }
            return updatedData;
        });
    };

    const addNewField = (type) => {
        setFormData(prevData => {
            const updatedData = { ...prevData };
            if (type === 'education' && prevData.educations.length < MAX_FIELDS) {
                updatedData.educations.push({ school: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' });
            } else if (type === 'certification' && prevData.certifications.length < MAX_FIELDS) {
                updatedData.certifications.push({ certificationName: '', certificationProvider: '', certificationDate: '', QualificationId: '' });
            } else if (type === 'experience' && prevData.experiences.length < MAX_FIELDS) {
                updatedData.experiences.push({ companyName: '', position: '', description: '', startDate: '', endDate: '' });
            } else {
                alert(`You can only add up to ${MAX_FIELDS} ${type}.`);
            }
            return updatedData;
        });
    };

    const removeField = (index, type) => {
        setFormData(prevData => {
            const updatedData = { ...prevData };
            if (type === 'education' && prevData.educations.length > 1) {
                updatedData.educations.splice(index, 1);
            } else if (type === 'certification' && prevData.certifications.length > 1) {
                updatedData.certifications.splice(index, 1);
            } else if (type === 'experience' && prevData.experiences.length > 1) {
                updatedData.experiences.splice(index, 1);
            }
            return updatedData;
        });
    };

    // Validate dates
    const validateDates = (startDate, endDate) => {
        return new Date(startDate) <= new Date(endDate);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!employeeId) {
            console.error('Invalid token: employeeId not found');
            return; // Stop if the token is invalid
        }
    
        // Validate dates in experiences and educations
        const validationErrors = {};
        for (const education of formData.educations) {
            if (education.startDate || education.endDate) { // Only validate if at least one date is provided
                if (!validateDates(education.startDate, education.endDate)) {
                    validationErrors.education = validationErrors.education || [];
                    validationErrors.education.push("End date must be after start date for education.");
                }
            }
        }
    
        // Check for experience entries and validate dates
        for (const experience of formData.experiences) {
            if (experience.startDate || experience.endDate) { // Only validate if at least one date is provided
                if (!validateDates(experience.startDate, experience.endDate)) {
                    validationErrors.experience = validationErrors.experience || [];
                    validationErrors.experience.push("End date must be after start date for experience.");
                }
            }
        }
    

        // If there are validation errors, update state and return
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
    
// Helper function to check if a value is empty
const isEmpty = (value) => value === null || value === undefined || value === "";

// Create a new object with null values for empty fields
const prepareDataForApi = (data) => {
    console.log(data);
    
    // Check if all fields in educations are empty
    const allEducationsEmpty = data.educations.every(education => 
        isEmpty(education.school) &&
        isEmpty(education.degree) &&
        isEmpty(education.fieldOfStudy) &&
        isEmpty(education.startDate) &&
        isEmpty(education.endDate)
    );

    // Check if all fields in certifications are empty
    const allCertificationsEmpty = data.certifications.every(certification => 
        isEmpty(certification.certificationName) &&
        isEmpty(certification.certificationProvider) &&
        isEmpty(certification.certificationDate) &&
        isEmpty(certification.QualificationId)
    );

    // Check if all fields in experiences are empty
    const allExperiencesEmpty = data.experiences.every(experience => 
        isEmpty(experience.companyName) &&
        isEmpty(experience.position) &&
        isEmpty(experience.description) &&
        isEmpty(experience.startDate) &&
        isEmpty(experience.endDate)
    );

    return {
        ...data,
        address: isEmpty(data.address) ? null : data.address,
        position: isEmpty(data.position) ? null : data.position,
        department: isEmpty(data.department) ? null : data.department,
        city: isEmpty(data.city) ? null : data.city,
        educations: allEducationsEmpty ? null : data.educations.map(education => ({
            school: isEmpty(education.school) ? null : education.school,
            degree: isEmpty(education.degree) ? null : education.degree,
            fieldOfStudy: isEmpty(education.fieldOfStudy) ? null : education.fieldOfStudy,
            startDate: isEmpty(education.startDate) ? null : education.startDate,
            endDate: isEmpty(education.endDate) ? null : education.endDate,
        })), // If all education entries are empty, send null
        certifications: allCertificationsEmpty ? null : data.certifications.map(certification => ({
            certificationName: isEmpty(certification.certificationName) ? null : certification.certificationName,
            certificationProvider: isEmpty(certification.certificationProvider) ? null : certification.certificationProvider,
            certificationDate: isEmpty(certification.certificationDate) ? null : certification.certificationDate,
            QualificationId: isEmpty(certification.QualificationId) ? null : certification.QualificationId,
        })), // If all certification entries are empty, send null
        experiences: allExperiencesEmpty ? null : data.experiences.map(experience => ({
            companyName: isEmpty(experience.companyName) ? null : experience.companyName,
            position: isEmpty(experience.position) ? null : experience.position,
            description: isEmpty(experience.description) ? null : experience.description,
            startDate: isEmpty(experience.startDate) ? null : experience.startDate,
            endDate: isEmpty(experience.endDate) ? null : experience.endDate,
        })), // If all experience entries are empty, send null
    };
};


    
        const preparedData = prepareDataForApi(formData);
    
        try {
            console.log(preparedData)
            const response = await axios.post(`https://localhost:7136/api/Employee/AddEmployeeDetail/${employeeId}`, preparedData, {
                headers: {
                    Authorization: `Bearer ${token}` // Add token in the header
                }
            });

            setErrors({}); 
            navigate('/profile');
        } catch (error) {
            const errorMessages = error.response?.data.errors || {}; 
            setErrors(errorMessages);
        }
    };
    
    return (
        <div className="container mt-5">
            <h1>Add Employee Details</h1>
            {Object.keys(errors).length > 0 && (
                <div className="error" style={{ color: 'red' }}>
                    <ul>
                        {Object.entries(errors).map(([field, messages]) => (
                            <li key={field}>
                                <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong>
                                <ul>
                                    {messages.map((message, index) => (
                                        <li key={index}>{message}</li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <form onSubmit={handleSubmit}>
                {/* Basic employee details */}
                <div className="mb-3">
                    <label htmlFor="address" className="form-label">Address</label>
                    <input
                        type="text"
                        className="form-control"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required // Required field
                    />
                </div>

                {/* BirthDate field */}
                <div className="mb-3">
                    <label htmlFor="birthDate" className="form-label">Birth Date</label>
                    <input
                        type="date"
                        className="form-control"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="position" className="form-label">Position</label>
                    <input
                        type="text"
                        className="form-control"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        required // Required field
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="department" className="form-label">Department</label>
                    <input
                        type="text"
                        className="form-control"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        required // Required field
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="city" className="form-label">City</label>
                    <input
                        type="text"
                        className="form-control"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required // Required field
                    />
                </div>

                {/* Educations Section */}
                <h3>Educations</h3>
                {formData.educations.map((education, index) => (
                    <div key={index} className="mb-4 p-3 border rounded bg-light">
                        <div className="mb-3">
                            <label htmlFor={`school_${index}`} className="form-label">School</label>
                            <input
                                type="text"
                                className="form-control"
                                name="school"
                                value={education.school}
                                onChange={(e) => handleInputChange(e, index, 'education')}
                                id={`school_${index}`}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor={`degree_${index}`} className="form-label">Degree</label>
                            <input
                                type="text"
                                className="form-control"
                                name="degree"
                                value={education.degree}
                                onChange={(e) => handleInputChange(e, index, 'education')}
                                id={`degree_${index}`}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor={`fieldOfStudy_${index}`} className="form-label">Field of Study</label>
                            <input
                                type="text"
                                className="form-control"
                                name="fieldOfStudy"
                                value={education.fieldOfStudy}
                                onChange={(e) => handleInputChange(e, index, 'education')}
                                id={`fieldOfStudy_${index}`}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor={`startDate_${index}`} className="form-label">Start Date</label>
                            <input
                                type="date"
                                className="form-control"
                                name="startDate"
                                value={education.startDate}
                                onChange={(e) => handleInputChange(e, index, 'education')}
                                id={`startDate_${index}`}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor={`endDate_${index}`} className="form-label">End Date</label>
                            <input
                                type="date"
                                className="form-control"
                                name="endDate"
                                value={education.endDate}
                                onChange={(e) => handleInputChange(e, index, 'education')}
                                id={`endDate_${index}`}
                            />
                        </div>
                        <button type="button" className="btn btn-danger" onClick={() => removeField(index, 'education')}>Remove Education</button>
                    </div>
                ))}
                <button type="button" className="btn btn-primary" onClick={() => addNewField('education')}>Add Education</button>

                {/* Certifications Section */}
                <h3>Certifications</h3>
{formData.certifications.map((certification, index) => (
    <div key={index} className="mb-4 p-3 border rounded bg-light">
        <div className="mb-3">
            <label htmlFor={`certificationName_${index}`} className="form-label">Certification Name</label>
            <input
                type="text"
                className="form-control"
                name="certificationName"
                value={certification.certificationName}
                onChange={(e) => handleInputChange(e, index, 'certification')}
                id={`certificationName_${index}`}
            />
        </div>
        <div className="mb-3">
            <label htmlFor={`certificationProvider_${index}`} className="form-label">Certification Provider</label>
            <input
                type="text"
                className="form-control"
                name="certificationProvider"
                value={certification.certificationProvider}
                onChange={(e) => handleInputChange(e, index, 'certification')}
                id={`certificationProvider_${index}`}
            />
        </div>
        <div className="mb-3">
            <label htmlFor={`certificationDate_${index}`} className="form-label">Certification Date</label>
            <input
                type="date"
                className="form-control"
                name="certificationDate"
                value={certification.certificationDate}
                onChange={(e) => handleInputChange(e, index, 'certification')}
                id={`certificationDate_${index}`}
            />
        </div>
        <div className="mb-3">
            <label htmlFor={`qualificationId_${index}`} className="form-label">Qualification ID</label>
            <input
                type="text"
                className="form-control"
                name="QualificationId"
                value={certification.QualificationId}
                onChange={(e) => handleInputChange(e, index, 'certification')}
                id={`qualificationId_${index}`}
            />
        </div>
        <button type="button" className="btn btn-danger" onClick={() => removeField(index, 'certification')}>Remove Certification</button>
    </div>
))}
                <button type="button" className="btn btn-primary" onClick={() => addNewField('certification')}>Add Certification</button>

                {/* Experiences Section */}
                <h3>Experiences</h3>
                {formData.experiences.map((experience, index) => (
                    <div key={index} className="mb-4 p-3 border rounded bg-light">
                        <div className="mb-3">
                            <label htmlFor={`companyName_${index}`} className="form-label">Company Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="companyName"
                                value={experience.companyName}
                                onChange={(e) => handleInputChange(e, index, 'experience')}
                                id={`companyName_${index}`}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor={`position_${index}`} className="form-label">Position</label>
                            <input
                                type="text"
                                className="form-control"
                                name="position"
                                value={experience.position}
                                onChange={(e) => handleInputChange(e, index, 'experience')}
                                id={`position_${index}`}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor={`description_${index}`} className="form-label">Description</label>
                            <textarea
                                className="form-control"
                                name="description"
                                value={experience.description}
                                onChange={(e) => handleInputChange(e, index, 'experience')}
                                id={`description_${index}`}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor={`experienceStartDate_${index}`} className="form-label">Start Date</label>
                            <input
                                type="date"
                                className="form-control"
                                name="startDate"
                                value={experience.startDate}
                                onChange={(e) => handleInputChange(e, index, 'experience')}
                                id={`experienceStartDate_${index}`}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor={`experienceEndDate_${index}`} className="form-label">End Date</label>
                            <input
                                type="date"
                                className="form-control"
                                name="endDate"
                                value={experience.endDate}
                                onChange={(e) => handleInputChange(e, index, 'experience')}
                                id={`experienceEndDate_${index}`}
                            />
                        </div>
                        <button type="button" className="btn btn-danger" onClick={() => removeField(index, 'experience')}>Remove Experience</button>
                    </div>
                ))}
                <div className="d-flex flex-column flex-md-row  mb-3">
                 <button type="button" className="btn btn-primary me-md-2 mb-2 mb-md-0" onClick={() => addNewField('experience')}>Add Another Experience</button>
                 <button type="submit" className="btn btn-success">Save Details</button>
                </div>
            </form>
        </div>
    );
};

export default AddDetails;
