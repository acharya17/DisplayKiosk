import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Menu, LogOut, User, HelpCircle, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const { logout, business } = useApp();
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-left">
        <button 
          className="header-menu-btn"
          onClick={() => {
            if (window.innerWidth <= 768) {
              setMobileOpen(!mobileOpen);
            } else {
              setCollapsed(!collapsed);
            }
          }}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-text-secondary)',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px',
            borderRadius: '4px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <Menu size={20} />
        </button>
        
        {/* Business Logo and Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {business.logo && (
            <img 
              src={business.logo} 
              alt="Logo" 
              style={{ height: '28px', width: '28px', borderRadius: '4px', objectFit: 'cover' }} 
            />
          )}
          <span style={{ fontWeight: 600, fontSize: '15px', color: 'var(--color-text-primary)' }}>
            {business.name} Admin Portal
          </span>
        </div>
      </div>

      <div className="header-right">
        {/* Help Placeholder */}
        <button style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--color-text-secondary)',
          padding: '6px',
          borderRadius: '50%',
          display: 'flex'
        }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
           onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
          <HelpCircle size={18} />
        </button>

        {/* Notifications Placeholder */}
        <button style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--color-text-secondary)',
          padding: '6px',
          borderRadius: '50%',
          display: 'flex'
        }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
           onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
          <Bell size={18} />
        </button>

        <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--color-border)' }}></div>

        {/* Profile Dropdown */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 500
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: 'hsl(var(--primary-h), var(--primary-s), 95%)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: '12px'
            }}>
              A
            </div>
            <span>Administrator</span>
          </button>

          {profileOpen && (
            <>
              {/* Overlay click to close */}
              <div 
                onClick={() => setProfileOpen(false)} 
                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 90 }}
              />
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                width: '160px',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-dropdown)',
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                flexDirection: 'column',
                padding: '4px',
                zIndex: 100
              }}>
                <div style={{ padding: '8px 12px', fontSize: '12px', color: 'var(--color-text-secondary)', borderBottom: '1px solid var(--color-border)' }}>
                  Signed in as <strong>admin</strong>
                </div>
                <button 
                  onClick={handleLogout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '8px 12px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '13px',
                    color: 'var(--color-error)',
                    borderRadius: '4px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-error-light)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
