import React from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronRight, Sparkles, Clock, AlertCircle } from 'lucide-react';

const PlaceholderPage = () => {
  const location = useLocation();
  
  // Format pathname to clean page title
  const rawPath = location.pathname.substring(1);
  const pageTitle = rawPath.charAt(0).toUpperCase() + rawPath.slice(1);

  return (
    <div>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span>TV Display</span>
        <ChevronRight size={12} className="breadcrumb-separator" />
        <span className="breadcrumb-item active">{pageTitle}</span>
      </div>

      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>{pageTitle}</h1>
          <p>Upcoming system module workspace.</p>
        </div>
      </div>

      {/* Placeholder content card */}
      <div className="card" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 24px',
        textAlign: 'center',
        backgroundColor: 'var(--color-surface)'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-info-light)',
          color: 'var(--color-info)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px'
        }}>
          <Clock size={28} />
        </div>
        
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
          Upcoming Feature (Phase 2/3)
        </h2>
        
        <p style={{
          fontSize: '13px',
          color: 'var(--color-text-secondary)',
          maxWidth: '420px',
          lineHeight: '1.6',
          marginBottom: '24px'
        }}>
          The "{pageTitle}" module is currently out of scope for Phase 1. It will be implemented in subsequent phases to support media upload, scheduling loops, TV setups, and display metrics.
        </p>

        {/* Dummy Skeleton visual representation of a loader */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          width: '100%',
          maxWidth: '300px',
          opacity: 0.6
        }}>
          <div style={{ height: '14px', backgroundColor: '#e2e8f0', borderRadius: '4px', width: '100%' }}></div>
          <div style={{ height: '14px', backgroundColor: '#e2e8f0', borderRadius: '4px', width: '80%', alignSelf: 'center' }}></div>
          <div style={{ height: '14px', backgroundColor: '#e2e8f0', borderRadius: '4px', width: '60%', alignSelf: 'center' }}></div>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderPage;
