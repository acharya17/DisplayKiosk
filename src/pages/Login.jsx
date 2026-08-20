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
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/overview';

  // If already authenticated, redirect to target page
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate brief network lag for loading state
    setTimeout(() => {
      const success = login(username, password);
      setLoading(false);
      if (success) {
        navigate(from, { replace: true });
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
            Please sign in to manage digital signage
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
        
        {/* Mock credentials reminder */}
        <div style={{
          marginTop: '20px',
          padding: '10px',
          backgroundColor: '#f8fafc',
          border: '1px dashed var(--color-border)',
          borderRadius: '6px',
          fontSize: '11px',
          color: 'var(--color-text-secondary)',
          textAlign: 'center'
        }}>
          Demo Credentials: <strong>admin</strong> / <strong>admin</strong>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
