import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ChevronRight, Search, Filter, X, ChevronLeft, Info, 
  Settings2, Printer, CheckSquare, Square, AlertTriangle, Play, CheckCircle
} from 'lucide-react';
import DataTable from '../components/table/DataTable';

const KioskSettings = () => {
  const { 
    kiosks, editKiosk, hardware, updateHardwareConfig, setHardwareConnection 
  } = useApp();

  const [activeTab, setActiveTab] = useState('settings'); // 'settings' or 'hardware'
  const [viewState, setViewState] = useState('list'); // 'list', 'edit_settings', 'edit_hardware', 'details_hardware'
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedKiosk, setSelectedKiosk] = useState(null);
  const [selectedHardware, setSelectedHardware] = useState(null);
  const [unsavedModalOpen, setUnsavedModalOpen] = useState(false);
  const [pendingBackAction, setPendingBackAction] = useState(null);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [errors, setErrors] = useState({});

  // Forms state
  const [settingsForm, setSettingsForm] = useState({
    inactivityTimeout: 60,
    showTimeoutWarning: true,
    warningDuration: 10
  });

  const [hardwareForm, setHardwareForm] = useState({
    name: '',
    deviceId: '',
    type: '',
    connection: 'Connected',
    configuration: 'Configured',
    kioskId: ''
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setViewState('list');
    setSearchQuery('');
  };

  const handleOpenEditSettings = (kiosk) => {
    setErrors({});
    setSelectedKiosk(kiosk);
    setSettingsForm({
      inactivityTimeout: kiosk.inactivityTimeout !== undefined ? kiosk.inactivityTimeout : 60,
      showTimeoutWarning: kiosk.showTimeoutWarning !== undefined ? kiosk.showTimeoutWarning : true,
      warningDuration: kiosk.warningDuration !== undefined ? kiosk.warningDuration : 10
    });
    setViewState('edit_settings');
  };

  const handleOpenEditHardware = (hw) => {
    setErrors({});
    setSelectedHardware(hw);
    setHardwareForm({
      name: hw.name,
      deviceId: hw.deviceId,
      type: hw.type,
      connection: hw.connection,
      configuration: hw.configuration,
      kioskId: hw.kioskId
    });
    setViewState('edit_hardware');
  };

  const handleBack = () => {
    if (viewState === 'edit_settings' || viewState === 'edit_hardware') {
      // Direct back check
      setViewState('list');
    } else {
      setViewState('list');
    }
  };

  // Save Settings
  const handleSaveSettings = () => {
    const timeoutVal = Number(settingsForm.inactivityTimeout);
    const warningVal = Number(settingsForm.warningDuration);
    const tempErrors = {};

    if (isNaN(timeoutVal) || timeoutVal < 10 || timeoutVal > 300) {
      tempErrors.inactivityTimeout = 'Timeout must be between 10 and 300 seconds.';
    }
    if (settingsForm.showTimeoutWarning) {
      if (isNaN(warningVal) || warningVal < 2 || warningVal >= timeoutVal) {
        tempErrors.warningDuration = 'Warning duration must be at least 2s and less than the inactivity timeout.';
      }
    }

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    editKiosk(selectedKiosk.id, {
      inactivityTimeout: timeoutVal,
      showTimeoutWarning: settingsForm.showTimeoutWarning,
      warningDuration: settingsForm.showTimeoutWarning ? warningVal : 0
    });
    setViewState('list');
  };

  // Save Hardware Config
  const handleSaveHardware = () => {
    const tempErrors = {};
    if (!hardwareForm.name.trim()) tempErrors.name = 'Device name is required.';
    if (!hardwareForm.deviceId.trim()) tempErrors.deviceId = 'Device ID is required.';

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    updateHardwareConfig(selectedHardware.id, hardwareForm);
    setViewState('list');
  };

  // Test Print / Connect Retries
  const handleTestPrint = (hw) => {
    alert(`Initiating Test Signal to print diagnostic token for ${hw.name} (${hw.deviceId})...\nSignal successful! Device buffer flushed.`);
  };

  // Filter lists
  const filteredKiosks = kiosks.filter(k => {
    if (searchQuery) {
      return k.name?.toLowerCase().includes(searchQuery.toLowerCase()) || k.kioskId?.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const filteredHardware = hardware.filter(h => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return h.name?.toLowerCase().includes(q) || h.deviceId?.toLowerCase().includes(q) || h.type?.toLowerCase().includes(q);
    }
    return true;
  });

  // Columns definitions
  const settingsColumns = [
    { field: 'kioskId', header: 'Kiosk ID', render: (val) => <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{val}</span> },
    { field: 'name', header: 'Kiosk Name' },
    { field: 'inactivityTimeout', header: 'Timeout Value', render: (val) => <span>{val !== undefined ? `${val}s` : '60s'}</span> },
    { field: 'showTimeoutWarning', header: 'Timeout Warning', render: (val) => <span>{val ? 'Enabled' : 'Disabled'}</span> },
    { field: 'warningDuration', header: 'Warning Period', render: (val) => <span>{val ? `${val}s` : '—'}</span> },
    { 
      field: 'readiness', 
      header: 'Operational Readiness', 
      render: (_, row) => {
        const isOnline = row.connection === 'Online';
        const configReady = (row.categoriesAvailability?.length > 0 && row.productsAvailability?.length > 0);
        const paymentsReady = (row.payments?.length > 0);
        const overallReady = isOnline && configReady && paymentsReady;

        return (
          <span style={{ 
            fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px',
            backgroundColor: overallReady ? '#dcfce7' : '#fee2e2',
            color: overallReady ? '#15803d' : '#dc2626'
          }}>{overallReady ? 'Operationally Ready' : 'Config Error'}</span>
        );
      }
    }
  ];

  const hardwareColumns = [
    { field: 'deviceId', header: 'Device ID', render: (val) => <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{val}</span> },
    { field: 'name', header: 'Device Name' },
    { field: 'type', header: 'Hardware Type' },
    { 
      field: 'connection', 
      header: 'Connection State', 
      render: (val, row) => (
        <select value={val} onChange={(e) => setHardwareConnection(row.id, e.target.value)} className="form-control" style={{ height: '28px', fontSize: '11px', padding: '0 4px', width: '120px' }}>
          <option value="Connected">Connected</option>
          <option value="Disconnected">Disconnected</option>
          <option value="Error">Error Status</option>
          <option value="Not Configured">Not Configured</option>
        </select>
      )
    },
    { field: 'configuration', header: 'Config Status' },
    { 
      field: 'kioskId', 
      header: 'Linked Kiosk', 
      render: (val) => {
        const k = kiosks.find(item => item.id === val);
        return <span>{k ? k.name : 'Unmapped'}</span>;
      }
    }
  ];

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="breadcrumb">
        <span>Kiosk Admin</span>
        <ChevronRight size={12} className="breadcrumb-separator" />
        <span className="breadcrumb-item active" onClick={handleBack} style={{ cursor: viewState !== 'list' ? 'pointer' : 'default' }}>
          Operational Configuration
        </span>
        {viewState !== 'list' && (
          <>
            <ChevronRight size={12} className="breadcrumb-separator" />
            <span className="breadcrumb-item active">
              {viewState === 'edit_settings' ? 'Configure Timeout' : viewState === 'edit_hardware' ? 'Configure Hardware' : 'Hardware Details'}
            </span>
          </>
        )}
      </div>

      {/* Page Header */}
      <div className="page-header" style={{ alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {viewState !== 'list' && (
            <button onClick={handleBack} className="btn btn-outline" style={{ height: '36px', width: '36px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
              <ChevronLeft size={18} />
            </button>
          )}
          <div>
            <h1 className="page-title" style={{ margin: 0 }}>
              {viewState === 'edit_settings' ? 'Configure Session Timeout' : viewState === 'edit_hardware' ? 'Edit Hardware Config' : 'Operational Configuration'}
            </h1>
            <p className="page-desc" style={{ margin: 0 }}>
              {viewState === 'list' ? 'Manage timeout settings, inactivity session defaults, and peripheral hardware terminals.' : 'Configure parameters mapping session cycles and diagnostic checks.'}
            </p>
          </div>
        </div>
        {viewState !== 'list' && (
          <button className="btn btn-primary" onClick={viewState === 'edit_settings' ? handleSaveSettings : handleSaveHardware}>
            Save Settings
          </button>
        )}
      </div>

      {/* Tabs */}
      {viewState === 'list' && (
        <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', marginBottom: '16px' }}>
          <button 
            onClick={() => handleTabChange('settings')}
            style={{
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 500,
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'settings' ? '2px solid var(--color-primary)' : '2px solid transparent',
              color: activeTab === 'settings' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              cursor: 'pointer'
            }}
          >
            Kiosk Session Settings
          </button>
          <button 
            onClick={() => handleTabChange('hardware')}
            style={{
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 500,
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'hardware' ? '2px solid var(--color-primary)' : '2px solid transparent',
              color: activeTab === 'hardware' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              cursor: 'pointer'
            }}
          >
            Hardware & Terminals
          </button>
        </div>
      )}

      {/* ─── LIST VIEW ─── */}
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
                <input 
                  type="text" 
                  placeholder={activeTab === 'settings' ? 'Search kiosks...' : 'Search hardware name, ID...'} 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  className="form-control" 
                  style={{ width: '100%', paddingLeft: '36px', height: '36px' }} 
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '12px', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}><X size={14} /></button>
                )}
              </div>
            </div>
          </div>
          <DataTable
            columns={activeTab === 'settings' ? settingsColumns : hardwareColumns}
            data={activeTab === 'settings' ? filteredKiosks : filteredHardware}
            onEdit={activeTab === 'settings' ? handleOpenEditSettings : handleOpenEditHardware}
            onView={activeTab === 'hardware' ? handleTestPrint : null}
            searchQuery={searchQuery}
            searchField={activeTab === 'settings' ? 'name' : 'name'}
            keyField="id"
          />
        </>

      /* ─── EDIT SETTINGS ─── */
      ) : viewState === 'edit_settings' && selectedKiosk ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '16px', alignItems: 'start' }}>
          {/* Left Column: Timeout & Warning */}
          <div className="card" style={{ padding: '16px' }}>
            <h3 style={{ fontSize: '12px', fontWeight: 600, marginBottom: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>Inactivity Timeout parameters</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '11px' }}>Inactivity Timeout (seconds) <span className="required">*</span></label>
                <input type="number" value={settingsForm.inactivityTimeout} onChange={(e) => setSettingsForm(prev => ({ ...prev, inactivityTimeout: e.target.value }))} placeholder="e.g. 60" className={`form-control ${errors.inactivityTimeout ? 'error' : ''}`} style={{ height: '32px', fontSize: '12px' }} min="10" max="300" />
                {errors.inactivityTimeout && <span className="form-error">{errors.inactivityTimeout}</span>}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: '4px', cursor: 'pointer', backgroundColor: settingsForm.showTimeoutWarning ? 'var(--color-primary-light)' : '#fff', transition: 'all 0.15s' }} onClick={() => setSettingsForm(prev => ({ ...prev, showTimeoutWarning: !prev.showTimeoutWarning }))}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Settings2 size={14} style={{ color: settingsForm.showTimeoutWarning ? 'var(--color-primary)' : 'var(--color-text-secondary)' }} />
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>Enable Timeout Warning Dialog</span>
                </div>
                <input type="checkbox" checked={settingsForm.showTimeoutWarning} readOnly style={{ accentColor: 'var(--color-primary)', marginLeft: 'auto' }} />
              </div>

              {settingsForm.showTimeoutWarning && (
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '11px' }}>Warning Dialog Duration (seconds) <span className="required">*</span></label>
                  <input type="number" value={settingsForm.warningDuration} onChange={(e) => setSettingsForm(prev => ({ ...prev, warningDuration: e.target.value }))} placeholder="e.g. 10" className={`form-control ${errors.warningDuration ? 'error' : ''}`} style={{ height: '32px', fontSize: '12px' }} min="2" />
                  {errors.warningDuration && <span className="form-error">{errors.warningDuration}</span>}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Readiness checklist */}
          <div className="card" style={{ padding: '16px' }}>
            <h3 style={{ fontSize: '12px', fontWeight: 600, marginBottom: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>Kiosk Readiness checklist</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Kiosk Identity</span>
                <span style={{ fontWeight: 600 }}>{selectedKiosk.kioskId} (Active)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Menu Configuration status</span>
                <span style={{ fontWeight: 500, color: '#15803d' }}>Ready ({selectedKiosk.productsAvailability?.length || 0} Products)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Online Payments mapping</span>
                <span style={{ fontWeight: 500, color: '#15803d' }}>Ready ({selectedKiosk.payments?.join(', ') || 'None'})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', borderTop: '1px solid var(--color-border)', paddingTop: '8px', marginTop: '4px' }}>
                <span style={{ color: 'var(--color-text-main)', fontWeight: 600 }}>Overall Readiness</span>
                <span style={{ color: '#15803d', fontWeight: 700 }}>Ready</span>
              </div>
            </div>
          </div>
        </div>

      /* ─── EDIT HARDWARE ─── */
      ) : viewState === 'edit_hardware' && selectedHardware ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '16px', alignItems: 'start' }}>
          {/* Left Column: Config Parameters */}
          <div className="card" style={{ padding: '16px' }}>
            <h3 style={{ fontSize: '12px', fontWeight: 600, marginBottom: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>Device Configuration</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '11px' }}>Device Label / Name <span className="required">*</span></label>
                <input type="text" value={hardwareForm.name} onChange={(e) => setHardwareForm(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g. Printer Counter 1" className={`form-control ${errors.name ? 'error' : ''}`} style={{ height: '32px', fontSize: '12px' }} />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '11px' }}>Hardware Device ID <span className="required">*</span></label>
                <input type="text" value={hardwareForm.deviceId} onChange={(e) => setHardwareForm(prev => ({ ...prev, deviceId: e.target.value }))} placeholder="e.g. PRN-001" className={`form-control ${errors.deviceId ? 'error' : ''}`} style={{ height: '32px', fontSize: '12px', fontFamily: 'monospace' }} />
                {errors.deviceId && <span className="form-error">{errors.deviceId}</span>}
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '11px' }}>Device Peripheral Type</label>
                <select value={hardwareForm.type} onChange={(e) => setHardwareForm(prev => ({ ...prev, type: e.target.value }))} className="form-control" style={{ height: '32px', fontSize: '12px' }}>
                  <option value="Printer">Receipt Printer</option>
                  <option value="Payment Terminal">Payment card Terminal</option>
                  <option value="Customer Display">Front Customer Display screen</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '11px' }}>Configuration State</label>
                <select value={hardwareForm.configuration} onChange={(e) => setHardwareForm(prev => ({ ...prev, configuration: e.target.value }))} className="form-control" style={{ height: '32px', fontSize: '12px' }}>
                  <option value="Configured">Configured & Flushed</option>
                  <option value="Not Configured">Not Configured</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right Column: Linked kiosk source */}
          <div className="card" style={{ padding: '16px' }}>
            <h3 style={{ fontSize: '12px', fontWeight: 600, marginBottom: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>Linked operational Terminal</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '11px' }}>Operational Kiosk mapping</label>
                <select value={hardwareForm.kioskId} onChange={(e) => setHardwareForm(prev => ({ ...prev, kioskId: e.target.value }))} className="form-control" style={{ height: '32px', fontSize: '12px' }}>
                  <option value="">Unmapped Peripheral</option>
                  {kiosks.map(k => (
                    <option key={k.id} value={k.id}>{k.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <button type="button" className="btn btn-outline" onClick={() => handleTestPrint(selectedHardware)} style={{ height: '32px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Play size={12} /> Send Diagnostic Test print
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* ─── INFO GUIDE ─── */}
      {infoModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ width: '450px' }}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Info size={16} style={{ color: 'var(--color-primary)' }} />
                <span>Session & Timeout Guide</span>
              </h3>
              <button className="modal-close" onClick={() => setInfoModalOpen(false)}><X size={16} /></button>
            </div>
            <div className="modal-body" style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '10px', lineHeight: 1.5 }}>
              <p style={{ margin: 0 }}>Configure kiosk session timers. When the warning threshold expires, the kiosk automatically clears active cart variables and temporary customer contact records.</p>
              <div style={{ backgroundColor: '#f8fafc', padding: '10px 14px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                <span style={{ fontWeight: 600, display: 'block', marginBottom: '4px', fontSize: '11px' }}>Operational Constraints:</span>
                <ul style={{ margin: 0, paddingLeft: '14px', fontSize: '11px', color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li><strong>Inactivity timeout:</strong> Ranges from 10 to 300 seconds.</li>
                  <li><strong>Warning threshold:</strong> Must be lower than the timeout value to pop a reminder modal alert.</li>
                </ul>
              </div>
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

export default KioskSettings;
