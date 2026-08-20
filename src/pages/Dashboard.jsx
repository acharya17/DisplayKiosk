import React from 'react';
import { useApp } from '../context/AppContext';
import { ChevronRight, Monitor, Image, ListMusic, Tv } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Dashboard = () => {
  const { tvs, playlists, banners, business } = useApp();

  const totalBanners = banners.length;
  const activeBanners = banners.filter(b => b.status === 'Active').length;

  const totalPlaylists = playlists.length;
  const activePlaylists = playlists.filter(p => p.status === 'Active').length;

  const totalTVs = tvs.length;
  const onlineTVs = tvs.filter(t => t.connectionStatus === 'Online').length;
  const offlineTVs = tvs.filter(t => t.connectionStatus === 'Offline').length;

  const kpis = [
    { title: "Total Banners", value: totalBanners, change: `${activeBanners} Active Banners`, icon: Image, theme: 'primary' },
    { title: "Playlists Configured", value: totalPlaylists, change: `${activePlaylists} Active Playlists`, icon: ListMusic, theme: 'success' },
    { title: "TVs Online", value: onlineTVs, change: `Out of ${totalTVs} Registered`, icon: Tv, theme: 'info' },
    { title: "TVs Offline", value: offlineTVs, change: "Requires Inspection", icon: Monitor, theme: offlineTVs > 0 ? 'danger' : 'neutral' }
  ];

  const getThemeColors = (theme) => {
    switch (theme) {
      case 'primary':
        return { bg: 'var(--color-primary-light)', text: 'var(--color-primary)' };
      case 'success':
        return { bg: 'var(--color-success-light)', text: 'var(--color-success)' };
      case 'info':
        return { bg: 'var(--color-info-light)', text: 'var(--color-info)' };
      case 'danger':
        return { bg: 'var(--color-error-light)', text: 'var(--color-error)' };
      default:
        return { bg: '#f1f5f9', text: 'var(--color-text-secondary)' };
    }
  };

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="breadcrumb">
        <span>Dashboard</span>
        <ChevronRight size={12} className="breadcrumb-separator" />
        <span className="breadcrumb-item active">Overview</span>
      </div>

      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Welcome to {business.name || 'Spice Junction'} Admin Portal</h1>
          <p>Centralized monitoring of your digital display playlists and connected signage displays.</p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          const colors = getThemeColors(kpi.theme);
          return (
            <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--color-text-secondary)', fontSize: '13px' }}>
                <span>{kpi.title}</span>
                <div style={{
                  padding: '6px',
                  borderRadius: '6px',
                  backgroundColor: colors.bg,
                  color: colors.text
                }}>
                  <Icon size={16} />
                </div>
              </div>
              <span style={{ fontSize: '24px', fontWeight: 600 }}>{kpi.value}</span>
              <span style={{ fontSize: '11px', color: kpi.theme === 'danger' ? 'var(--color-error)' : 'var(--color-text-muted)', fontWeight: 500 }}>
                {kpi.change}
              </span>
            </div>
          );
        })}
      </div>

      {/* Main Dashboard Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
        
        {/* Left Widget: Current Hardware Status */}
        <div className="card">
          <h2 style={{ fontSize: '15px', fontWeight: 600, borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', marginBottom: '16px' }}>
            Connected Display Status
          </h2>
          {totalTVs === 0 ? (
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>No registered displays found in catalog database.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {tvs.map(tv => (
                <div key={tv.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: '6px' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13px' }}>{tv.name} ({tv.tvId})</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Last Seen: {new Date(tv.lastSeen).toLocaleString()}</div>
                  </div>
                  <span className={`badge ${tv.connectionStatus === 'Online' ? 'badge-active' : 'badge-inactive'}`}>
                    {tv.connectionStatus}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Widget: Quick Operations Shortcuts */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', marginBottom: '16px' }}>
            Quick Shortcuts
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
            <NavLink to="/banners" className="btn btn-outline" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              Manage Banners
            </NavLink>
            <NavLink to="/playlists" className="btn btn-outline" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              Manage Playlists
            </NavLink>
            <NavLink to="/devices" className="btn btn-primary" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              TV / Device Settings
            </NavLink>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
