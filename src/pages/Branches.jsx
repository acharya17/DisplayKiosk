import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronRight, Plus, Search, Filter, AlertTriangle, X, MapPin, RefreshCw, ServerCrash } from 'lucide-react';
import DataTable from '../components/table/DataTable';
import FilterDialog from '../components/filters/FilterDialog';

const Branches = () => {
  const { branches, addBranch, editBranch, setBranchStatus } = useApp();
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({ status: '', city: '' });
  const [filterOpen, setFilterOpen] = useState(false);

  // Prototype State Controls
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Modals state
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [confirmDeleteTarget, setConfirmDeleteTarget] = useState(null);

  // Form State
  const initialForm = {
    name: '',
    code: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    contactNumber: '',
    email: '',
    status: 'Active'
  };
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  // Simulate loading state on initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const triggerSimulatedLoad = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  // Helper for filter lists
  const cities = Array.from(new Set(branches.map(b => b.city))).filter(Boolean);

  const handleOpenAdd = () => {
    setEditTarget(null);
    setFormData(initialForm);
    setErrors({});
    setFormOpen(true);
  };

  const handleOpenEdit = (branch) => {
    setEditTarget(branch.id);
    setFormData({ ...branch });
    setErrors({});
    setFormOpen(true);
  };

  const validate = () => {
    const tempErrors = {};
    if (!formData.name?.trim()) tempErrors.name = 'Branch Name is required';
    if (!formData.code?.trim()) tempErrors.code = 'Branch Code is required';
    if (!formData.city?.trim()) tempErrors.city = 'City is required';
    
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
    if (!validate()) return;

    if (editTarget) {
      const success = editBranch(editTarget, formData);
      if (success) setFormOpen(false);
    } else {
      const success = addBranch(formData);
      if (success) setFormOpen(false);
    }
  };

  const handleDeactivate = () => {
    if (confirmDeleteTarget) {
      setBranchStatus(confirmDeleteTarget.id, 'Inactive');
      setConfirmDeleteTarget(null);
    }
  };

  const columns = [
    { field: 'name', header: 'Branch Name', sortable: true },
    { field: 'code', header: 'Branch Code', sortable: true },
    { field: 'city', header: 'City', sortable: true },
    { field: 'contactNumber', header: 'Contact' },
    { 
      field: 'status', 
      header: 'Status', 
      sortable: true,
      render: (val) => (
        <span className={`badge badge-${val.toLowerCase()}`}>
          {val}
        </span>
      )
    }
  ];

  // Active filters count
  const activeFiltersCount = Object.values(activeFilters).filter(Boolean).length;

  // Filter & Search validation for Empty list check
  const filteredBranchesCount = branches.filter(item => {
    if (searchQuery && item.name) {
      if (!item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    }
    for (const key in activeFilters) {
      if (activeFilters[key]) {
        if (String(item[key]).toLowerCase() !== String(activeFilters[key]).toLowerCase()) return false;
      }
    }
    return true;
  }).length;

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="breadcrumb">
        <span>Business</span>
        <ChevronRight size={12} className="breadcrumb-separator" />
        <span className="breadcrumb-item active">Branches</span>
      </div>

      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Branches</h1>
          <p>Configure, manage, and monitor all restaurant branch locations.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Dev control states buttons */}
          <div style={{ 
            display: 'flex', 
            gap: '4px', 
            padding: '4px', 
            backgroundColor: '#f1f5f9', 
            borderRadius: 'var(--radius-input)',
            marginRight: '8px'
          }}>
            <button 
              onClick={triggerSimulatedLoad}
              className="btn btn-outline" 
              style={{ height: '28px', padding: '0 8px', fontSize: '11px', border: 'none' }}
              title="Simulate Loading state"
            >
              <RefreshCw size={12} />
              <span>Simulate Load</span>
            </button>
            <button 
              onClick={() => setIsError(!isError)}
              className="btn btn-outline" 
              style={{ 
                height: '28px', 
                padding: '0 8px', 
                fontSize: '11px', 
                border: 'none', 
                backgroundColor: isError ? 'var(--color-error-light)' : 'transparent',
                color: isError ? 'var(--color-error)' : 'var(--color-text-secondary)'
              }}
              title="Toggle Simulated Error state"
            >
              <ServerCrash size={12} />
              <span>Simulate Error</span>
            </button>
          </div>

          {branches.length > 0 && !isError && (
            <button className="btn btn-primary" onClick={handleOpenAdd}>
              <Plus size={16} />
              <span>Add Branch</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary states wrapper */}
      {isError ? (
        /* Error State */
        <div className="card" style={{ 
          textAlign: 'center', 
          padding: '48px 24px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: '16px', 
          border: '1px solid var(--color-error)',
          maxWidth: '480px',
          margin: '24px auto'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-error-light)',
            color: 'var(--color-error)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <AlertTriangle size={24} />
          </div>
          <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Unable to load branch data</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', maxWidth: '320px' }}>
            Something went wrong while retrieving the franchise branch listings. Please refresh or try again.
          </p>
          <button className="btn btn-primary" onClick={() => { setIsError(false); triggerSimulatedLoad(); }}>
            Try Again
          </button>
        </div>
      ) : isLoading ? (
        /* Loading Skeletons state */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '8px 0' }}>
          <div style={{ height: '36px', backgroundColor: '#e2e8f0', borderRadius: '6px', width: '100%', animation: 'pulse 1.5s infinite' }}></div>
          <div style={{ height: '40px', backgroundColor: '#f1f5f9', borderRadius: '6px', width: '100%', animation: 'pulse 1.5s infinite', display: 'flex', alignItems: 'center', padding: '0 12px', gap: '20px' }}>
            <div style={{ width: '16px', height: '16px', backgroundColor: '#cbd5e1', borderRadius: '3px' }}></div>
            <div style={{ width: '120px', height: '14px', backgroundColor: '#cbd5e1', borderRadius: '3px' }}></div>
            <div style={{ width: '80px', height: '14px', backgroundColor: '#cbd5e1', borderRadius: '3px' }}></div>
            <div style={{ width: '80px', height: '14px', backgroundColor: '#cbd5e1', borderRadius: '3px' }}></div>
          </div>
          <div style={{ height: '44px', backgroundColor: '#ffffff', border: '1px solid var(--color-border)', borderRadius: '6px', width: '100%', animation: 'pulse 1.5s infinite', opacity: 0.8 }}></div>
          <div style={{ height: '44px', backgroundColor: '#ffffff', border: '1px solid var(--color-border)', borderRadius: '6px', width: '100%', animation: 'pulse 1.5s infinite', opacity: 0.6 }}></div>
        </div>
      ) : branches.length === 0 ? (
        /* Empty Database State */
        <div className="card" style={{ 
          textAlign: 'center', 
          padding: '56px 24px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: '16px',
          maxWidth: '480px',
          margin: '32px auto'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <MapPin size={24} />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 600 }}>No branches configured yet</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', maxWidth: '340px', lineHeight: '1.6' }}>
            There are currently no branches configured for your business. Set up your first location to initialize the TV display networks.
          </p>
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} />
            <span>Add Branch</span>
          </button>
        </div>
      ) : (
        /* Normal Table View */
        <>
          {/* Toolbar */}
          <div className="toolbar">
            <div className="toolbar-left">
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flex: 1, maxWidth: '320px' }}>
                <Search size={15} style={{ position: 'absolute', left: '12px', color: 'var(--color-text-muted)', opacity: 0.6 }} />
                <input 
                  type="text" 
                  placeholder="Search branches..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control"
                  style={{ width: '100%', paddingLeft: '36px', height: '36px' }}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    style={{ position: 'absolute', right: '12px', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              
              <button 
                onClick={() => setFilterOpen(true)}
                className="btn btn-outline" 
                style={{ height: '36px' }}
              >
                <Filter size={15} />
                <span>Filter{activeFiltersCount > 0 ? ` • ${activeFiltersCount}` : ''}</span>
              </button>
            </div>
          </div>

          {/* Reusable Data Table */}
          <DataTable 
            columns={columns}
            data={branches}
            onEdit={handleOpenEdit}
            onDelete={(branch) => setConfirmDeleteTarget(branch)}
            searchQuery={searchQuery}
            searchField="name"
            filters={activeFilters}
            keyField="id"
          />
        </>
      )}

      {/* Filter Popup dialog */}
      <FilterDialog 
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={setActiveFilters}
        currentFilters={activeFilters}
        cities={cities}
      />

      {/* Add / Edit Modal dialog */}
      {formOpen && (
        <div className="modal-overlay">
          <div className="modal-container size-md">
            <div className="modal-header">
              <h3>{editTarget ? 'Edit Branch' : 'Add Branch'}</h3>
              <button onClick={() => setFormOpen(false)} className="modal-close-btn">
                <X size={16} />
              </button>
            </div>
            <div className="modal-body" style={{ maxHeight: '70vh' }}>
              <div className="form-section">
                <div className="form-section-title">Branch Profile</div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Branch Name <span className="required">*</span></label>
                    <input 
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className={`form-control ${errors.name ? 'error' : ''}`}
                      placeholder="e.g. Spice Junction Udupi"
                    />
                    {errors.name && <span className="form-error">{errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Branch Code <span className="required">*</span></label>
                    <input 
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value})}
                      className={`form-control ${errors.code ? 'error' : ''}`}
                      placeholder="e.g. SJ-UD-01"
                      disabled={!!editTarget}
                    />
                    {errors.code && <span className="form-error">{errors.code}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Contact Number</label>
                    <input 
                      type="text"
                      value={formData.contactNumber}
                      onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                      className={`form-control ${errors.contactNumber ? 'error' : ''}`}
                      placeholder="Branch phone number"
                    />
                    {errors.contactNumber && <span className="form-error">{errors.contactNumber}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input 
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className={`form-control ${errors.email ? 'error' : ''}`}
                      placeholder="branch@spicejunction.com"
                    />
                    {errors.email && <span className="form-error">{errors.email}</span>}
                  </div>
                </div>
              </div>

              <div className="form-section">
                <div className="form-section-title">Location Details</div>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">Address</label>
                  <input 
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="form-control"
                    placeholder="Street Address"
                  />
                </div>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">City <span className="required">*</span></label>
                    <input 
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className={`form-control ${errors.city ? 'error' : ''}`}
                      placeholder="City"
                    />
                    {errors.city && <span className="form-error">{errors.city}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input 
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                      className="form-control"
                      placeholder="State / Region"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Country</label>
                    <input 
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({...formData, country: e.target.value})}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="form-control"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setFormOpen(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleSave} className="btn btn-primary">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation dialog for deactivation */}
      {confirmDeleteTarget && (
        <div className="modal-overlay">
          <div className="modal-container size-sm" style={{ padding: '4px' }}>
            <div className="modal-header" style={{ borderBottom: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-error)' }}>
                <AlertTriangle size={20} />
                <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Deactivate Branch</h3>
              </div>
              <button onClick={() => setConfirmDeleteTarget(null)} className="modal-close-btn">
                <X size={16} />
              </button>
            </div>
            <div className="modal-body" style={{ padding: '0 24px 16px 24px' }}>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                Are you sure you want to deactivate branch <strong>{confirmDeleteTarget.name}</strong> ({confirmDeleteTarget.code})? 
                Deactivated branches will remain in the system but won't be operational.
              </p>
            </div>
            <div className="modal-footer" style={{ borderTop: 'none', padding: '16px 24px' }}>
              <button onClick={() => setConfirmDeleteTarget(null)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleDeactivate} className="btn btn-danger">
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Branches;
