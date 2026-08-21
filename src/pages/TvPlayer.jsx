import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Tv, AlertTriangle, Play, WifiOff, CloudLightning, RefreshCw, X, ChevronRight, HelpCircle
} from 'lucide-react';

const TvPlayer = () => {
  const { tvId } = useParams();
  const navigate = useNavigate();
  const { tvs, playlists, banners, defaultContent, groups } = useApp();

  const [currentQueueIndex, setCurrentQueueIndex] = useState(() => {
    const cached = localStorage.getItem(`tv_queue_index_${tvId}`);
    return cached ? parseInt(cached) : 0;
  });
  const [isOffline, setIsOffline] = useState(false);
  const [simulateLoadError, setSimulateLoadError] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [tick, setTick] = useState(0);

  // Dynamic time-slot ticker (updates every 15s to check playlist transitions)
  useEffect(() => {
    const timer = setInterval(() => {
      setTick(t => t + 1);
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  // Sync index to cache when index updates
  useEffect(() => {
    localStorage.setItem(`tv_queue_index_${tvId}`, currentQueueIndex.toString());
  }, [currentQueueIndex, tvId]);

  // Timer reference for image duration transition
  const transitionTimerRef = useRef(null);
  const videoRef = useRef(null);

  // Find the TV device configuration
  const tv = tvs.find(t => t.tvId === tvId);
  const isTVValid = tv && tv.status === 'Active';



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
          allMapped.push({ config, fullBanner });
        });
      }
    });

    const mockCurrentDate = new Date('2026-08-20T12:00:00Z');
    return allMapped
      .filter(({ config, fullBanner }) => {
        if (!fullBanner || fullBanner.status !== 'Active' || !fullBanner.tvPermission) return false;
        
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

  // Auto transition loops handler
  useEffect(() => {
    if (!isTVValid || eligibleQueue.length === 0) return;

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
        // Move to next queue banner in loop
        setCurrentQueueIndex(prev => (prev + 1) % eligibleQueue.length);
      }, bannerDuration * 1000);
    }

    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, [currentQueueIndex, eligibleQueue.length, isTVValid]);

  const handleVideoEnded = () => {
    if (eligibleQueue.length > 0) {
      setCurrentQueueIndex(prev => (prev + 1) % eligibleQueue.length);
    }
  };

  if (!isTVValid) {
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
        gap: '20px',
        padding: '24px'
      }}>
        <AlertTriangle size={64} style={{ color: 'var(--color-error)' }} />
        <h2 style={{ fontSize: '24px', fontWeight: 600 }}>TV Playback Disabled</h2>
        <p style={{ color: '#94a3b8', textAlign: 'center', maxWidth: '480px' }}>
          The requested TV ID <strong>{tvId}</strong> is either unregistered or marked as Inactive. Register/Activate the screen inside device configuration.
        </p>
        <button onClick={() => navigate('/devices')} className="btn btn-primary">
          Back to Portal
        </button>
      </div>
    );
  }

  // Rule 4: Handle skip loading failure or empty queue
  const displayFallback = eligibleQueue.length === 0 || simulateLoadError;

  return (
    <div style={{ 
      position: 'relative', 
      height: '100vh', 
      width: '100vw', 
      backgroundColor: '#000000', 
      overflow: 'hidden'
    }}>
      
      {/* Playback Container (100% full screen / Kiosk resolution) */}
      <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
        {displayFallback ? (
          /* Rule 3 fallback visual */
          defaultContent ? (
            <img 
              src={defaultContent.mediaUrl} 
              alt="default fallback" 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#ffffff', gap: '12px' }}>
              <AlertTriangle size={48} />
              <span>Standby Mode - Fallback Signage Empty</span>
            </div>
          )
        ) : (
          /* Active signage playing */
          activeQueueItem.fullBanner.mediaType === 'Video' ? (
            <video 
              ref={videoRef}
              src={activeQueueItem.fullBanner.mediaUrl} 
              autoPlay 
              muted 
              onEnded={handleVideoEnded}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          ) : (
            <img 
              src={activeQueueItem.fullBanner.mediaUrl} 
              alt={activeQueueItem.fullBanner.name} 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
            />
          )
        )}
      </div>

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
            <div>Active Playlist: <strong>{playlists.find(p => p.id === tv.playlistId)?.name || 'Central Mapped Loop'}</strong></div>
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
              <span>{isOffline ? 'Simulate Online' : 'Simulate Offline (Rule 5)'}</span>
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
              <span>{simulateLoadError ? 'Clear Load Error' : 'Simulate Load Error (Rule 4)'}</span>
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

      {/* Floating launch button if overlay was closed */}
      {!showOverlay && (
        <button 
          onClick={() => setShowOverlay(true)}
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            backgroundColor: '#0f172a',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            zIndex: 100
          }}
        >
          <HelpCircle size={18} />
        </button>
      )}
    </div>
  );
};

export default TvPlayer;
