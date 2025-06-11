import React, { useState, useEffect } from 'react';
import './UserPersonalInfo.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faEnvelope, faPhone, faMapMarkerAlt, faCalendarAlt, 
  faUsers, faBriefcase, faShieldAlt, faClock, faCheckCircle, 
  faExclamationCircle, faSpinner 
} from '@fortawesome/free-solid-svg-icons';

function UserPersonalInfo() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    role: '',
    status: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [errors, setErrors] = useState({});
  const [dropdownOptions, setDropdownOptions] = useState({
    genders: [],
    roles: [],
    statuses: []
  });

  useEffect(() => {
    const fetchUsersAndExtractOptions = async () => {
      try {
        const response = await fetch('http://localhost:3001/users');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const users = await response.json();
        console.log('Fetched users:', users);
        const uniqueGenders = [...new Set(users.map(user => user.gender).filter(Boolean))];
        const uniqueRoles = [...new Set(users.map(user => user.jobTitle).filter(Boolean))];
        const uniqueStatuses = [...new Set(users.map(user => user.status).filter(Boolean))];

        console.log('Extracted options:', { uniqueGenders, uniqueRoles, uniqueStatuses });

        setDropdownOptions({
          genders: uniqueGenders,
          roles: uniqueRoles,
          statuses: uniqueStatuses
        });
      } catch (error) {
        console.error('Error fetching users:', error);
        setDropdownOptions({
          genders: ['male', 'female', 'other'],
          roles: ['Software Developer', 'Marketing Manager', 'Financial Analyst', 'HR Specialist'],
          statuses: ['active', 'inactive', 'on-leave']
        });
      }
    };

    fetchUsersAndExtractOptions();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email format is invalid';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.role) newErrors.role = 'Role is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setMessage({ type: 'error', text: 'Please fix the errors below' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const submitData = {
        ...formData,
        jobTitle: formData.role,
        department: formData.role.toLowerCase().replace(/\s+/g, ''),
        registrationDate: new Date().toISOString().split('T')[0],
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        id: Date.now().toString()
      };

      const response = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        throw new Error('Failed to save user information');
      }

      setMessage({ type: 'success', text: 'User information saved successfully!' });
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        dateOfBirth: '',
        gender: '',
        role: '',
        status: 'active'
      });
      
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      dateOfBirth: '',
      gender: '',
      role: '',
      status: 'active'
    });
    setErrors({});
    setMessage({ type: '', text: '' });
  };

  return (
    <div className="container">
      <div className="form-wrapper">
        <div className="form-card">
          <div className="header">
            <div className="header-content">
              <FontAwesomeIcon icon={faUser} className="header-icon" />
              <h2 className="header-title">User Personal Information</h2>
            </div>
            <p className="header-subtitle">Please fill in all the required information below</p>
          </div>
          {message.text && (
            <div className={`message ${message.type === 'success' ? 'message-success' : 'message-error'}`}>
              {message.type === 'success' ? (
                <FontAwesomeIcon icon={faCheckCircle} className="message-icon" />
              ) : (
                <FontAwesomeIcon icon={faExclamationCircle} className="message-icon" />
              )}
              <span>{message.text}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="form">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  <FontAwesomeIcon icon={faUser} className="label-icon" />
                  <span>Full Name *</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`form-input ${errors.name ? 'form-input-error' : ''}`}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="error-text">{errors.name}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">
                  <FontAwesomeIcon icon={faEnvelope} className="label-icon" />
                  <span>Email Address *</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`form-input ${errors.email ? 'form-input-error' : ''}`}
                  placeholder="Enter your email address"
                />
                {errors.email && <p className="error-text">{errors.email}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">
                  <FontAwesomeIcon icon={faPhone} className="label-icon" />
                  <span>Phone Number *</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`form-input ${errors.phone ? 'form-input-error' : ''}`}
                  placeholder="Enter your phone number"
                />
                {errors.phone && <p className="error-text">{errors.phone}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">
                  <FontAwesomeIcon icon={faCalendarAlt} className="label-icon" />
                  <span>Date of Birth *</span>
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className={`form-input ${errors.dateOfBirth ? 'form-input-error' : ''}`}
                />
                {errors.dateOfBirth && <p className="error-text">{errors.dateOfBirth}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">
                  <FontAwesomeIcon icon={faUsers} className="label-icon" />
                  <span>Gender *</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={`form-input ${errors.gender ? 'form-input-error' : ''}`}
                >
                  <option value="">Select gender</option>
                  {dropdownOptions.genders.map((gender, index) => (
                    <option key={index} value={gender}>
                      {gender.charAt(0).toUpperCase() + gender.slice(1)}
                    </option>
                  ))}
                </select>
                {errors.gender && <p className="error-text">{errors.gender}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">
                  <FontAwesomeIcon icon={faBriefcase} className="label-icon" />
                  <span>Role *</span>
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className={`form-input ${errors.role ? 'form-input-error' : ''}`}
                >
                  <option value="">Select role</option>
                  {dropdownOptions.roles.map((role, index) => (
                    <option key={index} value={role}>{role}</option>
                  ))}
                </select>
                {errors.role && <p className="error-text">{errors.role}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">
                  <FontAwesomeIcon icon={faShieldAlt} className="label-icon" />
                  <span>Status</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="">Select status</option>
                  {dropdownOptions.statuses.map((status, index) => (
                    <option key={index} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group form-group-full">
                <label className="form-label">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="label-icon" />
                  <span>Address *</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                  className={`form-textarea ${errors.address ? 'form-input-error' : ''}`}
                  placeholder="Enter your complete address"
                />
                {errors.address && <p className="error-text">{errors.address}</p>}
              </div>
            </div>
            <div className="form-actions">
              <button
                type="button"
                onClick={handleReset}
                className="btn btn-secondary"
                disabled={loading}
              >
                Reset Form
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`btn btn-primary ${loading ? 'btn-loading' : ''}`}
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="btn-icon spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faCheckCircle} className="btn-icon" />
                    <span>Save Information</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserPersonalInfo;