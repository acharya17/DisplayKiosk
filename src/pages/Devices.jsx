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
    setTVStatus,
    showToast
  } = useApp();

  // Navigation State (Detail Workspace)
  const [selectedTVId, setSelectedTVId] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({ branchId: '', status: '', groupId: '', assignmentStatus: '' });
  const [filterOpen, setFilterOpen] = useState(false);

  // Loading / Error simulation states
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Modals Open States
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [confirmDeleteTarget, setConfirmDeleteTarget] = useState(null);

  // TV Register Form State
  const initialTVForm = {
    name: '',
    tvId: '',
    branchId: '',
    groupId: '',
    playlistId: '',
    status: 'Inactive'
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
    setEditTarget(null);
    setFormData(initialTVForm);
    setErrors({});
    setFormOpen(true);
  };

  const handleOpenEdit = (tv) => {
    setEditTarget(tv.id);
    setFormData({ ...tv });
    setErrors({});
    setFormOpen(true);
  };

  const validateTV = () => {
    const tempErrors = {};
    if (!formData.name?.trim()) tempErrors.name = 'TV Name is required';
    if (!formData.tvId?.trim()) tempErrors.tvId = 'TV ID is required';
    if (!formData.branchId) tempErrors.branchId = 'Branch assignment is required';
    
    // Inactive branches should not receive new TV assignments
    if (formData.branchId) {
      const selectedBranch = branches.find(b => b.id === formData.branchId);
      if (selectedBranch && selectedBranch.status === 'Inactive') {
        tempErrors.branchId = 'Selected Branch is inactive. Cannot assign TV to inactive branch.';
      }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSaveTV = () => {
    if (!validateTV()) return;

    if (editTarget) {
      const success = editTV(editTarget, formData);
      if (success) setFormOpen(false);
    } else {
      const success = addTV(formData);
      if (success) setFormOpen(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (confirmDeleteTarget) {
      deleteTV(confirmDeleteTarget.id);
      if (selectedTVId === confirmDeleteTarget.id) {
        setSelectedTVId(null);
      }
      setConfirmDeleteTarget(null);
    }
  };

  const selectedTV = tvs.find(t => t.id === selectedTVId);

  // Helper to determine playlist assignment details (Rule 11 priority resolution)
  const getPlaylistAssignment = (tvRecord) => {
    if (!tvRecord) return { playlistName: 'Unassigned', type: 'None', playlistId: '' };

    // Highest Priority: Individual TV Assignment
    if (tvRecord.playlistId) {
      const pl = playlists.find(p => p.id === tvRecord.playlistId);
      return { 
        playlistName: pl ? pl.name : 'Unknown Playlist', 
        type: 'Individual Override', 
        playlistId: tvRecord.playlistId 
      };
    }

    // Lower Priority: Display Group Assignment
    if (tvRecord.groupId) {
      const groupRecord = groups.find(g => g.id === tvRecord.groupId);
      if (groupRecord && groupRecord.playlistId) {
        const pl = playlists.find(p => p.id === groupRecord.playlistId);
        return { 
          playlistName: pl ? pl.name : 'Unknown Playlist', 
          type: 'Inherited from Group', 
          playlistId: groupRecord.playlistId 
        };
      }
    }

    return { playlistName: 'Unassigned', type: 'None', playlistId: '' };
  };

  const getConnectionBadgeClass = (status) => {
    switch (status) {
      case 'Online':
        return 'badge-active';
      case 'Offline':
        return 'badge-inactive';
      default:
        return 'badge-upcoming';
    }
  };

  // Columns for main grid table
  const columns = [
    { field: 'tvId', header: 'TV ID', sortable: true },
    { field: 'name', header: 'Device Name', sortable: true },
    { 
      field: 'branchId', 
      header: 'Branch', 
      sortable: true,
      render: (val) => {
        const b = branches.find(item => item.id === val);
        return b ? b.name : 'Unknown';
      }
    },
    { 
      field: 'groupId', 
      header: 'Display Group', 
      render: (val) => {
        const g = groups.find(item => item.id === val);
        return g ? g.name : <span style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>None</span>;
      }
    },
    { 
      field: 'id', 
      header: 'Playlist Assignment', 
      render: (val, row) => {
        const assign = getPlaylistAssignment(row);
        return (
          <div>
            <div style={{ fontWeight: assign.type !== 'None' ? 500 : 400 }}>{assign.playlistName}</div>
            {assign.type !== 'None' && (
              <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>{assign.type}</div>
            )}
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
      render: (val) => (
        <span className={`badge badge-${val.toLowerCase()}`}>
          {val}
        </span>
      )
    }
  ];

  // Filters calculation
  const filteredTVs = tvs.filter(tv => {
    const branch = branches.find(b => b.id === tv.branchId) || {};
    const group = groups.find(g => g.id === tv.groupId) || {};
    
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

  return (
    <div>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span>TV Display</span>
        <ChevronRight size={12} className="breadcrumb-separator" />
        <span className="breadcrumb-item active" style={{ cursor: selectedTVId ? 'pointer' : 'default' }} onClick={() => setSelectedTVId(null)}>
          TVs / Devices
        </span>
        {selectedTV && (
          <>
            <ChevronRight size={12} className="breadcrumb-separator" />
            <span className="breadcrumb-item active">{selectedTV.tvId}</span>
          </>
        )}
      </div>

      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>{selectedTV ? selectedTV.name : 'TVs & Displays'}</h1>
          <p>{selectedTV ? `Device Identity: ${selectedTV.tvId}` : 'Register physical displays, group screens, and centrally push playlist schedules.'}</p>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Dev Sim controls */}
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
            selectedTV ? (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-secondary" onClick={() => setSelectedTVId(null)}>
                  <ChevronLeft size={16} />
                  <span>Back to Device List</span>
                </button>
                <button className="btn btn-primary" onClick={() => handleOpenEdit(selectedTV)}>
                  <Edit2 size={15} />
                  <span>Edit Config</span>
                </button>
              </div>
            ) : (
              <button className="btn btn-primary" onClick={handleOpenAdd}>
                <Plus size={16} />
                <span>Register TV</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Page States */}
      {isError ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', border: '1px solid var(--color-error)', maxWidth: '480px', margin: '24px auto' }}>
          <AlertTriangle size={36} style={{ color: 'var(--color-error)' }} />
          <h3>Unable to fetch device registry</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
            We encountered a network timeout connection error.
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
      ) : !selectedTV ? (
        /* DEVICE LIST VIEW */
        tvs.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '56px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', maxWidth: '480px', margin: '32px auto' }}>
            <Tv size={36} style={{ color: 'var(--color-text-muted)' }} />
            <h3>No TVs registered yet</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', maxWidth: '340px' }}>
              Register physical display media hardware with branch locations to configure digital signage play systems.
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
                    placeholder="Search by TV Name, ID, or Branch..." 
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
              onRowClick={(tv) => setSelectedTVId(tv.id)}
            />
          </>
        )
      ) : (
        /* DEVICE DETAIL VIEW WORKSPACE */
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px', alignItems: 'start' }}>
          
          {/* Card 1: Configuration Detail */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, borderBottom: '1px solid var(--color-border)', paddingBottom: '8px', marginBottom: '12px' }}>
                Display Details
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 8px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>TV Name</div>
                  <div style={{ fontWeight: 500, fontSize: '13px' }}>{selectedTV.name}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>TV Unique ID</div>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--color-primary)' }}>{selectedTV.tvId}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Assigned Branch</div>
                  <div style={{ fontWeight: 500, fontSize: '13px' }}>
                    {branches.find(b => b.id === selectedTV.branchId)?.name || 'Unknown Branch'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Display Status</div>
                  <div>
                    <span className={`badge badge-${selectedTV.status.toLowerCase()}`}>
                      {selectedTV.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Playback Assignment Status info */}
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, borderBottom: '1px solid var(--color-border)', paddingBottom: '8px', marginBottom: '12px' }}>
                Active Playlist Assignment
              </h3>
              {(() => {
                const assign = getPlaylistAssignment(selectedTV);
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {assign.type === 'None' ? (
                      <div style={{ padding: '16px', border: '1px dashed var(--color-border)', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f8fafc' }}>
                        <AlertCircle size={18} style={{ color: 'var(--color-text-secondary)' }} />
                        <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>No playlist has been assigned to this TV.</span>
                      </div>
                    ) : (
                      <div style={{ padding: '12px', border: '1px solid var(--color-border)', borderRadius: '6px', backgroundColor: '#f8fafc' }}>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Assigned Target</div>
                        <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '2px' }}>{assign.playlistName}</div>
                        <div style={{ marginTop: '8px', fontSize: '11px', display: 'flex', gap: '16px' }}>
                          <div>
                            <span style={{ color: 'var(--color-text-secondary)' }}>Source Type:</span> <strong>{assign.type}</strong>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Card 2: Network Health Status */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
              Connection Health Monitor
            </h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                backgroundColor: selectedTV.connectionStatus === 'Online' ? '#dcfce7' : '#fee2e2',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: selectedTV.connectionStatus === 'Online' ? 'var(--color-success)' : 'var(--color-error)'
              }}>
                <Power size={20} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>{selectedTV.connectionStatus}</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                  <Clock size={10} />
                  <span>Last Seen: {new Date(selectedTV.lastSeen).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '8px', padding: '12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '11px', color: 'var(--color-text-secondary)', display: 'flex', gap: '6px' }}>
              <HelpCircle size={14} style={{ flexShrink: 0, marginTop: '1px' }} />
              <span>Real-time display heartbeat and sync protocols will be linked in downstream phases.</span>
            </div>
          </div>

        </div>
      )}

      {/* Add / Edit TV Registry Modal */}
      {formOpen && (
        <div className="modal-overlay">
          <div className="modal-container size-md">
            <div className="modal-header">
              <h3>{editTarget ? 'Edit TV Settings' : 'Register TV Device'}</h3>
              <button onClick={() => setFormOpen(false)} className="modal-close-btn">
                <X size={16} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">TV Display Name <span className="required">*</span></label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} 
                  className={`form-control ${errors.name ? 'error' : ''}`}
                  placeholder="e.g. Reception TV Menu Board"
                />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">TV Physical Device ID (Unique Code) <span className="required">*</span></label>
                <input 
                  type="text" 
                  value={formData.tvId} 
                  onChange={(e) => setFormData(prev => ({ ...prev, tvId: e.target.value }))} 
                  className={`form-control ${errors.tvId ? 'error' : ''}`}
                  placeholder="e.g. TV-UDUPI-01"
                />
                {errors.tvId && <span className="form-error">{errors.tvId}</span>}
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Branch Assignment <span className="required">*</span></label>
                <select 
                  value={formData.branchId} 
                  onChange={(e) => setFormData(prev => ({ ...prev, branchId: e.target.value }))}
                  className={`form-control ${errors.branchId ? 'error' : ''}`}
                >
                  <option value="">-- Choose Branch Location --</option>
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name} {b.status === 'Inactive' ? '(Inactive)' : ''}
                    </option>
                  ))}
                </select>
                {errors.branchId && <span className="form-error">{errors.branchId}</span>}
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Display Group Association</label>
                <select 
                  value={formData.groupId} 
                  onChange={(e) => setFormData(prev => ({ ...prev, groupId: e.target.value }))}
                  className="form-control"
                >
                  <option value="">None (Standalone Display)</option>
                  {groups.filter(g => g.status === 'Active').map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Individual Playlist Assignment (Priority Override)</label>
                <select 
                  value={formData.playlistId} 
                  onChange={(e) => setFormData(prev => ({ ...prev, playlistId: e.target.value }))}
                  className="form-control"
                >
                  <option value="">None (Use default fallback / inherit group playlist)</option>
                  {playlists.filter(p => p.status === 'Active').map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Device Status</label>
                <select 
                  value={formData.status} 
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="form-control"
                >
                  <option value="Active">Active (Available for Playback)</option>
                  <option value="Inactive">Inactive (Disabled)</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setFormOpen(false)} className="btn btn-secondary">Cancel</button>
              <button onClick={handleSaveTV} className="btn btn-primary">Save Settings</button>
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
                <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Unregister TV</h3>
              </div>
              <button onClick={() => setConfirmDeleteTarget(null)} className="modal-close-btn">
                <X size={16} />
              </button>
            </div>
            <div className="modal-body" style={{ padding: '0 24px 16px 24px' }}>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                Are you sure you want to permanently unregister TV device <strong>{confirmDeleteTarget.name} ({confirmDeleteTarget.tvId})</strong>? 
                This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer" style={{ borderTop: 'none', padding: '16px 24px' }}>
              <button onClick={() => setConfirmDeleteTarget(null)} className="btn btn-secondary">Cancel</button>
              <button onClick={handleDeleteConfirm} className="btn btn-danger">Unregister</button>
            </div>
          </div>
        </div>
      )}

      {/* Filters Modal Dialog */}
      {filterOpen && (
        <div className="modal-overlay">
          <div className="modal-container size-sm">
            <div className="modal-header">
              <h3>Filter TV Displays</h3>
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
                <label className="form-label">Assignment Status</label>
                <select 
                  value={activeFilters.assignmentStatus} 
                  onChange={(e) => setActiveFilters(prev => ({ ...prev, assignmentStatus: e.target.value }))}
                  className="form-control"
                >
                  <option value="">All Assignments</option>
                  <option value="Assigned">Assigned Playlists</option>
                  <option value="Unassigned">Unassigned (Offline Loop)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Device Status</label>
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
