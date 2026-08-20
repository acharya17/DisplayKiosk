import React, { useState } from 'react';
import { X } from 'lucide-react';

const FilterDialog = ({ isOpen, onClose, onApply, currentFilters, cities }) => {
  const [status, setStatus] = useState(currentFilters.status || '');
  const [city, setCity] = useState(currentFilters.city || '');

  if (!isOpen) return null;

  const handleApply = () => {
    onApply({ status, city });
    onClose();
  };

  const handleClear = () => {
    setStatus('');
    setCity('');
    onApply({ status: '', city: '' });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container size-sm" style={{ boxShadow: 'var(--shadow-lg)' }}>
        <div className="modal-header">
          <h3>Filter Branches</h3>
          <button onClick={onClose} className="modal-close-btn">
            <X size={16} />
          </button>
        </div>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)} 
              className="form-control"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">City</label>
            <select 
              value={city} 
              onChange={(e) => setCity(e.target.value)} 
              className="form-control"
            >
              <option value="">All Cities</option>
              {cities.map((c, idx) => (
                <option key={idx} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <button onClick={handleClear} className="btn btn-secondary">
            Clear Filters
          </button>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button onClick={handleApply} className="btn btn-primary">
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterDialog;
