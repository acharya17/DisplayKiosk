import React, { createContext, useState, useContext } from 'react';
import { initialBusiness, initialBranches, initialBanners, initialDefaultContent, initialPlaylists, initialTVs, initialGroups } from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('kiosk_admin_auth') === 'true';
  });
  
  const [business, setBusiness] = useState(initialBusiness);
  const [branches, setBranches] = useState(initialBranches);
  const [banners, setBanners] = useState(initialBanners);
  const [defaultContent, setDefaultContent] = useState(initialDefaultContent);
  const [playlists, setPlaylists] = useState(initialPlaylists);
  const [tvs, setTvs] = useState(initialTVs);
  const [groups, setGroups] = useState(initialGroups);
  const [toasts, setToasts] = useState([]);

  // Toast helper
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // Auth actions
  const login = (username, password) => {
    // Basic mock authentication: Accept admin/admin
    if (username === 'admin' && password === 'admin') {
      setIsAuthenticated(true);
      localStorage.setItem('kiosk_admin_auth', 'true');
      showToast('Logged in successfully', 'success');
      return true;
    }
    showToast('Invalid username or password', 'error');
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('kiosk_admin_auth');
    showToast('Logged out successfully', 'success');
  };

  // Business Actions
  const updateBusiness = (updatedFields) => {
    // Validations
    if (!updatedFields.name?.trim()) {
      showToast('Business Name is required', 'error');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (updatedFields.email && !emailRegex.test(updatedFields.email)) {
      showToast('Invalid Email format', 'error');
      return false;
    }
    
    setBusiness(updatedFields);
    showToast('Business settings saved', 'success');
    return true;
  };

  // Branch Actions
  const addBranch = (newBranch) => {
    // Validations
    if (!newBranch.name?.trim()) {
      showToast('Branch Name is required', 'error');
      return false;
    }
    if (!newBranch.code?.trim()) {
      showToast('Branch Code is required', 'error');
      return false;
    }
    if (!newBranch.city?.trim()) {
      showToast('City is required', 'error');
      return false;
    }
    
    // Uniqueness validation
    if (branches.some(b => b.code.toLowerCase() === newBranch.code.toLowerCase())) {
      showToast(`Branch Code "${newBranch.code}" must be unique`, 'error');
      return false;
    }

    const branchRecord = {
      ...newBranch,
      id: `br-${Date.now()}`
    };
    
    setBranches(prev => [...prev, branchRecord]);
    showToast('Branch added successfully', 'success');
    return true;
  };

  const editBranch = (branchId, updatedBranch) => {
    if (!updatedBranch.name?.trim()) {
      showToast('Branch Name is required', 'error');
      return false;
    }
    if (!updatedBranch.code?.trim()) {
      showToast('Branch Code is required', 'error');
      return false;
    }
    if (!updatedBranch.city?.trim()) {
      showToast('City is required', 'error');
      return false;
    }

    // Code uniqueness except itself
    if (branches.some(b => b.id !== branchId && b.code.toLowerCase() === updatedBranch.code.toLowerCase())) {
      showToast(`Branch Code "${updatedBranch.code}" must be unique`, 'error');
      return false;
    }

    setBranches(prev => prev.map(b => b.id === branchId ? { ...updatedBranch, id: branchId } : b));
    showToast('Branch updated successfully', 'success');
    return true;
  };

  const setBranchStatus = (branchId, newStatus) => {
    setBranches(prev => prev.map(b => b.id === branchId ? { ...b, status: newStatus } : b));
    showToast(`Branch ${newStatus === 'Active' ? 'activated' : 'deactivated'} successfully`, 'success');
  };

  // Banner Actions
  const addBanner = (newBanner) => {
    if (!newBanner.name?.trim()) {
      showToast('Banner Name is required', 'error');
      return false;
    }
    if (!newBanner.mediaUrl?.trim()) {
      showToast('Media File / URL is required', 'error');
      return false;
    }
    if (newBanner.mediaType === 'Image' && (!newBanner.duration || newBanner.duration <= 0)) {
      showToast('Display Duration is required for Image banners and must be > 0', 'error');
      return false;
    }

    const bannerRecord = {
      ...newBanner,
      id: `bn-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setBanners(prev => [...prev, bannerRecord]);
    showToast('Banner created successfully', 'success');
    return true;
  };

  const editBanner = (bannerId, updatedFields) => {
    if (!updatedFields.name?.trim()) {
      showToast('Banner Name is required', 'error');
      return false;
    }
    if (!updatedFields.mediaUrl?.trim()) {
      showToast('Media File / URL is required', 'error');
      return false;
    }
    if (updatedFields.mediaType === 'Image' && (!updatedFields.duration || updatedFields.duration <= 0)) {
      showToast('Display Duration is required for Image banners and must be > 0', 'error');
      return false;
    }

    setBanners(prev => prev.map(b => b.id === bannerId ? { 
      ...b, 
      ...updatedFields, 
      id: bannerId, 
      updatedAt: new Date().toISOString() 
    } : b));
    showToast('Banner updated successfully', 'success');
    return true;
  };

  const deleteBanner = (bannerId) => {
    setBanners(prev => prev.filter(b => b.id !== bannerId));
    showToast('Banner deleted successfully', 'success');
  };

  const setBannerStatus = (bannerId, newStatus) => {
    setBanners(prev => prev.map(b => b.id === bannerId ? { 
      ...b, 
      status: newStatus,
      updatedAt: new Date().toISOString() 
    } : b));
    showToast(`Banner ${newStatus === 'Active' ? 'activated' : 'deactivated'} successfully`, 'success');
  };

  // Fallback Content Actions
  const updateDefaultContent = (updatedFields) => {
    if (!updatedFields.name?.trim()) {
      showToast('Default Banner Name is required', 'error');
      return false;
    }
    if (!updatedFields.mediaUrl?.trim()) {
      showToast('Default Media URL is required', 'error');
      return false;
    }
    
    setDefaultContent({
      ...defaultContent,
      ...updatedFields,
      updatedAt: new Date().toISOString()
    });
    showToast('Default content updated successfully', 'success');
    return true;
  };

  // Playlists Actions
  const addPlaylist = (playlistData) => {
    const newId = `pl-${Date.now()}`;
    const newPlaylist = {
      ...playlistData,
      id: newId,
      banners: playlistData.banners || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setPlaylists(prev => [...prev, newPlaylist]);
    showToast('Playlist created successfully', 'success');
    return true;
  };

  const editPlaylist = (id, updatedFields) => {
    setPlaylists(prev => prev.map(pl => pl.id === id ? {
      ...pl,
      ...updatedFields,
      updatedAt: new Date().toISOString()
    } : pl));
    showToast('Playlist updated successfully', 'success');
    return true;
  };

  const deletePlaylist = (id) => {
    setPlaylists(prev => prev.filter(pl => pl.id !== id));
    showToast('Playlist deleted successfully', 'success');
    return true;
  };

  const setPlaylistStatus = (id, newStatus) => {
    setPlaylists(prev => prev.map(pl => pl.id === id ? {
      ...pl,
      status: newStatus,
      updatedAt: new Date().toISOString()
    } : pl));
    showToast(`Playlist ${newStatus === 'Active' ? 'activated' : 'deactivated'} successfully`, 'success');
  };

  const addBannerToPlaylist = (playlistId, bannerId) => {
    let duplicate = false;
    setPlaylists(prev => prev.map(pl => {
      if (pl.id !== playlistId) return pl;
      if (pl.banners.some(b => b.bannerId === bannerId)) {
        duplicate = true;
        return pl;
      }
      const newOrder = pl.banners.length + 1;
      const newBanner = {
        bannerId,
        displayOrder: newOrder,
        scheduleType: 'Continuous',
        startDate: new Date().toISOString().split('T')[0],
        startTime: '00:00',
        endDate: '',
        endTime: ''
      };
      return {
        ...pl,
        banners: [...pl.banners, newBanner],
        updatedAt: new Date().toISOString()
      };
    }));

    if (duplicate) {
      showToast('Banner already exists in playlist', 'error');
      return false;
    }
    showToast('Banner added to playlist successfully', 'success');
    return true;
  };

  const removeBannerFromPlaylist = (playlistId, bannerId) => {
    setPlaylists(prev => prev.map(pl => {
      if (pl.id !== playlistId) return pl;
      const filtered = pl.banners.filter(b => b.bannerId !== bannerId);
      const reindexed = filtered.map((item, idx) => ({
        ...item,
        displayOrder: idx + 1
      }));
      return {
        ...pl,
        banners: reindexed,
        updatedAt: new Date().toISOString()
      };
    }));
    showToast('Banner removed from playlist successfully', 'success');
    return true;
  };

  const reorderPlaylistBanners = (playlistId, reorderedBanners) => {
    setPlaylists(prev => prev.map(pl => {
      if (pl.id !== playlistId) return pl;
      return {
        ...pl,
        banners: reorderedBanners,
        updatedAt: new Date().toISOString()
      };
    }));
    showToast('Banner order updated successfully', 'success');
    return true;
  };

  const updatePlaylistBannerSchedule = (playlistId, bannerId, scheduleDetails) => {
    setPlaylists(prev => prev.map(pl => {
      if (pl.id !== playlistId) return pl;
      const updatedBanners = pl.banners.map(b => b.bannerId === bannerId ? {
        ...b,
        ...scheduleDetails
      } : b);
      return {
        ...pl,
        banners: updatedBanners,
        updatedAt: new Date().toISOString()
      };
    }));
    showToast('Schedule updated successfully', 'success');
    return true;
  };

  // TVs / Devices Actions
  const addTV = (tvData) => {
    // Unique TV ID check
    const isDuplicate = tvs.some(t => t.tvId.trim().toLowerCase() === tvData.tvId.trim().toLowerCase());
    if (isDuplicate) {
      showToast(`TV ID "${tvData.tvId}" is already registered`, 'error');
      return false;
    }

    const newId = `tv-${Date.now()}`;
    const newTV = {
      ...tvData,
      id: newId,
      connectionStatus: 'Unknown',
      lastSeen: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTvs(prev => [...prev, newTV]);
    showToast('TV registered successfully', 'success');
    return true;
  };

  const editTV = (id, updatedFields) => {
    // Unique TV ID check excluding self
    const isDuplicate = tvs.some(t => t.id !== id && t.tvId.trim().toLowerCase() === updatedFields.tvId.trim().toLowerCase());
    if (isDuplicate) {
      showToast(`TV ID "${updatedFields.tvId}" is already registered`, 'error');
      return false;
    }

    setTvs(prev => prev.map(t => t.id === id ? {
      ...t,
      ...updatedFields,
      updatedAt: new Date().toISOString()
    } : t));
    showToast('TV details updated successfully', 'success');
    return true;
  };

  const deleteTV = (id) => {
    setTvs(prev => prev.filter(t => t.id !== id));
    showToast('TV removed successfully', 'success');
    return true;
  };

  const setTVStatus = (id, newStatus) => {
    setTvs(prev => prev.map(t => t.id === id ? {
      ...t,
      status: newStatus,
      updatedAt: new Date().toISOString()
    } : t));
    showToast(`TV display ${newStatus === 'Active' ? 'activated' : 'deactivated'} successfully`, 'success');
  };

  const assignPlaylistToTV = (tvId, playlistId) => {
    setTvs(prev => prev.map(t => t.id === tvId ? {
      ...t,
      playlistId,
      updatedAt: new Date().toISOString()
    } : t));
    showToast('Playlist assigned to TV successfully', 'success');
    return true;
  };

  // Display Groups Actions
  const addGroup = (groupData) => {
    const newId = `gp-${Date.now()}`;
    const newGroup = {
      ...groupData,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setGroups(prev => [...prev, newGroup]);
    showToast('Display group created successfully', 'success');
    return true;
  };

  const editGroup = (id, updatedFields) => {
    setGroups(prev => prev.map(g => g.id === id ? {
      ...g,
      ...updatedFields,
      updatedAt: new Date().toISOString()
    } : g));
    
    // Update TVs associated with this group if needed
    if (updatedFields.associatedTvIds) {
      setTvs(prev => prev.map(t => {
        if (updatedFields.associatedTvIds.includes(t.id)) {
          return { ...t, groupId: id, updatedAt: new Date().toISOString() };
        } else if (t.groupId === id) {
          // Unlinked from this group
          return { ...t, groupId: '', updatedAt: new Date().toISOString() };
        }
        return t;
      }));
    }

    showToast('Display group updated successfully', 'success');
    return true;
  };

  const deleteGroup = (id) => {
    setGroups(prev => prev.filter(g => g.id !== id));
    // Rule 13: Deleting a display group must not delete the TVs inside that group (simply unlink them)
    setTvs(prev => prev.map(t => t.groupId === id ? { ...t, groupId: '', updatedAt: new Date().toISOString() } : t));
    showToast('Display group deleted successfully', 'success');
    return true;
  };

  const setGroupStatus = (id, newStatus) => {
    setGroups(prev => prev.map(g => g.id === id ? {
      ...g,
      status: newStatus,
      updatedAt: new Date().toISOString()
    } : g));
    showToast(`Display group ${newStatus === 'Active' ? 'activated' : 'deactivated'} successfully`, 'success');
  };

  const assignPlaylistToGroup = (groupId, playlistId) => {
    setGroups(prev => prev.map(g => g.id === groupId ? {
      ...g,
      playlistId,
      updatedAt: new Date().toISOString()
    } : g));
    showToast('Playlist assigned to group successfully', 'success');
    return true;
  };

  return (
    <AppContext.Provider value={{
      isAuthenticated,
      business,
      branches,
      banners,
      defaultContent,
      playlists,
      tvs,
      groups,
      toasts,
      showToast,
      login,
      logout,
      updateBusiness,
      addBranch,
      editBranch,
      setBranchStatus,
      addBanner,
      editBanner,
      deleteBanner,
      setBannerStatus,
      updateDefaultContent,
      addPlaylist,
      editPlaylist,
      deletePlaylist,
      setPlaylistStatus,
      addBannerToPlaylist,
      removeBannerFromPlaylist,
      reorderPlaylistBanners,
      updatePlaylistBannerSchedule,
      addTV,
      editTV,
      deleteTV,
      setTVStatus,
      assignPlaylistToTV,
      addGroup,
      editGroup,
      deleteGroup,
      setGroupStatus,
      assignPlaylistToGroup
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
