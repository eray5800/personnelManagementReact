import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const MAX_FIELDS = 10;

const CompanyAdminUpdateDetails = () => {
    const location = useLocation();
    const { employeeId } = location.state || {};
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        address: '',
        position: '',
        department: '',
        city: '',
        remainingLeaveDays: 0, // Admin-specific field
        birthDate: '',
        educations: [{ school: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' }],
        certifications: [{ certificationName: '', certificationProvider: '', certificationDate: '', qualificationId: '' }],
        experiences: [{ companyName: '', position: '', description: '', startDate: '', endDate: '' }]
    });


    const [errors, setErrors] = useState({});


    const token = localStorage.getItem('token');

    useEffect(() => {
      
        if (employeeId) {
            axios.get(`https://localhost:7136/api/Employee/GetEmployeeById/${employeeId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    const formattedData = {
                        address: response.data.address || '',
                        position: response.data.position || '',
                        department: response.data.department || '',
                        city: response.data.city || '',
                        remainingLeaveDays: response.data.remainingLeaveDays || 0,
                        birthDate: response.data.birthDate ? response.data.birthDate.split('T')[0] : '',
                        educations: response.data.educations && response.data.educations.length > 0
                            ? response.data.educations.map(education => ({
                                ...education,
                                startDate: education.startDate ? education.startDate.split('T')[0] : '',
                                endDate: education.endDate ? education.endDate.split('T')[0] : ''
                            }))
                            : [{ school: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' }], // Default value if empty
                        certifications: response.data.certifications && response.data.certifications.length > 0
                            ? response.data.certifications.map(certification => ({
                                ...certification,
                                certificationDate: certification.certificationDate ? certification.certificationDate.split('T')[0] : ''
                            }))
                            : [{ certificationName: '', certificationProvider: '', certificationDate: '', qualificationId: '' }], // Default value if empty
                        experiences: response.data.experiences && response.data.experiences.length > 0
                            ? response.data.experiences.map(experience => ({
                                ...experience,
                                startDate: experience.startDate ? experience.startDate.split('T')[0] : '',
                                endDate: experience.endDate ? experience.endDate.split('T')[0] : ''
                            }))
                            : [{ companyName: '', position: '', description: '', startDate: '', endDate: '' }] // Default value if empty
                    };
                    setFormData(formattedData);
                })
                .catch(error => {
                    console.error('Error fetching employee details:', error);
                });
        }
    }, [employeeId, token]);


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
                updatedData.certifications.push({ certificationName: '', certificationProvider: '', certificationDate: '', qualificationId: '' });
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

    const validateDates = (startDate, endDate) => {
        return new Date(startDate) <= new Date(endDate);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!employeeId) {
            console.error('Invalid token: employeeId not found');
            return;
        }

        const validationErrors = {};
        for (const education of formData.educations) {
            if (education.startDate || education.endDate) {
                if (!validateDates(education.startDate, education.endDate)) {
                    validationErrors.education = validationErrors.education || [];
                    validationErrors.education.push("End date must be after start date for education.");
                }
            }
        }

        for (const experience of formData.experiences) {
            if (experience.startDate || experience.endDate) {
                if (!validateDates(experience.startDate, experience.endDate)) {
                    validationErrors.experience = validationErrors.experience || [];
                    validationErrors.experience.push("End date must be after start date for experience.");
                }
            }
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const preparedData = {
            ...formData,
            birthDate: formData.birthDate || null,
            remainingLeaveDays: formData.remainingLeaveDays || null, // Handle remaining leave days
            educations: formData.educations.map(education => ({
                ...education,
                startDate: education.startDate || null,
                endDate: education.endDate || null
            })),
            certifications: formData.certifications.map(certification => ({
                ...certification,
                certificationDate: certification.certificationDate || null
            })),
            experiences: formData.experiences.map(experience => ({
                ...experience,
                startDate: experience.startDate || null,
                endDate: experience.endDate || null
            }))
        };

        try {
            await axios.put(`https://localhost:7136/api/Company/AdminEmployeeDetailUpdate/${employeeId}`, preparedData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setErrors({});
            navigate('/company');
        } catch (error) {
            console.log(error.response);
            const errorMessages = error.response?.data.errors || {};
            setErrors(errorMessages);
        }
    };
    return (
        <div className="container mt-5">
            <h1>Update Employee Details (Admin)</h1>
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
                {/* Employee details form fields */}
                <div className="mb-3">
                    <label htmlFor="address" className="form-label">Address</label>
                    <input
                        type="text"
                        className="form-control"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                    />
                </div>

                {/* Birth Date field */}
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
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="remainingLeaveDays" className="form-label">Remaining Leave Days</label>
                    <input
                        type="number"
                        className="form-control"
                        name="remainingLeaveDays"
                        value={formData.remainingLeaveDays}
                        onChange={handleInputChange}
                        required
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
                        required
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
                        required
                    />
                </div>

                {/* Educations Section */}
                <h3>Educations</h3>
                {formData.educations.map((education, index) => (
                    <div key={index} className="mb-4 p-3 border rounded bg-light">
                        <div className="mb-2">
                            <label htmlFor={`school-${index}`} className="form-label">School</label>
                            <input
                                type="text"
                                className="form-control"
                                name="school"
                                value={education.school}
                                onChange={(e) => handleInputChange(e, index, 'education')}
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <label htmlFor={`degree-${index}`} className="form-label">Degree</label>
                            <input
                                type="text"
                                className="form-control"
                                name="degree"
                                value={education.degree}
                                onChange={(e) => handleInputChange(e, index, 'education')}
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <label htmlFor={`fieldOfStudy-${index}`} className="form-label">Field of Study</label>
                            <input
                                type="text"
                                className="form-control"
                                name="fieldOfStudy"
                                value={education.fieldOfStudy}
                                onChange={(e) => handleInputChange(e, index, 'education')}
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <label htmlFor={`startDate-${index}`} className="form-label">Start Date</label>
                            <input
                                type="date"
                                className="form-control"
                                name="startDate"
                                value={education.startDate}
                                onChange={(e) => handleInputChange(e, index, 'education')}
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <label htmlFor={`endDate-${index}`} className="form-label">End Date</label>
                            <input
                                type="date"
                                className="form-control"
                                name="endDate"
                                value={education.endDate}
                                onChange={(e) => handleInputChange(e, index, 'education')}
                                required
                            />
                        </div>
                        <button type="button" className="btn btn-danger" onClick={() => removeField(index, 'education')}>Remove Education</button>
                    </div>
                ))}
                <button type="button" className="btn btn-primary" onClick={() => addNewField('education')}>Add New Education</button>

                {/* Certifications Section */}
                <h3>Certifications</h3>
                {formData.certifications.map((certification, index) => (

                    <div key={index} className="mb-4 p-3 border rounded bg-light">
                        <div className="mb-2">
                            <label htmlFor={`certificationName-${index}`} className="form-label">Certification Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="certificationName"
                                value={certification.certificationName}
                                onChange={(e) => handleInputChange(e, index, 'certification')}
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <label htmlFor={`certificationProvider-${index}`} className="form-label">Certification Provider</label>
                            <input
                                type="text"
                                className="form-control"
                                name="certificationProvider"
                                value={certification.certificationProvider}
                                onChange={(e) => handleInputChange(e, index, 'certification')}
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <label htmlFor={`certificationDate-${index}`} className="form-label">Certification Date</label>
                            <input
                                type="date"
                                className="form-control"
                                name="certificationDate"
                                value={certification.certificationDate}
                                onChange={(e) => handleInputChange(e, index, 'certification')}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor={`qualificationId-${index}`} className="form-label">Qualification ID</label>
                            <input
                                type="text"
                                className="form-control"
                                name="qualificationId"
                                value={certification.qualificationId}
                                onChange={(e) => handleInputChange(e, index, 'certification')}

                            />
                        </div>
                        <button type="button" className="btn btn-danger" onClick={() => removeField(index, 'certification')}>Remove Certification</button>
                    </div>
                ))}
                <button type="button" className="btn btn-primary" onClick={() => addNewField('certification')}>Add New Certification</button>

                {/* Experiences Section */}
                <h3>Experiences</h3>
                {formData.experiences.map((experience, index) => (
                    <div key={index} className="mb-4 p-3 border rounded bg-light">
                        <div className="mb-2">
                            <label htmlFor={`companyName-${index}`} className="form-label">Company Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="companyName"
                                value={experience.companyName}
                                onChange={(e) => handleInputChange(e, index, 'experience')}
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <label htmlFor={`position-${index}`} className="form-label">Position</label>
                            <input
                                type="text"
                                className="form-control"
                                name="position"
                                value={experience.position}
                                onChange={(e) => handleInputChange(e, index, 'experience')}
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <label htmlFor={`description-${index}`} className="form-label">Description</label>
                            <textarea
                                className="form-control"
                                name="description"
                                value={experience.description}
                                onChange={(e) => handleInputChange(e, index, 'experience')}
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <label htmlFor={`startDateExp-${index}`} className="form-label">Start Date</label>
                            <input
                                type="date"
                                className="form-control"
                                name="startDate"
                                value={experience.startDate}
                                onChange={(e) => handleInputChange(e, index, 'experience')}
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <label htmlFor={`endDateExp-${index}`} className="form-label">End Date</label>
                            <input
                                type="date"
                                className="form-control"
                                name="endDate"
                                value={experience.endDate}
                                onChange={(e) => handleInputChange(e, index, 'experience')}
                                required
                            />
                        </div>
                        <button type="button" className="btn btn-danger" onClick={() => removeField(index, 'experience')}>Remove Experience</button>
                    </div>
                ))}

                <div className="d-flex flex-column flex-md-row  mb-3">
                    <button type="button" className="btn btn-primary me-md-2 mb-2 mb-md-0" onClick={() => addNewField('experience')}>Add New Experience</button>
                    <button type="submit" className="btn btn-success ">Update Details</button>
                </div>
            </form>
        </div>
    );
};

export default CompanyAdminUpdateDetails;