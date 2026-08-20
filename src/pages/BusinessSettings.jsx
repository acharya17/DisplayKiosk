import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronRight, Edit2, Check, X, Shield, Globe, Clock, Mail, Phone, MapPin } from 'lucide-react';
import { timeZones } from '../data/mockData';

const BusinessSettings = () => {
  const { business, updateBusiness } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({ ...business });
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const tempErrors = {};
    if (!formData.name?.trim()) {
      tempErrors.name = 'Business Name is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      tempErrors.email = 'Invalid Email format';
    }
    const phoneRegex = /^\+?[0-9\s\-()]{7,15}$/;
    if (formData.contactNumber && !phoneRegex.test(formData.contactNumber)) {
      tempErrors.contactNumber = 'Invalid Contact Number format';
    }
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      const success = updateBusiness(formData);
      if (success) {
        setIsEditing(false);
      }
    }
  };

  const handleCancel = () => {
    setFormData({ ...business });
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span>Business</span>
        <ChevronRight size={12} className="breadcrumb-separator" />
        <span className="breadcrumb-item active">Business Settings</span>
      </div>

      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Business Settings</h1>
          <p>Configure details, contact details, and location configurations of your franchise.</p>
        </div>
        <div>
          {!isEditing ? (
            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
              <Edit2 size={16} />
              <span>Edit Details</span>
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-secondary" onClick={handleCancel}>
                <X size={16} />
                <span>Cancel</span>
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                <Check size={16} />
                <span>Save Changes</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Form Content */}
      <div className="card">
        <div className="form-section">
          <div className="form-section-title">Brand Information</div>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ position: 'relative' }}>
              {formData.logo ? (
                <img 
                  src={formData.logo} 
                  alt="Business Logo" 
                  style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--color-border)' }} 
                />
              ) : (
                <div style={{
                  width: '80px', height: '80px', borderRadius: '8px',
                  backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--color-text-muted)'
                }}>
                  No Logo
                </div>
              )}
            </div>
            
            <div style={{ flex: 1 }}>
              <div className="form-group" style={{ maxWidth: '400px' }}>
                <label className="form-label">Logo URL</label>
                <input 
                  type="text" 
                  value={formData.logo} 
                  onChange={(e) => handleInputChange('logo', e.target.value)}
                  className="form-control"
                  disabled={!isEditing}
                  placeholder="Enter logo image URL"
                />
                <span className="form-helper">Paste an Unsplash or web link of the restaurant logo icon.</span>
              </div>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Business Name <span className="required">*</span></label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`form-control ${errors.name ? 'error' : ''}`}
                disabled={!isEditing}
                placeholder="Enter Business Name"
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Business Status</label>
              <select 
                value={formData.status} 
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="form-control"
                disabled={!isEditing}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-title">Contact & Communication</div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Mail size={15} style={{ position: 'absolute', left: '12px', color: 'var(--color-text-muted)', opacity: 0.6 }} />
                <input 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`form-control ${errors.email ? 'error' : ''}`}
                  style={{ width: '100%', paddingLeft: '36px' }}
                  disabled={!isEditing}
                  placeholder="example@restaurant.com"
                />
              </div>
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Contact Number</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Phone size={15} style={{ position: 'absolute', left: '12px', color: 'var(--color-text-muted)', opacity: 0.6 }} />
                <input 
                  type="text" 
                  value={formData.contactNumber} 
                  onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                  className={`form-control ${errors.contactNumber ? 'error' : ''}`}
                  style={{ width: '100%', paddingLeft: '36px' }}
                  disabled={!isEditing}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              {errors.contactNumber && <span className="form-error">{errors.contactNumber}</span>}
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-title">Localization & Location Settings</div>
          
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label">Office Address</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <MapPin size={15} style={{ position: 'absolute', left: '12px', color: 'var(--color-text-muted)', opacity: 0.6 }} />
              <input 
                type="text" 
                value={formData.address} 
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="form-control"
                style={{ width: '100%', paddingLeft: '36px' }}
                disabled={!isEditing}
                placeholder="Street address details"
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">City</label>
              <input 
                type="text" 
                value={formData.city} 
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="form-control"
                disabled={!isEditing}
                placeholder="City"
              />
            </div>

            <div className="form-group">
              <label className="form-label">State</label>
              <input 
                type="text" 
                value={formData.state} 
                onChange={(e) => handleInputChange('state', e.target.value)}
                className="form-control"
                disabled={!isEditing}
                placeholder="State / Region"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Country</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Globe size={15} style={{ position: 'absolute', left: '12px', color: 'var(--color-text-muted)', opacity: 0.6 }} />
                <input 
                  type="text" 
                  value={formData.country} 
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="form-control"
                  style={{ width: '100%', paddingLeft: '36px' }}
                  disabled={!isEditing}
                  placeholder="Country"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Time Zone</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Clock size={15} style={{ position: 'absolute', left: '12px', color: 'var(--color-text-muted)', opacity: 0.6 }} />
                <select 
                  value={formData.timeZone} 
                  onChange={(e) => handleInputChange('timeZone', e.target.value)}
                  className="form-control"
                  style={{ width: '100%', paddingLeft: '36px' }}
                  disabled={!isEditing}
                >
                  {timeZones.map((tz, idx) => (
                    <option key={idx} value={tz}>{tz}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessSettings;
