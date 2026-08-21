import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ChevronRight, Plus, Search, Filter, AlertTriangle, X, 
  ChevronLeft, Info, Trash2, Package, Check, HelpCircle, Monitor, CreditCard
} from 'lucide-react';
import DataTable from '../components/table/DataTable';

const Kiosks = () => {
  const { 
    kiosks, addKiosk, editKiosk, deleteKiosk, setKioskStatus, setKioskAvailability,
    branches, categories, products, combos
  } = useApp();

  const [viewState, setViewState] = useState('list'); // 'list', 'add', 'edit', 'details'
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({ status: '', availability: '', connection: '', location: '' });
  const [filterOpen, setFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmDeleteTarget, setConfirmDeleteTarget] = useState(null);
  const [unsavedModalOpen, setUnsavedModalOpen] = useState(false);
  const [pendingBackAction, setPendingBackAction] = useState(null);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [detailsKiosk, setDetailsKiosk] = useState(null);
  const [errors, setErrors] = useState({});

  // Form state
  const initialForm = {
    kioskId: '',
    name: '',
    location: '',
    categoriesAvailability: [],
    productsAvailability: [],
    combosAvailability: [],
    payments: [],
    status: 'Active',
    availability: 'Available'
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Helpers
  const getBranchName = (id) => branches.find(b => b.id === id)?.name || 'Unknown Location';
  const getCategoryName = (id) => categories.find(c => c.id === id)?.name || '—';
  const getProductName = (id) => products.find(p => p.id === id)?.name || '—';
  const getComboName = (id) => combos.find(c => c.id === id)?.name || '—';

  const formatRelativeTime = (isoString) => {
    if (!isoString) return '—';
    const date = new Date(isoString);
    const diffMs = new Date() - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hr ago`;
    return date.toLocaleDateString();
  };

  // State transitions
  const handleOpenAdd = () => {
    setErrors({});
    setFormData({
      ...initialForm,
      categoriesAvailability: categories.filter(c => c.status === 'Active').map(c => c.id),
      productsAvailability: products.filter(p => p.status === 'Active').map(p => p.id),
      combosAvailability: combos.filter(c => c.status === 'Active').map(c => c.id),
      payments: ['UPI']
    });
    setViewState('add');
  };

  const handleOpenEdit = (kiosk) => {
    setErrors({});
    setFormData({
      id: kiosk.id,
      kioskId: kiosk.kioskId,
      name: kiosk.name,
      location: kiosk.location,
      categoriesAvailability: kiosk.categoriesAvailability || [],
      productsAvailability: kiosk.productsAvailability || [],
      combosAvailability: kiosk.combosAvailability || [],
      payments: kiosk.payments || [],
      status: kiosk.status,
      availability: kiosk.availability
    });
    setViewState('edit');
  };

  const handleOpenDetails = (kiosk) => {
    setDetailsKiosk(kiosk);
    setViewState('details');
  };

  const hasUnsavedChanges = () => {
    if (viewState === 'add') {
      return formData.name !== '' || formData.kioskId !== '' || formData.location !== '';
    } else if (viewState === 'edit') {
      const original = kiosks.find(k => k.id === formData.id) || {};
      return (
        formData.name !== original.name ||
        formData.location !== original.location ||
        formData.status !== original.status ||
        formData.availability !== original.availability ||
        JSON.stringify(formData.payments) !== JSON.stringify(original.payments || []) ||
        JSON.stringify(formData.categoriesAvailability) !== JSON.stringify(original.categoriesAvailability || []) ||
        JSON.stringify(formData.productsAvailability) !== JSON.stringify(original.productsAvailability || []) ||
        JSON.stringify(formData.combosAvailability) !== JSON.stringify(original.combosAvailability || [])
      );
    }
    return false;
  };

  const handleBack = () => {
    if ((viewState === 'add' || viewState === 'edit') && hasUnsavedChanges()) {
      setPendingBackAction(() => () => setViewState('list'));
      setUnsavedModalOpen(true);
    } else {
      setViewState('list');
    }
  };

  // Toggle helpers
  const handleToggleCategory = (catId) => {
    setFormData(prev => ({
      ...prev,
      categoriesAvailability: prev.categoriesAvailability.includes(catId)
        ? prev.categoriesAvailability.filter(id => id !== catId)
        : [...prev.categoriesAvailability, catId]
    }));
  };

  const handleToggleProduct = (prodId) => {
    setFormData(prev => ({
      ...prev,
      productsAvailability: prev.productsAvailability.includes(prodId)
        ? prev.productsAvailability.filter(id => id !== prodId)
        : [...prev.productsAvailability, prodId]
    }));
  };

  const handleToggleCombo = (comboId) => {
    setFormData(prev => ({
      ...prev,
      combosAvailability: prev.combosAvailability.includes(comboId)
        ? prev.combosAvailability.filter(id => id !== comboId)
        : [...prev.combosAvailability, comboId]
    }));
  };

  const handleTogglePayment = (method) => {
    setFormData(prev => ({
      ...prev,
      payments: prev.payments.includes(method)
        ? prev.payments.filter(m => m !== method)
        : [...prev.payments, method]
    }));
  };

  // Save
  const handleSave = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Kiosk name is required.';
    if (!formData.kioskId.trim()) tempErrors.kioskId = 'Kiosk ID is required.';
    else {
      const isDup = kiosks.some(k => k.id !== formData.id && k.kioskId.toLowerCase().trim() === formData.kioskId.toLowerCase().trim());
      if (isDup) tempErrors.kioskId = 'Kiosk ID must be unique.';
    }
    if (!formData.location) tempErrors.location = 'Location selection is required.';
    if (formData.payments.length === 0) tempErrors.payments = 'Select at least one payment method.';

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    const payload = {
      kioskId: formData.kioskId.toUpperCase().trim(),
      name: formData.name,
      location: formData.location,
      categoriesAvailability: formData.categoriesAvailability,
      productsAvailability: formData.productsAvailability,
      combosAvailability: formData.combosAvailability,
      payments: formData.payments,
      status: formData.status,
      availability: formData.availability
    };

    if (viewState === 'add') {
      addKiosk(payload);
    } else {
      editKiosk(formData.id, payload);
    }
    setViewState('list');
  };

  // Delete
  const handleDeleteConfirm = () => {
    if (confirmDeleteTarget) {
      deleteKiosk(confirmDeleteTarget.id);
      setConfirmDeleteTarget(null);
    }
  };

  // Filter
  const filteredKiosks = kiosks.filter(k => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchName = k.name?.toLowerCase().includes(query);
      const matchId = k.kioskId?.toLowerCase().includes(query);
      const matchLoc = getBranchName(k.location).toLowerCase().includes(query);
      if (!matchName && !matchId && !matchLoc) return false;
    }
    if (activeFilters.status && k.status !== activeFilters.status) return false;
    if (activeFilters.availability && k.availability !== activeFilters.availability) return false;
    if (activeFilters.connection && k.connection !== activeFilters.connection) return false;
    if (activeFilters.location && k.location !== activeFilters.location) return false;
    return true;
  });

  // Table columns
  const columns = [
    { field: 'name', header: 'Kiosk Name', sortable: true },
    { field: 'kioskId', header: 'Kiosk ID', render: (val) => <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{val}</span> },
    { field: 'location', header: 'Location', render: (val) => <span>{getBranchName(val)}</span> },
    { 
      field: 'connection', 
      header: 'Connection', 
      render: (val) => (
        <span style={{ 
          fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px',
          backgroundColor: val === 'Online' ? '#dcfce7' : '#fee2e2',
          color: val === 'Online' ? '#15803d' : '#dc2626',
          display: 'inline-flex', alignItems: 'center', gap: '4px'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: val === 'Online' ? '#16a34a' : '#dc2626' }}></span>
          {val}
        </span>
      )
    },
    {
      field: 'availability',
      header: 'Availability',
      render: (val, row) => (
        <label className="switch-control" onClick={(e) => e.stopPropagation()}>
          <input type="checkbox" checked={val === 'Available'} onChange={() => setKioskAvailability(row.id, val === 'Available' ? 'Unavailable' : 'Available')} />
          <span className="switch-slider"></span>
        </label>
      )
    },
    {
      field: 'status',
      header: 'Status',
      render: (val, row) => (
        <select value={val} onChange={(e) => setKioskStatus(row.id, e.target.value)} className="form-control" style={{ height: '28px', fontSize: '11px', padding: '0 4px', width: '90px' }} onClick={(e) => e.stopPropagation()}>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Maintenance">Maintenance</option>
        </select>
      )
    },
    { field: 'lastActive', header: 'Last Active', render: (val) => <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>{formatRelativeTime(val)}</span> }
  ];

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="breadcrumb">
        <span>Kiosk Admin</span>
        <ChevronRight size={12} className="breadcrumb-separator" />
        <span className="breadcrumb-item active" onClick={handleBack} style={{ cursor: viewState !== 'list' ? 'pointer' : 'default' }}>Kiosk Management</span>
        {viewState !== 'list' && (<><ChevronRight size={12} className="breadcrumb-separator" /><span className="breadcrumb-item active">{viewState === 'add' ? 'Add Kiosk' : viewState === 'edit' ? 'Edit Kiosk' : 'Kiosk Details'}</span></>)}
      </div>

      {/* Page Header */}
      <div className="page-header" style={{ alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {viewState !== 'list' && (
            <button onClick={handleBack} className="btn btn-outline" style={{ height: '36px', width: '36px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }} title="Back">
              <ChevronLeft size={18} />
            </button>
          )}
          <div>
            <h1 className="page-title" style={{ margin: 0 }}>
              {viewState === 'add' ? 'Add Kiosk' : viewState === 'edit' ? 'Edit Kiosk' : viewState === 'details' ? 'Kiosk Details' : 'Kiosk Management'}
            </h1>
            <p className="page-desc" style={{ margin: 0 }}>
              {viewState === 'list' ? 'Monitor status and manage kiosk specific configuration mappings.' : 'Register and map menu availability rules for order kiosks.'}
            </p>
          </div>
        </div>
        <div>
          {viewState === 'list' && (
            <button className="btn btn-primary" onClick={handleOpenAdd}><Plus size={16} /><span>Register Kiosk</span></button>
          )}
          {(viewState === 'add' || viewState === 'edit') && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button type="button" className="btn btn-outline" onClick={() => setInfoModalOpen(true)} style={{ height: '36px', width: '36px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }} title="View Guide">
                <Info size={16} />
              </button>
              <button className="btn btn-primary" onClick={handleSave}>Save Kiosk</button>
            </div>
          )}
          {viewState === 'details' && (
            <button className="btn btn-primary" onClick={() => handleOpenEdit(detailsKiosk)}>Edit Configuration</button>
          )}
        </div>
      </div>

      {/* ─── LIST VIEW ─── */}
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ height: '36px', backgroundColor: '#e2e8f0', borderRadius: '6px', width: '100%', animation: 'pulse 1.5s infinite' }}></div>
          <div style={{ height: '44px', backgroundColor: '#ffffff', border: '1px solid var(--color-border)', borderRadius: '6px', width: '100%', animation: 'pulse 1.5s infinite' }}></div>
        </div>
      ) : viewState === 'list' ? (
        <>
          <div className="toolbar">
            <div className="toolbar-left">
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flex: 1, maxWidth: '320px' }}>
                <Search size={15} style={{ position: 'absolute', left: '12px', color: 'var(--color-text-muted)', opacity: 0.6 }} />
                <input type="text" placeholder="Search by name, ID or location..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="form-control" style={{ width: '100%', paddingLeft: '36px', height: '36px' }} />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '12px', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}><X size={14} /></button>
                )}
              </div>
              <button onClick={() => setFilterOpen(true)} className="btn btn-outline" style={{ height: '36px' }}><Filter size={15} /><span>Filter</span></button>
            </div>
          </div>
          <DataTable
            columns={columns}
            data={filteredKiosks}
            onEdit={handleOpenEdit}
            onDelete={(item) => setConfirmDeleteTarget(item)}
            onRowClick={handleOpenDetails}
            searchQuery={searchQuery}
            searchField="name"
            keyField="id"
          />
        </>

      /* ─── ADD / EDIT VIEW ─── */
      ) : viewState === 'add' || viewState === 'edit' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '16px', alignItems: 'start' }}>
          {/* Left Column: Basic Details & Payments */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 600, marginBottom: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>Kiosk Parameters</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '11px' }}>Kiosk Name <span className="required">*</span></label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g. Entrance Terminal 01" className={`form-control ${errors.name ? 'error' : ''}`} style={{ height: '32px', fontSize: '12px' }} />
                  {errors.name && <span className="form-error">{errors.name}</span>}
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '11px' }}>Kiosk Unique ID <span className="required">*</span></label>
                  <input type="text" value={formData.kioskId} onChange={(e) => setFormData(prev => ({ ...prev, kioskId: e.target.value }))} placeholder="e.g. KSK-001" disabled={viewState === 'edit'} className={`form-control ${errors.kioskId ? 'error' : ''}`} style={{ height: '32px', fontSize: '12px', fontFamily: 'monospace' }} />
                  {errors.kioskId && <span className="form-error">{errors.kioskId}</span>}
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '11px' }}>Branch / Location <span className="required">*</span></label>
                  <select value={formData.location} onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))} className={`form-control ${errors.location ? 'error' : ''}`} style={{ height: '32px', fontSize: '12px' }}>
                    <option value="">Select location...</option>
                    {branches.filter(b => b.status === 'Active').map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                  {errors.location && <span className="form-error">{errors.location}</span>}
                </div>

                {viewState === 'edit' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '4px' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '11px' }}>State</label>
                      <select value={formData.status} onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))} className="form-control" style={{ height: '32px', fontSize: '12px' }}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '11px' }}>Availability</label>
                      <select value={formData.availability} onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))} className="form-control" style={{ height: '32px', fontSize: '12px' }}>
                        <option value="Available">Available</option>
                        <option value="Unavailable">Unavailable</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Payments Settings */}
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 600, marginBottom: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Online Payments Mapping</span>
                {errors.payments && <span className="form-error" style={{ margin: 0, fontWeight: 400, fontSize: '11px' }}>{errors.payments}</span>}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['UPI', 'Card'].map(method => {
                  const isChecked = formData.payments.includes(method);
                  return (
                    <label key={method} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: '4px', cursor: 'pointer', backgroundColor: isChecked ? 'var(--color-primary-light)' : '#fff', transition: 'all 0.15s' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CreditCard size={14} style={{ color: isChecked ? 'var(--color-primary)' : 'var(--color-text-secondary)' }} />
                        <span style={{ fontSize: '12px', fontWeight: 600 }}>{method === 'UPI' ? 'UPI Pay (GPay / PhonePe)' : 'Debit / Credit Card Reader'}</span>
                      </div>
                      <input type="checkbox" checked={isChecked} onChange={() => handleTogglePayment(method)} style={{ accentColor: 'var(--color-primary)' }} />
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Menu Scope Mapping */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Category selection */}
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px', borderBottom: '1px solid var(--color-border)', paddingBottom: '4px' }}>Categories Scope Mapping</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '100px', overflowY: 'auto' }}>
                {categories.filter(c => c.status === 'Active').map(cat => {
                  const isSelected = formData.categoriesAvailability.includes(cat.id);
                  return (
                    <button type="button" key={cat.id} onClick={() => handleToggleCategory(cat.id)} style={{
                      fontSize: '11px', padding: '4px 10px', borderRadius: '4px', border: isSelected ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                      backgroundColor: isSelected ? 'var(--color-primary)' : '#fff', color: isSelected ? '#fff' : 'var(--color-text-main)',
                      cursor: 'pointer', fontWeight: 500, transition: 'all 0.15s'
                    }}>
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Product selection */}
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px', borderBottom: '1px solid var(--color-border)', paddingBottom: '4px' }}>Products Scope Mapping</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '200px', overflowY: 'auto', paddingRight: '4px' }}>
                {products.filter(p => p.status === 'Active').map(prod => {
                  const isSelected = formData.productsAvailability.includes(prod.id);
                  return (
                    <label key={prod.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', borderRadius: '4px', cursor: 'pointer', backgroundColor: isSelected ? 'var(--color-primary-light)' : '#fff', border: isSelected ? '1px solid var(--color-primary)' : '1px solid #f1f5f9', transition: 'all 0.15s' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '3px', overflow: 'hidden', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {prod.image ? <img src={prod.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Package size={12} style={{ color: 'var(--color-text-muted)' }} />}
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', fontWeight: 600 }}>{prod.name}</div>
                          <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>{getCategoryName(prod.categoryId)}</div>
                        </div>
                      </div>
                      <input type="checkbox" checked={isSelected} onChange={() => handleToggleProduct(prod.id)} style={{ accentColor: 'var(--color-primary)' }} />
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Combos selection */}
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px', borderBottom: '1px solid var(--color-border)', paddingBottom: '4px' }}>Combos Scope Mapping</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '150px', overflowY: 'auto', paddingRight: '4px' }}>
                {combos.filter(c => c.status === 'Active').map(combo => {
                  const isSelected = formData.combosAvailability.includes(combo.id);
                  return (
                    <label key={combo.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', borderRadius: '4px', cursor: 'pointer', backgroundColor: isSelected ? 'var(--color-primary-light)' : '#fff', border: isSelected ? '1px solid var(--color-primary)' : '1px solid #f1f5f9', transition: 'all 0.15s' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '3px', overflow: 'hidden', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {combo.image ? <img src={combo.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Package size={12} style={{ color: 'var(--color-text-muted)' }} />}
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', fontWeight: 600 }}>{combo.name}</div>
                          <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>₹{Number(combo.comboPrice || 0).toFixed(2)}</div>
                        </div>
                      </div>
                      <input type="checkbox" checked={isSelected} onChange={() => handleToggleCombo(combo.id)} style={{ accentColor: 'var(--color-primary)' }} />
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

      /* ─── DETAILS VIEW ─── */
      ) : viewState === 'details' && detailsKiosk ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Top Panel: Monitoring metrics */}
          <div className="card" style={{ padding: '16px' }}>
            <h3 style={{ fontSize: '12px', fontWeight: 600, marginBottom: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>Operation & Monitoring Metrics</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>Kiosk Name</div>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>{detailsKiosk.name}</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>Connection State</div>
                <span style={{ 
                  fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px',
                  backgroundColor: detailsKiosk.connection === 'Online' ? '#dcfce7' : '#fee2e2',
                  color: detailsKiosk.connection === 'Online' ? '#15803d' : '#dc2626'
                }}>{detailsKiosk.connection}</span>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>Kiosk Availability</div>
                <span style={{ 
                  fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px',
                  backgroundColor: detailsKiosk.availability === 'Available' ? '#dcfce7' : '#fee2e2',
                  color: detailsKiosk.availability === 'Available' ? '#15803d' : '#dc2626'
                }}>{detailsKiosk.availability}</span>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>Branch Code</div>
                <div style={{ fontSize: '12px', fontWeight: 500 }}>{getBranchName(detailsKiosk.location)}</div>
              </div>
            </div>
          </div>

          {/* Lower Panel: Configured Scope Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
            {/* Products scope details */}
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 600, marginBottom: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>
                Configured Products Scope ({detailsKiosk.productsAvailability?.length || 0})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '250px', overflowY: 'auto' }}>
                {(detailsKiosk.productsAvailability || []).map(id => {
                  const p = getProduct(id);
                  if (!p) return null;
                  return (
                    <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px', borderBottom: '1px solid #f1f5f9' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '3px', overflow: 'hidden', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {p.image ? <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Package size={10} />}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '11px', fontWeight: 600 }}>{p.name}</span>
                        <span style={{ fontSize: '9px', color: 'var(--color-text-secondary)' }}>{getCategoryName(p.categoryId)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Payment methods list */}
              <div className="card" style={{ padding: '16px' }}>
                <h3 style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px', borderBottom: '1px solid var(--color-border)', paddingBottom: '4px' }}>Online Payment Rules</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {(detailsKiosk.payments || []).map(method => (
                    <div key={method} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', padding: '4px 0' }}>
                      <Check size={12} style={{ color: 'var(--color-success)' }} />
                      <span>{method === 'UPI' ? 'UPI Pay (GPay / PhonePe / QR)' : 'Credit Card Swipe Terminal'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Combos Scope details */}
              <div className="card" style={{ padding: '16px' }}>
                <h3 style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px', borderBottom: '1px solid var(--color-border)', paddingBottom: '4px' }}>
                  Combos Scope ({detailsKiosk.combosAvailability?.length || 0})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '120px', overflowY: 'auto' }}>
                  {(detailsKiosk.combosAvailability || []).map(id => {
                    const c = combos.find(combo => combo.id === id);
                    if (!c) return null;
                    return (
                      <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 0', fontSize: '11px' }}>
                        <span style={{ fontWeight: 600 }}>• {c.name}</span>
                        <span style={{ color: 'var(--color-text-secondary)' }}>— ₹{Number(c.comboPrice || 0).toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* ─── FILTER DIALOG ─── */}
      {filterOpen && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ width: '400px' }}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Filter Kiosks</h3>
              <button className="modal-close" onClick={() => setFilterOpen(false)}><X size={16} /></button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '11px' }}>Administrative Status</label>
                <select value={activeFilters.status} onChange={(e) => setActiveFilters(prev => ({ ...prev, status: e.target.value }))} className="form-control" style={{ height: '32px', fontSize: '12px' }}>
                  <option value="">All States</option>
                  <option value="Active">Active Only</option>
                  <option value="Inactive">Inactive Only</option>
                  <option value="Maintenance">Maintenance Mode</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '11px' }}>Customer Availability</label>
                <select value={activeFilters.availability} onChange={(e) => setActiveFilters(prev => ({ ...prev, availability: e.target.value }))} className="form-control" style={{ height: '32px', fontSize: '12px' }}>
                  <option value="">All States</option>
                  <option value="Available">Available Only</option>
                  <option value="Unavailable">Unavailable Only</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '11px' }}>Connection State</label>
                <select value={activeFilters.connection} onChange={(e) => setActiveFilters(prev => ({ ...prev, connection: e.target.value }))} className="form-control" style={{ height: '32px', fontSize: '12px' }}>
                  <option value="">All Connections</option>
                  <option value="Online">Online Only</option>
                  <option value="Offline">Offline Only</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '11px' }}>Physical Store Location</label>
                <select value={activeFilters.location} onChange={(e) => setActiveFilters(prev => ({ ...prev, location: e.target.value }))} className="form-control" style={{ height: '32px', fontSize: '12px' }}>
                  <option value="">All Branches</option>
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => { setActiveFilters({ status: '', availability: '', connection: '', location: '' }); setFilterOpen(false); }}>Reset Filters</button>
              <button className="btn btn-primary" onClick={() => setFilterOpen(false)}>Apply</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── CONFIRM DELETE ─── */}
      {confirmDeleteTarget && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ width: '400px' }}>
            <div className="modal-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-error)' }}>
                <AlertTriangle size={20} />
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Unregister Kiosk?</h3>
              </div>
            </div>
            <div className="modal-body" style={{ fontSize: '13px', padding: '12px 16px' }}>
              Are you sure you want to permanently delete kiosk <strong>{confirmDeleteTarget.name}</strong> ({confirmDeleteTarget.kioskId})?
            </div>
            <div className="modal-footer" style={{ borderTop: 'none', paddingTop: 0 }}>
              <button className="btn btn-outline" onClick={() => setConfirmDeleteTarget(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ backgroundColor: 'var(--color-error)', borderColor: 'var(--color-error)' }} onClick={handleDeleteConfirm}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── UNSAVED CHANGES ─── */}
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

      {/* ─── INFO GUIDE ─── */}
      {infoModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ width: '450px' }}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Info size={16} style={{ color: 'var(--color-primary)' }} />
                <span>Kiosk Setup Guide</span>
              </h3>
              <button className="modal-close" onClick={() => setInfoModalOpen(false)}><X size={16} /></button>
            </div>
            <div className="modal-body" style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '10px', lineHeight: 1.5 }}>
              <p style={{ margin: 0 }}>Manage the physical Self-Order terminals. Configured kiosk options map scope boundaries without duplicating core catalog data.</p>
              <div style={{ backgroundColor: '#f8fafc', padding: '10px 14px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                <span style={{ fontWeight: 600, display: 'block', marginBottom: '4px', fontSize: '11px' }}>Configuration Instructions:</span>
                <ul style={{ margin: 0, paddingLeft: '14px', fontSize: '11px', color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li><strong>Kiosk ID:</strong> Unique identifier linking physical hardware registers.</li>
                  <li><strong>Scope Mapping:</strong> Toggle available categories, products, or combos. If globally disabled, they remain hidden on all kiosks.</li>
                  <li><strong>Connection State:</strong> Online status shows active heartbeat signals from the kiosks.</li>
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

export default Kiosks;
