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
  const [unsavedModalOpen, setUnsavedModalOpen] = useState(false);

  // Form State
  const initialTVForm = {
    name: '',
    tvId: '',
    branchId: '',
    groupId: '',
    playlistId: '',
    status: 'Active',
    schedules: []
  };
  const [formData, setFormData] = useState(initialTVForm);
  const [errors, setErrors] = useState({});
  const [draftSlot, setDraftSlot] = useState({
    startTime: '09:00',
    endTime: '10:00',
    scheduleType: 'Daily',
    startDate: '',
    endDate: '',
    playlistIds: []
  });
  const [slotErrors, setSlotErrors] = useState({});

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
      ...initialTVForm,
      branchId: branches[0]?.id || 'br-1',
      tvId: 'TV-' + Math.random().toString(36).substr(2, 6).toUpperCase()
    });
    setDraftSlot({
      startTime: '09:00',
      endTime: '10:00',
      scheduleType: 'Daily',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      playlistIds: []
    });
    setErrors({});
    setSlotErrors({});
    setViewState('add');
  };

  const handleOpenEdit = (tv) => {
    setFormData({ 
      ...tv,
      schedules: tv.schedules || []
    });
    setDraftSlot({
      startTime: '09:00',
      endTime: '10:00',
      scheduleType: 'Daily',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      playlistIds: []
    });
    setErrors({});
    setSlotErrors({});
    setViewState('edit');
  };

  const handleRowClick = (tv) => {
    setSelectedTVId(tv.id);
    setViewState('detail');
  };

  const validateTV = () => {
    const tempErrors = {};
    if (!formData.name?.trim()) tempErrors.name = 'TV Display Name is required';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const validateDraftSlot = () => {
    const tempErrors = {};
    if (!draftSlot.startTime) tempErrors.startTime = 'Start Time is required';
    if (!draftSlot.endTime) tempErrors.endTime = 'End Time is required';
    if (draftSlot.startTime && draftSlot.endTime && draftSlot.startTime >= draftSlot.endTime) {
      tempErrors.endTime = 'End time must be after start time';
    }
    if (!draftSlot.playlistIds || draftSlot.playlistIds.length === 0) {
      tempErrors.playlistIds = 'At least one playlist must be selected';
    }
    if (draftSlot.scheduleType === 'Date Range') {
      if (!draftSlot.startDate) tempErrors.startDate = 'Start date is required';
      if (!draftSlot.endDate) tempErrors.endDate = 'End date is required';
      if (draftSlot.startDate && draftSlot.endDate && draftSlot.startDate > draftSlot.endDate) {
        tempErrors.endDate = 'End date must be after start date';
      }
    }

    if (!tempErrors.startTime && !tempErrors.endTime) {
      const convertToMinutes = (timeStr) => {
        const [h, m] = timeStr.split(':').map(Number);
        return h * 60 + m;
      };
      const newStart = convertToMinutes(draftSlot.startTime);
      const newEnd = convertToMinutes(draftSlot.endTime);

      const hasOverlap = (formData.schedules || []).some(s => {
        const scheduleDatesOverlap = () => {
          if (draftSlot.scheduleType === 'Daily' || s.scheduleType === 'Daily') return true;
          return (draftSlot.startDate <= s.endDate && s.startDate <= draftSlot.endDate);
        };

        if (scheduleDatesOverlap()) {
          const sStart = convertToMinutes(s.startTime);
          const sEnd = convertToMinutes(s.endTime);
          return (newStart < sEnd && sStart < newEnd);
        }
        return false;
      });

      if (hasOverlap) {
        tempErrors.conflict = 'Time slot conflicts or overlaps with an existing slot.';
      }
    }

    setSlotErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleAddSlotClick = () => {
    if (!validateDraftSlot()) return;
    const newSlot = {
      id: `slot-${Date.now()}`,
      ...draftSlot
    };
    setFormData(prev => ({
      ...prev,
      schedules: [...(prev.schedules || []), newSlot]
    }));
    setDraftSlot(prev => ({
      ...prev,
      playlistIds: []
    }));
    setSlotErrors({});
  };

  const handleDeleteSlot = (index) => {
    setFormData(prev => ({
      ...prev,
      schedules: prev.schedules.filter((_, i) => i !== index)
    }));
  };

  const handleEditSlot = (index) => {
    const target = formData.schedules[index];
    setDraftSlot({
      startTime: target.startTime || '09:00',
      endTime: target.endTime || '10:00',
      scheduleType: target.scheduleType || 'Daily',
      startDate: target.startDate || '',
      endDate: target.endDate || '',
      playlistIds: target.playlistIds || (target.playlistId ? [target.playlistId] : [])
    });
    handleDeleteSlot(index);
  };

  const hasUnsavedChanges = () => {
    if (viewState === 'add') {
      return (
        formData.name !== '' ||
        formData.tvId !== '' ||
        formData.branchId !== '' ||
        formData.groupId !== '' ||
        formData.playlistId !== '' ||
        formData.schedules?.length > 0
      );
    }
    if (viewState === 'edit') {
      const original = tvs.find(t => t.id === formData.id);
      if (!original) return false;
      return (
        formData.name !== original.name ||
        formData.tvId !== original.tvId ||
        formData.branchId !== original.branchId ||
        formData.groupId !== original.groupId ||
        formData.playlistId !== original.playlistId ||
        formData.status !== original.status ||
        JSON.stringify(formData.schedules || []) !== JSON.stringify(original.schedules || [])
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

  const handleSaveTV = () => {
    if (!validateTV()) return false;

    if (viewState === 'edit') {
      const success = editTV(formData.id, formData);
      if (success) {
        setViewState('list');
        return true;
      }
    } else {
      const newTVId = addTV(formData);
      if (newTVId) {
        setSelectedTVId(newTVId);
        setViewState('detail'); // Proceed to Display Configuration naturally
        return true;
      }
    }
    return false;
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

  const handleAddTimeSlot = () => {
    setFormData(prev => ({
      ...prev,
      schedules: [
        ...(prev.schedules || []),
        { id: `slot-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`, startTime: '08:00', endTime: '12:00', playlistId: '' }
      ]
    }));
  };

  const handleRemoveTimeSlot = (index) => {
    setFormData(prev => {
      const nextSchedules = [...(prev.schedules || [])];
      nextSchedules.splice(index, 1);
      return { ...prev, schedules: nextSchedules };
    });
  };

  const handleUpdateSlot = (index, field, value) => {
    setFormData(prev => {
      const nextSchedules = [...(prev.schedules || [])];
      nextSchedules[index] = { ...nextSchedules[index], [field]: value };
      return { ...prev, schedules: nextSchedules };
    });
  };

  // Rule 11 Calculation: Priority Playlist Assignment Resolution
  const getPlaylistAssignment = (tvRecord) => {
    // Priority 0: Active Schedule Slot (match current local time)
    if (tvRecord.schedules && tvRecord.schedules.length > 0) {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const convertToMinutes = (timeStr) => {
        const [h, m] = timeStr.split(':').map(Number);
        return h * 60 + m;
      };

      const matchingSlot = tvRecord.schedules.find(slot => {
        const start = convertToMinutes(slot.startTime);
        const end = convertToMinutes(slot.endTime);
        const matchesTime = currentMinutes >= start && currentMinutes <= end;
        if (!matchesTime) return false;

        if (slot.scheduleType === 'Date Range') {
          const todayStr = now.toISOString().split('T')[0];
          return todayStr >= slot.startDate && todayStr <= slot.endDate;
        }
        return true;
      });

      if (matchingSlot) {
        const ids = matchingSlot.playlistIds || (matchingSlot.playlistId ? [matchingSlot.playlistId] : []);
        const names = ids.map(id => playlists.find(p => p.id === id)?.name).filter(Boolean);
        if (names.length > 0) {
          return {
            type: `Scheduled Loop (${matchingSlot.startTime}–${matchingSlot.endTime})`,
            playlistName: names.join(', '),
            playlistId: ids[0]
          };
        }
      }
    }

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
    { field: 'name', header: 'TV Name', sortable: true },
    { field: 'slotTime', header: 'Time', sortable: true },
    { field: 'slotSchedule', header: 'Schedule', sortable: true },
    { 
      field: 'slotPlaylists', 
      header: 'Playlist(s)',
      render: (_, row) => {
        const ids = row.slotPlaylists || [];
        const playlistNames = ids.map(id => playlists.find(p => p.id === id)?.name).filter(Boolean);
        if (playlistNames.length === 0) {
          return <span style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>Standby Fallback</span>;
        }
        const firstTwo = playlistNames.slice(0, 2);
        const countRemaining = playlistNames.length - firstTwo.length;
        return (
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
            {firstTwo.map(name => (
              <span key={name} className="badge badge-active" style={{ fontSize: '11px', padding: '2px 6px', backgroundColor: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1' }}>
                {name}
              </span>
            ))}
            {countRemaining > 0 && (
              <span className="badge" style={{ fontSize: '10px', padding: '2px 5px', backgroundColor: '#e2e8f0', color: '#475569', fontWeight: 600 }}>
                +{countRemaining}
              </span>
            )}
          </div>
        );
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
              setTVStatus(row.originalTV?.id || row.id, val === 'Active' ? 'Inactive' : 'Active');
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

  const flattenedTVs = [];
  filteredTVs.forEach(tv => {
    if (tv.schedules && tv.schedules.length > 0) {
      tv.schedules.forEach(slot => {
        flattenedTVs.push({
          ...tv,
          id: `${tv.id}-${slot.id}`,
          originalTV: tv,
          slotTime: `${slot.startTime} – ${slot.endTime}`,
          slotSchedule: slot.scheduleType === 'Date Range' ? `${slot.startDate} – ${slot.endDate}` : 'Daily',
          slotPlaylists: slot.playlistIds || (slot.playlistId ? [slot.playlistId] : [])
        });
      });
    } else {
      flattenedTVs.push({
        ...tv,
        originalTV: tv,
        slotTime: 'All Day',
        slotSchedule: 'Daily',
        slotPlaylists: tv.playlistId ? [tv.playlistId] : []
      });
    }
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
        <span className="breadcrumb-item active" style={{ cursor: viewState !== 'list' ? 'pointer' : 'default' }} onClick={handleBack}>
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
                <h1>TVs & Displays</h1>
                <p>Register physical displays, group screens, and centrally push playlist schedules.</p>
              </>
            )}
            {viewState === 'add' && (
              <>
                <h1 style={{ margin: 0 }}>Register TV</h1>
                <p style={{ margin: 0 }}>Connect a new physical display screen.</p>
              </>
            )}
            {viewState === 'edit' && (
              <>
                <h1 style={{ margin: 0 }}>Configure TV</h1>
                <p style={{ margin: 0 }}>Configure schedule slots and active loop playlists.</p>
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
                  <span>Configure TV</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-primary" onClick={handleSaveTV}>Save Configuration</button>
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
              data={flattenedTVs}
              onEdit={(row) => handleOpenEdit(row.originalTV || row)}
              onDelete={(row) => setConfirmDeleteTarget(row.originalTV || row)}
              searchQuery={searchQuery}
              searchField="name"
              filters={activeFilters}
              keyField="id"
              onRowClick={(row) => handleRowClick(row.originalTV || row)}
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

            {selectedTV.schedules && selectedTV.schedules.length > 0 && (
              <div style={{ marginTop: '8px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Configured Recurring Time Slots</h4>
                <div className="table-wrapper" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                  <table className="data-table" style={{ fontSize: '12px' }}>
                    <thead>
                      <tr>
                        <th>Time Period</th>
                        <th>Assigned Playlist</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedTV.schedules.map((slot, idx) => {
                        const pl = playlists.find(p => p.id === slot.playlistId);
                        return (
                          <tr key={slot.id || idx}>
                            <td style={{ padding: '6px 12px' }}>{slot.startTime} – {slot.endTime}</td>
                            <td style={{ padding: '6px 12px', fontWeight: 500 }}>{pl ? pl.name : 'Unknown Playlist'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
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
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px', alignItems: 'start' }}>
          {/* Column 1: TV Core Details & Draft Schedule Slot */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* TV Screen Info */}
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>TV Core Properties</h3>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">TV Display Name <span className="required">*</span></label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Dining Hall TV"
                  className={`form-control ${errors.name ? 'error' : ''}`}
                  style={{ height: '34px' }}
                />
                {errors.name && <span className="form-error">{errors.name}</span>}
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '6px' }}>
                  Hardware Identifier Code: <strong>{formData.tvId}</strong> (Auto-assigned)
                </div>
              </div>
            </div>

            {/* Add Display Schedule (Time First, then Playlist) */}
            <div className="card" style={{ padding: '16px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>Add Display Schedule</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* 1. Time selection */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Start Time</label>
                    <input 
                      type="time" 
                      value={draftSlot.startTime} 
                      onChange={(e) => setDraftSlot(prev => ({ ...prev, startTime: e.target.value }))}
                      className="form-control"
                      style={{ height: '34px' }}
                    />
                    {slotErrors.startTime && <span className="form-error">{slotErrors.startTime}</span>}
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">End Time</label>
                    <input 
                      type="time" 
                      value={draftSlot.endTime} 
                      onChange={(e) => setDraftSlot(prev => ({ ...prev, endTime: e.target.value }))}
                      className="form-control"
                      style={{ height: '34px' }}
                    />
                    {slotErrors.endTime && <span className="form-error">{slotErrors.endTime}</span>}
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Schedule Type</label>
                    <select
                      value={draftSlot.scheduleType}
                      onChange={(e) => setDraftSlot(prev => ({ ...prev, scheduleType: e.target.value }))}
                      className="form-control"
                      style={{ height: '34px' }}
                    >
                      <option value="Daily">Daily recurring</option>
                      <option value="Date Range">Date Range limit</option>
                    </select>
                  </div>
                </div>

                {/* 2. Date Range parameters (Optional) */}
                {draftSlot.scheduleType === 'Date Range' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', backgroundColor: '#f8fafc', padding: '10px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '11px' }}>From Date</label>
                      <input 
                        type="date" 
                        value={draftSlot.startDate} 
                        onChange={(e) => setDraftSlot(prev => ({ ...prev, startDate: e.target.value }))}
                        className="form-control"
                        style={{ height: '32px', fontSize: '12px' }}
                      />
                      {slotErrors.startDate && <span className="form-error">{slotErrors.startDate}</span>}
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '11px' }}>To Date</label>
                      <input 
                        type="date" 
                        value={draftSlot.endDate} 
                        onChange={(e) => setDraftSlot(prev => ({ ...prev, endDate: e.target.value }))}
                        className="form-control"
                        style={{ height: '32px', fontSize: '12px' }}
                      />
                      {slotErrors.endDate && <span className="form-error">{slotErrors.endDate}</span>}
                    </div>
                  </div>
                )}

                {/* 3. Playlists checklist */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Select Playlists (Multiple allowed)</label>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
                    gap: '8px', 
                    border: '1px solid var(--color-border)', 
                    borderRadius: '6px', 
                    padding: '10px', 
                    maxHeight: '110px', 
                    overflowY: 'auto', 
                    backgroundColor: '#ffffff' 
                  }}>
                    {playlists.filter(p => p.status === 'Active').map(p => {
                      const isChecked = draftSlot.playlistIds.includes(p.id);
                      return (
                        <label key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer', margin: 0 }}>
                          <input 
                            type="checkbox" 
                            checked={isChecked}
                            onChange={() => {
                              setDraftSlot(prev => {
                                const next = [...prev.playlistIds];
                                const idx = next.indexOf(p.id);
                                if (idx > -1) next.splice(idx, 1);
                                else next.push(p.id);
                                return { ...prev, playlistIds: next };
                              });
                            }}
                          />
                          <span>{p.name}</span>
                        </label>
                      );
                    })}
                  </div>
                  {slotErrors.playlistIds && <span className="form-error" style={{ display: 'block', marginTop: '4px' }}>{slotErrors.playlistIds}</span>}
                </div>

                {slotErrors.conflict && (
                  <div style={{ color: 'var(--color-error)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                    <AlertTriangle size={12} /> {slotErrors.conflict}
                  </div>
                )}

                <button 
                  type="button" 
                  onClick={handleAddSlotClick} 
                  className="btn btn-outline"
                  style={{ height: '34px', alignSelf: 'start', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}
                >
                  <Plus size={14} /> Add Time Slot
                </button>
              </div>
            </div>
          </div>

          {/* Column 2: Configured schedules table */}
          <div className="card" style={{ padding: '16px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>Configured Schedule</h3>
            
            {(!formData.schedules || formData.schedules.length === 0) ? (
              <div style={{ padding: '36px 12px', textAlign: 'center', color: 'var(--color-text-secondary)', border: '1.5px dashed var(--color-border)', borderRadius: '6px' }}>
                <Clock size={28} style={{ color: 'var(--color-text-muted)', marginBottom: '8px' }} />
                <div style={{ fontSize: '12px' }}>No time slots configured. Displays will play standalone overrides or standby fallback loop.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {formData.schedules.map((slot, idx) => {
                  const names = slot.playlistIds.map(id => playlists.find(p => p.id === id)?.name).filter(Boolean).join(', ');
                  return (
                    <div 
                      key={slot.id || idx}
                      style={{
                        padding: '10px 12px',
                        border: '1px solid var(--color-border)',
                        borderRadius: '6px',
                        backgroundColor: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px'
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '12px' }}>
                          {slot.startTime} – {slot.endTime}
                          <span style={{ 
                            fontSize: '9px', 
                            color: 'var(--color-primary)', 
                            backgroundColor: '#f0fdf4', 
                            border: '1px solid #dcfce7', 
                            padding: '1px 4px', 
                            borderRadius: '3px', 
                            marginLeft: '8px',
                            fontWeight: 500 
                          }}>
                            {slot.scheduleType}
                            {slot.scheduleType === 'Date Range' && ` (${slot.startDate} to ${slot.endDate})`}
                          </span>
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} title={names}>
                          Playlists: <strong>{names || 'None selected'}</strong>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button 
                          type="button" 
                          onClick={() => handleEditSlot(idx)} 
                          className="btn btn-outline" 
                          style={{ height: '24px', width: '24px', padding: 0 }}
                          title="Edit slot"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => handleDeleteSlot(idx)} 
                          className="btn btn-outline" 
                          style={{ height: '24px', width: '24px', padding: 0, borderColor: 'var(--color-error)' }}
                          title="Remove slot"
                        >
                          <Trash2 size={12} style={{ color: 'var(--color-error)' }} />
                        </button>
                      </div>
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
                  const success = handleSaveTV();
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

export default Devices;
