import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Tv, AlertTriangle, WifiOff, CloudLightning, RefreshCw, X, HelpCircle, Check
} from 'lucide-react';

const TvPlayer = () => {
  const { tvId: urlTvId } = useParams();
  const navigate = useNavigate();
  const { tvs, playlists, banners, defaultContent, groups } = useApp();

  // Pairing & session state
  const [pairedTvId, setPairedTvId] = useState(() => {
    return urlTvId || localStorage.getItem('paired_tv_id') || '';
  });
  const [pairingCodeInput, setPairingCodeInput] = useState('');
  const [pairingError, setPairingError] = useState('');

  // Loading phase state
  const [isLoadingPhase, setIsLoadingPhase] = useState(true);

  // Playback queue states
  const [currentQueueIndex, setCurrentQueueIndex] = useState(0);
  const [isOffline, setIsOffline] = useState(false);
  const [simulateLoadError, setSimulateLoadError] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [tick, setTick] = useState(0);

  // Timer reference for image duration transition
  const transitionTimerRef = useRef(null);
  const videoRef = useRef(null);

  // Update pairing state when url param changes
  useEffect(() => {
    if (urlTvId) {
      setPairedTvId(urlTvId);
      localStorage.setItem('paired_tv_id', urlTvId);
    }
  }, [urlTvId]);

  // Sync index to cache when index updates
  useEffect(() => {
    if (pairedTvId) {
      localStorage.setItem(`tv_queue_index_${pairedTvId}`, currentQueueIndex.toString());
    }
  }, [currentQueueIndex, pairedTvId]);

  // Dynamic time-slot ticker (updates every 15s to check playlist transitions)
  useEffect(() => {
    const timer = setInterval(() => {
      setTick(t => t + 1);
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  // Simulate loading configuration phase on start or pairing
  useEffect(() => {
    if (pairedTvId) {
      setIsLoadingPhase(true);
      const timer = setTimeout(() => {
        setIsLoadingPhase(false);
      }, 1800); // 1.8 seconds branded loader
      return () => clearTimeout(timer);
    }
  }, [pairedTvId]);

  // Find the TV device configuration
  const tv = tvs.find(t => t.tvId === pairedTvId);
  const isTVValid = tv && tv.status === 'Active';

  // Handle manual pairing submission
  const handlePairSubmit = (e) => {
    e.preventDefault();
    const enteredCode = pairingCodeInput.trim().toUpperCase();
    const matchedTv = tvs.find(t => t.tvId === enteredCode);

    if (matchedTv) {
      if (matchedTv.status === 'Active') {
        setPairedTvId(enteredCode);
        localStorage.setItem('paired_tv_id', enteredCode);
        setPairingError('');
        navigate(`/player/${enteredCode}`);
      } else {
        setPairingError('This TV is currently marked as Inactive. Activate it in the Admin portal.');
      }
    } else {
      setPairingError('Invalid TV Pairing Code. Check your TV / Devices registry in the admin portal.');
    }
  };

  const handleDisconnectTv = () => {
    localStorage.removeItem('paired_tv_id');
    setPairedTvId('');
    setIsLoadingPhase(true);
    setShowOverlay(false);
    navigate('/player/pair');
  };

  const getEligibleBanners = () => {
    if (!tv) return [];

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const convertToMinutes = (timeStr) => {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };

    let matchedPlaylists = [];

    // 1. Check TV custom schedules (Time slot checks)
    if (tv.schedules && tv.schedules.length > 0) {
      const matchingSlot = tv.schedules.find(slot => {
        const start = convertToMinutes(slot.startTime);
        const end = convertToMinutes(slot.endTime);
        const matchesTime = currentMinutes >= start && currentMinutes <= end;
        if (!matchesTime) return false;

        // If Date Range is selected, check date constraints
        if (slot.scheduleType === 'Date Range') {
          const todayStr = now.toISOString().split('T')[0];
          return todayStr >= slot.startDate && todayStr <= slot.endDate;
        }
        return true;
      });

      if (matchingSlot) {
        const ids = matchingSlot.playlistIds || (matchingSlot.playlistId ? [matchingSlot.playlistId] : []);
        matchedPlaylists = ids.map(id => playlists.find(p => p.id === id)).filter(p => p && p.status === 'Active');
      }
    }

    // 2. Fallback to Priority 1 override
    if (matchedPlaylists.length === 0 && tv.playlistId) {
      const pl = playlists.find(p => p.id === tv.playlistId);
      if (pl && pl.status === 'Active') matchedPlaylists = [pl];
    }

    // 3. Fallback to Priority 2 Inherited Group playlist
    if (matchedPlaylists.length === 0 && tv.groupId) {
      const gp = groups.find(g => g.id === tv.groupId);
      if (gp && gp.playlistId) {
        const pl = playlists.find(p => p.id === gp.playlistId);
        if (pl && pl.status === 'Active') matchedPlaylists = [pl];
      }
    }

    if (matchedPlaylists.length === 0) return [];

    // Aggregate banners from all resolved playlists
    const allMapped = [];
    matchedPlaylists.forEach(pl => {
      if (pl.banners) {
        pl.banners.forEach(config => {
          const fullBanner = banners.find(b => b.id === config.bannerId);
          allMapped.push({ config, fullBanner, playlistName: pl.name });
        });
      }
    });

    const mockCurrentDate = new Date('2026-08-20T12:00:00Z');
    return allMapped
      .filter(({ config, fullBanner }) => {
        if (!fullBanner || fullBanner.status !== 'Active' || fullBanner.tvPermission === false) return false;
        
        if (config.scheduleType === 'Scheduled') {
          const startDateTime = new Date(`${config.startDate}T${config.startTime || '00:00'}`);
          const endDateTime = new Date(`${config.endDate}T${config.endTime || '23:59'}`);
          if (mockCurrentDate < startDateTime || mockCurrentDate > endDateTime) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => a.config.order - b.config.order);
  };

  const eligibleQueue = tv ? getEligibleBanners() : [];
  const activeQueueItem = eligibleQueue[currentQueueIndex];
  const displayFallback = eligibleQueue.length === 0 || simulateLoadError;

  // Auto transition loops handler
  useEffect(() => {
    if (!isTVValid || eligibleQueue.length === 0 || isLoadingPhase) return;

    // Reset index if out of bounds
    if (currentQueueIndex >= eligibleQueue.length) {
      setCurrentQueueIndex(0);
      return;
    }

    const currentBanner = eligibleQueue[currentQueueIndex].fullBanner;
    
    // Clear any active timers
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
    }

    if (currentBanner.mediaType === 'Image') {
      const bannerDuration = parseInt(currentBanner.duration) || 10;
      transitionTimerRef.current = setTimeout(() => {
        // Move to next queue banner in loop smoothly
        setCurrentQueueIndex(prev => (prev + 1) % eligibleQueue.length);
      }, bannerDuration * 1000);
    }

    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, [currentQueueIndex, eligibleQueue.length, isTVValid, isLoadingPhase]);

  const handleVideoEnded = () => {
    if (eligibleQueue.length > 0) {
      setCurrentQueueIndex(prev => (prev + 1) % eligibleQueue.length);
    }
  };

  // 1. Initial TV Login/Pairing screen
  if (!pairedTvId || !isTVValid) {
    return (
      <div style={{
        height: '100vh',
        width: '100vw',
        backgroundColor: '#0f172a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        fontFamily: 'system-ui, sans-serif',
        padding: '24px',
        position: 'relative'
      }}>
        {/* Style tags for slide animations */}
        <style>{`
          @keyframes glow {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
        `}</style>

        <div style={{ width: '100%', maxWidth: '400px', backgroundColor: '#1e293b', padding: '32px', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(249, 115, 22, 0.1)', color: 'var(--color-primary)', marginBottom: '16px' }}>
              <Tv size={28} />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 6px 0' }}>Connect Display Screen</h2>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Enter pairing code to link this customer TV display</p>
          </div>

          <form onSubmit={handlePairSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pairing Code / TV ID</label>
              <input 
                type="text"
                value={pairingCodeInput}
                onChange={(e) => setPairingCodeInput(e.target.value)}
                placeholder="e.g. TV-MANGALORE-01"
                style={{
                  width: '100%',
                  height: '42px',
                  backgroundColor: '#0f172a',
                  border: pairingError ? '1px solid var(--color-error)' : '1px solid #334155',
                  borderRadius: '6px',
                  color: '#ffffff',
                  padding: '0 12px',
                  fontSize: '14px',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  outline: 'none',
                  textAlign: 'center'
                }}
              />
              {pairingError && (
                <div style={{ color: 'var(--color-error)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                  <AlertTriangle size={12} />
                  <span>{pairingError}</span>
                </div>
              )}
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ width: '100%', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '14px', fontWeight: 600 }}
            >
              <span>Connect Device</span>
            </button>
          </form>

          {/* Registry Quick-Helper for Prototypes */}
          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #334155' }}>
            <span style={{ fontSize: '10px', color: '#64748b', display: 'block', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase' }}>Available Registry Codes for Testing:</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {tvs.map(t => (
                <span 
                  key={t.id} 
                  onClick={() => setPairingCodeInput(t.tvId)}
                  style={{ fontSize: '10px', padding: '3px 8px', backgroundColor: '#0f172a', borderRadius: '4px', color: t.status === 'Active' ? '#f97316' : '#64748b', cursor: 'pointer', border: '1px solid #334155' }}
                >
                  {t.tvId} ({t.status})
                </span>
              ))}
            </div>
          </div>
        </div>

        <button 
          onClick={() => navigate('/devices')}
          style={{ position: 'absolute', bottom: '24px', background: 'none', border: 'none', color: '#64748b', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <span>Back to Control Portal</span>
        </button>
      </div>
    );
  }

  // 2. Preparing Display Loading State
  if (isLoadingPhase) {
    return (
      <div style={{
        height: '100vh',
        width: '100vw',
        backgroundColor: '#0f172a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        fontFamily: 'system-ui, sans-serif'
      }}>
        {/* Style tags for loader scale */}
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '0.1em', color: '#f97316' }}>SPICE JUNCTION</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '13px' }}>
            <div style={{ width: '16px', height: '16px', border: '2px solid #94a3b8', borderTopColor: '#f97316', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
            <span>Preparing your display...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      position: 'relative', 
      height: '100vh', 
      width: '100vw', 
      backgroundColor: '#000000', 
      overflow: 'hidden',
      fontFamily: 'system-ui, sans-serif'
    }}>
      {/* Style tags for image slide/fade animations */}
      <style>{`
        @keyframes slideInFromRight {
          from { transform: translateX(100%); opacity: 0.9; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
      
      {/* Playback Container (100% full screen) */}
      <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {displayFallback ? (
          /* Branded Standby / Fallback Signage Screen */
          <div style={{ 
            height: '100vh',
            width: '100vw',
            backgroundColor: '#0f172a',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff'
          }}>
            <span style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '0.1em', color: '#f97316' }}>SPICE JUNCTION</span>
            <span style={{ fontSize: '12px', color: '#94a3b8', marginTop: '12px' }}>No display content is currently configured.</span>
          </div>
        ) : (
          /* Active signage playing in loop */
          <div 
            key={`slide-${currentQueueIndex}`}
            style={{ 
              width: '100%', 
              height: '100%', 
              animation: 'slideInFromRight 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {activeQueueItem.fullBanner.mediaType === 'Video' ? (
              <video 
                ref={videoRef}
                src={activeQueueItem.fullBanner.mediaUrl} 
                autoPlay 
                muted 
                onEnded={handleVideoEnded}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <img 
                src={activeQueueItem.fullBanner.mediaUrl} 
                alt={activeQueueItem.fullBanner.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            )}
          </div>
        )}
      </div>

      {/* Floating simulator/telemetry config dialog toggle icon (hidden/discreet) */}
      <button 
        onClick={() => setShowOverlay(prev => !prev)}
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          color: 'rgba(255, 255, 255, 0.6)',
          borderRadius: '50%',
          width: '28px',
          height: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 100,
          opacity: 0.3,
          transition: 'opacity 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.3'}
      >
        <HelpCircle size={14} />
      </button>

      {/* Connection notification toasts */}
      {isOffline && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          backgroundColor: 'rgba(239, 68, 68, 0.95)',
          color: '#ffffff',
          padding: '10px 16px',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '12px',
          fontWeight: 600,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
          zIndex: 100
        }}>
          <WifiOff size={16} />
          <span>Offline mode: Playing Cached signages</span>
        </div>
      )}

      {/* Simulator Control Panel (Overlay dashboard for prototype testing) */}
      {showOverlay && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          padding: '16px',
          color: '#ffffff',
          width: '320px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          zIndex: 100
        }}>
          <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Tv size={16} style={{ color: 'var(--color-primary)' }} />
              <strong style={{ fontSize: '13px' }}>{tv.name} ({tv.tvId})</strong>
            </div>
            <button onClick={() => setShowOverlay(false)} style={{ border: 'none', background: 'none', color: '#64748b', cursor: 'pointer' }}>
              <X size={14} />
            </button>
          </div>

          <div style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
            <div>Active Playlist: <strong>{activeQueueItem ? activeQueueItem.playlistName : 'Standby Loop'}</strong></div>
            <div>Banners playing: {displayFallback ? 'Fallback Signage active' : `Queue item ${currentQueueIndex + 1} of ${eligibleQueue.length}`}</div>
          </div>

          {/* Test Toggle Action Lists */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '12px' }}>
            <button 
              onClick={() => setIsOffline(!isOffline)}
              className="btn btn-outline" 
              style={{ 
                height: '32px', 
                fontSize: '11px', 
                justifyContent: 'center', 
                color: '#ffffff', 
                borderColor: isOffline ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.2)',
                backgroundColor: isOffline ? 'rgba(239, 68, 68, 0.15)' : 'transparent'
              }}
            >
              <WifiOff size={12} style={{ marginRight: '6px' }} />
              <span>{isOffline ? 'Simulate Online' : 'Simulate Offline'}</span>
            </button>

            <button 
              onClick={() => setSimulateLoadError(!simulateLoadError)}
              className="btn btn-outline" 
              style={{ 
                height: '32px', 
                fontSize: '11px', 
                justifyContent: 'center', 
                color: '#ffffff', 
                borderColor: simulateLoadError ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.2)',
                backgroundColor: simulateLoadError ? 'rgba(239, 68, 68, 0.15)' : 'transparent'
              }}
            >
              <CloudLightning size={12} style={{ marginRight: '6px' }} />
              <span>{simulateLoadError ? 'Clear Load Error' : 'Simulate Load Error'}</span>
            </button>

            <button 
              onClick={handleDisconnectTv}
              className="btn btn-secondary" 
              style={{ height: '32px', fontSize: '11px', justifyContent: 'center', borderColor: 'var(--color-error)', color: 'var(--color-error)' }}
            >
              Disconnect TV (Unpair Session)
            </button>

            <button 
              onClick={() => navigate('/devices')}
              className="btn btn-primary" 
              style={{ height: '32px', fontSize: '11px', justifyContent: 'center' }}
            >
              Exit Player Kiosk
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TvPlayer;
