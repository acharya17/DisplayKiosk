import React from 'react';
import { useApp } from '../context/AppContext';
import { ChevronRight, Building, Monitor, Play, Image, Layers, Sparkles } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Dashboard = () => {
  const { branches, business } = useApp();
  const totalBranches = branches.length;
  const activeBranches = branches.filter(b => b.status === 'Active').length;

  const kpis = [
    { title: "Total Branches", value: totalBranches, change: "All Franchises configured", icon: Building },
    { title: "Active Branches", value: activeBranches, change: "Operational locations", icon: Building, success: true },
    { title: "Display Banners", value: "8", change: "Upcoming Phase 2", icon: Image, upcoming: true },
    { title: "Connected TVs", value: "3", change: "Upcoming Phase 4", icon: Monitor, upcoming: true },
  ];

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
          <h1>Welcome to {business.name} portal</h1>
          <p>Centralized monitoring of your digital display playlists and connected signage displays.</p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--color-text-secondary)', fontSize: '13px' }}>
                <span>{kpi.title}</span>
                <div style={{
                  padding: '6px',
                  borderRadius: '6px',
                  backgroundColor: kpi.upcoming ? 'var(--color-info-light)' : kpi.success ? 'var(--color-success-light)' : '#f1f5f9',
                  color: kpi.upcoming ? 'var(--color-info)' : kpi.success ? 'var(--color-success)' : 'var(--color-text-secondary)'
                }}>
                  <Icon size={16} />
                </div>
              </div>
              <span style={{ fontSize: '24px', fontWeight: 600 }}>{kpi.value}</span>
              <span style={{ fontSize: '11px', color: kpi.upcoming ? 'var(--color-info)' : 'var(--color-text-muted)' }}>
                {kpi.change}
              </span>
            </div>
          );
        })}
      </div>

      {/* Main Dashboard Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
        {/* Left Widget: Current Phase Overview */}
        <div className="card">
          <h2 style={{ fontSize: '15px', fontWeight: 600, borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', marginBottom: '16px' }}>
            Phase 1 Deployment Summary
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
              The business & branch relational setup is fully functional. Head office details are initialized for <strong>{business.name}</strong>, linking to Udupi, Mangalore, and Manipal branches.
            </p>
            <div style={{ marginTop: '12px', display: 'flex', gap: '12px' }}>
              <NavLink to="/business" className="btn btn-outline">
                Manage Business Info
              </NavLink>
              <NavLink to="/branches" className="btn btn-primary">
                Manage Branches
              </NavLink>
            </div>
          </div>
        </div>

        {/* Right Widget: Upcoming Phases */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', marginBottom: '16px' }}>
            Signage Roadmap
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ padding: '6px', borderRadius: '4px', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', marginTop: '2px' }}>
                <Image size={15} />
              </div>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 600 }}>Phase 2: Banner Management</h4>
                <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Media uploads, playlists configurations, and sequence orders.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ padding: '6px', borderRadius: '4px', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', marginTop: '2px' }}>
                <Monitor size={15} />
              </div>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 600 }}>Phase 3 & 4: Signage Loops & TVs</h4>
                <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Looping playback engines, TV registrations, and group assignments.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
