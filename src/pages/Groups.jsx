import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ChevronRight, Plus, Search, Filter, AlertTriangle, X, 
  Layers, Tv, CheckCircle, Clock, Edit2, Trash2, ChevronLeft, 
  AlertCircle, RefreshCw, ServerCrash
} from 'lucide-react';
import DataTable from '../components/table/DataTable';

const Groups = () => {
  const { 
    groups, 
    tvs, 
    playlists, 
    branches, 
    addGroup, 
    editGroup, 
    deleteGroup, 
    editTV,
    setGroupStatus
  } = useApp();

  // Layout View States
  const [viewState, setViewState] = useState('list'); // 'list' | 'add' | 'edit' | 'detail'
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({ status: '' });
  const [filterOpen, setFilterOpen] = useState(false);

  // Loading / Error simulation states
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Modals Open States
  const [confirmDeleteTarget, setConfirmDeleteTarget] = useState(null);

  // Form State
  const initialGroupForm = {
    name: '',
    description: '',
    status: 'Inactive',
    playlistId: '',
    associatedTvIds: [] // tracked in local form draft for TV mapping
  };
  const [formData, setFormData] = useState(initialGroupForm);
  const [errors, setErrors] = useState({});
  const [unsavedModalOpen, setUnsavedModalOpen] = useState(false);

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
    setFormData({
      ...initialGroupForm,
      associatedTvIds: []
    });
    setErrors({});
    setViewState('add');
  };

  const handleOpenEdit = (group) => {
    // Collect currently associated TV IDs
    const linkedTvs = tvs.filter(t => t.groupId === group.id).map(t => t.id);
    setFormData({
      ...group,
      associatedTvIds: linkedTvs
    });
    setErrors({});
    setViewState('edit');
  };

  const handleRowClick = (group) => {
    setSelectedGroupId(group.id);
    setViewState('detail');
  };

  const validateGroup = () => {
    const tempErrors = {};
    if (!formData.name?.trim()) tempErrors.name = 'Group Name is required';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const hasUnsavedChanges = () => {
    if (viewState === 'add') {
      return (
        formData.name !== '' ||
        formData.description !== '' ||
        formData.playlistId !== '' ||
        formData.associatedTvIds?.length > 0
      );
    }
    if (viewState === 'edit') {
      const original = groups.find(g => g.id === formData.id);
      if (!original) return false;
      const linkedTvs = tvs.filter(t => t.groupId === original.id).map(t => t.id);
      return (
        formData.name !== original.name ||
        formData.description !== original.description ||
        formData.playlistId !== original.playlistId ||
        formData.status !== original.status ||
        JSON.stringify(formData.associatedTvIds || []) !== JSON.stringify(linkedTvs)
      );
    }
    return false;
  };

  const handleBack = () => {
    if ((viewState === 'add' || viewState === 'edit') && hasUnsavedChanges()) {
      setUnsavedModalOpen(true);
    } else {
      setViewState('list');
    }
  };

  const handleSaveGroup = () => {
    if (!validateGroup()) return false;

    if (viewState === 'edit') {
      const success = editGroup(formData.id, formData);
      if (success) {
        setViewState('list');
        return true;
      }
    } else {
      const success = addGroup(formData);
      if (success) {
        setViewState('list');
        return true;
      }
    }
    return false;
  };

  const handleDeleteConfirm = () => {
    if (confirmDeleteTarget) {
      deleteGroup(confirmDeleteTarget.id);
      setConfirmDeleteTarget(null);
      if (selectedGroupId === confirmDeleteTarget.id) {
        setViewState('list');
      }
    }
  };

  const handleToggleTvAssociation = (tvId) => {
    setFormData(prev => {
      const nextList = [...prev.associatedTvIds];
      const idx = nextList.indexOf(tvId);
      if (idx > -1) {
        nextList.splice(idx, 1);
      } else {
        nextList.push(tvId);
      }
      return { ...prev, associatedTvIds: nextList };
    });
  };

  const handleRemoveTvFromDetailList = (tvRecord) => {
    // Unlink TV by clearing its groupId
    editTV(tvRecord.id, {
      ...tvRecord,
      groupId: ''
    });
  };

  const selectedGroup = groups.find(g => g.id === selectedGroupId);
  const associatedTVsList = selectedGroup ? tvs.filter(t => t.groupId === selectedGroup.id) : [];

  // Columns for display groups catalog
  const columns = [
    { field: 'name', header: 'Group Name', sortable: true },
    { field: 'description', header: 'Description' },
    { 
      field: 'playlistId', 
      header: 'Assigned Playlist', 
      render: (val) => {
        const pl = playlists.find(p => p.id === val);
        return pl ? pl.name : <span style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>Unassigned</span>;
      }
    },
    { 
      field: 'id', 
      header: 'Connected TVs', 
      render: (val) => {
        const count = tvs.filter(t => t.groupId === val).length;
        return `${count} displays`;
      }
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
              setGroupStatus(row.id, val === 'Active' ? 'Inactive' : 'Active');
            }}
          />
          <span className="switch-slider"></span>
        </label>
      )
    }
  ];

  // Filters calculation
  const filteredGroups = groups.filter(g => {
    if (searchQuery && !g.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (activeFilters.status && g.status !== activeFilters.status) return false;
    return true;
  });

  return (
    <div>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span>TV Display</span>
        <ChevronRight size={12} className="breadcrumb-separator" />
        <span className="breadcrumb-item active" style={{ cursor: viewState !== 'list' ? 'pointer' : 'default' }} onClick={handleBack}>
          Display Groups
        </span>
        {viewState === 'add' && (
          <>
            <ChevronRight size={12} className="breadcrumb-separator" />
            <span className="breadcrumb-item active">Add Group</span>
          </>
        )}
        {viewState === 'edit' && (
          <>
            <ChevronRight size={12} className="breadcrumb-separator" />
            <span className="breadcrumb-item active">Edit Group</span>
          </>
        )}
        {selectedGroup && viewState === 'detail' && (
          <>
            <ChevronRight size={12} className="breadcrumb-separator" />
            <span className="breadcrumb-item active">{selectedGroup.name}</span>
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
          <div className="page-title-group">
            {viewState === 'list' && (
              <>
                <h1>Display Groups</h1>
                <p>Group multiple TV screens together to push centrally controlled layout schedules.</p>
              </>
            )}
            {viewState === 'add' && (
              <>
                <h1 style={{ margin: 0 }}>Create Display Group</h1>
                <p style={{ margin: 0 }}>Map branch displays and assign central signage playlists.</p>
              </>
            )}
            {viewState === 'edit' && (
              <>
                <h1 style={{ margin: 0 }}>Edit Display Group</h1>
                <p style={{ margin: 0 }}>Re-configure group members and active layout schedules.</p>
              </>
            )}
            {selectedGroup && viewState === 'detail' && (
              <>
                <h1 style={{ margin: 0 }}>{selectedGroup.name}</h1>
                <p style={{ margin: 0 }}>{selectedGroup.description || 'Display network loop.'}</p>
              </>
            )}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>

          {!isError && (
            viewState === 'list' ? (
              <button className="btn btn-primary" onClick={handleOpenAdd}>
                <Plus size={16} />
                <span>Add Group</span>
              </button>
            ) : viewState === 'detail' ? (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-secondary" onClick={() => setViewState('list')}>
                  <ChevronLeft size={16} />
                  <span>Back to Groups</span>
                </button>
                <button className="btn btn-primary" onClick={() => handleOpenEdit(selectedGroup)}>
                  <Edit2 size={15} />
                  <span>Edit Group</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-primary" onClick={handleSaveGroup}>Save Display Group</button>
              </div>
            )
          )}
        </div>
      </div>

      {/* Page States */}
      {isError ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', border: '1px solid var(--color-error)', maxWidth: '480px', margin: '24px auto' }}>
          <AlertTriangle size={36} style={{ color: 'var(--color-error)' }} />
          <h3>Unable to fetch display groups</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
            We encountered a sync database timeout error.
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
        /* GROUPS LIST CATALOG */
        groups.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '56px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', maxWidth: '480px', margin: '32px auto' }}>
            <Layers size={36} style={{ color: 'var(--color-text-muted)' }} />
            <h3>No display groups configured</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', maxWidth: '340px' }}>
              Create display groups to assign playlists centrally to multiple branch TV screens at once.
            </p>
            <button className="btn btn-primary" onClick={handleOpenAdd}>
              <Plus size={16} />
              <span>Create First Group</span>
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
                    placeholder="Search groups by name..." 
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
              data={filteredGroups}
              onEdit={handleOpenEdit}
              onDelete={(group) => setConfirmDeleteTarget(group)}
              searchQuery={searchQuery}
              searchField="name"
              filters={activeFilters}
              keyField="id"
              onRowClick={handleRowClick}
            />
          </>
        )
      ) : viewState === 'detail' && selectedGroup ? (
        /* DISPLAY GROUP DETAIL VIEW */
        <div>
          {/* Info Card Banner */}
          <div className="card" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className={`badge badge-${selectedGroup.status.toLowerCase()}`}>{selectedGroup.status}</span>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Last updated: {new Date(selectedGroup.updatedAt).toLocaleDateString()}</span>
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, marginTop: '8px' }}>{selectedGroup.name}</h2>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>{selectedGroup.description || 'No description provided.'}</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'right' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Central Assigned Playlist</span>
              <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-primary)' }}>
                {playlists.find(p => p.id === selectedGroup.playlistId)?.name || 'Unassigned'}
              </span>
            </div>
          </div>

          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Associated TV Displays</h3>

          {associatedTVsList.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <Tv size={32} style={{ color: 'var(--color-text-muted)' }} />
              <h4 style={{ fontSize: '15px', fontWeight: 600 }}>No TVs inside this display group</h4>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '12px', maxWidth: '360px' }}>
                This group has no connected display units. Edit the group to link hardware screens.
              </p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>TV ID</th>
                    <th>TV Name</th>
                    <th>Branch Location</th>
                    <th>Individual Override</th>
                    <th style={{ width: '120px', textAlign: 'center' }}>Connection</th>
                    <th style={{ width: '100px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {associatedTVsList.map((tvItem) => {
                    const tvBranch = branches.find(b => b.id === tvItem.branchId) || {};
                    return (
                      <tr key={tvItem.id}>
                        <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{tvItem.tvId}</td>
                        <td>{tvItem.name}</td>
                        <td>{tvBranch.name || 'Unknown'}</td>
                        <td>
                          {tvItem.playlistId ? (
                            <span>Override Active (Priority 1)</span>
                          ) : (
                            <span style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>None (Inherits Group Playlist)</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span className={`badge ${tvItem.connectionStatus === 'Online' ? 'badge-active' : 'badge-inactive'}`}>
                            {tvItem.connectionStatus}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button 
                            onClick={() => handleRemoveTvFromDetailList(tvItem)}
                            className="btn btn-outline" 
                            style={{ height: '24px', padding: '0 6px', borderColor: 'var(--color-error)' }}
                            title="Unlink TV from Group"
                          >
                            <X size={12} style={{ color: 'var(--color-error)' }} />
                          </button>
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
        <div className="card" style={{ maxWidth: '720px' }}>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label">Display Group Name <span className="required">*</span></label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} 
              className={`form-control ${errors.name ? 'error' : ''}`}
              placeholder="e.g. Entrance Screen Network"
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
              placeholder="Describe where these displays reside."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <div className="form-group">
              <label className="form-label">Assigned Central Playlist</label>
              <select 
                value={formData.playlistId} 
                onChange={(e) => setFormData(prev => ({ ...prev, playlistId: e.target.value }))}
                className="form-control"
              >
                <option value="">None (Unassigned / Standby fallback)</option>
                {playlists.filter(p => p.status === 'Active').map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select 
                value={formData.status} 
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="form-control"
              >
                <option value="Active">Active (Available for Signage)</option>
                <option value="Inactive">Inactive (Disabled)</option>
              </select>
            </div>
          </div>

          {/* TVs checklist mapping inside form */}
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px', marginBottom: '24px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>Map Registered TV Screens to Group</h4>
            
            {tvs.length === 0 ? (
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>No registered TVs found in catalog. Create devices first.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {tvs.map(tv => {
                  const tvBranch = branches.find(b => b.id === tv.branchId) || {};
                  const isChecked = formData.associatedTvIds.includes(tv.id);
                  return (
                    <div 
                      key={tv.id}
                      onClick={() => handleToggleTvAssociation(tv.id)}
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
                        onChange={() => {}} // handled by wrapper onClick
                        style={{ marginRight: '12px', cursor: 'pointer' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500, fontSize: '13px' }}>{tv.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                          TV ID: <strong>{tv.tvId}</strong> • Branch: {tvBranch.name || 'Unknown'}
                        </div>
                      </div>
                      {tv.groupId && tv.groupId !== formData.id && (
                        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                          Currently in: {groups.find(g => g.id === tv.groupId)?.name}
                        </span>
                      )}
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
                <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Delete Display Group</h3>
              </div>
              <button onClick={() => setConfirmDeleteTarget(null)} className="modal-close-btn">
                <X size={16} />
              </button>
            </div>
            <div className="modal-body" style={{ padding: '0 24px 16px 24px' }}>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                Are you sure you want to permanently delete display group <strong>{confirmDeleteTarget.name}</strong>? 
                TV devices belonging to this group will remain registered, but their group link will be removed.
              </p>
            </div>
            <div className="modal-footer" style={{ borderTop: 'none', padding: '16px 24px' }}>
              <button onClick={() => setConfirmDeleteTarget(null)} className="btn btn-secondary">Cancel</button>
              <button onClick={handleDeleteConfirm} className="btn btn-danger">Delete Group</button>
            </div>
          </div>
        </div>
      )}

      {/* Filters Modal Dialog */}
      {filterOpen && (
        <div className="modal-overlay">
          <div className="modal-container size-sm">
            <div className="modal-header">
              <h3>Filter Display Groups</h3>
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
      {/* Unsaved changes warning modal */}
      {unsavedModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container size-sm" style={{ padding: '4px' }}>
            <div className="modal-header" style={{ borderBottom: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-warning)' }}>
                <AlertTriangle size={20} />
                <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Unsaved Changes</h3>
              </div>
              <button onClick={() => setUnsavedModalOpen(false)} className="modal-close-btn">
                <X size={16} />
              </button>
            </div>
            <div className="modal-body" style={{ padding: '0 24px 16px 24px' }}>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                You have unsaved changes. What would you like to do?
              </p>
            </div>
            <div className="modal-footer" style={{ borderTop: 'none', padding: '16px 24px', flexDirection: 'column', gap: '8px', alignItems: 'stretch' }}>
              <button 
                onClick={() => {
                  const success = handleSaveGroup();
                  if (success) {
                    setUnsavedModalOpen(false);
                  }
                }} 
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Save & Go Back
              </button>
              <button 
                onClick={() => {
                  setUnsavedModalOpen(false);
                  setViewState('list');
                }} 
                className="btn btn-secondary"
                style={{ width: '100%' }}
              >
                Go Back Without Saving
              </button>
              <button 
                onClick={() => setUnsavedModalOpen(false)} 
                className="btn btn-outline"
                style={{ width: '100%', borderColor: 'transparent' }}
              >
                Continue Editing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Groups;
