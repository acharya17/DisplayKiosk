import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ChevronRight, Plus, Search, Filter, AlertTriangle, X, 
  Tv, Monitor, CheckCircle, HelpCircle, Power, Clock, Edit2, Trash2, 
  ChevronLeft, AlertCircle, RefreshCw, ServerCrash
} from 'lucide-react';
import DataTable from '../components/table/DataTable';

const Devices = () => {
  const { 
    tvs, 
    branches, 
    groups, 
    playlists, 
    addTV, 
    editTV, 
    deleteTV, 
    setTVStatus
  } = useApp();

  // Layout View States
  const [viewState, setViewState] = useState('list'); // 'list' | 'add' | 'edit' | 'detail'
  const [selectedTVId, setSelectedTVId] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({ branchId: '', status: '', groupId: '', assignmentStatus: '' });
  const [filterOpen, setFilterOpen] = useState(false);

  // Loading / Error simulation states
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Modals Open States
  const [confirmDeleteTarget, setConfirmDeleteTarget] = useState(null);

  // Form State
  const initialTVForm = {
    name: '',
    tvId: '',
    branchId: '',
    groupId: '',
    playlistId: '', // Optional priority override
    status: 'Active'
  };
  const [formData, setFormData] = useState(initialTVForm);
  const [errors, setErrors] = useState({});

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
    setFormData(initialTVForm);
    setErrors({});
    setViewState('add');
  };

  const handleOpenEdit = (tv) => {
    setFormData({ ...tv });
    setErrors({});
    setViewState('edit');
  };

  const handleRowClick = (tv) => {
    setSelectedTVId(tv.id);
    setViewState('detail');
  };

  const validateTV = () => {
    const tempErrors = {};
    if (!formData.name?.trim()) tempErrors.name = 'TV Display Name is required';
    
    // Rule 2: TV ID must be unique
    if (!formData.tvId?.trim()) {
      tempErrors.tvId = 'TV Identifier Code is required';
    } else {
      const match = tvs.find(t => t.tvId.toLowerCase() === formData.tvId.trim().toLowerCase());
      if (match && match.id !== formData.id) {
        tempErrors.tvId = 'TV ID code must be unique (already registered)';
      }
    }

    // Rule 4: Every TV must belong to a branch
    if (!formData.branchId) {
      tempErrors.branchId = 'Branch allocation is required';
    } else {
      // Rule 4 constraint: Inactive branches should not receive new TV assignments
      const targetBranch = branches.find(b => b.id === formData.branchId);
      if (targetBranch && targetBranch.status === 'Inactive' && viewState !== 'edit') {
        tempErrors.branchId = 'TVs cannot be allocated to inactive branch networks';
      }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSaveTV = () => {
    if (!validateTV()) return;

    if (viewState === 'edit') {
      const success = editTV(formData.id, formData);
      if (success) setViewState('list');
    } else {
      const success = addTV(formData);
      if (success) setViewState('list');
    }
  };

  const handleDeleteConfirm = () => {
    if (confirmDeleteTarget) {
      deleteTV(confirmDeleteTarget.id);
      setConfirmDeleteTarget(null);
      if (selectedTVId === confirmDeleteTarget.id) {
        setViewState('list');
      }
    }
  };

  // Rule 11 Calculation: Priority Playlist Assignment Resolution
  const getPlaylistAssignment = (tvRecord) => {
    // Priority 1: Individual Override
    if (tvRecord.playlistId) {
      const pl = playlists.find(p => p.id === tvRecord.playlistId);
      return {
        type: 'Individual Override',
        playlistName: pl ? pl.name : 'Unresolved Playlist',
        playlistId: tvRecord.playlistId
      };
    }

    // Priority 2: Inherited from Display Group
    if (tvRecord.groupId) {
      const gp = groups.find(g => g.id === tvRecord.groupId);
      if (gp && gp.playlistId) {
        const pl = playlists.find(p => p.id === gp.playlistId);
        return {
          type: 'Inherited from Group',
          playlistName: pl ? pl.name : 'Unresolved Playlist',
          playlistId: gp.playlistId,
          groupName: gp.name
        };
      }
    }

    return {
      type: 'None',
      playlistName: 'None (Standby fallback)',
      playlistId: ''
    };
  };

  const getConnectionBadgeClass = (status) => {
    switch (status) {
      case 'Online': return 'badge-active';
      case 'Offline': return 'badge-inactive';
      default: return 'badge-inactive';
    }
  };

  // Columns for datatable list view
  const columns = [
    { field: 'tvId', header: 'TV ID', sortable: true },
    { field: 'name', header: 'TV Name', sortable: true },
    { 
      field: 'branchId', 
      header: 'Branch Location',
      sortable: true,
      render: (val) => branches.find(b => b.id === val)?.name || 'Unknown'
    },
    { 
      field: 'groupId', 
      header: 'Display Group',
      render: (val) => groups.find(g => g.id === val)?.name || <span style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>None</span>
    },
    { 
      field: 'playlistId', 
      header: 'Playlist Config',
      render: (_, row) => {
        const resolution = getPlaylistAssignment(row);
        return (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 500 }}>{resolution.playlistName}</span>
            <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>{resolution.type}</span>
          </div>
        );
      }
    },
    { 
      field: 'connectionStatus', 
      header: 'Connection', 
      sortable: true,
      render: (val) => (
        <span className={`badge ${getConnectionBadgeClass(val)}`}>
          {val}
        </span>
      )
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
              setTVStatus(row.id, val === 'Active' ? 'Inactive' : 'Active');
            }}
          />
          <span className="switch-slider"></span>
        </label>
      )
    }
  ];

  // Filters calculation
  const filteredTVs = tvs.filter(tv => {
    const branch = branches.find(b => b.id === tv.branchId) || {};
    
    // Search
    const searchLower = searchQuery.toLowerCase();
    if (searchQuery) {
      const matchName = tv.name?.toLowerCase().includes(searchLower);
      const matchId = tv.tvId?.toLowerCase().includes(searchLower);
      const matchBranch = branch.name?.toLowerCase().includes(searchLower);
      if (!matchName && !matchId && !matchBranch) return false;
    }

    // Branch filter
    if (activeFilters.branchId && tv.branchId !== activeFilters.branchId) return false;
    // Status filter
    if (activeFilters.status && tv.status !== activeFilters.status) return false;
    // Display Group filter
    if (activeFilters.groupId && tv.groupId !== activeFilters.groupId) return false;
    // Assignment status filter
    if (activeFilters.assignmentStatus) {
      const assign = getPlaylistAssignment(tv);
      const isAssigned = assign.type !== 'None';
      if (activeFilters.assignmentStatus === 'Assigned' && !isAssigned) return false;
      if (activeFilters.assignmentStatus === 'Unassigned' && isAssigned) return false;
    }

    return true;
  });

  const activeFiltersCount = Object.values(activeFilters).filter(Boolean).length;
  const selectedTV = tvs.find(t => t.id === selectedTVId);
  const resolvedPlaylist = selectedTV ? getPlaylistAssignment(selectedTV) : null;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span>TV Display</span>
        <ChevronRight size={12} className="breadcrumb-separator" />
        <span className="breadcrumb-item active" style={{ cursor: viewState !== 'list' ? 'pointer' : 'default' }} onClick={() => setViewState('list')}>
          TVs / Devices
        </span>
        {viewState === 'add' && (
          <>
            <ChevronRight size={12} className="breadcrumb-separator" />
            <span className="breadcrumb-item active">Add TV</span>
          </>
        )}
        {viewState === 'edit' && (
          <>
            <ChevronRight size={12} className="breadcrumb-separator" />
            <span className="breadcrumb-item active">Edit TV</span>
          </>
        )}
        {viewState === 'detail' && selectedTV && (
          <>
            <ChevronRight size={12} className="breadcrumb-separator" />
            <span className="breadcrumb-item active">{selectedTV.tvId}</span>
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
                <h1>TVs & Displays</h1>
                <p>Register physical displays, group screens, and centrally push playlist schedules.</p>
              </>
            )}
            {viewState === 'add' && (
              <>
                <h1 style={{ margin: 0 }}>Add TV</h1>
                <p style={{ margin: 0 }}>Register a new physical TV display screen.</p>
              </>
            )}
            {viewState === 'edit' && (
              <>
                <h1 style={{ margin: 0 }}>Edit TV Settings</h1>
                <p style={{ margin: 0 }}>Configure hardware variables and layout overrides.</p>
              </>
            )}
            {viewState === 'detail' && selectedTV && (
              <>
                <h1 style={{ margin: 0 }}>{selectedTV.name}</h1>
                <p style={{ margin: 0 }}>Physical Display Panel Code: {selectedTV.tvId}</p>
              </>
            )}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>

          {!isError && (
            viewState === 'list' ? (
              <button className="btn btn-primary" onClick={handleOpenAdd}>
                <Plus size={16} />
                <span>Add TV</span>
              </button>
            ) : viewState === 'detail' ? (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-secondary" onClick={() => setViewState('list')}>
                  <ChevronLeft size={16} />
                  <span>Back to TVs</span>
                </button>
                <button 
                  className="btn btn-outline" 
                  onClick={() => window.open(`#/player/${selectedTV.tvId}`, '_blank')}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Play size={14} />
                  <span>Launch Player</span>
                </button>
                <button className="btn btn-primary" onClick={() => handleOpenEdit(selectedTV)}>
                  <Edit2 size={15} />
                  <span>Edit TV</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-secondary" onClick={() => setViewState('list')}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSaveTV}>Save TV Screen</button>
              </div>
            )
          )}
        </div>
      </div>

      {/* Page States */}
      {isError ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', border: '1px solid var(--color-error)', maxWidth: '480px', margin: '24px auto' }}>
          <AlertTriangle size={36} style={{ color: 'var(--color-error)' }} />
          <h3>Unable to fetch registered screens</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
            We encountered a network sync failure.
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
        tvs.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '56px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', maxWidth: '480px', margin: '32px auto' }}>
            <Tv size={36} style={{ color: 'var(--color-text-muted)' }} />
            <h3>No display hardware registered</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', maxWidth: '340px' }}>
              Register physical TVs deployed across your branch network locations to push playlists.
            </p>
            <button className="btn btn-primary" onClick={handleOpenAdd}>
              <Plus size={16} />
              <span>Register First TV</span>
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
                    placeholder="Search by TV ID, Name, or Branch..." 
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
              data={filteredTVs}
              onEdit={handleOpenEdit}
              onDelete={(tv) => setConfirmDeleteTarget(tv)}
              searchQuery={searchQuery}
              searchField="name"
              filters={activeFilters}
              keyField="id"
              onRowClick={handleRowClick}
            />
          </>
        )
      ) : viewState === 'detail' && selectedTV ? (
        /* DETAIL VIEW SUB-PAGE */
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px', alignItems: 'start' }}>
          {/* Left panel: Connection telemetry */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600 }}>Active Screen Telemetry</h3>
            
            <div style={{ display: 'flex', gap: '20px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Status Badge</span>
                <span className={`badge badge-${selectedTV.status.toLowerCase()}`}>{selectedTV.status}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Connection Pulse</span>
                <span className={`badge ${selectedTV.connectionStatus === 'Online' ? 'badge-active' : 'badge-inactive'}`}>
                  {selectedTV.connectionStatus}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Last Heartbeat</span>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>{new Date(selectedTV.lastSeen).toLocaleTimeString()}</span>
              </div>
            </div>

            <div style={{ marginTop: '8px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Calculated Playlist Priority Resolution</h4>
              <div style={{ padding: '12px', border: '1px solid var(--color-border)', borderRadius: '6px', backgroundColor: '#f8fafc' }}>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Priority Mode</div>
                <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-primary)', marginTop: '2px' }}>{resolvedPlaylist.type}</div>
                
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '8px' }}>Active Loop Output</div>
                <div style={{ fontWeight: 500, fontSize: '13px', marginTop: '2px' }}>{resolvedPlaylist.playlistName}</div>
              </div>
            </div>
          </div>

          {/* Right panel: Attributes grid */}
          <div className="card">
            <h3 style={{ fontSize: '14px', fontWeight: 600, borderBottom: '1px solid var(--color-border)', paddingBottom: '8px', marginBottom: '12px' }}>Device Properties</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>TV Display Name</div>
                <div style={{ fontWeight: 500, fontSize: '13px' }}>{selectedTV.name}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>TV ID Code</div>
                <div style={{ fontWeight: 500, fontSize: '13px' }}>{selectedTV.tvId}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Allocated Branch</div>
                <div style={{ fontWeight: 500, fontSize: '13px' }}>
                  {branches.find(b => b.id === selectedTV.branchId)?.name || 'Unresolved branch'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Display Network Group</div>
                <div style={{ fontWeight: 500, fontSize: '13px' }}>
                  {groups.find(g => g.id === selectedTV.groupId)?.name || 'None (Isolated Screen)'}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ADD / EDIT SUB-PAGE FORM */
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '24px', alignItems: 'start' }}>
          {/* Card 1: TV Settings (Left Panel) */}
          <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>TV Screen Settings</h3>
            
            <div className="form-group">
              <label className="form-label">TV Display Name <span className="required">*</span></label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Udupi Cashier Screen"
                className={`form-control ${errors.name ? 'error' : ''}`}
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">TV ID Code (Unique Identifier) <span className="required">*</span></label>
              <input 
                type="text" 
                value={formData.tvId} 
                onChange={(e) => setFormData(prev => ({ ...prev, tvId: e.target.value }))}
                placeholder="e.g. TV-UDUPI-02"
                className={`form-control ${errors.tvId ? 'error' : ''}`}
              />
              {errors.tvId && <span className="form-error">{errors.tvId}</span>}
            </div>

            {/* Status switch toggle */}
            <div style={{ backgroundColor: '#f8fafc', padding: '12px 16px', borderRadius: '6px', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '12px' }}>Device Status</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                  {formData.status === 'Active' ? 'Active & loops signages' : 'Inactive / offline'}
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

          {/* Card 2: Branch & Group Allocation (Right Panel) */}
          <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>Network Allocation</h3>

            <div className="form-group">
              <label className="form-label">Allocated Branch <span className="required">*</span></label>
              <select 
                value={formData.branchId} 
                onChange={(e) => setFormData(prev => ({ ...prev, branchId: e.target.value }))}
                className={`form-control ${errors.branchId ? 'error' : ''}`}
              >
                <option value="">Select Branch</option>
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.name} ({b.status})</option>
                ))}
              </select>
              {errors.branchId && <span className="form-error">{errors.branchId}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Display Network Group</label>
              <select 
                value={formData.groupId} 
                onChange={(e) => setFormData(prev => ({ ...prev, groupId: e.target.value }))}
                className="form-control"
              >
                <option value="">None (Standalone)</option>
                {groups.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Playlist Override (Priority 1)</label>
              <select 
                value={formData.playlistId} 
                onChange={(e) => setFormData(prev => ({ ...prev, playlistId: e.target.value }))}
                className="form-control"
              >
                <option value="">No Override (Inherit Group Loop)</option>
                {playlists.filter(p => p.status === 'Active').map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
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
                <h3 style={{ fontSize: '15px', fontWeight: 600 }}>De-register TV Screen</h3>
              </div>
              <button onClick={() => setConfirmDeleteTarget(null)} className="modal-close-btn">
                <X size={16} />
              </button>
            </div>
            <div className="modal-body" style={{ padding: '0 24px 16px 24px' }}>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                Are you sure you want to permanently de-register TV Screen <strong>{confirmDeleteTarget.name}</strong> ({confirmDeleteTarget.tvId})? 
                This action cancels active digital signage playbacks.
              </p>
            </div>
            <div className="modal-footer" style={{ borderTop: 'none', padding: '16px 24px' }}>
              <button onClick={() => setConfirmDeleteTarget(null)} className="btn btn-secondary">Cancel</button>
              <button onClick={handleDeleteConfirm} className="btn btn-danger">Delete Screen</button>
            </div>
          </div>
        </div>
      )}

      {/* Filters Modal Dialog */}
      {filterOpen && (
        <div className="modal-overlay">
          <div className="modal-container size-sm">
            <div className="modal-header">
              <h3>Filter Display TVs</h3>
              <button onClick={() => setFilterOpen(false)} className="modal-close-btn">
                <X size={16} />
              </button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Branch Location</label>
                <select 
                  value={activeFilters.branchId} 
                  onChange={(e) => setActiveFilters(prev => ({ ...prev, branchId: e.target.value }))}
                  className="form-control"
                >
                  <option value="">All Branches</option>
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Connection Status</label>
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
                <label className="form-label">Display Group</label>
                <select 
                  value={activeFilters.groupId} 
                  onChange={(e) => setActiveFilters(prev => ({ ...prev, groupId: e.target.value }))}
                  className="form-control"
                >
                  <option value="">All Groups</option>
                  {groups.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Playlist Assignment</label>
                <select 
                  value={activeFilters.assignmentStatus} 
                  onChange={(e) => setActiveFilters(prev => ({ ...prev, assignmentStatus: e.target.value }))}
                  className="form-control"
                >
                  <option value="">All Configurations</option>
                  <option value="Assigned">Assigned Playlists</option>
                  <option value="Unassigned">Unassigned Screens</option>
                </select>
              </div>
            </div>
            <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
              <button onClick={() => { setActiveFilters({ branchId: '', status: '', groupId: '', assignmentStatus: '' }); setFilterOpen(false); }} className="btn btn-secondary">
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

export default Devices;
