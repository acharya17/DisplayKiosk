import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ChevronRight, Plus, Search, Filter, AlertTriangle, X, 
  Edit2, Trash2, ChevronLeft, Info
} from 'lucide-react';
import DataTable from '../components/table/DataTable';

const KioskCustomisations = () => {
  const { 
    customisations,
    addCustomisation,
    editCustomisation,
    deleteCustomisation,
    setCustomisationStatus,
    products
  } = useApp();

  const [viewState, setViewState] = useState('list'); // 'list' | 'add' | 'edit'
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({ status: '' });
  const [filterOpen, setFilterOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [confirmDeleteTarget, setConfirmDeleteTarget] = useState(null);
  const [unsavedModalOpen, setUnsavedModalOpen] = useState(false);
  const [pendingBackAction, setPendingBackAction] = useState(null);
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  const initialForm = {
    name: '',
    description: '',
    type: 'Modifier',
    price: 0,
    status: 'Active'
  };

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenAdd = () => {
    setErrors({});
    setFormData(initialForm);
    setViewState('add');
  };

  const handleOpenEdit = (item) => {
    setErrors({});
    setFormData({ ...item });
    setViewState('edit');
  };

  const hasUnsavedChanges = () => {
    if (viewState === 'add') {
      return formData.name !== '' || formData.description !== '';
    } else if (viewState === 'edit') {
      const original = customisations.find(c => c.id === formData.id) || {};
      return (
        formData.name !== original.name ||
        formData.description !== original.description
      );
    }
    return false;
  };

  const handleBack = () => {
    if (hasUnsavedChanges()) {
      setPendingBackAction(() => () => setViewState('list'));
      setUnsavedModalOpen(true);
    } else {
      setViewState('list');
    }
  };

  const handleSave = () => {
    const tempErrors = {};
    if (!formData.name.trim()) {
      tempErrors.name = 'Customisation name is required.';
    } else {
      const isDuplicate = customisations.some(
        c => c.id !== formData.id && c.name.toLowerCase().trim() === formData.name.toLowerCase().trim()
      );
      if (isDuplicate) {
        tempErrors.name = 'A customisation with this name already exists.';
      }
    }

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    const payload = {
      name: formData.name,
      description: formData.description,
      type: formData.type || 'Modifier',
      price: Number(formData.price || 0),
      status: formData.status || 'Active'
    };

    if (viewState === 'add') {
      addCustomisation(payload);
    } else {
      editCustomisation(formData.id, payload);
    }
    setViewState('list');
  };

  const handleDeleteConfirm = () => {
    if (confirmDeleteTarget) {
      deleteCustomisation(confirmDeleteTarget.id);
      setConfirmDeleteTarget(null);
    }
  };

  const filteredCustomisations = customisations.filter(item => {
    if (searchQuery) {
      const matchName = item.name?.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchName) return false;
    }
    if (activeFilters.status && item.status !== activeFilters.status) return false;
    return true;
  });

  const columns = [
    { field: 'name', header: 'Customisation Name', sortable: true },
    { 
      field: 'type', 
      header: 'Type', 
      sortable: true,
      render: (val) => (
        <span style={{ 
          fontSize: '11px', 
          fontWeight: 600, 
          padding: '2px 8px', 
          borderRadius: '4px',
          backgroundColor: val === 'Add-on' ? '#dcfce7' : '#f1f5f9',
          color: val === 'Add-on' ? '#15803d' : '#475569'
        }}>
          {val || 'Modifier'}
        </span>
      )
    },
    { 
      field: 'price', 
      header: 'Additional Cost', 
      sortable: true,
      render: (val) => val === 0 || !val ? 'Free (₹0.00)' : `+₹${Number(val).toFixed(2)}`
    },
    { field: 'description', header: 'Description', sortable: false },
    { 
      field: 'applicableProducts', 
      header: 'Applicable Product Count', 
      render: (val, row) => {
        const count = products.filter(p => p.customisationId === row.id).length;
        return (
          <span style={{ fontWeight: 600 }}>
            {count} {count === 1 ? 'product' : 'products'}
          </span>
        );
      }
    },
    { 
      field: 'status', 
      header: 'Status',
      render: (val, row) => (
        <label className="switch-control" onClick={(e) => e.stopPropagation()}>
          <input 
            type="checkbox" 
            checked={val === 'Active'} 
            onChange={() => {
              setCustomisationStatus(row.id, val === 'Active' ? 'Inactive' : 'Active');
            }}
          />
          <span className="switch-slider"></span>
        </label>
      )
    }
  ];

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="breadcrumb">
        <span>Kiosk Admin</span>
        <ChevronRight size={12} className="breadcrumb-separator" />
        <span className="breadcrumb-item active" onClick={handleBack} style={{ cursor: viewState !== 'list' ? 'pointer' : 'default' }}>
          Customisations Master
        </span>
        {viewState === 'add' && (
          <>
            <ChevronRight size={12} className="breadcrumb-separator" />
            <span className="breadcrumb-item active">Add Customisation</span>
          </>
        )}
        {viewState === 'edit' && (
          <>
            <ChevronRight size={12} className="breadcrumb-separator" />
            <span className="breadcrumb-item active">Edit Customisation</span>
          </>
        )}
      </div>

      {/* Page Header */}
      <div className="page-header" style={{ alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {viewState !== 'list' && (
            <button 
              onClick={handleBack} 
              className="btn btn-outline" 
              style={{ height: '36px', width: '36px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}
              title="Back"
            >
              <ChevronLeft size={18} />
            </button>
          )}
          <div>
            <h1 className="page-title" style={{ margin: 0 }}>
              {viewState === 'add' ? 'Add Customisation' :
               viewState === 'edit' ? 'Edit Customisation' : 'Customisations Library'}
            </h1>
            <p className="page-desc" style={{ margin: 0 }}>
              {viewState === 'add' || viewState === 'edit' ? 'Configure a simple customisation attribute group.' :
               'Manage simple customisations library like sizes, sugar levels, spice levels.'}
            </p>
          </div>
        </div>

        <div>
          {viewState === 'list' && (
            <button className="btn btn-primary" onClick={handleOpenAdd}>
              <Plus size={16} />
              <span>Add Customisation</span>
            </button>
          )}
          {(viewState === 'add' || viewState === 'edit') && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button 
                type="button"
                className="btn btn-outline" 
                onClick={() => setInfoModalOpen(true)}
                style={{ height: '36px', width: '36px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}
                title="View Guide"
              >
                <Info size={16} />
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                Save Customisation
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ height: '36px', backgroundColor: '#e2e8f0', borderRadius: '6px', width: '100%', animation: 'pulse 1.5s infinite' }}></div>
          <div style={{ height: '44px', backgroundColor: '#ffffff', border: '1px solid var(--color-border)', borderRadius: '6px', width: '100%', animation: 'pulse 1.5s infinite' }}></div>
        </div>
      ) : viewState === 'list' ? (
        <>
          {/* Toolbar */}
          <div className="toolbar">
            <div className="toolbar-left">
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flex: 1, maxWidth: '320px' }}>
                <Search size={15} style={{ position: 'absolute', left: '12px', color: 'var(--color-text-muted)', opacity: 0.6 }} />
                <input 
                  type="text" 
                  placeholder="Search customisations by name..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control"
                  style={{ width: '100%', paddingLeft: '36px', height: '36px' }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '12px', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                    <X size={14} />
                  </button>
                )}
              </div>
              <button onClick={() => setFilterOpen(true)} className="btn btn-outline" style={{ height: '36px' }}>
                <Filter size={15} />
                <span>Filter</span>
              </button>
            </div>
          </div>

          <DataTable 
            columns={columns}
            data={filteredCustomisations}
            onEdit={handleOpenEdit}
            onDelete={(item) => setConfirmDeleteTarget(item)}
            searchQuery={searchQuery}
            searchField="name"
            keyField="id"
          />
        </>
      ) : (
        /* Form view: single card matching global admin style */
        <div>
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>Customisation Configurations</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Customisation Name <span className="required">*</span></label>
                  <input 
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Pizza Size, Sugar Level, Spice Level"
                    className={`form-control ${errors.name ? 'error' : ''}`}
                    style={{ height: '34px' }}
                  />
                  {errors.name && <span className="form-error">{errors.name}</span>}
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Additional Price (₹) <span className="required">*</span></label>
                  <input 
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="e.g. 20 (0 for free option)"
                    className={`form-control ${errors.price ? 'error' : ''}`}
                    style={{ height: '34px' }}
                  />
                  {errors.price && <span className="form-error">{errors.price}</span>}
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Description (Optional)</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="e.g. Select sweet level, size preferences, spice levels..."
                  className="form-control"
                  rows={4}
                  style={{ resize: 'none', fontSize: '12px', width: '100%', boxSizing: 'border-box' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FILTER DIALOG */}
      {filterOpen && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ width: '400px' }}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Filter Customisations</h3>
              <button className="modal-close" onClick={() => setFilterOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Status</label>
                <select 
                  value={activeFilters.status} 
                  onChange={(e) => setActiveFilters({ status: e.target.value })}
                  className="form-control"
                >
                  <option value="">All</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => { setActiveFilters({ status: '' }); setFilterOpen(false); }}>
                Reset Filters
              </button>
              <button className="btn btn-primary" onClick={() => setFilterOpen(false)}>
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE DIALOG */}
      {confirmDeleteTarget && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ width: '400px' }}>
            <div className="modal-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-error)' }}>
                <AlertTriangle size={20} />
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Delete Customisation?</h3>
              </div>
            </div>
            <div className="modal-body" style={{ fontSize: '13px', padding: '12px 16px' }}>
              Are you sure you want to permanently delete <strong>{confirmDeleteTarget.name}</strong>? This will clear assignments on all menu products.
            </div>
            <div className="modal-footer" style={{ borderTop: 'none', paddingTop: 0 }}>
              <button className="btn btn-outline" onClick={() => setConfirmDeleteTarget(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ backgroundColor: 'var(--color-error)', borderColor: 'var(--color-error)' }} onClick={handleDeleteConfirm}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* UNSAVED CHANGES DIALOG */}
      {unsavedModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ width: '400px' }}>
            <div className="modal-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)' }}>
                <AlertTriangle size={20} />
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Unsaved Changes</h3>
              </div>
            </div>
            <div className="modal-body" style={{ fontSize: '13px', padding: '12px 16px' }}>
              You have unsaved changes. Do you want to save them before leaving?
            </div>
            <div className="modal-footer" style={{ borderTop: 'none', paddingTop: 0 }}>
              <button className="btn btn-outline" onClick={() => { setUnsavedModalOpen(false); if (pendingBackAction) pendingBackAction(); }}>Leave Page</button>
              <button className="btn btn-primary" onClick={() => { setUnsavedModalOpen(false); handleSave(); }}>Save & Leave</button>
            </div>
          </div>
        </div>
      )}

      {/* USAGE GUIDE INFO DIALOG */}
      {infoModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ width: '450px' }}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Info size={18} style={{ color: 'var(--color-primary)' }} />
                <span>Customisations Guide</span>
              </h3>
              <button className="modal-close" onClick={() => setInfoModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>
            <div className="modal-body" style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '12px', lineHeight: 1.5 }}>
              <p style={{ margin: 0 }}>
                Configure high-level kiosk choice panels (e.g. <strong>Pizza Size</strong>, <strong>Sugar Level</strong>, <strong>Spice Level</strong>) to let customers customise their orders.
              </p>
              <div style={{ backgroundColor: '#f8fafc', padding: '10px 14px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                <span style={{ fontWeight: 600, display: 'block', marginBottom: '4px', fontSize: '11px' }}>Quick Instructions:</span>
                <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11px', color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li>Create a customisation with a clean name and helpful description.</li>
                  <li>Go to <strong>Products & Categories</strong> to link this customisation to specific menu products.</li>
                  <li>Control active states dynamically on the main Customisations master table.</li>
                </ul>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => setInfoModalOpen(false)}>Got It</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KioskCustomisations;
