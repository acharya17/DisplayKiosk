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
  const [viewState, setViewState] = useState('list'); // 'list' | 'add' | 'edit' | 'detail'
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({ status: '', scheduleStatus: '' });
  const [filterOpen, setFilterOpen] = useState(false);

  // Prototype state controls
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Modal / Dialog Open States
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

  // Banner Schedule Form State
  const [scheduleForm, setScheduleForm] = useState({
    startDate: '',
    startTime: '00:00',
    endDate: '',
    endTime: '23:59',
    noEndDate: true
  });

  // Simulated current date
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
    }

    return 'Running';
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Running': return 'badge-active';
      case 'Upcoming': return 'badge-upcoming';
      case 'Expired': return 'badge-inactive';
      default: return 'badge-inactive';
    }
  };

  const handleOpenAdd = () => {
    setFormData(initialPlaylistForm);
    setErrors({});
    setViewState('add');
  };

  const handleOpenEdit = (playlist) => {
    setFormData({ ...playlist });
    setErrors({});
    setViewState('edit');
  };

  const handleRowClick = (playlist) => {
    setSelectedPlaylistId(playlist.id);
    setViewState('detail');
  };

  const validatePlaylist = () => {
    const tempErrors = {};
    if (!formData.name?.trim()) tempErrors.name = 'Playlist Name is required';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSavePlaylist = () => {
    if (!validatePlaylist()) return;

    if (viewState === 'edit') {
      const success = editPlaylist(formData.id, formData);
      if (success) setViewState('list');
    } else {
      const success = addPlaylist(formData);
      if (success) setViewState('list');
    }
  };

  const handleDeleteConfirm = () => {
    if (confirmDeleteTarget) {
      deletePlaylist(confirmDeleteTarget.id);
      setConfirmDeleteTarget(null);
      if (selectedPlaylistId === confirmDeleteTarget.id) {
        setViewState('list');
      }
    }
  };

  // Banner Ordering operations inside Form
  const moveBannerItem = (index, direction) => {
    const nextList = [...formData.banners];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= nextList.length) return;

    // Swap elements
    const temp = nextList[index];
    nextList[index] = nextList[targetIdx];
    nextList[targetIdx] = temp;

    // Swap orders
    const orderTemp = nextList[index].order;
    nextList[index].order = nextList[targetIdx].order;
    nextList[targetIdx].order = orderTemp;

    setFormData(prev => ({ ...prev, banners: nextList }));
  };

  const removeBannerFromForm = (index) => {
    const nextList = [...formData.banners];
    nextList.splice(index, 1);
    
    // Recalculate sequence orders
    const recalculated = nextList.map((item, idx) => ({
      ...item,
      order: idx + 1
    }));

    setFormData(prev => ({ ...prev, banners: recalculated }));
  };

  // Banner Selection dialog helpers
  const handleOpenBannerPicker = () => {
    const currentIds = new Set(formData.banners.map(b => b.bannerId));
    setSelectedBannerIds(currentIds);
    setBannerSearchQuery('');
    setBannerPickerOpen(true);
  };

  const handleApplyBannerSelection = () => {
    const nextBanners = [];
    let currentIdx = 1;

    // Preserve existing banner configuration data if still selected
    formData.banners.forEach(b => {
      if (selectedBannerIds.has(b.bannerId)) {
        nextBanners.push({
          ...b,
          order: currentIdx++
        });
      }
    });

    // Append newly selected banners
    selectedBannerIds.forEach(id => {
      const exists = nextBanners.some(b => b.bannerId === id);
      if (!exists) {
        const fullBanner = banners.find(b => b.id === id);
        nextBanners.push({
          bannerId: id,
          order: currentIdx++,
          scheduleType: 'Always',
          startDate: new Date().toISOString().split('T')[0],
          startTime: '00:00',
          endDate: '',
          endTime: '23:59',
          noEndDate: true
        });
      }
    });

    setFormData(prev => ({ ...prev, banners: nextBanners }));
    setBannerPickerOpen(false);
  };

  const handleTogglePickerSelection = (id) => {
    setSelectedBannerIds(prev => {
      const nextSet = new Set(prev);
      if (nextSet.has(id)) {
        nextSet.delete(id);
      } else {
        nextSet.add(id);
      }
      return nextSet;
    });
  };

  // Schedule Popup configuration
  const handleOpenScheduleEditor = (bannerConfig) => {
    setSelectedBannerForSchedule(bannerConfig);
    setScheduleForm({
      startDate: bannerConfig.startDate || new Date().toISOString().split('T')[0],
      startTime: bannerConfig.startTime || '00:00',
      endDate: bannerConfig.endDate || '',
      endTime: bannerConfig.endTime || '23:59',
      noEndDate: bannerConfig.scheduleType === 'Always' || bannerConfig.noEndDate
    });
    setScheduleModalOpen(true);
  };

  const handleApplyScheduleConfig = () => {
    if (!selectedBannerForSchedule) return;

    const nextList = formData.banners.map(b => {
      if (b.bannerId === selectedBannerForSchedule.bannerId) {
        return {
          ...b,
          scheduleType: scheduleForm.noEndDate ? 'Always' : 'Scheduled',
          startDate: scheduleForm.startDate,
          startTime: scheduleForm.startTime,
          endDate: scheduleForm.noEndDate ? '' : scheduleForm.endDate,
          endTime: scheduleForm.noEndDate ? '' : scheduleForm.endTime,
          noEndDate: scheduleForm.noEndDate
        };
      }
      return b;
    });

    setFormData(prev => ({ ...prev, banners: nextList }));
    setScheduleModalOpen(false);
    setSelectedBannerForSchedule(null);
  };

  // Columns for data list view
  const columns = [
    { field: 'name', header: 'Playlist Name', sortable: true },
    { field: 'description', header: 'Description' },
    { 
      field: 'banners', 
      header: 'Banners Size', 
      render: (val) => `${val ? val.length : 0} items` 
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
              setPlaylistStatus(row.id, val === 'Active' ? 'Inactive' : 'Active');
            }}
          />
          <span className="switch-slider"></span>
        </label>
      )
    }
  ];

  // Filtering calculation
  const filteredPlaylists = playlists.filter(p => {
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (activeFilters.status && p.status !== activeFilters.status) return false;
    return true;
  });

  const currentSelectedPlaylist = playlists.find(p => p.id === selectedPlaylistId);

  return (
    <div>
      {/* Breadcrumb path navigation */}
      <div className="breadcrumb">
        <span>TV Display</span>
        <ChevronRight size={12} className="breadcrumb-separator" />
        <span className="breadcrumb-item active" style={{ cursor: viewState !== 'list' ? 'pointer' : 'default' }} onClick={() => setViewState('list')}>
          Playlists
        </span>
        {viewState === 'add' && (
          <>
            <ChevronRight size={12} className="breadcrumb-separator" />
            <span className="breadcrumb-item active">Add Playlist</span>
          </>
        )}
        {viewState === 'edit' && (
          <>
            <ChevronRight size={12} className="breadcrumb-separator" />
            <span className="breadcrumb-item active">Edit Playlist</span>
          </>
        )}
        {viewState === 'detail' && currentSelectedPlaylist && (
          <>
            <ChevronRight size={12} className="breadcrumb-separator" />
            <span className="breadcrumb-item active">{currentSelectedPlaylist.name}</span>
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
                <h1>Playlists</h1>
                <p>Organize multiple creative banner assets into scheduled digital loops.</p>
              </>
            )}
            {viewState === 'add' && (
              <>
                <h1 style={{ margin: 0 }}>Create Playlist</h1>
                <p style={{ margin: 0 }}>Configure sequence layout loops.</p>
              </>
            )}
            {viewState === 'edit' && (
              <>
                <h1 style={{ margin: 0 }}>Edit Playlist</h1>
                <p style={{ margin: 0 }}>Configure loops sequence order and schedules.</p>
              </>
            )}
            {viewState === 'detail' && currentSelectedPlaylist && (
              <>
                <h1 style={{ margin: 0 }}>{currentSelectedPlaylist.name}</h1>
                <p style={{ margin: 0 }}>Inspect active display loops schedules and orders.</p>
              </>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>

          {!isError && (
            viewState === 'list' ? (
              <button className="btn btn-primary" onClick={handleOpenAdd}>
                <Plus size={16} />
                <span>Add Playlist</span>
              </button>
            ) : viewState === 'detail' ? (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-secondary" onClick={() => setViewState('list')}>
                  <ChevronLeft size={16} />
                  <span>Back to Playlists</span>
                </button>
                <button className="btn btn-primary" onClick={() => handleOpenEdit(currentSelectedPlaylist)}>
                  <Edit size={15} />
                  <span>Edit Playlist</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-secondary" onClick={() => setViewState('list')}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSavePlaylist}>Save Playlist</button>
              </div>
            )
          )}
        </div>
      </div>

      {/* Page States */}
      {isError ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', border: '1px solid var(--color-error)', maxWidth: '480px', margin: '24px auto' }}>
          <AlertTriangle size={36} style={{ color: 'var(--color-error)' }} />
          <h3>Unable to fetch playlists</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
            We encountered a connection timeout error.
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
        playlists.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '56px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', maxWidth: '480px', margin: '32px auto' }}>
            <ListMusic size={36} style={{ color: 'var(--color-text-muted)' }} />
            <h3>No playlists configured</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', maxWidth: '340px' }}>
              Create loop playlists and define schedule sequences to map your TV screens.
            </p>
            <button className="btn btn-primary" onClick={handleOpenAdd}>
              <Plus size={16} />
              <span>Create Playlist</span>
            </button>
          </div>
        ) : (
          <>
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
                  <span>Filter</span>
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
              onRowClick={handleRowClick}
            />
          </>
        )
      ) : viewState === 'detail' && currentSelectedPlaylist ? (
        /* DETAIL VIEW SUB-PAGE */
        <div>
          {/* Details Overview Banner */}
          <div className="card" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className={`badge badge-${currentSelectedPlaylist.status.toLowerCase()}`}>{currentSelectedPlaylist.status}</span>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Last updated: {new Date(currentSelectedPlaylist.updatedAt || new Date()).toLocaleDateString()}</span>
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, marginTop: '8px' }}>{currentSelectedPlaylist.name}</h2>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>{currentSelectedPlaylist.description || 'No description provided.'}</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'right' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Banners Size</span>
              <span style={{ fontWeight: 600, fontSize: '16px', color: 'var(--color-primary)' }}>
                {currentSelectedPlaylist.banners ? currentSelectedPlaylist.banners.length : 0} items
              </span>
            </div>
          </div>

          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Configured Display Loops Sequence</h3>
          
          {(!currentSelectedPlaylist.banners || currentSelectedPlaylist.banners.length === 0) ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <ImageIcon size={32} style={{ color: 'var(--color-text-muted)' }} />
              <h4 style={{ fontSize: '15px', fontWeight: 600 }}>Playlist is empty</h4>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '12px', maxWidth: '360px' }}>
                There are no active banner schedules assigned inside this playlist. Edit playlist to map assets.
              </p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '80px', textAlign: 'center' }}>Sequence</th>
                    <th style={{ width: '80px' }}>Preview</th>
                    <th>Banner Name</th>
                    <th style={{ width: '120px' }}>Format Type</th>
                    <th>Schedule Period</th>
                    <th style={{ width: '120px', textAlign: 'center' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentSelectedPlaylist.banners.map((item) => {
                    const fullBanner = banners.find(b => b.id === item.bannerId);
                    if (!fullBanner) return null;
                    const schedStatus = getBannerScheduleStatus(item);
                    return (
                      <tr key={item.bannerId}>
                        <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--color-primary)' }}>#{item.order}</td>
                        <td>
                          <div style={{ width: '50px', height: '30px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--color-border)', backgroundColor: '#f1f5f9' }}>
                            {fullBanner.mediaType === 'Video' ? (
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-primary)' }}>
                                <Film size={12} />
                              </div>
                            ) : (
                              <img src={fullBanner.mediaUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            )}
                          </div>
                        </td>
                        <td style={{ fontWeight: 500 }}>{fullBanner.name}</td>
                        <td>{fullBanner.mediaType}</td>
                        <td style={{ fontSize: '12px' }}>
                          {item.scheduleType === 'Always' ? (
                            <span>Always Active (Indefinite)</span>
                          ) : (
                            <span>{item.startDate} to {item.endDate || 'No limit'} ({item.startTime} - {item.endTime})</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span className={`badge ${getStatusBadgeClass(schedStatus)}`}>
                            {schedStatus}
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
      ) : (
        /* ADD / EDIT SUB-PAGE FORM */
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '24px', alignItems: 'start' }}>
          {/* Properties Card (Left Panel) */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>Playlist Information</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
              <div className="form-group">
                <label className="form-label">Playlist Name <span className="required">*</span></label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Counter Signage Grid"
                  className={`form-control ${errors.name ? 'error' : ''}`}
                />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '12px 16px', borderRadius: '6px', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '12px' }}>Playlist Status</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                    {formData.status === 'Active' ? 'Active & looping on TVs' : 'Inactive / paused'}
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
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Description</label>
              <textarea 
                value={formData.description} 
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe where this playlist is intended to show."
                className="form-control"
                style={{ height: '110px', padding: '8px 12px', resize: 'none' }}
              />
            </div>
          </div>

          {/* Sequence Loop list inside form (Right Panel) */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600 }}>Mapped Banners & Timing Loop</h3>
              <button className="btn btn-outline" style={{ height: '32px' }} onClick={handleOpenBannerPicker}>
                <Plus size={14} />
                <span>Configure Banners</span>
              </button>
            </div>

            {formData.banners.length === 0 ? (
              <div style={{ padding: '36px 12px', textAlign: 'center', color: 'var(--color-text-secondary)', border: '1.5px dashed var(--color-border)', borderRadius: '6px' }}>
                <ImageIcon size={28} style={{ color: 'var(--color-text-muted)', marginBottom: '8px' }} />
                <div style={{ fontSize: '12px' }}>No banners selected inside this playlist loop.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {formData.banners.map((item, idx) => {
                  const fullBanner = banners.find(b => b.id === item.bannerId);
                  if (!fullBanner) return null;
                  return (
                    <div 
                      key={item.bannerId}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px 12px',
                        border: '1px solid var(--color-border)',
                        borderRadius: '6px',
                        backgroundColor: '#ffffff'
                      }}
                    >
                      <GripVertical size={16} style={{ color: 'var(--color-text-muted)', marginRight: '8px', cursor: 'grab' }} />
                      
                      <div style={{ width: '48px', height: '28px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--color-border)', marginRight: '12px', backgroundColor: '#f1f5f9' }}>
                        {fullBanner.mediaType === 'Video' ? (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-primary)' }}>
                            <Film size={12} />
                          </div>
                        ) : (
                          <img src={fullBanner.mediaUrl} alt="prev" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500, fontSize: '13px' }}>{fullBanner.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', display: 'flex', gap: '8px', alignItems: 'center', marginTop: '2px' }}>
                          <span>Order #{item.order}</span>
                          <span>•</span>
                          <span 
                            style={{ color: 'var(--color-primary)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '2px' }}
                            onClick={() => handleOpenScheduleEditor(item)}
                          >
                            <Clock size={10} />
                            {item.scheduleType === 'Always' ? 'Always' : 'Scheduled time'}
                          </span>
                        </div>
                      </div>

                      {/* Order sorting icons */}
                      <div style={{ display: 'flex', gap: '4px', marginRight: '12px' }}>
                        <button 
                          type="button" 
                          disabled={idx === 0} 
                          onClick={() => moveBannerItem(idx, -1)} 
                          className="btn btn-outline" 
                          style={{ height: '26px', width: '26px', padding: 0, opacity: idx === 0 ? 0.3 : 1 }}
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button 
                          type="button" 
                          disabled={idx === formData.banners.length - 1} 
                          onClick={() => moveBannerItem(idx, 1)} 
                          className="btn btn-outline" 
                          style={{ height: '26px', width: '26px', padding: 0, opacity: idx === formData.banners.length - 1 ? 0.3 : 1 }}
                        >
                          <ArrowDown size={12} />
                        </button>
                      </div>

                      {/* Remove item */}
                      <button 
                        type="button" 
                        onClick={() => removeBannerFromForm(idx)}
                        className="btn btn-outline" 
                        style={{ height: '26px', width: '26px', padding: 0, borderColor: 'var(--color-error)' }}
                      >
                        <Trash2 size={12} style={{ color: 'var(--color-error)' }} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
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
                Connected TV displays will fallback to default screens.
              </p>
            </div>
            <div className="modal-footer" style={{ borderTop: 'none', padding: '16px 24px' }}>
              <button onClick={() => setConfirmDeleteTarget(null)} className="btn btn-secondary">Cancel</button>
              <button onClick={handleDeleteConfirm} className="btn btn-danger">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Banner checklist popup */}
      {bannerPickerOpen && (
        <div className="modal-overlay">
          <div className="modal-container size-md" style={{ maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
            <div className="modal-header">
              <h3>Map Banners to Playlist</h3>
              <button onClick={() => setBannerPickerOpen(false)} className="modal-close-btn">
                <X size={16} />
              </button>
            </div>
            <div className="modal-body" style={{ overflowY: 'auto', flex: 1, padding: '20px' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <Search size={14} style={{ position: 'absolute', left: '12px', color: 'var(--color-text-muted)', opacity: 0.6 }} />
                <input 
                  type="text" 
                  placeholder="Search banners catalog..." 
                  value={bannerSearchQuery}
                  onChange={(e) => setBannerSearchQuery(e.target.value)}
                  className="form-control"
                  style={{ width: '100%', paddingLeft: '34px', height: '34px' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {banners
                  .filter(b => b.name.toLowerCase().includes(bannerSearchQuery.toLowerCase()))
                  .map(b => {
                    const isChecked = selectedBannerIds.has(b.id);
                    return (
                      <div 
                        key={b.id}
                        onClick={() => handleTogglePickerSelection(b.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '10px',
                          border: '1px solid var(--color-border)',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          backgroundColor: isChecked ? '#f8fafc' : '#ffffff'
                        }}
                      >
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          onChange={() => {}} // handled by parent wrapper onClick
                          style={{ marginRight: '12px', cursor: 'pointer' }}
                        />
                        <div style={{ width: '48px', height: '28px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--color-border)', marginRight: '12px', backgroundColor: '#f1f5f9' }}>
                          {b.mediaType === 'Video' ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-primary)' }}>
                              <Film size={12} />
                            </div>
                          ) : (
                            <img src={b.mediaUrl} alt="prev" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 500, fontSize: '13px' }}>{b.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Format: {b.mediaType}</div>
                        </div>
                        <span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span>
                      </div>
                    );
                  })}
              </div>
            </div>
            <div className="modal-footer" style={{ borderTop: '1px solid var(--color-border)' }}>
              <button onClick={() => setBannerPickerOpen(false)} className="btn btn-secondary">Cancel</button>
              <button onClick={handleApplyBannerSelection} className="btn btn-primary">Apply Banners</button>
            </div>
          </div>
        </div>
      )}

      {/* Scheduling editor popup */}
      {scheduleModalOpen && selectedBannerForSchedule && (
        <div className="modal-overlay">
          <div className="modal-container size-sm">
            <div className="modal-header">
              <h3>Banner Scheduling Limits</h3>
              <button onClick={() => setScheduleModalOpen(false)} className="modal-close-btn">
                <X size={16} />
              </button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input 
                  type="checkbox" 
                  id="noEndDate" 
                  checked={scheduleForm.noEndDate} 
                  onChange={(e) => setScheduleForm(prev => ({ ...prev, noEndDate: e.target.checked }))}
                  style={{ cursor: 'pointer' }}
                />
                <label htmlFor="noEndDate" style={{ fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>Always Active (No expiry dates)</label>
              </div>

              <div className="form-group">
                <label className="form-label">Start Date</label>
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

              {!scheduleForm.noEndDate && (
                <>
                  <div className="form-group">
                    <label className="form-label">End Date</label>
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
                </>
              )}
            </div>
            <div className="modal-footer">
              <button onClick={() => setScheduleModalOpen(false)} className="btn btn-secondary">Cancel</button>
              <button onClick={handleApplyScheduleConfig} className="btn btn-primary">Apply Schedule</button>
            </div>
          </div>
        </div>
      )}

      {/* Filter modal dialog */}
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
            </div>
            <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
              <button onClick={() => { setActiveFilters({ status: '' }); setFilterOpen(false); }} className="btn btn-secondary">
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
