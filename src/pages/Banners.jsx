import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ChevronRight, Plus, Search, Filter, AlertTriangle, X, 
  Image as ImageIcon, Film, Play, Settings, RefreshCw, ServerCrash,
  Upload, CheckCircle, Trash2
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

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({ status: '', mediaType: '' });
  const [filterOpen, setFilterOpen] = useState(false);

  // Prototype States
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Modals state
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [confirmDeleteTarget, setConfirmDeleteTarget] = useState(null);
  const [defaultContentOpen, setDefaultContentOpen] = useState(false);

  // Form State
  const initialForm = {
    name: '',
    mediaUrl: '',
    mediaType: 'Image',
    mediaFileName: '',
    duration: 10,
    status: 'Active'
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
    setEditTarget(null);
    setFormData(initialForm);
    setErrors({});
    setUploadProgress(null);
    setUploadError('');
    setFormOpen(true);
  };

  const handleOpenEdit = (banner) => {
    setEditTarget(banner.id);
    setFormData({ ...banner });
    setErrors({});
    setUploadProgress('done');
    setUploadError('');
    setFormOpen(true);
  };

  // HTML5 File Selection & Validation Handler
  const handleFileSelection = (e, isDefaultFallback = false) => {
    const file = e.target.files[0];
    if (!file) return;

    const setProgress = isDefaultFallback ? setDefaultUploadProgress : setUploadProgress;
    const setError = isDefaultFallback ? setDefaultUploadError : setUploadError;
    const setForm = isDefaultFallback ? setDefaultFormData : setFormData;

    // 1. File Format Type Check
    const acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'];
    if (!acceptedTypes.includes(file.type)) {
      setError('Unsupported media format. Please upload a supported image or video.');
      setProgress(null);
      return;
    }

    // 2. File Size Limit Check (Max 15MB)
    const maxSize = 15 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File size exceeds the allowed limit (15MB). Please select a smaller file.');
      setProgress(null);
      return;
    }

    // 3. Auto Identify Media Type
    const detectedType = file.type.startsWith('video/') ? 'Video' : 'Image';

    setError('');
    setProgress(0);

    // 4. Simulate Upload Progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      setProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setProgress('done');
        
        // Generate Browser temporary local path
        const localUrl = URL.createObjectURL(file);
        setForm(prev => ({
          ...prev,
          mediaUrl: localUrl,
          mediaType: detectedType,
          mediaFileName: file.name,
          duration: detectedType === 'Video' ? 10 : prev.duration
        }));
      }
    }, 120);
  };

  const handleRemoveSelectedMedia = (isDefaultFallback = false) => {
    const setProgress = isDefaultFallback ? setDefaultUploadProgress : setUploadProgress;
    const setForm = isDefaultFallback ? setDefaultFormData : setFormData;
    
    setProgress(null);
    setForm(prev => ({
      ...prev,
      mediaUrl: '',
      mediaFileName: ''
    }));
    
    // Clear input element so same file can be selected again
    if (isDefaultFallback && defaultFileInputRef.current) {
      defaultFileInputRef.current.value = '';
    } else if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validate = () => {
    const tempErrors = {};
    if (!formData.name?.trim()) tempErrors.name = 'Banner Name is required';
    if (!formData.mediaUrl) tempErrors.mediaUrl = 'Media File upload is required';
    
    if (formData.mediaType === 'Image') {
      if (!formData.duration || formData.duration <= 0) {
        tempErrors.duration = 'Display Duration must be greater than zero';
      }
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    if (editTarget) {
      const success = editBanner(editTarget, formData);
      if (success) setFormOpen(false);
    } else {
      const success = addBanner(formData);
      if (success) setFormOpen(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (confirmDeleteTarget) {
      deleteBanner(confirmDeleteTarget.id);
      setConfirmDeleteTarget(null);
    }
  };

  const handleSaveDefaultContent = () => {
    if (!defaultFormData.name?.trim()) {
      setDefaultErrors({ name: 'Default Name is required' });
      return;
    }
    if (!defaultFormData.mediaUrl) {
      setDefaultErrors({ mediaUrl: 'Default Fallback Media upload is required' });
      return;
    }

    const success = updateDefaultContent(defaultFormData);
    if (success) {
      setDefaultContentOpen(false);
    }
  };

  const handleOpenDefaultEdit = () => {
    setDefaultFormData({ ...defaultContent });
    setDefaultErrors({});
    setDefaultUploadProgress('done');
    setDefaultUploadError('');
    setDefaultContentOpen(true);
  };

  const columns = [
    {
      field: 'mediaUrl',
      header: 'Preview',
      render: (val, row) => (
        <div style={{ position: 'relative', width: '60px', height: '36px', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#f1f5f9', border: '1px solid var(--color-border)' }}>
          {row.mediaType === 'Video' ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', color: 'var(--color-primary)' }}>
              <Film size={16} />
              <Play size={8} style={{ position: 'absolute', opacity: 0.8 }} />
            </div>
          ) : (
            <img src={val} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
        </div>
      )
    },
    { field: 'name', header: 'Banner Name', sortable: true },
    { 
      field: 'mediaType', 
      header: 'Type', 
      sortable: true,
      render: (val) => (
        <span style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '4px',
          fontSize: '11px',
          fontWeight: 600,
          color: val === 'Video' ? 'var(--color-info)' : 'var(--color-text-secondary)'
        }}>
          {val === 'Video' ? <Film size={12} /> : <ImageIcon size={12} />}
          {val}
        </span>
      )
    },
    { 
      field: 'duration', 
      header: 'Duration', 
      render: (val, row) => row.mediaType === 'Video' ? 'Auto (Length)' : `${val}s`
    },
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

  return (
    <div>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span>Business</span>
        <ChevronRight size={12} className="breadcrumb-separator" />
        <span className="breadcrumb-item active">Banners</span>
      </div>

      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Banners</h1>
          <p>Create, upload, and maintain promotional graphics and videos for kiosk signs.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Dev Sim State Console */}
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
            >
              <ServerCrash size={12} />
              <span>Simulate Error</span>
            </button>
          </div>

          {!isError && (
            <button className="btn btn-primary" onClick={handleOpenAdd}>
              <Plus size={16} />
              <span>Add Banner</span>
            </button>
          )}
        </div>
      </div>

      {/* Default content fallback looping banner widget */}
      {!isError && !isLoading && (
        <div className="card" style={{ marginBottom: '24px', borderLeft: '4px solid var(--color-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ width: '100px', height: '60px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--color-border)', backgroundColor: '#f1f5f9' }}>
                <img src={defaultContent.mediaUrl} alt="Default Content" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Default / Fallback Loop content</span>
                <h3 style={{ fontSize: '15px', fontWeight: 600, marginTop: '2px' }}>{defaultContent.name}</h3>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                  Plays when no scheduled playlists are active. Format: <strong>{defaultContent.mediaType}</strong>
                </p>
              </div>
            </div>
            <button className="btn btn-outline" onClick={handleOpenDefaultEdit}>
              <Settings size={15} />
              <span>Configure Fallback</span>
            </button>
          </div>
        </div>
      )}

      {/* Page States */}
      {isError ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', border: '1px solid var(--color-error)', maxWidth: '480px', margin: '24px auto' }}>
          <AlertTriangle size={36} style={{ color: 'var(--color-error)' }} />
          <h3>Unable to load banners content</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
            We encountered a network timeout error while querying the media catalog database.
          </p>
          <button className="btn btn-primary" onClick={() => { setIsError(false); triggerSimulatedLoad(); }}>
            Try Again
          </button>
        </div>
      ) : isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ height: '36px', backgroundColor: '#e2e8f0', borderRadius: '6px', width: '100%', animation: 'pulse 1.5s infinite' }}></div>
          <div style={{ height: '40px', backgroundColor: '#f1f5f9', borderRadius: '6px', width: '100%', animation: 'pulse 1.5s infinite', display: 'flex', alignItems: 'center', padding: '0 12px', gap: '20px' }}>
            <div style={{ width: '40px', height: '24px', backgroundColor: '#cbd5e1', borderRadius: '3px' }}></div>
            <div style={{ width: '150px', height: '14px', backgroundColor: '#cbd5e1', borderRadius: '3px' }}></div>
            <div style={{ width: '80px', height: '14px', backgroundColor: '#cbd5e1', borderRadius: '3px' }}></div>
            <div style={{ width: '80px', height: '14px', backgroundColor: '#cbd5e1', borderRadius: '3px' }}></div>
          </div>
          <div style={{ height: '44px', backgroundColor: '#ffffff', border: '1px solid var(--color-border)', borderRadius: '6px', width: '100%', animation: 'pulse 1.5s infinite', opacity: 0.8 }}></div>
          <div style={{ height: '44px', backgroundColor: '#ffffff', border: '1px solid var(--color-border)', borderRadius: '6px', width: '100%', animation: 'pulse 1.5s infinite', opacity: 0.6 }}></div>
        </div>
      ) : banners.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '56px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', maxWidth: '480px', margin: '32px auto' }}>
          <ImageIcon size={36} style={{ color: 'var(--color-text-muted)' }} />
          <h3>No banners uploaded yet</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', maxWidth: '340px' }}>
            Start building your restaurant display media catalog by uploading images or videos of dishes and weekly offers.
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
            data={banners}
            onEdit={handleOpenEdit}
            onDelete={(banner) => setConfirmDeleteTarget(banner)}
            searchQuery={searchQuery}
            searchField="name"
            filters={activeFilters}
            keyField="id"
          />
        </>
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
                <label className="form-label">Media Type</label>
                <select 
                  value={activeFilters.mediaType} 
                  onChange={(e) => setActiveFilters(prev => ({ ...prev, mediaType: e.target.value }))}
                  className="form-control"
                >
                  <option value="">All Media Types</option>
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

      {/* Add / Edit Banner Drawer Modal */}
      {formOpen && (
        <div className="modal-overlay">
          <div className="modal-container size-md">
            <div className="modal-header">
              <h3>{editTarget ? 'Edit Banner' : 'Upload Banner'}</h3>
              <button onClick={() => setFormOpen(false)} className="modal-close-btn">
                <X size={16} />
              </button>
            </div>
            <div className="modal-body" style={{ maxHeight: '70vh' }}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Banner Name <span className="required">*</span></label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} 
                  className={`form-control ${errors.name ? 'error' : ''}`}
                  placeholder="e.g. Weekday Lunch Special Offer"
                />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>

              {/* Upload zone strictly using file picker (no direct URL inputs) */}
              <div className="form-section" style={{ border: '1px dashed var(--color-border)', borderRadius: '8px', padding: '16px', backgroundColor: '#f8fafc', marginBottom: '16px' }}>
                <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Media File Upload <span className="required">*</span></label>
                
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={(e) => handleFileSelection(e, false)}
                  style={{ display: 'none' }}
                  accept="image/jpeg,image/jpg,image/png,image/webp,video/mp4,video/webm"
                />

                {uploadProgress === null ? (
                  /* Initial selector visual click zone */
                  <div 
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0', gap: '12px', cursor: 'pointer', border: '1px dashed var(--color-border-hover)', borderRadius: '6px', backgroundColor: '#ffffff' }}
                  >
                    <Upload size={32} style={{ color: 'var(--color-text-muted)' }} />
                    <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-primary)' }}>Select media file from device</span>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Supports JPG, PNG, WebP or MP4, WebM (Max 15MB)</span>
                  </div>
                ) : typeof uploadProgress === 'number' ? (
                  /* Progress loader */
                  <div style={{ padding: '24px 0', textAlign: 'center' }}>
                    <RefreshCw size={24} style={{ animation: 'spin 1.5s linear infinite', color: 'var(--color-primary)', margin: '0 auto 8px auto' }} />
                    <div style={{ fontSize: '12px', fontWeight: 600 }}>Uploading media file... {uploadProgress}%</div>
                    <div style={{ width: '100%', height: '4px', backgroundColor: '#e2e8f0', borderRadius: '2px', marginTop: '8px' }}>
                      <div style={{ width: `${uploadProgress}%`, height: '100%', backgroundColor: 'var(--color-primary)', borderRadius: '2px', transition: 'width 100ms' }}></div>
                    </div>
                  </div>
                ) : (
                  /* Success Uploaded Preview */
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--color-success)', fontWeight: 600 }}>
                        <CheckCircle size={14} /> Upload Complete
                      </span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          type="button" 
                          onClick={() => fileInputRef.current && fileInputRef.current.click()}
                          className="btn btn-outline" 
                          style={{ height: '24px', padding: '0 8px', fontSize: '10px' }}
                        >
                          Replace File
                        </button>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveSelectedMedia(false)}
                          className="btn btn-outline" 
                          style={{ height: '24px', padding: '0 8px', fontSize: '10px', color: 'var(--color-error)' }}
                        >
                          <Trash2 size={10} style={{ marginRight: '2px' }} /> Remove
                        </button>
                      </div>
                    </div>
                    {/* Media render wrapper */}
                    <div style={{ width: '100%', height: '150px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--color-border)', backgroundColor: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {formData.mediaType === 'Video' ? (
                        <video controls style={{ maxHeight: '100%', maxWidth: '100%' }}>
                          <source src={formData.mediaUrl} type="video/mp4" />
                          Your browser does not support HTML5 video preview.
                        </video>
                      ) : (
                        <img src={formData.mediaUrl} alt="Preview" style={{ height: '100%', width: '100%', objectFit: 'contain' }} />
                      )}
                    </div>
                    <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--color-text-secondary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      Selected: <strong>{formData.mediaFileName}</strong>
                    </div>
                  </div>
                )}
                
                {uploadError && <div style={{ color: 'var(--color-error)', fontSize: '12px', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertTriangle size={14} /> {uploadError}</div>}
                {errors.mediaUrl && <div style={{ color: 'var(--color-error)', fontSize: '12px', marginTop: '4px' }}>{errors.mediaUrl}</div>}
              </div>

              {formData.mediaType === 'Image' && (
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">Display Duration (Seconds) <span className="required">*</span></label>
                  <input 
                    type="number" 
                    value={formData.duration} 
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))} 
                    className={`form-control ${errors.duration ? 'error' : ''}`}
                    min="1"
                  />
                  {errors.duration && <span className="form-error">{errors.duration}</span>}
                  <span className="form-helper">Determines how long this graphic shows up on the screen before scrolling.</span>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Banner Status</label>
                <select 
                  value={formData.status} 
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="form-control"
                >
                  <option value="Active">Active (Operational)</option>
                  <option value="Inactive">Inactive (Stored / Disabled)</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setFormOpen(false)} className="btn btn-secondary">Cancel</button>
              <button onClick={handleSave} className="btn btn-primary" disabled={uploadProgress !== 'done'}>Save Banner</button>
            </div>
          </div>
        </div>
      )}

      {/* Configure Default Fallback Content Modal */}
      {defaultContentOpen && (
        <div className="modal-overlay">
          <div className="modal-container size-sm">
            <div className="modal-header">
              <h3>Configure Fallback Signage</h3>
              <button onClick={() => setDefaultContentOpen(false)} className="modal-close-btn">
                <X size={16} />
              </button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Fallback Banner Name</label>
                <input 
                  type="text" 
                  value={defaultFormData.name} 
                  onChange={(e) => setDefaultFormData(prev => ({ ...prev, name: e.target.value }))} 
                  className="form-control"
                />
              </div>

              {/* Fallback File Upload Zone */}
              <div className="form-section" style={{ border: '1px dashed var(--color-border)', borderRadius: '8px', padding: '12px', backgroundColor: '#f8fafc' }}>
                <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Fallback Media File <span className="required">*</span></label>
                
                <input 
                  type="file" 
                  ref={defaultFileInputRef}
                  onChange={(e) => handleFileSelection(e, true)}
                  style={{ display: 'none' }}
                  accept="image/jpeg,image/jpg,image/png,image/webp,video/mp4,video/webm"
                />

                {defaultUploadProgress === null ? (
                  <div 
                    onClick={() => defaultFileInputRef.current && defaultFileInputRef.current.click()}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0', gap: '8px', cursor: 'pointer', border: '1px dashed var(--color-border-hover)', borderRadius: '6px', backgroundColor: '#ffffff' }}
                  >
                    <Upload size={24} style={{ color: 'var(--color-text-muted)' }} />
                    <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-primary)' }}>Select fallback file</span>
                  </div>
                ) : typeof defaultUploadProgress === 'number' ? (
                  <div style={{ padding: '12px 0', textAlign: 'center' }}>
                    <RefreshCw size={20} style={{ animation: 'spin 1.5s linear infinite', color: 'var(--color-primary)', margin: '0 auto 8px auto' }} />
                    <div style={{ fontSize: '11px' }}>Uploading file... {defaultUploadProgress}%</div>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 600 }}>File Ready ({defaultFormData.mediaType})</span>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button 
                          type="button" 
                          onClick={() => defaultFileInputRef.current && defaultFileInputRef.current.click()}
                          className="btn btn-outline" 
                          style={{ height: '22px', padding: '0 6px', fontSize: '9px' }}
                        >
                          Replace
                        </button>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveSelectedMedia(true)}
                          className="btn btn-outline" 
                          style={{ height: '22px', padding: '0 6px', fontSize: '9px', color: 'var(--color-error)' }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div style={{ width: '100%', height: '100px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                      <img src={defaultFormData.mediaUrl} alt="Fallback Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </div>
                )}
                
                {defaultUploadError && <div style={{ color: 'var(--color-error)', fontSize: '11px', marginTop: '6px' }}>{defaultUploadError}</div>}
              </div>              
            </div>
            <div className="modal-footer">
              <button onClick={() => setDefaultContentOpen(false)} className="btn btn-outline">Cancel</button>
              <button onClick={handleSaveDefaultContent} className="btn btn-primary" disabled={defaultUploadProgress !== 'done'}>Save Fallback</button>
            </div>
          </div>
        </div>
      )}

      {/* Deletion confirmation modal */}
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
                Are you sure you want to permanently delete banner <strong>{confirmDeleteTarget.name}</strong> from the catalog library? 
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
    </div>
  );
};

export default Banners;
