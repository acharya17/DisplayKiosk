import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ChevronRight, Plus, Search, Filter, AlertTriangle, X, 
  Image as ImageIcon, Film, Play, Settings, RefreshCw, ServerCrash,
  Upload, CheckCircle, Trash2, ChevronLeft, Edit2
} from 'lucide-react';
import DataTable from '../components/table/DataTable';

const Banners = () => {
  const { 
    banners, 
    defaultContent, 
    addBanner, 
    editBanner, 
    deleteBanner, 
    setBannerStatus,
    updateDefaultContent
  } = useApp();

  const fileInputRef = useRef(null);
  const defaultFileInputRef = useRef(null);

  // Layout View States
  const [viewState, setViewState] = useState('list'); // 'list' | 'add' | 'edit' | 'detail'
  const [selectedBannerId, setSelectedBannerId] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({ status: '', mediaType: '' });
  const [filterOpen, setFilterOpen] = useState(false);

  // Prototype States
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Delete Confirmation Modal State
  const [confirmDeleteTarget, setConfirmDeleteTarget] = useState(null);
  const [defaultContentOpen, setDefaultContentOpen] = useState(false);

  // Form State for Add/Edit
  const initialForm = {
    name: '',
    mediaUrl: '',
    mediaType: 'Image',
    mediaFileName: '',
    duration: 10,
    status: 'Active',
    enableSchedule: false,
    startDate: new Date().toISOString().split('T')[0],
    startTime: '00:00',
    endDate: '',
    endTime: '23:59',
    timezone: 'Asia/Kolkata (IST)',
    repeatOption: 'None',
    tvPermission: true
  };
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  // Upload Simulation State
  const [uploadProgress, setUploadProgress] = useState(null); // null, 0 to 100, or 'done'
  const [uploadError, setUploadError] = useState('');

  // Default content Form State
  const [defaultFormData, setDefaultFormData] = useState({ ...defaultContent });
  const [defaultErrors, setDefaultErrors] = useState({});
  const [defaultUploadProgress, setDefaultUploadProgress] = useState('done');
  const [defaultUploadError, setDefaultUploadError] = useState('');

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

  const handleOpenAdd = () => {
    setFormData(initialForm);
    setErrors({});
    setUploadProgress(null);
    setUploadError('');
    setViewState('add');
  };

  const handleOpenEdit = (banner) => {
    setFormData({ ...banner });
    setErrors({});
    setUploadProgress('done');
    setUploadError('');
    setViewState('edit');
  };

  const handleRowClick = (banner) => {
    setSelectedBannerId(banner.id);
    setViewState('detail');
  };

  // HTML5 File Selection & Validation Handler
  const handleFileSelection = (e, isDefaultFallback = false) => {
    const file = e.target.files[0];
    if (!file) return;

    const setProgress = isDefaultFallback ? setDefaultUploadProgress : setUploadProgress;
    const setError = isDefaultFallback ? setDefaultUploadError : setUploadError;
    const setForm = isDefaultFallback ? setDefaultFormData : setFormData;

    setError('');
    setProgress(0);

    // Rule 4: Validation (Limits: 15MB)
    const maxLimitBytes = 15 * 1024 * 1024;
    if (file.size > maxLimitBytes) {
      setError('File size exceeds the 15MB limit.');
      setProgress(null);
      return;
    }

    // Auto-detect format type
    let identifiedType = 'Image';
    if (file.type.startsWith('video/')) {
      identifiedType = 'Video';
    } else if (!file.type.startsWith('image/')) {
      setError('Invalid format type. Please upload a standard image or video file.');
      setProgress(null);
      return;
    }

    // Simulate upload progress steps
    let currentPct = 0;
    const uploadInterval = setInterval(() => {
      currentPct += 20;
      setProgress(currentPct);
      
      if (currentPct >= 100) {
        clearInterval(uploadInterval);
        
        // Create local object URL for preview purposes
        const localUrl = URL.createObjectURL(file);
        
        setForm(prev => ({
          ...prev,
          mediaUrl: localUrl,
          mediaType: identifiedType,
          mediaFileName: file.name
        }));
        setProgress('done');
      }
    }, 150);
  };

  const handleRemoveUploadedFile = () => {
    setFormData(prev => ({
      ...prev,
      mediaUrl: '',
      mediaFileName: '',
      mediaType: 'Image'
    }));
    setUploadProgress(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveDefaultFile = () => {
    setDefaultFormData(prev => ({
      ...prev,
      mediaUrl: '',
      mediaFileName: '',
      mediaType: 'Image'
    }));
    setDefaultUploadProgress(null);
    if (defaultFileInputRef.current) defaultFileInputRef.current.value = '';
  };

  const validateForm = () => {
    const tempErrors = {};
    if (!formData.name?.trim()) tempErrors.name = 'Banner Name is required';
    if (!formData.mediaUrl) tempErrors.mediaFile = 'Media file upload is required';
    
    // Duration validation (Required for images)
    if (formData.mediaType === 'Image') {
      const durationVal = parseInt(formData.duration);
      if (isNaN(durationVal) || durationVal <= 0) {
        tempErrors.duration = 'Valid positive duration is required for image banners';
      }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSaveBanner = () => {
    if (!validateForm()) return;

    if (viewState === 'edit') {
      const success = editBanner(formData.id, formData);
      if (success) setViewState('list');
    } else {
      const success = addBanner(formData);
      if (success) setViewState('list');
    }
  };

  const validateDefaultForm = () => {
    const tempErrors = {};
    if (!defaultFormData.name?.trim()) tempErrors.name = 'Default Banner Name is required';
    if (!defaultFormData.mediaUrl) tempErrors.mediaFile = 'Media file upload is required';
    
    setDefaultErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSaveDefaultContent = () => {
    if (!validateDefaultForm()) return;
    const success = updateDefaultContent(defaultFormData);
    if (success) setDefaultContentOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (confirmDeleteTarget) {
      deleteBanner(confirmDeleteTarget.id);
      setConfirmDeleteTarget(null);
      if (selectedBannerId === confirmDeleteTarget.id) {
        setViewState('list');
      }
    }
  };

  // Columns for datatable list view
  const columns = [
    { 
      field: 'mediaUrl', 
      header: 'Preview', 
      render: (val, row) => (
        <div style={{ width: '60px', height: '36px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--color-border)', backgroundColor: '#f1f5f9' }}>
          {row.mediaType === 'Video' ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-primary)' }}>
              <Film size={14} />
            </div>
          ) : (
            <img src={val} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
        </div>
      )
    },
    { field: 'name', header: 'Banner Name', sortable: true },
    { field: 'mediaType', header: 'Format Type', sortable: true },
    { 
      field: 'duration', 
      header: 'Duration', 
      render: (val, row) => row.mediaType === 'Video' ? 'Auto' : `${val}s` 
    },
    { 
      field: 'status', 
      header: 'Status', 
      sortable: true,
      render: (val, row) => (
        <label className="switch-control" onClick={(e) => e.stopPropagation()}>
          <input 
            type="checkbox" 
            checked={val === 'Active'} 
            onChange={() => {
              setBannerStatus(row.id, val === 'Active' ? 'Inactive' : 'Active');
            }}
          />
          <span className="switch-slider"></span>
        </label>
      )
    }
  ];

  // Filtering list logic
  const filteredBanners = banners.filter(b => {
    if (searchQuery && !b.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (activeFilters.status && b.status !== activeFilters.status) return false;
    if (activeFilters.mediaType && b.mediaType !== activeFilters.mediaType) return false;
    return true;
  });

  const activeFiltersCount = Object.values(activeFilters).filter(Boolean).length;
  const currentSelectedBanner = banners.find(b => b.id === selectedBannerId);

  return (
    <div>
      {/* Breadcrumb path navigation */}
      <div className="breadcrumb">
        <span>TV Display</span>
        <ChevronRight size={12} className="breadcrumb-separator" />
        <span className="breadcrumb-item active" style={{ cursor: viewState !== 'list' ? 'pointer' : 'default' }} onClick={() => setViewState('list')}>
          Banners
        </span>
        {viewState === 'add' && (
          <>
            <ChevronRight size={12} className="breadcrumb-separator" />
            <span className="breadcrumb-item active">Add Banner</span>
          </>
        )}
        {viewState === 'edit' && (
          <>
            <ChevronRight size={12} className="breadcrumb-separator" />
            <span className="breadcrumb-item active">Edit Banner</span>
          </>
        )}
        {viewState === 'detail' && currentSelectedBanner && (
          <>
            <ChevronRight size={12} className="breadcrumb-separator" />
            <span className="breadcrumb-item active">{currentSelectedBanner.name}</span>
          </>
        )}
      </div>

      {/* Page Header */}
      <div className="page-header" style={{ alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {viewState !== 'list' && (
            <button 
              onClick={() => setViewState('list')} 
              className="btn btn-outline" 
              style={{ height: '36px', width: '36px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}
              title="Back"
            >
              <ChevronLeft size={18} />
            </button>
          )}
          <div className="page-title-group">
            {viewState === 'list' && (
              <>
                <h1>Banner Library</h1>
                <p>Upload, preview, and configure timings for advertisement banner graphic loops.</p>
              </>
            )}
            {viewState === 'add' && (
              <>
                <h1 style={{ margin: 0 }}>Add Banner</h1>
                <p style={{ margin: 0 }}>Create a new promotional slideshow banner.</p>
              </>
            )}
            {viewState === 'edit' && (
              <>
                <h1 style={{ margin: 0 }}>Edit Banner</h1>
                <p style={{ margin: 0 }}>Update configurations for your creative media banner.</p>
              </>
            )}
            {viewState === 'detail' && currentSelectedBanner && (
              <>
                <h1 style={{ margin: 0 }}>{currentSelectedBanner.name}</h1>
                <p style={{ margin: 0 }}>View creative assets and active timing attributes.</p>
              </>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>

          {!isError && (
            viewState === 'list' ? (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-outline" onClick={() => { setDefaultFormData({ ...defaultContent }); setDefaultErrors({}); setDefaultUploadProgress('done'); setDefaultUploadError(''); setDefaultContentOpen(true); }}>
                  <Settings size={15} />
                  <span>Configure Fallback</span>
                </button>
                <button className="btn btn-primary" onClick={handleOpenAdd}>
                  <Plus size={16} />
                  <span>Add Banner</span>
                </button>
              </div>
            ) : viewState === 'detail' ? (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-secondary" onClick={() => setViewState('list')}>
                  <ChevronLeft size={16} />
                  <span>Back to Library</span>
                </button>
                <button className="btn btn-primary" onClick={() => handleOpenEdit(currentSelectedBanner)}>
                  <Edit2 size={15} />
                  <span>Edit Banner</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-secondary" onClick={() => setViewState('list')}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSaveBanner}>Save Banner</button>
              </div>
            )
          )}
        </div>
      </div>

      {/* Page States */}
      {isError ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', border: '1px solid var(--color-error)', maxWidth: '480px', margin: '24px auto' }}>
          <AlertTriangle size={36} style={{ color: 'var(--color-error)' }} />
          <h3>Unable to fetch media assets</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
            We encountered a connection handshake error.
          </p>
          <button className="btn btn-primary" onClick={() => { setIsError(false); triggerSimulatedLoad(); }}>
            Try Again
          </button>
        </div>
      ) : isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ height: '36px', backgroundColor: '#e2e8f0', borderRadius: '6px', width: '100%', animation: 'pulse 1.5s infinite' }}></div>
          <div style={{ height: '44px', backgroundColor: '#ffffff', border: '1px solid var(--color-border)', borderRadius: '6px', width: '100%', animation: 'pulse 1.5s infinite', opacity: 0.8 }}></div>
          <div style={{ height: '44px', backgroundColor: '#ffffff', border: '1px solid var(--color-border)', borderRadius: '6px', width: '100%', animation: 'pulse 1.5s infinite', opacity: 0.6 }}></div>
        </div>
      ) : viewState === 'list' ? (
        /* LISTING VIEW */
        <>
          {banners.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '56px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', maxWidth: '480px', margin: '32px auto' }}>
              <ImageIcon size={36} style={{ color: 'var(--color-text-muted)' }} />
              <h3>No banners configured yet</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', maxWidth: '340px' }}>
                Upload landscape pictures and promo videoclips to begin creating loops.
              </p>
              <button className="btn btn-primary" onClick={handleOpenAdd}>
                <Plus size={16} />
                <span>Upload First Banner</span>
              </button>
            </div>
          ) : (
            <>
              {/* Search Toolbar */}
              <div className="toolbar">
                <div className="toolbar-left">
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flex: 1, maxWidth: '320px' }}>
                    <Search size={15} style={{ position: 'absolute', left: '12px', color: 'var(--color-text-muted)', opacity: 0.6 }} />
                    <input 
                      type="text" 
                      placeholder="Search banners by name..." 
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
                    <span>Filter{activeFiltersCount > 0 ? ` • ${activeFiltersCount}` : ''}</span>
                  </button>
                </div>
              </div>

              <DataTable 
                columns={columns}
                data={filteredBanners}
                onEdit={handleOpenEdit}
                onDelete={(banner) => setConfirmDeleteTarget(banner)}
                searchQuery={searchQuery}
                searchField="name"
                filters={activeFilters}
                keyField="id"
                onRowClick={handleRowClick}
              />
            </>
          )}

        </>
      ) : viewState === 'detail' && currentSelectedBanner ? (
        /* DETAIL VIEW SUB-PAGE */
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px', alignItems: 'start' }}>
          {/* Left panel: Media Player frame */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600 }}>Media Asset Preview</h3>
            <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--color-border)', backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {currentSelectedBanner.mediaType === 'Video' ? (
                <video src={currentSelectedBanner.mediaUrl} controls autoPlay muted style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : (
                <img src={currentSelectedBanner.mediaUrl} alt="banner" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              )}
            </div>
          </div>

          {/* Right panel: Attributes grid */}
          <div className="card">
            <h3 style={{ fontSize: '14px', fontWeight: 600, borderBottom: '1px solid var(--color-border)', paddingBottom: '8px', marginBottom: '12px' }}>Attributes</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Banner Name</div>
                <div style={{ fontWeight: 500, fontSize: '13px' }}>{currentSelectedBanner.name}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Format Type</div>
                <div style={{ fontWeight: 500, fontSize: '13px' }}>{currentSelectedBanner.mediaType}</div>
              </div>
              {currentSelectedBanner.mediaType === 'Image' && (
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Duration</div>
                  <div style={{ fontWeight: 500, fontSize: '13px' }}>{currentSelectedBanner.duration} seconds</div>
                </div>
              )}
              <div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>File Name</div>
                <div style={{ fontWeight: 500, fontSize: '13px', wordBreak: 'break-all' }}>{currentSelectedBanner.mediaFileName || 'No file trace'}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Banner Status</div>
                <span className={`badge badge-${currentSelectedBanner.status.toLowerCase()}`}>
                  {currentSelectedBanner.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ADD / EDIT SUB-PAGE FORM */
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '24px', alignItems: 'start' }}>
          {/* Column 1: Config settings & Schedule */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>Banner Settings</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Banner Name <span className="required">*</span></label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Diwali Fest Special"
                    className={`form-control ${errors.name ? 'error' : ''}`}
                  />
                  {errors.name && <span className="form-error">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Display Duration (Seconds) {formData.mediaType === 'Image' && <span className="required">*</span>}
                  </label>
                  <input 
                    type="number" 
                    value={formData.mediaType === 'Video' ? '' : formData.duration} 
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    disabled={formData.mediaType === 'Video'}
                    placeholder={formData.mediaType === 'Video' ? 'Auto-detected from video' : 'e.g. 10'}
                    className={`form-control ${errors.duration ? 'error' : ''}`}
                  />
                  {formData.mediaType === 'Video' && (
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px', display: 'block' }}>
                      Video loop duration matches video length automatically.
                    </span>
                  )}
                  {errors.duration && <span className="form-error">{errors.duration}</span>}
                </div>

                {/* Toggles Pane */}
                <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '6px', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Active Switch */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '12px' }}>Banner Status</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                        {formData.status === 'Active' ? 'Active & available to loop' : 'Inactive / paused'}
                      </div>
                    </div>
                    <label className="switch-control">
                      <input 
                        type="checkbox" 
                        checked={formData.status === 'Active'} 
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.checked ? 'Active' : 'Inactive' }))}
                      />
                      <span className="switch-slider"></span>
                    </label>
                  </div>

                  {/* Permission Switch */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '12px' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '12px' }}>TV Signage Permission</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                        Status: <strong style={{ color: formData.tvPermission ? 'var(--color-success)' : 'var(--color-error)' }}>
                          {formData.tvPermission ? 'Granted' : 'Revoked'}
                        </strong>
                      </div>
                    </div>
                    <label className="switch-control">
                      <input 
                        type="checkbox" 
                        checked={formData.tvPermission} 
                        onChange={(e) => setFormData(prev => ({ ...prev, tvPermission: e.target.checked }))}
                      />
                      <span className="switch-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Scheduling Card */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '13px' }}>Configure Signage Schedule</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                    Define dates, time restrictions, and repeats constraints.
                  </div>
                </div>
                <label className="switch-control">
                  <input 
                    type="checkbox" 
                    checked={formData.enableSchedule} 
                    onChange={(e) => setFormData(prev => ({ ...prev, enableSchedule: e.target.checked }))}
                  />
                  <span className="switch-slider"></span>
                </label>
              </div>

              {/* Collapsible schedule inputs */}
              {formData.enableSchedule && (
                <div style={{ 
                  backgroundColor: '#f8fafc', 
                  border: '1px solid var(--color-border)', 
                  borderRadius: '6px', 
                  padding: '16px', 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '16px',
                  animation: 'fadeIn 0.2s ease-out'
                }}>
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input 
                      type="date" 
                      value={formData.startDate} 
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Start Time</label>
                    <input 
                      type="time" 
                      value={formData.startTime} 
                      onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input 
                      type="date" 
                      value={formData.endDate} 
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">End Time</label>
                    <input 
                      type="time" 
                      value={formData.endTime} 
                      onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Repeat Pattern</label>
                    <select 
                      value={formData.repeatOption} 
                      onChange={(e) => setFormData(prev => ({ ...prev, repeatOption: e.target.value }))}
                      className="form-control"
                    >
                      <option value="None">None (Once)</option>
                      <option value="Daily">Daily loop repeat</option>
                      <option value="Weekly">Weekly loops repeat</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Timezone</label>
                    <select 
                      value={formData.timezone} 
                      onChange={(e) => setFormData(prev => ({ ...prev, timezone: e.target.value }))}
                      className="form-control"
                    >
                      <option value="Asia/Kolkata (IST)">Asia/Kolkata (IST)</option>
                      <option value="Asia/Dubai (GST)">Asia/Dubai (GST)</option>
                      <option value="UTC">UTC Greenwich</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Media Dropzone & Preview Card */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>Media Asset</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Upload Zone container */}
              <div 
                style={{ 
                  border: errors.mediaFile ? '1.5px dashed var(--color-error)' : '1.5px dashed var(--color-border)',
                  borderRadius: '6px',
                  padding: '24px 12px',
                  textAlign: 'center',
                  backgroundColor: '#f8fafc',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  minHeight: '180px'
                }}
                onClick={() => {
                  if (uploadProgress !== 'done' && fileInputRef.current) {
                    fileInputRef.current.click();
                  }
                }}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="image/*,video/*"
                  onChange={handleFileSelection}
                />

                {uploadProgress === null && (
                  <>
                    <Upload size={28} style={{ color: 'var(--color-text-secondary)' }} />
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '2px' }}>Choose image or video file</span>
                      <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Drag files here or click to browse (Max 15MB)</span>
                    </div>
                  </>
                )}

                {typeof uploadProgress === 'number' && (
                  <div style={{ width: '100%', padding: '0 16px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>Uploading creative file... {uploadProgress}%</div>
                    <div style={{ height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${uploadProgress}%`, backgroundColor: 'var(--color-primary)', transition: 'width 100ms ease' }} />
                    </div>
                  </div>
                )}

                {uploadProgress === 'done' && (
                  <>
                    <CheckCircle size={24} style={{ color: 'var(--color-success)' }} />
                    <div>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-success)', display: 'block' }}>Media upload ready</span>
                      <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)', wordBreak: 'break-all' }}>{formData.mediaFileName}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); fileInputRef.current.click(); }} 
                        className="btn btn-outline" 
                        style={{ height: '26px', fontSize: '10px', padding: '0 8px' }}
                      >
                        Replace File
                      </button>
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleRemoveUploadedFile(); }} 
                        className="btn btn-outline" 
                        style={{ height: '26px', fontSize: '10px', padding: '0 8px', borderColor: 'var(--color-error)', color: 'var(--color-error)' }}
                      >
                        Remove
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Inline Media Preview Panel */}
              {formData.mediaUrl && uploadProgress === 'done' && (
                <div style={{ 
                  border: '1px solid var(--color-border)', 
                  borderRadius: '6px', 
                  overflow: 'hidden', 
                  backgroundColor: '#0f172a', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  height: '180px'
                }}>
                  {formData.mediaType === 'Video' ? (
                    <video src={formData.mediaUrl} controls autoPlay muted style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <img src={formData.mediaUrl} alt="prev" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  )}
                </div>
              )}
            </div>
            {uploadError && <span style={{ color: 'var(--color-error)', fontSize: '11px', marginTop: '6px', display: 'block' }}>{uploadError}</span>}
            {errors.mediaFile && <span className="form-error" style={{ marginTop: '6px' }}>{errors.mediaFile}</span>}
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {confirmDeleteTarget && (
        <div className="modal-overlay">
          <div className="modal-container size-sm" style={{ padding: '4px' }}>
            <div className="modal-header" style={{ borderBottom: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-error)' }}>
                <AlertTriangle size={20} />
                <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Delete Banner</h3>
              </div>
              <button onClick={() => setConfirmDeleteTarget(null)} className="modal-close-btn">
                <X size={16} />
              </button>
            </div>
            <div className="modal-body" style={{ padding: '0 24px 16px 24px' }}>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                Are you sure you want to permanently delete banner <strong>{confirmDeleteTarget.name}</strong>? 
                This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer" style={{ borderTop: 'none', padding: '16px 24px' }}>
              <button onClick={() => setConfirmDeleteTarget(null)} className="btn btn-secondary">Cancel</button>
              <button onClick={handleDeleteConfirm} className="btn btn-danger">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Configure Fallback signage modal */}
      {defaultContentOpen && (
        <div className="modal-overlay">
          <div className="modal-container size-md">
            <div className="modal-header">
              <h3>Configure Fallback Signage</h3>
              <button onClick={() => setDefaultContentOpen(false)} className="modal-close-btn">
                <X size={16} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Fallback Banner Name <span className="required">*</span></label>
                <input 
                  type="text" 
                  value={defaultFormData.name} 
                  onChange={(e) => setDefaultFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={`form-control ${defaultErrors.name ? 'error' : ''}`}
                  placeholder="e.g. Spice Junction Main Welcome Screen"
                />
                {defaultErrors.name && <span className="form-error">{defaultErrors.name}</span>}
              </div>

              {/* File selection dropzone */}
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Upload Fallback Media <span className="required">*</span></label>
                <div 
                  style={{ 
                    border: defaultErrors.mediaFile ? '1.5px dashed var(--color-error)' : '1.5px dashed var(--color-border)',
                    borderRadius: '6px',
                    padding: '20px 12px',
                    textAlign: 'center',
                    backgroundColor: '#f8fafc',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    minHeight: '120px'
                  }}
                  onClick={() => {
                    if (defaultUploadProgress !== 'done' && defaultFileInputRef.current) {
                      defaultFileInputRef.current.click();
                    }
                  }}
                >
                  <input 
                    type="file" 
                    ref={defaultFileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={(e) => handleFileSelection(e, true)}
                  />
                  
                  {defaultUploadProgress === null && (
                    <>
                      <Upload size={20} style={{ color: 'var(--color-text-secondary)' }} />
                      <span style={{ fontSize: '12px', fontWeight: 500 }}>Select fallback image</span>
                    </>
                  )}

                  {typeof defaultUploadProgress === 'number' && (
                    <div style={{ width: '100%', padding: '0 8px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 600, marginBottom: '6px' }}>Uploading... {defaultUploadProgress}%</div>
                      <div style={{ height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${defaultUploadProgress}%`, backgroundColor: 'var(--color-primary)' }} />
                      </div>
                    </div>
                  )}

                  {defaultUploadProgress === 'done' && (
                    <>
                      <CheckCircle size={20} style={{ color: 'var(--color-success)' }} />
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-success)' }}>Fallback Image Loaded</span>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                        <button 
                          type="button" 
                          onClick={(e) => { e.stopPropagation(); defaultFileInputRef.current.click(); }} 
                          className="btn btn-outline" 
                          style={{ height: '24px', fontSize: '10px', padding: '0 8px' }}
                        >
                          Replace
                        </button>
                        <button 
                          type="button" 
                          onClick={(e) => { e.stopPropagation(); handleRemoveDefaultFile(); }} 
                          className="btn btn-outline" 
                          style={{ height: '24px', fontSize: '10px', padding: '0 8px', borderColor: 'var(--color-error)', color: 'var(--color-error)' }}
                        >
                          Remove
                        </button>
                      </div>
                    </>
                  )}
                </div>
                {defaultUploadError && <span style={{ color: 'var(--color-error)', fontSize: '11px', marginTop: '4px', display: 'block' }}>{defaultUploadError}</span>}
                {defaultErrors.mediaFile && <span className="form-error">{defaultErrors.mediaFile}</span>}
              </div>

              {/* Preview frame */}
              {defaultFormData.mediaUrl && defaultUploadProgress === 'done' && (
                <div style={{ width: '100%', height: '150px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--color-border)', backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={defaultFormData.mediaUrl} alt="prev" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
              )}

            </div>
            <div className="modal-footer">
              <button onClick={() => setDefaultContentOpen(false)} className="btn btn-secondary">Cancel</button>
              <button onClick={handleSaveDefaultContent} className="btn btn-primary">Save Fallback</button>
            </div>
          </div>
        </div>
      )}

      {/* Filter dialog popup */}
      {filterOpen && (
        <div className="modal-overlay">
          <div className="modal-container size-sm">
            <div className="modal-header">
              <h3>Filter Banners</h3>
              <button onClick={() => setFilterOpen(false)} className="modal-close-btn">
                <X size={16} />
              </button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select 
                  value={activeFilters.status} 
                  onChange={(e) => setActiveFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="form-control"
                >
                  <option value="">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Format Type</label>
                <select 
                  value={activeFilters.mediaType} 
                  onChange={(e) => setActiveFilters(prev => ({ ...prev, mediaType: e.target.value }))}
                  className="form-control"
                >
                  <option value="">All Formats</option>
                  <option value="Image">Image</option>
                  <option value="Video">Video</option>
                </select>
              </div>
            </div>
            <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
              <button onClick={() => { setActiveFilters({ status: '', mediaType: '' }); setFilterOpen(false); }} className="btn btn-secondary">
                Clear Filters
              </button>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setFilterOpen(false)} className="btn btn-outline">Cancel</button>
                <button onClick={() => setFilterOpen(false)} className="btn btn-primary">Apply</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Banners;
