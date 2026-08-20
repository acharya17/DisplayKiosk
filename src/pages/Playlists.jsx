import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ChevronRight, Plus, Search, Filter, AlertTriangle, X, 
  ListMusic, Calendar, Image as ImageIcon, ArrowUp, ArrowDown, Trash2, 
  Play, Clock, ChevronLeft, Edit, AlertCircle, Film, RefreshCw, ServerCrash,
  Upload, CheckCircle, GripVertical
} from 'lucide-react';
import DataTable from '../components/table/DataTable';

const Playlists = () => {
  const { 
    playlists, 
    banners, 
    addPlaylist, 
    editPlaylist, 
    deletePlaylist, 
    setPlaylistStatus
  } = useApp();

  // Navigation State inside playlists workspace
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({ status: '', scheduleStatus: '' });
  const [filterOpen, setFilterOpen] = useState(false);

  // Prototype state controls
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Modal / Dialog Open States
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [confirmDeleteTarget, setConfirmDeleteTarget] = useState(null);
  
  // Playlist Details sub-dialogs
  const [bannerPickerOpen, setBannerPickerOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedBannerForSchedule, setSelectedBannerForSchedule] = useState(null);

  // Playlist Form State (holds mutable banners array for configuration)
  const initialPlaylistForm = {
    name: '',
    description: '',
    status: 'Inactive',
    banners: []
  };
  const [formData, setFormData] = useState(initialPlaylistForm);
  const [errors, setErrors] = useState({});

  // Banner Selection Dialog Checklist State
  const [bannerSearchQuery, setBannerSearchQuery] = useState('');
  const [selectedBannerIds, setSelectedBannerIds] = useState(new Set());

  // Banner Drag & Drop indices state
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Banner Schedule Form State
  const [scheduleForm, setScheduleForm] = useState({
    startDate: '',
    startTime: '00:00',
    endDate: '',
    endTime: '23:59',
    noEndDate: true
  });

  // Simulated system current date context
  const mockCurrentDate = new Date('2026-08-20T12:00:00Z');

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

  // Status calculation helper
  const getBannerScheduleStatus = (schedule) => {
    const targetBanner = banners.find(b => b.id === schedule.bannerId);
    if (targetBanner && targetBanner.status === 'Inactive') return 'Inactive Banner';

    const startDateTime = new Date(`${schedule.startDate}T${schedule.startTime || '00:00'}`);
    if (mockCurrentDate < startDateTime) {
      return 'Upcoming';
    }

    if (schedule.scheduleType === 'Scheduled' && schedule.endDate) {
      const endDateTime = new Date(`${schedule.endDate}T${schedule.endTime || '23:59'}`);
      if (mockCurrentDate > endDateTime) {
        return 'Expired';
      }
      return 'Running';
    }

    return 'No End Date';
  };

  const getScheduleBadgeClass = (status) => {
    switch (status) {
      case 'Running':
      case 'No End Date':
        return 'badge-active';
      case 'Upcoming':
        return 'badge-upcoming';
      case 'Expired':
      case 'Inactive Banner':
        return 'badge-inactive';
      default:
        return 'badge-inactive';
    }
  };

  const handleOpenAdd = () => {
    setEditTarget(null);
    setFormData(initialPlaylistForm);
    setErrors({});
    setFormOpen(true);
  };

  const handleOpenEdit = (playlist) => {
    setEditTarget(playlist.id);
    setFormData({ ...playlist });
    setErrors({});
    setFormOpen(true);
  };

  const validatePlaylist = () => {
    const tempErrors = {};
    if (!formData.name?.trim()) tempErrors.name = 'Playlist Name is required';
    
    // Rule 23: At least one banner required before activation
    if (formData.status === 'Active' && (!formData.banners || formData.banners.length === 0)) {
      tempErrors.status = 'You must add at least one banner before activating the playlist';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSavePlaylist = () => {
    if (!validatePlaylist()) return;

    if (editTarget) {
      const success = editPlaylist(editTarget, formData);
      if (success) setFormOpen(false);
    } else {
      const success = addPlaylist(formData);
      if (success) setFormOpen(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (confirmDeleteTarget) {
      deletePlaylist(confirmDeleteTarget.id);
      if (selectedPlaylistId === confirmDeleteTarget.id) {
        setSelectedPlaylistId(null);
      }
      setConfirmDeleteTarget(null);
    }
  };

  // Drag and Drop Sequence swapping in form
  const handleDragStartForm = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOverForm = (e) => {
    e.preventDefault();
  };

  const handleDropForm = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const playlistBannersList = [...formData.banners];
    const draggedItem = playlistBannersList[draggedIndex];

    playlistBannersList.splice(draggedIndex, 1);
    playlistBannersList.splice(targetIndex, 0, draggedItem);

    const reindexed = playlistBannersList.map((item, idx) => ({
      ...item,
      displayOrder: idx + 1
    }));

    setFormData(prev => ({
      ...prev,
      banners: reindexed
    }));

    setDraggedIndex(null);
  };

  const handleOpenScheduleEdit = (bannerInPlaylist) => {
    setSelectedBannerForSchedule(bannerInPlaylist.bannerId);
    setScheduleForm({
      startDate: bannerInPlaylist.startDate,
      startTime: bannerInPlaylist.startTime || '00:00',
      endDate: bannerInPlaylist.endDate || '',
      endTime: bannerInPlaylist.endTime || '23:59',
      noEndDate: bannerInPlaylist.scheduleType === 'Continuous'
    });
    setScheduleModalOpen(true);
  };

  const handleSaveSchedule = () => {
    const updatedDetails = {
      scheduleType: scheduleForm.noEndDate ? 'Continuous' : 'Scheduled',
      startDate: scheduleForm.startDate,
      startTime: scheduleForm.startTime,
      endDate: scheduleForm.noEndDate ? '' : scheduleForm.endDate,
      endTime: scheduleForm.noEndDate ? '' : scheduleForm.endTime
    };

    setFormData(prev => {
      const updatedBanners = prev.banners.map(b => b.bannerId === selectedBannerForSchedule ? {
        ...b,
        ...updatedDetails
      } : b);
      return { ...prev, banners: updatedBanners };
    });

    setScheduleModalOpen(false);
  };

  const handleToggleBannerSelection = (bannerId) => {
    setSelectedBannerIds(prev => {
      const next = new Set(prev);
      if (next.has(bannerId)) {
        next.delete(bannerId);
      } else {
        next.add(bannerId);
      }
      return next;
    });
  };

  const handleAddSelectedBanners = () => {
    if (selectedBannerIds.size === 0) return;
    
    setFormData(prev => {
      const existing = [...prev.banners];
      selectedBannerIds.forEach(id => {
        if (!existing.some(item => item.bannerId === id)) {
          const newOrder = existing.length + 1;
          existing.push({
            bannerId: id,
            displayOrder: newOrder,
            scheduleType: 'Continuous',
            startDate: new Date().toISOString().split('T')[0],
            startTime: '00:00',
            endDate: '',
            endTime: ''
          });
        }
      });
      return { ...prev, banners: existing };
    });

    setBannerPickerOpen(false);
    setSelectedBannerIds(new Set());
  };

  const handleRemoveBannerFromForm = (bannerId) => {
    setFormData(prev => {
      const filtered = prev.banners.filter(b => b.bannerId !== bannerId);
      const reindexed = filtered.map((item, idx) => ({
        ...item,
        displayOrder: idx + 1
      }));
      return { ...prev, banners: reindexed };
    });
  };

  const selectedPlaylist = playlists.find(p => p.id === selectedPlaylistId);

  // Columns for main playlists grid
  const columns = [
    { field: 'name', header: 'Playlist Name', sortable: true },
    { 
      field: 'banners', 
      header: 'Banners Count', 
      render: (val) => `${val ? val.length : 0} items` 
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
    },
    { 
      field: 'updatedAt', 
      header: 'Last Updated', 
      render: (val) => new Date(val).toLocaleDateString() 
    }
  ];

  // Filters calculation
  const filteredPlaylists = playlists.filter(pl => {
    if (searchQuery && !pl.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (activeFilters.status && pl.status !== activeFilters.status) return false;
    
    if (activeFilters.scheduleStatus) {
      const hasMatch = pl.banners.some(b => getBannerScheduleStatus(b) === activeFilters.scheduleStatus);
      if (!hasMatch) return false;
    }
    return true;
  });

  const activeFiltersCount = Object.values(activeFilters).filter(Boolean).length;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span>TV Display</span>
        <ChevronRight size={12} className="breadcrumb-separator" />
        <span className="breadcrumb-item active" style={{ cursor: selectedPlaylistId ? 'pointer' : 'default' }} onClick={() => setSelectedPlaylistId(null)}>
          Playlists
        </span>
        {selectedPlaylist && (
          <>
            <ChevronRight size={12} className="breadcrumb-separator" />
            <span className="breadcrumb-item active">{selectedPlaylist.name}</span>
          </>
        )}
      </div>

      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>{selectedPlaylist ? selectedPlaylist.name : 'Playlists'}</h1>
          <p>{selectedPlaylist ? selectedPlaylist.description : 'Group multiple image/video banners into playlists and schedule active loops.'}</p>
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
            selectedPlaylist ? (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-secondary" onClick={() => setSelectedPlaylistId(null)}>
                  <ChevronLeft size={16} />
                  <span>Back to Playlists</span>
                </button>
                <button className="btn btn-primary" onClick={() => handleOpenEdit(selectedPlaylist)}>
                  <Edit size={16} />
                  <span>Edit Playlist</span>
                </button>
              </div>
            ) : (
              <button className="btn btn-primary" onClick={handleOpenAdd}>
                <Plus size={16} />
                <span>Add Playlist</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Page States */}
      {isError ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', border: '1px solid var(--color-error)', maxWidth: '480px', margin: '24px auto' }}>
          <AlertTriangle size={36} style={{ color: 'var(--color-error)' }} />
          <h3>Unable to load playlist catalogs</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
            We encountered a query sync timeout error.
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
      ) : !selectedPlaylist ? (
        /* PLAYLISTS LIST WORKSPACE */
        playlists.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '56px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', maxWidth: '480px', margin: '32px auto' }}>
            <ListMusic size={36} style={{ color: 'var(--color-text-muted)' }} />
            <h3>No playlists configured yet</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', maxWidth: '340px' }}>
              Playlists allow grouping promotional graphics and scheduling sequences for display TVs.
            </p>
            <button className="btn btn-primary" onClick={handleOpenAdd}>
              <Plus size={16} />
              <span>Create First Playlist</span>
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
                    placeholder="Search playlists by name..." 
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
              data={filteredPlaylists}
              onEdit={handleOpenEdit}
              onDelete={(playlist) => setConfirmDeleteTarget(playlist)}
              searchQuery={searchQuery}
              searchField="name"
              filters={activeFilters}
              keyField="id"
              onRowClick={(playlist) => setSelectedPlaylistId(playlist.id)}
            />
          </>
        )
      ) : (
        /* PLAYLIST DETAIL WORKSPACE (READ-ONLY VIEW) */
        <div>
          {/* Info Card Banner */}
          <div className="card" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className={`badge badge-${selectedPlaylist.status.toLowerCase()}`}>{selectedPlaylist.status}</span>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Last updated: {new Date(selectedPlaylist.updatedAt).toLocaleDateString()}</span>
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, marginTop: '8px' }}>{selectedPlaylist.name}</h2>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>{selectedPlaylist.description || 'No description provided.'}</p>
            </div>
            <button className="btn btn-outline" onClick={() => handleOpenEdit(selectedPlaylist)}>
              <Edit size={15} />
              <span>Edit Details & Banners</span>
            </button>
          </div>

          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Playlist Sequence & Schedules</h3>

          {selectedPlaylist.banners.length === 0 ? (
            /* Empty Playlist Banners visual */
            <div className="card" style={{ textAlign: 'center', padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <ImageIcon size={32} style={{ color: 'var(--color-text-muted)' }} />
              <h4 style={{ fontSize: '15px', fontWeight: 600 }}>No banners inside this playlist</h4>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '12px', maxWidth: '360px' }}>
                This playlist has no promotional banner components. Edit this playlist to link graphics from your library.
              </p>
            </div>
          ) : (
            /* Playlist contents sequence list (Read Only) */
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px', textAlign: 'center' }}>Order</th>
                    <th style={{ width: '80px' }}>Preview</th>
                    <th>Banner Name</th>
                    <th>Type</th>
                    <th>Duration</th>
                    <th>Schedule Details</th>
                    <th style={{ width: '120px', textAlign: 'center' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPlaylist.banners.map((item, idx) => {
                    const bannerRecord = banners.find(b => b.id === item.bannerId) || {};
                    const scheduleStatus = getBannerScheduleStatus(item);
                    return (
                      <tr key={item.bannerId}>
                        <td style={{ textAlign: 'center', fontWeight: 600 }}>{item.displayOrder}</td>
                        <td>
                          <div style={{ width: '50px', height: '30px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--color-border)', backgroundColor: '#f8fafc' }}>
                            {bannerRecord.mediaType === 'Video' ? (
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-primary)' }}>
                                <Film size={12} />
                              </div>
                            ) : (
                              <img src={bannerRecord.mediaUrl} alt="prev" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            )}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 500 }}>{bannerRecord.name || 'Unknown Banner'}</div>
                        </td>
                        <td>{bannerRecord.mediaType || 'Image'}</td>
                        <td>{bannerRecord.mediaType === 'Video' ? 'Auto' : `${bannerRecord.duration || 10}s`}</td>
                        <td>
                          <div style={{ fontSize: '11px' }}>
                            {item.scheduleType === 'Continuous' ? (
                              <span>Continuous (Start: <strong>{item.startDate}</strong>)</span>
                            ) : (
                              <span>Range: <strong>{item.startDate} {item.startTime}</strong> to <strong>{item.endDate} {item.endTime}</strong></span>
                            )}
                          </div>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span className={`badge ${getScheduleBadgeClass(scheduleStatus)}`}>
                            {scheduleStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Playlist Dialog Modal (With inline Banners configuration list) */}
      {formOpen && (
        <div className="modal-overlay">
          <div className="modal-container size-lg" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            <div className="modal-header">
              <h3>{editTarget ? 'Edit Playlist Info' : 'Create Playlist'}</h3>
              <button onClick={() => setFormOpen(false)} className="modal-close-btn">
                <X size={16} />
              </button>
            </div>
            
            <div className="modal-body" style={{ overflowY: 'auto', flex: 1, padding: '24px' }}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Playlist Name <span className="required">*</span></label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} 
                  className={`form-control ${errors.name ? 'error' : ''}`}
                  placeholder="e.g. Main Entrance Promo Loop"
                />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Description</label>
                <textarea 
                  value={formData.description} 
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} 
                  className="form-control"
                  style={{ height: '70px', padding: '8px 12px', resize: 'vertical' }}
                  placeholder="Provide context about where and when this playlist displays."
                />
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">Playlist Status</label>
                <select 
                  value={formData.status} 
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className={`form-control ${errors.status ? 'error' : ''}`}
                >
                  <option value="Inactive">Inactive (Disabled)</option>
                  <option value="Active">Active (Available for Signage)</option>
                </select>
                {errors.status && <span className="form-error">{errors.status}</span>}
              </div>

              {/* Inlined Playlist Banners sequence table as per mockup */}
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 600 }}>Playlist Banners Sequence</h4>
                  <button 
                    type="button" 
                    className="btn btn-outline" 
                    style={{ height: '28px', padding: '0 10px', fontSize: '12px' }}
                    onClick={() => { setBannerPickerOpen(true); setSelectedBannerIds(new Set()); setBannerSearchQuery(''); }}
                  >
                    <Plus size={14} />
                    <span>Add Banner</span>
                  </button>
                </div>

                {!formData.banners || formData.banners.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '32px 16px', border: '1px dashed var(--color-border)', borderRadius: '6px', backgroundColor: '#f8fafc' }}>
                    <ImageIcon size={24} style={{ color: 'var(--color-text-muted)', marginBottom: '8px' }} />
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>No banners added to this playlist yet. Click "+ Add Banner" to select graphics.</p>
                  </div>
                ) : (
                  <div className="table-wrapper" style={{ margin: 0, border: '1px solid var(--color-border)', borderRadius: '6px' }}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th style={{ width: '40px' }}></th>
                          <th style={{ width: '60px', textAlign: 'center' }}>Order</th>
                          <th style={{ width: '80px' }}>Preview</th>
                          <th>Banner Name</th>
                          <th>Schedule Details</th>
                          <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.banners.map((item, idx) => {
                          const bannerRecord = banners.find(b => b.id === item.bannerId) || {};
                          return (
                            <tr 
                              key={item.bannerId}
                              draggable="true"
                              onDragStart={(e) => handleDragStartForm(e, idx)}
                              onDragOver={handleDragOverForm}
                              onDrop={(e) => handleDropForm(e, idx)}
                              style={{ 
                                opacity: draggedIndex === idx ? 0.4 : 1,
                                cursor: 'grab',
                                backgroundColor: draggedIndex === idx ? '#f1f5f9' : 'transparent'
                              }}
                            >
                              <td style={{ textAlign: 'center', color: 'var(--color-text-muted)', cursor: 'grab' }}>
                                <GripVertical size={14} style={{ opacity: 0.5 }} />
                              </td>
                              <td style={{ textAlign: 'center', fontWeight: 600 }}>{item.displayOrder}</td>
                              <td>
                                <div style={{ width: '45px', height: '26px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--color-border)', backgroundColor: '#f8fafc' }}>
                                  {bannerRecord.mediaType === 'Video' ? (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-primary)' }}>
                                      <Film size={10} />
                                    </div>
                                  ) : (
                                    <img src={bannerRecord.mediaUrl} alt="prev" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  )}
                                </div>
                              </td>
                              <td>
                                <div style={{ fontWeight: 500, fontSize: '13px' }}>{bannerRecord.name || 'Unknown Banner'}</div>
                              </td>
                              <td style={{ fontSize: '11px' }}>
                                {item.scheduleType === 'Continuous' ? (
                                  <span>Continuous</span>
                                ) : (
                                  <span>{item.startDate} {item.startTime} to {item.endDate} {item.endTime}</span>
                                )}
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                  <button 
                                    type="button"
                                    onClick={() => handleOpenScheduleEdit(item)}
                                    className="btn btn-outline" 
                                    style={{ height: '24px', padding: '0 8px', fontSize: '11px' }}
                                  >
                                    Schedule
                                  </button>
                                  <button 
                                    type="button"
                                    onClick={() => handleRemoveBannerFromForm(item.bannerId)}
                                    className="btn btn-outline" 
                                    style={{ height: '24px', padding: '0 6px', borderColor: 'var(--color-error)' }}
                                  >
                                    <Trash2 size={12} style={{ color: 'var(--color-error)' }} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
                <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} />
                  <span>Drag rows by the handles to rearrange display sequence inside the form.</span>
                </div>
              </div>

            </div>
            
            <div className="modal-footer" style={{ borderTop: '1px solid var(--color-border)' }}>
              <button onClick={() => setFormOpen(false)} className="btn btn-secondary">Cancel</button>
              <button onClick={handleSavePlaylist} className="btn btn-primary">Save Playlist</button>
            </div>
          </div>
        </div>
      )}

      {/* Banner Picker Checklist Modal (Linking banners to playlist) */}
      {bannerPickerOpen && (
        <div className="modal-overlay">
          <div className="modal-container size-md">
            <div className="modal-header">
              <h3>Select Banners</h3>
              <button onClick={() => setBannerPickerOpen(false)} className="modal-close-btn">
                <X size={16} />
              </button>
            </div>
            
            {/* Search filter inside modal */}
            <div style={{ padding: '16px 24px 8px 24px', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', color: 'var(--color-text-muted)' }} />
                <input 
                  type="text" 
                  value={bannerSearchQuery}
                  onChange={(e) => setBannerSearchQuery(e.target.value)}
                  placeholder="Search existing banner files..."
                  className="form-control"
                  style={{ height: '32px', paddingLeft: '32px', fontSize: '12px' }}
                />
              </div>
            </div>

            <div className="modal-body" style={{ maxHeight: '50vh', overflowY: 'auto', padding: '16px 24px' }}>
              {banners.filter(b => b.status === 'Active').length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <AlertCircle size={24} style={{ color: 'var(--color-text-muted)' }} />
                  <p style={{ marginTop: '8px', fontSize: '13px' }}>No active banners available in your catalog. Please configure banners first.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {banners
                    .filter(b => b.status === 'Active')
                    .filter(b => b.name.toLowerCase().includes(bannerSearchQuery.toLowerCase()))
                    .map(b => {
                      const isAlreadyAdded = formData.banners.some(item => item.bannerId === b.id);
                      const isChecked = selectedBannerIds.has(b.id) || isAlreadyAdded;
                      return (
                        <div 
                          key={b.id} 
                          onClick={() => !isAlreadyAdded && handleToggleBannerSelection(b.id)}
                          style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            padding: '10px', 
                            border: '1px solid var(--color-border)', 
                            borderRadius: '6px', 
                            backgroundColor: isAlreadyAdded ? '#f8fafc' : '#ffffff',
                            cursor: isAlreadyAdded ? 'default' : 'pointer'
                          }}
                        >
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <input 
                              type="checkbox" 
                              checked={isChecked} 
                              disabled={isAlreadyAdded}
                              onChange={() => {}} // handled by row onClick
                              style={{ cursor: isAlreadyAdded ? 'default' : 'pointer' }}
                            />
                            <div style={{ width: '50px', height: '30px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                              <img src={b.mediaUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div>
                              <div style={{ fontWeight: 500, fontSize: '13px' }}>{b.name}</div>
                              <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Format: {b.mediaType}</div>
                            </div>
                          </div>
                          {isAlreadyAdded && <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Linked</span>}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button onClick={() => setBannerPickerOpen(false)} className="btn btn-outline">Cancel</button>
              <button 
                onClick={handleAddSelectedBanners} 
                className="btn btn-primary"
                disabled={selectedBannerIds.size === 0}
              >
                Add Selected ({selectedBannerIds.size})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Banner Schedule Modal */}
      {scheduleModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container size-sm">
            <div className="modal-header">
              <h3>Configure Playback Schedule</h3>
              <button onClick={() => setScheduleModalOpen(false)} className="modal-close-btn">
                <X size={16} />
              </button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-grid" style={{ gridTemplateColumns: '1.2fr 0.8fr', gap: '8px' }}>
                <div className="form-group">
                  <label className="form-label">Start Date <span className="required">*</span></label>
                  <input 
                    type="date" 
                    value={scheduleForm.startDate} 
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, startDate: e.target.value }))}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Start Time</label>
                  <input 
                    type="time" 
                    value={scheduleForm.startTime} 
                    onChange={(e) => setScheduleForm(prev => ({ ...prev, startTime: e.target.value }))}
                    className="form-control"
                  />
                </div>
              </div>

              {/* No End Date checkbox check */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0' }}>
                <input 
                  type="checkbox" 
                  id="no-end-date-check"
                  checked={scheduleForm.noEndDate} 
                  onChange={(e) => setScheduleForm(prev => ({ ...prev, noEndDate: e.target.checked }))}
                  style={{ cursor: 'pointer' }}
                />
                <label htmlFor="no-end-date-check" style={{ fontSize: '13px', fontWeight: 500, cursor: 'pointer', userSelect: 'none' }}>
                  No End Date (Run Indefinitely)
                </label>
              </div>

              {!scheduleForm.noEndDate && (
                <div className="form-grid" style={{ gridTemplateColumns: '1.2fr 0.8fr', gap: '8px' }}>
                  <div className="form-group">
                    <label className="form-label">End Date <span className="required">*</span></label>
                    <input 
                      type="date" 
                      value={scheduleForm.endDate} 
                      onChange={(e) => setScheduleForm(prev => ({ ...prev, endDate: e.target.value }))}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Time</label>
                    <input 
                      type="time" 
                      value={scheduleForm.endTime} 
                      onChange={(e) => setScheduleForm(prev => ({ ...prev, endTime: e.target.value }))}
                      className="form-control"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button onClick={() => setScheduleModalOpen(false)} className="btn btn-outline">Cancel</button>
              <button onClick={handleSaveSchedule} className="btn btn-primary">Save Schedule</button>
            </div>
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
                <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Delete Playlist</h3>
              </div>
              <button onClick={() => setConfirmDeleteTarget(null)} className="modal-close-btn">
                <X size={16} />
              </button>
            </div>
            <div className="modal-body" style={{ padding: '0 24px 16px 24px' }}>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                Are you sure you want to permanently delete playlist <strong>{confirmDeleteTarget.name}</strong>? 
                Banners inside this playlist will not be deleted from the system library.
              </p>
            </div>
            <div className="modal-footer" style={{ borderTop: 'none', padding: '16px 24px' }}>
              <button onClick={() => setConfirmDeleteTarget(null)} className="btn btn-secondary">Cancel</button>
              <button onClick={handleDeleteConfirm} className="btn btn-danger">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Playlist Filter modal */}
      {filterOpen && (
        <div className="modal-overlay">
          <div className="modal-container size-sm">
            <div className="modal-header">
              <h3>Filter Playlists</h3>
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
                <label className="form-label">Schedule Status</label>
                <select 
                  value={activeFilters.scheduleStatus} 
                  onChange={(e) => setActiveFilters(prev => ({ ...prev, scheduleStatus: e.target.value }))}
                  className="form-control"
                >
                  <option value="">All Schedule Statuses</option>
                  <option value="Running">Running</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Expired">Expired</option>
                  <option value="No End Date">No End Date (Continuous)</option>
                </select>
              </div>
            </div>
            <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
              <button onClick={() => { setActiveFilters({ status: '', scheduleStatus: '' }); setFilterOpen(false); }} className="btn btn-secondary">
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

export default Playlists;
