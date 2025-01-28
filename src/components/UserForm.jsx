import React, { useState, useEffect } from 'react';
import './UserForm.css';

const UserForm = ({ user, onSubmit, onCancel, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        department: user.department
      });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    } else if (formData.department.length < 2) {
      newErrors.department = 'Department must be at least 2 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };

    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) {
          newErrors[name] = `${name === 'firstName' ? 'First' : 'Last'} name is required`;
        } else if (value.length < 2) {
          newErrors[name] = `${name === 'firstName' ? 'First' : 'Last'} name must be at least 2 characters`;
        } else {
          delete newErrors[name];
        }
        break;
      case 'email':
        if (!value.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
          newErrors.email = 'Invalid email address';
        } else {
          delete newErrors.email;
        }
        break;
      case 'department':
        if (!value.trim()) {
          newErrors.department = 'Department is required';
        } else if (value.length < 2) {
          newErrors.department = 'Department must be at least 2 characters';
        } else {
          delete newErrors.department;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`user-form ${isSubmitting ? 'submitting' : ''}`}>
      <div className="form-fields">
        <div className="form-field">
          <label htmlFor="firstName" className="field-label">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
            className={`field-input ${errors.firstName ? 'error' : ''}`}
          />
          {errors.firstName && (
            <p className="error-message">{errors.firstName}</p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="lastName" className="field-label">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
            className={`field-input ${errors.lastName ? 'error' : ''}`}
          />
          {errors.lastName && (
            <p className="error-message">{errors.lastName}</p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="email" className="field-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
            className={`field-input ${errors.email ? 'error' : ''}`}
          />
          {errors.email && (
            <p className="error-message">{errors.email}</p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="department" className="field-label">
            Department
          </label>
          <input
            type="text"
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
            className={`field-input ${errors.department ? 'error' : ''}`}
          />
          {errors.department && (
            <p className="error-message">{errors.department}</p>
          )}
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="cancel-button"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="submit-button"
        >
          {isSubmitting ? (
            <>
              <div className="loading-spinner"></div>
              <span>{user ? 'Updating...' : 'Creating...'}</span>
            </>
          ) : (
            <span>{user ? 'Update' : 'Create'}</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default UserForm;