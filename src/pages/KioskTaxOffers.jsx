import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  ChevronRight, Plus, Search, Filter, AlertTriangle, X,
  ChevronLeft, Info, Percent, DollarSign, Calendar
} from 'lucide-react';
import DataTable from '../components/table/DataTable';

const KioskTaxOffers = () => {
  const {
    taxes, addTax, editTax, deleteTax, setTaxStatus,
    offers, addOffer, editOffer, deleteOffer, setOfferStatus,
    products, categories, combos
  } = useApp();

  // ─── Shared State ───
  const [activeTab, setActiveTab] = useState('taxes');
  const [viewState, setViewState] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmDeleteTarget, setConfirmDeleteTarget] = useState(null);
  const [unsavedModalOpen, setUnsavedModalOpen] = useState(false);
  const [pendingBackAction, setPendingBackAction] = useState(null);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [detailsItem, setDetailsItem] = useState(null);
  const [errors, setErrors] = useState({});

  // Tax filters
  const [taxFilters, setTaxFilters] = useState({ status: '' });
  // Offer filters
  const [offerFilters, setOfferFilters] = useState({ status: '', discountType: '', validity: '' });

  // ─── Tax Form ───
  const taxInitial = { name: '', rate: '', applicability: 'All Products', selectedCategories: [], selectedProducts: [], selectedCombos: [] };
  const [taxForm, setTaxForm] = useState(taxInitial);

  // ─── Offer Form ───
  const offerInitial = { name: '', discountType: 'Percentage', discountValue: '', applicability: 'All Products', selectedCategories: [], selectedProducts: [], selectedCombos: [], startDate: '', endDate: '' };
  const [offerForm, setOfferForm] = useState(offerInitial);

  useEffect(() => { const t = setTimeout(() => setIsLoading(false), 600); return () => clearTimeout(t); }, []);

  // ─── Helpers ───
  const getCatName = (id) => categories.find(c => c.id === id)?.name || 'Unknown';
  const getProdName = (id) => products.find(p => p.id === id)?.name || 'Unknown';
  const getComboName = (id) => combos.find(c => c.id === id)?.name || 'Unknown';

  const getApplicableSummary = (item) => {
    if (item.applicability === 'All Products') return 'All Products';
    if (item.applicability === 'Selected Categories') {
      const names = item.selectedCategories?.map(getCatName) || [];
      return names.length <= 2 ? names.join(', ') : `${names[0]} +${names.length - 1} more`;
    }
    if (item.applicability === 'Selected Products') {
      const names = item.selectedProducts?.map(getProdName) || [];
      return names.length <= 2 ? names.join(', ') : `${names[0]} +${names.length - 1} more`;
    }
    if (item.applicability === 'Selected Combos') {
      const names = item.selectedCombos?.map(getComboName) || [];
      return names.length <= 2 ? names.join(', ') : `${names[0]} +${names.length - 1} more`;
    }
    return '—';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getValidityStatus = (start, end) => {
    const now = new Date();
    const s = new Date(start);
    const e = new Date(end);
    if (now < s) return { label: 'Upcoming', color: '#0284c7', bg: '#e0f2fe' };
    if (now > e) return { label: 'Expired', color: '#dc2626', bg: '#fee2e2' };
    return { label: 'Active', color: '#15803d', bg: '#dcfce7' };
  };

  // ─── Tab switch resets ───
  const handleTabSwitch = (tab) => {
    if (viewState !== 'list') {
      if (hasUnsavedChanges()) {
        setPendingBackAction(() => () => { setActiveTab(tab); setViewState('list'); setSearchQuery(''); });
        setUnsavedModalOpen(true);
        return;
      }
    }
    setActiveTab(tab);
    setViewState('list');
    setSearchQuery('');
    setErrors({});
  };

  // ─── Navigation ───
  const handleBack = () => {
    if ((viewState === 'add' || viewState === 'edit') && hasUnsavedChanges()) {
      setPendingBackAction(() => () => setViewState('list'));
      setUnsavedModalOpen(true);
    } else {
      setViewState('list');
    }
  };

  // ─── Unsaved check ───
  const hasUnsavedChanges = () => {
    if (activeTab === 'taxes') {
      if (viewState === 'add') return taxForm.name !== '' || taxForm.rate !== '';
      if (viewState === 'edit') {
        const orig = taxes.find(t => t.id === taxForm.id) || {};
        return taxForm.name !== orig.name || taxForm.rate !== orig.rate || taxForm.applicability !== orig.applicability;
      }
    } else {
      if (viewState === 'add') return offerForm.name !== '' || offerForm.discountValue !== '';
      if (viewState === 'edit') {
        const orig = offers.find(o => o.id === offerForm.id) || {};
        return offerForm.name !== orig.name || offerForm.discountValue !== orig.discountValue || offerForm.discountType !== orig.discountType;
      }
    }
    return false;
  };

  // ═══════════════════════════════════════════
  // TAX METHODS
  // ═══════════════════════════════════════════
  const handleOpenAddTax = () => { setErrors({}); setTaxForm(taxInitial); setViewState('add'); };
  const handleOpenEditTax = (tax) => {
    setErrors({});
    setTaxForm({
      id: tax.id, name: tax.name, rate: tax.rate,
      applicability: tax.applicability,
      selectedCategories: tax.selectedCategories || [],
      selectedProducts: tax.selectedProducts || [],
      selectedCombos: tax.selectedCombos || []
    });
    setViewState('edit');
  };

  const handleSaveTax = () => {
    const e = {};
    if (!taxForm.name.trim()) e.name = 'Tax name is required.';
    if (taxForm.rate === '' || isNaN(taxForm.rate) || Number(taxForm.rate) <= 0) e.rate = 'Valid tax rate is required.';
    if (taxForm.applicability === 'Selected Categories' && taxForm.selectedCategories.length === 0) e.applicability = 'Select at least one category.';
    if (taxForm.applicability === 'Selected Products' && taxForm.selectedProducts.length === 0) e.applicability = 'Select at least one product.';
    if (taxForm.applicability === 'Selected Combos' && taxForm.selectedCombos.length === 0) e.applicability = 'Select at least one combo.';
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    const payload = { name: taxForm.name, rate: Number(taxForm.rate), applicability: taxForm.applicability, selectedCategories: taxForm.selectedCategories, selectedProducts: taxForm.selectedProducts, selectedCombos: taxForm.selectedCombos };
    viewState === 'add' ? addTax(payload) : editTax(taxForm.id, payload);
    setViewState('list');
  };

  const filteredTaxes = taxes.filter(t => {
    if (searchQuery && !t.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (taxFilters.status && t.status !== taxFilters.status) return false;
    return true;
  });

  // ═══════════════════════════════════════════
  // OFFER METHODS
  // ═══════════════════════════════════════════
  const handleOpenAddOffer = () => { setErrors({}); setOfferForm(offerInitial); setViewState('add'); };
  const handleOpenEditOffer = (offer) => {
    setErrors({});
    setOfferForm({
      id: offer.id, name: offer.name, discountType: offer.discountType,
      discountValue: offer.discountValue, applicability: offer.applicability,
      selectedCategories: offer.selectedCategories || [],
      selectedProducts: offer.selectedProducts || [],
      selectedCombos: offer.selectedCombos || [],
      startDate: offer.startDate || '', endDate: offer.endDate || ''
    });
    setViewState('edit');
  };

  const handleSaveOffer = () => {
    const e = {};
    if (!offerForm.name.trim()) e.name = 'Offer name is required.';
    if (offerForm.discountValue === '' || isNaN(offerForm.discountValue) || Number(offerForm.discountValue) <= 0) e.discountValue = 'Valid discount value is required.';
    if (offerForm.discountType === 'Percentage' && Number(offerForm.discountValue) > 100) e.discountValue = 'Percentage cannot exceed 100%.';
    if (offerForm.applicability === 'Selected Categories' && offerForm.selectedCategories.length === 0) e.applicability = 'Select at least one category.';
    if (offerForm.applicability === 'Selected Products' && offerForm.selectedProducts.length === 0) e.applicability = 'Select at least one product.';
    if (offerForm.applicability === 'Selected Combos' && offerForm.selectedCombos.length === 0) e.applicability = 'Select at least one combo.';
    if (offerForm.startDate && offerForm.endDate && new Date(offerForm.startDate) > new Date(offerForm.endDate)) e.endDate = 'End date must be after start date.';
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    const payload = { name: offerForm.name, discountType: offerForm.discountType, discountValue: Number(offerForm.discountValue), applicability: offerForm.applicability, selectedCategories: offerForm.selectedCategories, selectedProducts: offerForm.selectedProducts, selectedCombos: offerForm.selectedCombos, startDate: offerForm.startDate, endDate: offerForm.endDate };
    viewState === 'add' ? addOffer(payload) : editOffer(offerForm.id, payload);
    setViewState('list');
  };

  const filteredOffers = offers.filter(o => {
    if (searchQuery && !o.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (offerFilters.status && o.status !== offerFilters.status) return false;
    if (offerFilters.discountType && o.discountType !== offerFilters.discountType) return false;
    if (offerFilters.validity) {
      const vs = getValidityStatus(o.startDate, o.endDate);
      if (offerFilters.validity !== vs.label) return false;
    }
    return true;
  });

  // Delete handler
  const handleDeleteConfirm = () => {
    if (confirmDeleteTarget) {
      activeTab === 'taxes' ? deleteTax(confirmDeleteTarget.id) : deleteOffer(confirmDeleteTarget.id);
      setConfirmDeleteTarget(null);
    }
  };

  // ─── Columns ───
  const taxColumns = [
    { field: 'name', header: 'Tax Name', sortable: true },
    { field: 'rate', header: 'Tax Rate', sortable: true, render: (val) => <span style={{ fontWeight: 600 }}>{val}%</span> },
    { field: 'applicability', header: 'Applicable To', render: (val, row) => <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{getApplicableSummary(row)}</span> },
    {
      field: 'status', header: 'Status',
      render: (val, row) => (
        <label className="switch-control" onClick={e => e.stopPropagation()}>
          <input type="checkbox" checked={val === 'Active'} onChange={() => setTaxStatus(row.id, val === 'Active' ? 'Inactive' : 'Active')} />
          <span className="switch-slider"></span>
        </label>
      )
    }
  ];

  const offerColumns = [
    { field: 'name', header: 'Offer Name', sortable: true },
    { field: 'discountType', header: 'Discount Type', render: (val) => (
      <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', backgroundColor: val === 'Percentage' ? '#f0fdf4' : '#eff6ff', color: val === 'Percentage' ? '#15803d' : '#1d4ed8' }}>
        {val === 'Percentage' ? <><Percent size={10} style={{ marginRight: '4px', verticalAlign: 'middle' }} />{val}</> : <><DollarSign size={10} style={{ marginRight: '4px', verticalAlign: 'middle' }} />{val}</>}
      </span>
    )},
    { field: 'discountValue', header: 'Value', sortable: true, render: (val, row) => <span style={{ fontWeight: 600 }}>{row.discountType === 'Percentage' ? `${val}%` : `₹${val}`}</span> },
    { field: 'applicability', header: 'Applicable To', render: (val, row) => <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{getApplicableSummary(row)}</span> },
    { field: 'startDate', header: 'Validity', render: (val, row) => {
      const vs = getValidityStatus(row.startDate, row.endDate);
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>{formatDate(row.startDate)} – {formatDate(row.endDate)}</span>
          <span style={{ fontSize: '10px', fontWeight: 600, padding: '1px 6px', borderRadius: '3px', backgroundColor: vs.bg, color: vs.color, width: 'fit-content' }}>{vs.label}</span>
        </div>
      );
    }},
    {
      field: 'status', header: 'Status',
      render: (val, row) => (
        <label className="switch-control" onClick={e => e.stopPropagation()}>
          <input type="checkbox" checked={val === 'Active'} onChange={() => setOfferStatus(row.id, val === 'Active' ? 'Inactive' : 'Active')} />
          <span className="switch-slider"></span>
        </label>
      )
    }
  ];

  // ─── Multi-select handler ───
  const toggleMultiSelect = (formSetter, field, value) => {
    formSetter(prev => ({
      ...prev,
      [field]: prev[field].includes(value) ? prev[field].filter(v => v !== value) : [...prev[field], value]
    }));
  };

  // ─── Applicability Selector (shared) ───
  const renderApplicabilitySelector = (form, setForm, isOffer = false) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Applicability <span className="required">*</span></label>
        <select value={form.applicability} onChange={(e) => setForm(prev => ({ ...prev, applicability: e.target.value, selectedCategories: [], selectedProducts: [], selectedCombos: [] }))} className="form-control" style={{ height: '34px' }}>
          <option value="All Products">All Products</option>
          <option value="Selected Categories">Selected Categories</option>
          <option value="Selected Products">Selected Products</option>
          <option value="Selected Combos">Selected Combos</option>
        </select>
        {errors.applicability && <span className="form-error">{errors.applicability}</span>}
      </div>

      {form.applicability === 'Selected Categories' && (
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Select Categories</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', padding: '8px', border: '1px solid var(--color-border)', borderRadius: '4px', minHeight: '36px', backgroundColor: '#f8fafc' }}>
            {categories.filter(c => c.status === 'Active').map(cat => (
              <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer', backgroundColor: form.selectedCategories.includes(cat.id) ? '#ea580c' : '#e2e8f0', color: form.selectedCategories.includes(cat.id) ? '#fff' : '#334155', fontWeight: 500, transition: 'all 0.15s' }}>
                <input type="checkbox" checked={form.selectedCategories.includes(cat.id)} onChange={() => toggleMultiSelect(setForm, 'selectedCategories', cat.id)} style={{ display: 'none' }} />
                {cat.name}
              </label>
            ))}
          </div>
        </div>
      )}

      {form.applicability === 'Selected Products' && (
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Select Products</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', padding: '8px', border: '1px solid var(--color-border)', borderRadius: '4px', minHeight: '36px', backgroundColor: '#f8fafc' }}>
            {products.filter(p => p.status === 'Active').map(prod => (
              <label key={prod.id} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer', backgroundColor: form.selectedProducts.includes(prod.id) ? '#ea580c' : '#e2e8f0', color: form.selectedProducts.includes(prod.id) ? '#fff' : '#334155', fontWeight: 500, transition: 'all 0.15s' }}>
                <input type="checkbox" checked={form.selectedProducts.includes(prod.id)} onChange={() => toggleMultiSelect(setForm, 'selectedProducts', prod.id)} style={{ display: 'none' }} />
                {prod.name}
              </label>
            ))}
          </div>
        </div>
      )}

      {form.applicability === 'Selected Combos' && (
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Select Combos</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', padding: '8px', border: '1px solid var(--color-border)', borderRadius: '4px', minHeight: '36px', backgroundColor: '#f8fafc' }}>
            {combos.filter(c => c.status === 'Active').map(combo => (
              <label key={combo.id} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer', backgroundColor: form.selectedCombos.includes(combo.id) ? '#ea580c' : '#e2e8f0', color: form.selectedCombos.includes(combo.id) ? '#fff' : '#334155', fontWeight: 500, transition: 'all 0.15s' }}>
                <input type="checkbox" checked={form.selectedCombos.includes(combo.id)} onChange={() => toggleMultiSelect(setForm, 'selectedCombos', combo.id)} style={{ display: 'none' }} />
                {combo.name}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // ═════════════════════════════════════════════════════
  // RENDER
  // ═════════════════════════════════════════════════════
  const isTax = activeTab === 'taxes';
  const pageLabel = viewState === 'add' ? (isTax ? 'Add Tax' : 'Add Offer') : viewState === 'edit' ? (isTax ? 'Edit Tax' : 'Edit Offer') : viewState === 'details' ? (isTax ? 'Tax Details' : 'Offer Details') : 'Taxes & Offers';

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="breadcrumb">
        <span>Kiosk Admin</span>
        <ChevronRight size={12} className="breadcrumb-separator" />
        <span className="breadcrumb-item active" onClick={handleBack} style={{ cursor: viewState !== 'list' ? 'pointer' : 'default' }}>Taxes & Offers</span>
        {viewState !== 'list' && (<><ChevronRight size={12} className="breadcrumb-separator" /><span className="breadcrumb-item active">{pageLabel}</span></>)}
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
            <h1 className="page-title" style={{ margin: 0 }}>{pageLabel}</h1>
            <p className="page-desc" style={{ margin: 0 }}>
              {viewState === 'list' ? 'Manage tax rules and promotional offers.' : isTax ? 'Configure tax rate and applicability.' : 'Configure discount and applicability.'}
            </p>
          </div>
        </div>
        <div>
          {viewState === 'list' && (
            <button className="btn btn-primary" onClick={() => isTax ? handleOpenAddTax() : handleOpenAddOffer()}>
              <Plus size={16} /><span>{isTax ? 'Add Tax' : 'Add Offer'}</span>
            </button>
          )}
          {(viewState === 'add' || viewState === 'edit') && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button type="button" className="btn btn-outline" onClick={() => setInfoModalOpen(true)} style={{ height: '36px', width: '36px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }} title="View Guide"><Info size={16} /></button>
              <button className="btn btn-primary" onClick={() => isTax ? handleSaveTax() : handleSaveOffer()}>{isTax ? 'Save Tax' : 'Save Offer'}</button>
            </div>
          )}
          {viewState === 'details' && (
            <button className="btn btn-primary" onClick={() => isTax ? handleOpenEditTax(detailsItem) : handleOpenEditOffer(detailsItem)}>
              {isTax ? 'Edit Tax' : 'Edit Offer'}
            </button>
          )}
        </div>
      </div>

      {/* ─── TAB BAR (list only) ─── */}
      {viewState === 'list' && (
        <div style={{ display: 'flex', gap: '0', marginBottom: '16px', borderBottom: '2px solid var(--color-border)' }}>
          {[{ key: 'taxes', label: 'Taxes', count: taxes.length }, { key: 'offers', label: 'Offers', count: offers.length }].map(tab => (
            <button key={tab.key} onClick={() => handleTabSwitch(tab.key)} style={{
              padding: '8px 20px', fontSize: '13px', fontWeight: 600, border: 'none', borderBottom: activeTab === tab.key ? '2px solid var(--color-primary)' : '2px solid transparent',
              background: 'none', cursor: 'pointer', color: activeTab === tab.key ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              marginBottom: '-2px', transition: 'all 0.2s'
            }}>
              {tab.label} <span style={{ fontSize: '11px', fontWeight: 500, opacity: 0.7 }}>({tab.count})</span>
            </button>
          ))}
        </div>
      )}

      {/* ═══ LIST VIEW ═══ */}
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ height: '36px', backgroundColor: '#e2e8f0', borderRadius: '6px', width: '100%', animation: 'pulse 1.5s infinite' }}></div>
        </div>
      ) : viewState === 'list' ? (
        <>
          <div className="toolbar">
            <div className="toolbar-left">
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flex: 1, maxWidth: '320px' }}>
                <Search size={15} style={{ position: 'absolute', left: '12px', color: 'var(--color-text-muted)', opacity: 0.6 }} />
                <input type="text" placeholder={isTax ? 'Search taxes...' : 'Search offers...'} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="form-control" style={{ width: '100%', paddingLeft: '36px', height: '36px' }} />
                {searchQuery && <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '12px', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}><X size={14} /></button>}
              </div>
              <button onClick={() => setFilterOpen(true)} className="btn btn-outline" style={{ height: '36px' }}><Filter size={15} /><span>Filter</span></button>
            </div>
          </div>
          <DataTable
            columns={isTax ? taxColumns : offerColumns}
            data={isTax ? filteredTaxes : filteredOffers}
            onEdit={(item) => isTax ? handleOpenEditTax(item) : handleOpenEditOffer(item)}
            onDelete={(item) => setConfirmDeleteTarget(item)}
            onRowClick={(item) => { setDetailsItem(item); setViewState('details'); }}
            searchQuery={searchQuery}
            searchField="name"
            keyField="id"
          />
        </>

      /* ═══ ADD / EDIT TAX ═══ */
      ) : (viewState === 'add' || viewState === 'edit') && isTax ? (
        <div>
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>Tax Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Tax Name <span className="required">*</span></label>
                  <input type="text" value={taxForm.name} onChange={(e) => setTaxForm(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g. GST, Service Tax" className={`form-control ${errors.name ? 'error' : ''}`} style={{ height: '34px' }} />
                  {errors.name && <span className="form-error">{errors.name}</span>}
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Tax Rate (%) <span className="required">*</span></label>
                  <input type="number" value={taxForm.rate} onChange={(e) => setTaxForm(prev => ({ ...prev, rate: e.target.value }))} placeholder="e.g. 5" className={`form-control ${errors.rate ? 'error' : ''}`} style={{ height: '34px' }} min="0" step="0.1" />
                  {errors.rate && <span className="form-error">{errors.rate}</span>}
                </div>
              </div>
              {renderApplicabilitySelector(taxForm, setTaxForm)}
            </div>
          </div>
        </div>

      /* ═══ ADD / EDIT OFFER ═══ */
      ) : (viewState === 'add' || viewState === 'edit') && !isTax ? (
        <div>
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>Offer Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Offer Name <span className="required">*</span></label>
                <input type="text" value={offerForm.name} onChange={(e) => setOfferForm(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g. Lunch Special, Weekend Combo Deal" className={`form-control ${errors.name ? 'error' : ''}`} style={{ height: '34px' }} />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Discount Type <span className="required">*</span></label>
                  <select value={offerForm.discountType} onChange={(e) => setOfferForm(prev => ({ ...prev, discountType: e.target.value }))} className="form-control" style={{ height: '34px' }}>
                    <option value="Percentage">Percentage (%)</option>
                    <option value="Fixed Amount">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Discount Value <span className="required">*</span></label>
                  <input type="number" value={offerForm.discountValue} onChange={(e) => setOfferForm(prev => ({ ...prev, discountValue: e.target.value }))} placeholder={offerForm.discountType === 'Percentage' ? 'e.g. 10' : 'e.g. 50'} className={`form-control ${errors.discountValue ? 'error' : ''}`} style={{ height: '34px' }} min="0" />
                  {errors.discountValue && <span className="form-error">{errors.discountValue}</span>}
                </div>
              </div>

              {renderApplicabilitySelector(offerForm, setOfferForm, true)}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Start Date</label>
                  <input type="date" value={offerForm.startDate} onChange={(e) => setOfferForm(prev => ({ ...prev, startDate: e.target.value }))} className="form-control" style={{ height: '34px' }} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">End Date</label>
                  <input type="date" value={offerForm.endDate} onChange={(e) => setOfferForm(prev => ({ ...prev, endDate: e.target.value }))} className={`form-control ${errors.endDate ? 'error' : ''}`} style={{ height: '34px' }} />
                  {errors.endDate && <span className="form-error">{errors.endDate}</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

      /* ═══ DETAILS VIEW ═══ */
      ) : viewState === 'details' && detailsItem ? (
        <div>
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>{isTax ? 'Tax Configuration' : 'Offer Configuration'}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>{isTax ? 'Tax Name' : 'Offer Name'}</div>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>{detailsItem.name}</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>{isTax ? 'Tax Rate' : 'Discount'}</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-primary)' }}>
                  {isTax ? `${detailsItem.rate}%` : detailsItem.discountType === 'Percentage' ? `${detailsItem.discountValue}%` : `₹${detailsItem.discountValue}`}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>Status</div>
                <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', backgroundColor: detailsItem.status === 'Active' ? '#dcfce7' : '#fee2e2', color: detailsItem.status === 'Active' ? '#15803d' : '#dc2626' }}>{detailsItem.status}</span>
              </div>
            </div>

            {/* Validity (Offers only) */}
            {!isTax && detailsItem.startDate && (
              <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>Start Date</div>
                  <div style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12} /> {formatDate(detailsItem.startDate)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>End Date</div>
                  <div style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12} /> {formatDate(detailsItem.endDate)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>Validity</div>
                  {(() => { const vs = getValidityStatus(detailsItem.startDate, detailsItem.endDate); return <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', backgroundColor: vs.bg, color: vs.color }}>{vs.label}</span>; })()}
                </div>
              </div>
            )}
          </div>

          {/* Applicability Card */}
          <div className="card" style={{ padding: '24px', marginTop: '16px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>Applicability</h3>
            <div style={{ fontSize: '12px' }}>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ fontWeight: 600 }}>Scope:</span> <span style={{ color: 'var(--color-text-secondary)' }}>{detailsItem.applicability}</span>
              </div>
              {detailsItem.applicability === 'Selected Categories' && detailsItem.selectedCategories?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {detailsItem.selectedCategories.map(id => (
                    <span key={id} style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', backgroundColor: '#f1f5f9', fontWeight: 500 }}>{getCatName(id)}</span>
                  ))}
                </div>
              )}
              {detailsItem.applicability === 'Selected Products' && detailsItem.selectedProducts?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {detailsItem.selectedProducts.map(id => (
                    <span key={id} style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', backgroundColor: '#f1f5f9', fontWeight: 500 }}>{getProdName(id)}</span>
                  ))}
                </div>
              )}
              {detailsItem.applicability === 'Selected Combos' && detailsItem.selectedCombos?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {detailsItem.selectedCombos.map(id => (
                    <span key={id} style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', backgroundColor: '#f1f5f9', fontWeight: 500 }}>{getComboName(id)}</span>
                  ))}
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
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Filter {isTax ? 'Taxes' : 'Offers'}</h3>
              <button className="modal-close" onClick={() => setFilterOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Status</label>
                <select value={isTax ? taxFilters.status : offerFilters.status} onChange={(e) => isTax ? setTaxFilters(p => ({ ...p, status: e.target.value })) : setOfferFilters(p => ({ ...p, status: e.target.value }))} className="form-control">
                  <option value="">All</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              {!isTax && (
                <>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Discount Type</label>
                    <select value={offerFilters.discountType} onChange={(e) => setOfferFilters(p => ({ ...p, discountType: e.target.value }))} className="form-control">
                      <option value="">All</option>
                      <option value="Percentage">Percentage</option>
                      <option value="Fixed Amount">Fixed Amount</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Validity</label>
                    <select value={offerFilters.validity} onChange={(e) => setOfferFilters(p => ({ ...p, validity: e.target.value }))} className="form-control">
                      <option value="">All</option>
                      <option value="Active">Current</option>
                      <option value="Upcoming">Upcoming</option>
                      <option value="Expired">Expired</option>
                    </select>
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => { isTax ? setTaxFilters({ status: '' }) : setOfferFilters({ status: '', discountType: '', validity: '' }); setFilterOpen(false); }}>Reset</button>
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
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Delete {isTax ? 'Tax' : 'Offer'}?</h3>
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
              <button className="btn btn-primary" onClick={() => { setUnsavedModalOpen(false); isTax ? handleSaveTax() : handleSaveOffer(); }}>Save & Leave</button>
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
                <span>{isTax ? 'Tax Guide' : 'Offer Guide'}</span>
              </h3>
              <button className="modal-close" onClick={() => setInfoModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} /></button>
            </div>
            <div className="modal-body" style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '12px', lineHeight: 1.5 }}>
              {isTax ? (
                <>
                  <p style={{ margin: 0 }}>Configure tax rules that apply to products, categories, or combos.</p>
                  <div style={{ backgroundColor: '#f8fafc', padding: '10px 14px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                    <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11px', color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <li>Set a clear tax name and percentage rate.</li>
                      <li>Choose whether tax applies to all products, specific categories, products, or combos.</li>
                      <li>Toggle active/inactive status from the list view.</li>
                    </ul>
                  </div>
                </>
              ) : (
                <>
                  <p style={{ margin: 0 }}>Create promotional offers with percentage or fixed amount discounts.</p>
                  <div style={{ backgroundColor: '#f8fafc', padding: '10px 14px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                    <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11px', color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <li>Choose between percentage or fixed amount discount.</li>
                      <li>Set applicability to all products, specific categories, products, or combos.</li>
                      <li>Set optional start and end dates for time-limited promotions.</li>
                    </ul>
                  </div>
                </>
              )}
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

export default KioskTaxOffers;
