import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, User as UserIcon, Shield } from 'lucide-react';
import { ToastContainer } from '../components/ui/Toast';

const Login = () => {
  const { login, isAuthenticated, business } = useApp();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Admin'); // 'Admin' | 'Display' | 'Kiosk'
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/overview';

  // If already authenticated, redirect to target page depending on role choice
  React.useEffect(() => {
    if (isAuthenticated) {
      if (selectedRole === 'Display') {
        navigate('/player/pair', { replace: true });
      } else if (selectedRole === 'Kiosk') {
        navigate('/kiosk/pair', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [isAuthenticated, navigate, from, selectedRole]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate brief network lag for loading state
    setTimeout(() => {
      const success = login(username, password);
      setLoading(false);
      if (success) {
        if (selectedRole === 'Display') {
          navigate('/player/pair', { replace: true });
        } else if (selectedRole === 'Kiosk') {
          navigate('/kiosk/pair', { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      }
    }, 600);
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: 'var(--color-background)',
      padding: 'var(--spacing-md)'
    }}>
      <div className="card" style={{
        width: '100%',
        maxWidth: '380px',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--color-border)'
      }}>
        {/* Brand Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '28px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px'
        }}>
          {business.logo ? (
            <img 
              src={business.logo} 
              alt="Logo" 
              style={{ height: '48px', width: '48px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--color-border)' }} 
            />
          ) : (
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '8px',
              backgroundColor: 'hsl(var(--primary-h), var(--primary-s), 95%)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Shield size={24} />
            </div>
          )}
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginTop: '8px', color: 'var(--color-text-primary)' }}>
            {business.name} Portal
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            Please sign in to access terminal workspaces
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <UserIcon size={16} style={{ position: 'absolute', left: '12px', color: 'var(--color-text-muted)' }} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-control"
                style={{ width: '100%', paddingLeft: '36px' }}
                placeholder="Enter username"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', color: 'var(--color-text-muted)' }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                style={{ width: '100%', paddingLeft: '36px' }}
                placeholder="Enter password"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Remember me & Forgot Password */}
          <div style={{
            display: 'flex',
            justifyContent: 'between',
            alignItems: 'center',
            fontSize: '12px',
            color: 'var(--color-text-secondary)',
            justifyContent: 'space-between',
            marginTop: '4px'
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ cursor: 'pointer' }}
                disabled={loading}
              />
              <span>Remember me</span>
            </label>
            
            <a 
              href="#forgot" 
              onClick={(e) => { e.preventDefault(); alert("Prototype note: In production, this triggers an email recovery link."); }} 
              style={{ color: 'var(--color-primary)', fontWeight: 500 }}
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Role Selection Chips Section */}
        <div style={{ marginTop: '20px', display: 'flex', gap: '8px' }}>
          {['Admin', 'Display', 'Kiosk'].map((role) => {
            const isActive = selectedRole === role;
            return (
              <button
                key={role}
                type="button"
                onClick={() => setSelectedRole(role)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  border: isActive ? '1px solid #fdba74' : '1px solid #e2e8f0',
                  backgroundColor: isActive ? '#fff7ed' : '#f8fafc',
                  color: isActive ? '#ea580c' : '#64748b',
                  outline: 'none'
                }}
              >
                {role}
              </button>
            );
          })}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
