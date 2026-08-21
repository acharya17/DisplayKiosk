import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ChevronRight, Plus, Minus, Search, Filter, AlertTriangle, X, 
  ChevronLeft, Info, Trash2, Package, ImageIcon
} from 'lucide-react';
import DataTable from '../components/table/DataTable';

const KioskCombos = () => {
  const { 
    combos, products, categories, customisations,
    addCombo, editCombo, deleteCombo, 
    setComboStatus, setComboAvailability
  } = useApp();

  const [viewState, setViewState] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({ status: '', availability: '' });
  const [filterOpen, setFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmDeleteTarget, setConfirmDeleteTarget] = useState(null);
  const [unsavedModalOpen, setUnsavedModalOpen] = useState(false);
  const [pendingBackAction, setPendingBackAction] = useState(null);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [detailsCombo, setDetailsCombo] = useState(null);

  // Picker modal states
  const [itemPickerOpen, setItemPickerOpen] = useState(false);
  const [itemSearchQuery, setItemSearchQuery] = useState('');

  const initialForm = {
    name: '',
    description: '',
    image: '',
    items: [],
    comboPrice: '',
    availability: 'Available'
  };

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Helpers
  const getProduct = (id) => products.find(p => p.id === id);
  const getCategory = (catId) => categories.find(c => c.id === catId);

  const getIndividualTotal = (items) => {
    return items.reduce((sum, item) => {
      const product = getProduct(item.productId);
      return sum + (product ? Number(product.displayPrice || product.price || 0) * item.quantity : 0);
    }, 0);
  };

  const getItemsSummary = (items) => {
    if (!items || items.length === 0) return 'No items';
    const first = getProduct(items[0]?.productId);
    const firstName = first ? first.name : 'Unknown';
    if (items.length === 1) return firstName;
    return `${firstName} +${items.length - 1} more`;
  };

  // View state handlers
  const handleOpenAdd = () => {
    setErrors({});
    setFormData(initialForm);
    setViewState('add');
  };

  const handleOpenEdit = (combo) => {
    setErrors({});
    setFormData({
      id: combo.id,
      name: combo.name,
      description: combo.description || '',
      image: combo.image || '',
      items: [...(combo.items || [])],
      comboPrice: combo.comboPrice,
      availability: combo.availability
    });
    setViewState('edit');
  };

  const handleOpenDetails = (combo) => {
    setDetailsCombo(combo);
    setViewState('details');
  };

  const hasUnsavedChanges = () => {
    if (viewState === 'add') {
      return formData.name !== '' || formData.description !== '' || (formData.items && formData.items.length > 0) || formData.comboPrice !== '';
    } else if (viewState === 'edit') {
      const original = combos.find(c => c.id === formData.id) || {};
      return (
        formData.name !== original.name ||
        formData.description !== (original.description || '') ||
        formData.comboPrice !== original.comboPrice ||
        formData.availability !== original.availability ||
        JSON.stringify(formData.items) !== JSON.stringify(original.items || [])
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

  // Add product to combo items
  const handleAddProduct = (productId) => {
    if (!productId) return;
    setFormData(prev => {
      const itemsList = prev.items || [];
      const existing = itemsList.find(i => i.productId === productId);
      if (existing) {
        return {
          ...prev,
          items: itemsList.map(i => i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i)
        };
      }
      return {
        ...prev,
        items: [...itemsList, { productId, quantity: 1 }]
      };
    });
  };

  const handleRemoveItem = (productId) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(i => i.productId !== productId)
    }));
  };

  const handleItemQtyIncrement = (productId) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(i => i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i)
    }));
  };

  const handleItemQtyDecrement = (productId) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(i => i.productId === productId && i.quantity > 1 ? { ...i, quantity: i.quantity - 1 } : i)
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setFormData(prev => ({ ...prev, image: reader.result }));
    reader.readAsDataURL(file);
  };

  // Save
  const handleSave = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Combo name is required.';
    else {
      const isDup = combos.some(c => c.id !== formData.id && c.name.toLowerCase().trim() === formData.name.toLowerCase().trim());
      if (isDup) tempErrors.name = 'A combo with this name already exists.';
    }
    if (formData.items.length === 0) tempErrors.items = 'At least one product must be added.';
    if (formData.comboPrice === '' || isNaN(formData.comboPrice) || Number(formData.comboPrice) < 0) {
      tempErrors.comboPrice = 'Valid combo price is required.';
    }
    if (Object.keys(tempErrors).length > 0) { setErrors(tempErrors); return; }

    const payload = {
      name: formData.name,
      description: formData.description,
      image: formData.image,
      items: formData.items,
      comboPrice: Number(formData.comboPrice),
      availability: formData.availability
    };

    if (viewState === 'add') {
      addCombo(payload);
    } else {
      editCombo(formData.id, payload);
    }
    setViewState('list');
  };

  const handleDeleteConfirm = () => {
    if (confirmDeleteTarget) {
      deleteCombo(confirmDeleteTarget.id);
      setConfirmDeleteTarget(null);
    }
  };

  // Filters
  const filteredCombos = combos.filter(item => {
    if (searchQuery) {
      const matchName = item.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchProduct = item.items?.some(i => {
        const p = getProduct(i.productId);
        return p?.name?.toLowerCase().includes(searchQuery.toLowerCase());
      });
      if (!matchName && !matchProduct) return false;
    }
    if (activeFilters.status && item.status !== activeFilters.status) return false;
    if (activeFilters.availability && item.availability !== activeFilters.availability) return false;
    return true;
  });

  // Columns
  const columns = [
    {
      field: 'image',
      header: '',
      render: (val) => (
        <div style={{ width: '36px', height: '36px', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {val ? (
            <img src={val} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <Package size={16} style={{ color: 'var(--color-text-muted)' }} />
          )}
        </div>
      )
    },
    { field: 'name', header: 'Combo Name', sortable: true },
    {
      field: 'items',
      header: 'Included Items',
      render: (val) => (
        <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
          {getItemsSummary(val)}
        </span>
      )
    },
    {
      field: 'comboPrice',
      header: 'Combo Price',
      sortable: true,
      render: (val) => <span style={{ fontWeight: 600 }}>₹{Number(val).toFixed(2)}</span>
    },
    {
      field: 'availability',
      header: 'Availability',
      render: (val, row) => (
        <span style={{
          fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px',
          backgroundColor: val === 'Available' ? '#dcfce7' : '#fee2e2',
          color: val === 'Available' ? '#15803d' : '#dc2626'
        }}>
          {val}
        </span>
      )
    },
    {
      field: 'status',
      header: 'Status',
      render: (val, row) => (
        <label className="switch-control" onClick={(e) => e.stopPropagation()}>
          <input type="checkbox" checked={val === 'Active'} onChange={() => setComboStatus(row.id, val === 'Active' ? 'Inactive' : 'Active')} />
          <span className="switch-slider"></span>
        </label>
      )
    }
  ];

  // ─── RENDER ─────────────────────────────────────────────
  return (
    <div>
      {/* Breadcrumbs */}
      <div className="breadcrumb">
        <span>Kiosk Admin</span>
        <ChevronRight size={12} className="breadcrumb-separator" />
        <span className="breadcrumb-item active" onClick={handleBack} style={{ cursor: viewState !== 'list' ? 'pointer' : 'default' }}>Combos</span>
        {viewState === 'add' && (<><ChevronRight size={12} className="breadcrumb-separator" /><span className="breadcrumb-item active">Add Combo</span></>)}
        {viewState === 'edit' && (<><ChevronRight size={12} className="breadcrumb-separator" /><span className="breadcrumb-item active">Edit Combo</span></>)}
        {viewState === 'details' && (<><ChevronRight size={12} className="breadcrumb-separator" /><span className="breadcrumb-item active">Combo Details</span></>)}
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
              {viewState === 'add' ? 'Add Combo' : viewState === 'edit' ? 'Edit Combo' : viewState === 'details' ? 'Combo Details' : 'Combos'}
            </h1>
            <p className="page-desc" style={{ margin: 0 }}>
              {viewState === 'add' || viewState === 'edit' ? 'Configure a combo with existing products.' :
               viewState === 'details' ? 'View detailed combo specifications.' :
               'Manage product combos and meal deals.'}
            </p>
          </div>
        </div>
        <div>
          {viewState === 'list' && (
            <button className="btn btn-primary" onClick={handleOpenAdd}><Plus size={16} /><span>Add Combo</span></button>
          )}
          {(viewState === 'add' || viewState === 'edit') && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button type="button" className="btn btn-outline" onClick={() => setInfoModalOpen(true)} style={{ height: '36px', width: '36px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }} title="View Guide">
                <Info size={16} />
              </button>
              <button className="btn btn-primary" onClick={handleSave}>Save Combo</button>
            </div>
          )}
          {viewState === 'details' && (
            <button className="btn btn-primary" onClick={() => handleOpenEdit(detailsCombo)}>Edit Combo</button>
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
                <input type="text" placeholder="Search combos by name or product..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="form-control" style={{ width: '100%', paddingLeft: '36px', height: '36px' }} />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '12px', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}><X size={14} /></button>
                )}
              </div>
              <button onClick={() => setFilterOpen(true)} className="btn btn-outline" style={{ height: '36px' }}><Filter size={15} /><span>Filter</span></button>
            </div>
          </div>
          <DataTable
            columns={columns}
            data={filteredCombos}
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
          {/* Left Column: Basic Info */}
          <div className="card" style={{ padding: '16px' }}>
            <h3 style={{ fontSize: '12px', fontWeight: 600, marginBottom: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>Basic Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '11px' }}>Combo Name <span className="required">*</span></label>
                <input type="text" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g. Biryani Feast" className={`form-control ${errors.name ? 'error' : ''}`} style={{ height: '32px', fontSize: '12px' }} />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '11px' }}>Combo Price (₹) <span className="required">*</span></label>
                <input type="number" value={formData.comboPrice} onChange={(e) => setFormData(prev => ({ ...prev, comboPrice: e.target.value }))} placeholder="e.g. 249" className={`form-control ${errors.comboPrice ? 'error' : ''}`} style={{ height: '32px', fontSize: '12px' }} />
                {errors.comboPrice && <span className="form-error">{errors.comboPrice}</span>}
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '11px' }}>Description (Optional)</label>
                <textarea value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} placeholder="e.g. Served with soda." className="form-control" rows={2} style={{ resize: 'none', fontSize: '11px', padding: '6px 8px', width: '100%', boxSizing: 'border-box' }} />
              </div>

              {/* Image Upload & Availability Row */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
                  <label className="form-label" style={{ fontSize: '11px' }}>Combo Image</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {formData.image ? (
                      <div style={{ position: 'relative', width: '56px', height: '56px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                        <img src={formData.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button onClick={() => setFormData(prev => ({ ...prev, image: '' }))} style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: '16px', height: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                          <X size={10} />
                        </button>
                      </div>
                    ) : (
                      <label style={{ width: '56px', height: '56px', borderRadius: '4px', border: '1.5px dashed var(--color-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backgroundColor: '#f8fafc', gap: '2px' }}>
                        <ImageIcon size={14} style={{ color: 'var(--color-text-muted)' }} />
                        <span style={{ fontSize: '8px', color: 'var(--color-text-muted)' }}>Upload</span>
                        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                      </label>
                    )}
                  </div>
                </div>

                {viewState === 'edit' && (
                  <div style={{ flex: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '10px' }}>Availability</div>
                      <span style={{ fontSize: '9px', color: 'var(--color-text-secondary)' }}>{formData.availability}</span>
                    </div>
                    <label className="switch-control" style={{ margin: 0 }}>
                      <input type="checkbox" checked={formData.availability === 'Available'} onChange={() => setFormData(prev => ({ ...prev, availability: prev.availability === 'Available' ? 'Unavailable' : 'Available' }))} />
                      <span className="switch-slider"></span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Combo Items Section */}
          <div className="card" style={{ padding: '16px' }}>
            <h3 style={{ fontSize: '12px', fontWeight: 600, marginBottom: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Combo Items</span>
              {errors.items && <span className="form-error" style={{ margin: 0, fontWeight: 400, fontSize: '11px' }}>{errors.items}</span>}
            </h3>

            {/* Add Item Trigger Button */}
            <div style={{ marginBottom: '12px' }}>
              <button type="button" className="btn btn-outline" onClick={() => setItemPickerOpen(true)} style={{ height: '32px', fontSize: '12px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Plus size={14} /> Add Item
              </button>
            </div>

            {/* Items Table */}
            {formData.items.length > 0 && (
              <div style={{ border: '1px solid var(--color-border)', borderRadius: '4px', overflow: 'hidden', maxHeight: '180px', overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', position: 'sticky', top: 0, zIndex: 1 }}>
                      <th style={{ padding: '6px 10px', textAlign: 'left', fontWeight: 600, fontSize: '10px', width: '40px' }}>Image</th>
                      <th style={{ padding: '6px 10px', textAlign: 'left', fontWeight: 600, fontSize: '10px' }}>Product</th>
                      <th style={{ padding: '6px 10px', textAlign: 'center', fontWeight: 600, fontSize: '10px', width: '80px' }}>Qty</th>
                      <th style={{ padding: '6px 10px', textAlign: 'right', fontWeight: 600, fontSize: '10px' }}>Price</th>
                      <th style={{ padding: '6px 10px', textAlign: 'right', fontWeight: 600, fontSize: '10px' }}>Subtotal</th>
                      <th style={{ padding: '6px 10px', textAlign: 'center', fontWeight: 600, fontSize: '10px', width: '40px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.items.map((item) => {
                      const prod = getProduct(item.productId);
                      return (
                        <tr key={item.productId} style={{ borderTop: '1px solid var(--color-border)' }}>
                          <td style={{ padding: '6px 10px' }}>
                            <div style={{ width: '24px', height: '24px', borderRadius: '3px', overflow: 'hidden', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {prod?.image ? (
                                <img src={prod.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <Package size={10} style={{ color: 'var(--color-text-muted)' }} />
                              )}
                            </div>
                          </td>
                          <td style={{ padding: '6px 10px', fontWeight: 500 }}>{prod?.name || 'Unknown'}</td>
                          <td style={{ padding: '6px 10px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                              <button type="button" onClick={() => handleItemQtyDecrement(item.productId)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', border: '1px solid var(--color-border)', borderRadius: '50%', background: '#fff', cursor: 'pointer', padding: 0 }}><Minus size={8} /></button>
                              <span style={{ fontSize: '11px', fontWeight: 600, minWidth: '14px', textAlign: 'center' }}>{item.quantity}</span>
                              <button type="button" onClick={() => handleItemQtyIncrement(item.productId)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', border: '1px solid var(--color-border)', borderRadius: '50%', background: '#fff', cursor: 'pointer', padding: 0 }}><Plus size={8} /></button>
                            </div>
                          </td>
                          <td style={{ padding: '6px 10px', textAlign: 'right' }}>₹{prod ? Number(prod.displayPrice || prod.price || 0).toFixed(2) : '0.00'}</td>
                          <td style={{ padding: '6px 10px', textAlign: 'right', fontWeight: 600 }}>₹{prod ? (Number(prod.displayPrice || prod.price || 0) * item.quantity).toFixed(2) : '0.00'}</td>
                          <td style={{ padding: '6px 10px', textAlign: 'center' }}>
                            <button onClick={() => handleRemoveItem(item.productId)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error)', padding: '2px' }} title="Remove">
                              <Trash2 size={12} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pricing Summary */}
            {formData.items.length > 0 && (
              <div style={{ marginTop: '12px', padding: '10px 12px', backgroundColor: '#f8fafc', borderRadius: '4px', border: '1px solid var(--color-border)', fontSize: '11px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Total Items Quantity</span>
                  <span style={{ fontWeight: 600 }}>{formData.items.reduce((sum, i) => sum + i.quantity, 0)} items</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Individual Total Cost</span>
                  <span style={{ fontWeight: 500 }}>₹{getIndividualTotal(formData.items).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Combo Custom Price</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>₹{formData.comboPrice ? Number(formData.comboPrice).toFixed(2) : '0.00'}</span>
                </div>
                {formData.comboPrice && Number(formData.comboPrice) < getIndividualTotal(formData.items) && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '4px', marginTop: '4px' }}>
                    <span style={{ color: '#15803d', fontWeight: 600 }}>Net Savings</span>
                    <span style={{ color: '#15803d', fontWeight: 600 }}>₹{(getIndividualTotal(formData.items) - Number(formData.comboPrice)).toFixed(2)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : viewState === 'details' && detailsCombo ? (
        <div>
          {/* Basic Info Card */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>Basic Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: detailsCombo.image ? '80px 1fr' : '1fr', gap: '16px', alignItems: 'start' }}>
              {detailsCombo.image && (
                <div style={{ width: '80px', height: '80px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                  <img src={detailsCombo.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>Combo Name</div>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{detailsCombo.name}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>Combo Price</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-primary)' }}>₹{detailsCombo.comboPrice.toFixed(2)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>Availability</div>
                    <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', backgroundColor: detailsCombo.availability === 'Available' ? '#dcfce7' : '#fee2e2', color: detailsCombo.availability === 'Available' ? '#15803d' : '#dc2626' }}>{detailsCombo.availability}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>Status</div>
                    <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', backgroundColor: detailsCombo.status === 'Active' ? '#dcfce7' : '#fee2e2', color: detailsCombo.status === 'Active' ? '#15803d' : '#dc2626' }}>{detailsCombo.status}</span>
                  </div>
                </div>
                {detailsCombo.description && (
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>Description</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{detailsCombo.description}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Included Products */}
          <div className="card" style={{ padding: '24px', marginTop: '16px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>Included Products</h3>
            <div style={{ border: '1px solid var(--color-border)', borderRadius: '6px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc' }}>
                    <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, fontSize: '11px', width: '50px' }}>Image</th>
                    <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, fontSize: '11px' }}>Product</th>
                    <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, fontSize: '11px' }}>Category</th>
                    <th style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 600, fontSize: '11px' }}>Qty</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600, fontSize: '11px' }}>Base Price</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600, fontSize: '11px' }}>Subtotal</th>
                    <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, fontSize: '11px' }}>Customisation</th>
                  </tr>
                </thead>
                <tbody>
                  {detailsCombo.items.map((item) => {
                    const prod = getProduct(item.productId);
                    const cat = prod ? getCategory(prod.categoryId) : null;
                    const cust = prod?.customisationId ? customisations.find(c => c.id === prod.customisationId) : null;
                    return (
                      <tr key={item.productId} style={{ borderTop: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '8px 12px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {prod?.image ? (
                              <img src={prod.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <Package size={14} style={{ color: 'var(--color-text-muted)' }} />
                            )}
                          </div>
                        </td>
                        <td style={{ padding: '8px 12px', fontWeight: 500 }}>{prod?.name || 'Unknown'}</td>
                        <td style={{ padding: '8px 12px', color: 'var(--color-text-secondary)' }}>{cat?.name || '—'}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'center' }}>×{item.quantity}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'right' }}>₹{prod ? prod.displayPrice.toFixed(2) : '0.00'}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600 }}>₹{prod ? (prod.displayPrice * item.quantity).toFixed(2) : '0.00'}</td>
                        <td style={{ padding: '8px 12px' }}>
                          {cust ? (
                            <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', backgroundColor: '#f1f5f9', color: '#475569' }}>{cust.name}</span>
                          ) : (
                            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>None</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pricing Summary */}
            <div style={{ marginTop: '16px', padding: '14px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Individual Total</span>
                <span style={{ fontWeight: 500 }}>₹{getIndividualTotal(detailsCombo.items).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Combo Price</span>
                <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>₹{detailsCombo.comboPrice.toFixed(2)}</span>
              </div>
              {detailsCombo.comboPrice < getIndividualTotal(detailsCombo.items) && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', borderTop: '1px solid var(--color-border)', paddingTop: '6px' }}>
                  <span style={{ color: '#15803d', fontWeight: 600 }}>Savings</span>
                  <span style={{ color: '#15803d', fontWeight: 600 }}>₹{(getIndividualTotal(detailsCombo.items) - detailsCombo.comboPrice).toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {/* ─── FILTER DIALOG ─── */}
      {filterOpen && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ width: '400px' }}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Filter Combos</h3>
              <button className="modal-close" onClick={() => setFilterOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Status</label>
                <select value={activeFilters.status} onChange={(e) => setActiveFilters(prev => ({ ...prev, status: e.target.value }))} className="form-control">
                  <option value="">All</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Availability</label>
                <select value={activeFilters.availability} onChange={(e) => setActiveFilters(prev => ({ ...prev, availability: e.target.value }))} className="form-control">
                  <option value="">All</option>
                  <option value="Available">Available</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => { setActiveFilters({ status: '', availability: '' }); setFilterOpen(false); }}>Reset Filters</button>
              <button className="btn btn-primary" onClick={() => setFilterOpen(false)}>Apply Filters</button>
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
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Delete Combo?</h3>
              </div>
            </div>
            <div className="modal-body" style={{ fontSize: '13px', padding: '12px 16px' }}>
              Are you sure you want to permanently delete <strong>{confirmDeleteTarget.name}</strong>?
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
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Info size={18} style={{ color: 'var(--color-primary)' }} />
                <span>Combo Guide</span>
              </h3>
              <button className="modal-close" onClick={() => setInfoModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
            </div>
            <div className="modal-body" style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '12px', lineHeight: 1.5 }}>
              <p style={{ margin: 0 }}>Create sellable product combinations by selecting <strong>existing products</strong> from the master catalogue.</p>
              <div style={{ backgroundColor: '#f8fafc', padding: '10px 14px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                <span style={{ fontWeight: 600, display: 'block', marginBottom: '4px', fontSize: '11px' }}>Quick Instructions:</span>
                <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11px', color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li>Give the combo a clear name and set a competitive combo price.</li>
                  <li>Select products from the dropdown and set quantities.</li>
                  <li>The system will show individual total vs combo price savings automatically.</li>
                  <li>If the same product is added again, quantity is incremented instead of duplicating.</li>
                </ul>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => setInfoModalOpen(false)}>Got It</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── ADD ITEM POPUP MODAL ─── */}
      {itemPickerOpen && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ width: '450px' }}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Select Products</h3>
              <button className="modal-close" onClick={() => { setItemPickerOpen(false); setItemSearchQuery(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', color: 'var(--color-text-muted)', opacity: 0.6 }} />
                <input type="text" placeholder="Search product name..." value={itemSearchQuery} onChange={(e) => setItemSearchQuery(e.target.value)} className="form-control" style={{ width: '100%', paddingLeft: '32px', height: '32px', fontSize: '12px' }} />
              </div>
              <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '6px' }}>
                {products.filter(p => p.status === 'Active' && p.name.toLowerCase().includes(itemSearchQuery.toLowerCase())).map(p => {
                  const alreadySelected = formData.items.some(i => i.productId === p.id);
                  const selectedQty = formData.items.find(i => i.productId === p.id)?.quantity || 0;
                  return (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px', borderBottom: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
                          {p.image ? <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Package size={14} style={{ margin: '9px', color: 'var(--color-text-muted)' }} />}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 600 }}>{p.name}</span>
                            {selectedQty > 0 && (
                              <span style={{ fontSize: '10px', fontWeight: 700, padding: '1px 6px', borderRadius: '8px', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                                {selectedQty} Selected
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>₹{Number(p.displayPrice || p.price || 0).toFixed(2)}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {selectedQty > 0 && (
                          <button type="button" onClick={() => handleItemQtyDecrement(p.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', border: '1px solid var(--color-border)', borderRadius: '50%', background: '#fff', cursor: 'pointer', padding: 0 }}><Minus size={10} /></button>
                        )}
                        <button type="button" className={`btn ${alreadySelected ? 'btn-outline' : 'btn-primary'}`} onClick={() => handleAddProduct(p.id)} style={{ height: '26px', fontSize: '11px', padding: '0 10px' }}>
                          {alreadySelected ? 'Add More' : 'Select'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="modal-footer" style={{ borderTop: '1px solid var(--color-border)', padding: '12px 16px', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-primary" onClick={() => { setItemPickerOpen(false); setItemSearchQuery(''); }}>Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KioskCombos;
