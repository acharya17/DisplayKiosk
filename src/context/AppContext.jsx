import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  initialBusiness, initialBranches, initialBanners, initialDefaultContent, 
  initialPlaylists, initialTVs, initialGroups, initialCategories, initialProducts,
  initialCustomisations, initialCombos, initialTaxes, initialOffers, initialKiosks,
  initialOrders, initialPayments, initialHardware
} from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('kiosk_admin_auth') === 'true';
  });
  
  const [business, setBusiness] = useState(() => {
    const cached = localStorage.getItem('kiosk_business');
    return cached ? JSON.parse(cached) : initialBusiness;
  });
  const [branches, setBranches] = useState(() => {
    const cached = localStorage.getItem('kiosk_branches');
    return cached ? JSON.parse(cached) : initialBranches;
  });
  const [banners, setBanners] = useState(() => {
    const cached = localStorage.getItem('kiosk_banners');
    return cached ? JSON.parse(cached) : initialBanners;
  });
  const [defaultContent, setDefaultContent] = useState(() => {
    const cached = localStorage.getItem('kiosk_default_content');
    return cached ? JSON.parse(cached) : initialDefaultContent;
  });
  const [playlists, setPlaylists] = useState(() => {
    const cached = localStorage.getItem('kiosk_playlists');
    return cached ? JSON.parse(cached) : initialPlaylists;
  });
  const [tvs, setTvs] = useState(() => {
    const cached = localStorage.getItem('kiosk_tvs');
    return cached ? JSON.parse(cached) : initialTVs;
  });
  const [groups, setGroups] = useState(() => {
    const cached = localStorage.getItem('kiosk_groups');
    return cached ? JSON.parse(cached) : initialGroups;
  });
  const [categories, setCategories] = useState(() => {
    const cached = localStorage.getItem('kiosk_categories');
    if (cached) {
      const parsed = JSON.parse(cached);
      return parsed.map((c, idx) => {
        if (!c.categoryId) {
          const fallback = c.id ? c.id.toUpperCase() : `CAT-${idx + 1}`;
          return { ...c, categoryId: fallback };
        }
        return c;
      });
    }
    return initialCategories;
  });
  const [products, setProducts] = useState(() => {
    const cached = localStorage.getItem('kiosk_products');
    if (cached) {
      const parsed = JSON.parse(cached);
      // If cached products still contain the old customisations array, flush it
      if (parsed.length > 0 && Array.isArray(parsed[0].customisations)) {
        localStorage.removeItem('kiosk_products');
      } else {
        return parsed.map((p, idx) => {
          let updated = { ...p };
          if (!p.productId) {
            const fallback = p.id ? p.id.toUpperCase() : `PROD-${idx + 1}`;
            updated.productId = fallback;
          }
          if (p.availability === 'Available') {
            updated.availability = 'In Stock';
          } else if (p.availability === 'Unavailable') {
            updated.availability = 'Out of Stock';
          }
          if (updated.availability === 'In Stock' && (updated.stockQty === undefined || updated.stockQty === null)) {
            updated.stockQty = 15; // default initial stock
          }
          if (updated.displayPrice === undefined || updated.displayPrice === null) {
            updated.displayPrice = updated.price;
          }
          return updated;
        });
      }
    }
    // inject default stock values to initial mock data if missing
    return initialProducts.map(p => ({
      ...p,
      displayPrice: p.displayPrice !== undefined ? p.displayPrice : p.price,
      stockQty: p.availability === 'In Stock' ? (p.stockQty !== undefined ? p.stockQty : 15) : 0
    }));
  });

  // Force cache flush for Phase 3, 4, 5, 6 & 7 data schemas
  useEffect(() => {
    const marker = localStorage.getItem('kiosk_p3_to_p7_marker');
    if (!marker) {
      localStorage.removeItem('kiosk_combos');
      localStorage.removeItem('kiosk_taxes');
      localStorage.removeItem('kiosk_offers');
      localStorage.removeItem('kiosk_kiosks');
      localStorage.removeItem('kiosk_orders');
      localStorage.removeItem('kiosk_payments');
      localStorage.removeItem('kiosk_hardware');
      localStorage.removeItem('kiosk_customisations_master');
      localStorage.setItem('kiosk_p3_to_p7_marker', 'true');
      window.location.reload();
    }
  }, []);

  const [customisations, setCustomisations] = useState(() => {
    const cached = localStorage.getItem('kiosk_customisations_master');
    if (cached) {
      const parsed = JSON.parse(cached);
      // Flush if type field is missing or if cached data count doesn't match current dataset
      if (parsed.length > 0 && (parsed[0].type === undefined || parsed.length !== initialCustomisations.length)) {
        localStorage.removeItem('kiosk_customisations_master');
      } else {
        return parsed;
      }
    }
    return initialCustomisations;
  });

  const [combos, setCombos] = useState(() => {
    const cached = localStorage.getItem('kiosk_combos');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed.length !== initialCombos.length) {
        localStorage.removeItem('kiosk_combos');
      } else {
        return parsed;
      }
    }
    return initialCombos;
  });

  const [taxes, setTaxes] = useState(() => {
    const cached = localStorage.getItem('kiosk_taxes');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed.length !== initialTaxes.length) {
        localStorage.removeItem('kiosk_taxes');
      } else {
        return parsed;
      }
    }
    return initialTaxes;
  });

  const [offers, setOffers] = useState(() => {
    const cached = localStorage.getItem('kiosk_offers');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed.length !== initialOffers.length) {
        localStorage.removeItem('kiosk_offers');
      } else {
        return parsed;
      }
    }
    return initialOffers;
  });

  const [kiosks, setKiosks] = useState(() => {
    const cached = localStorage.getItem('kiosk_kiosks');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed.length !== initialKiosks.length) {
        localStorage.removeItem('kiosk_kiosks');
      } else {
        return parsed;
      }
    }
    return initialKiosks;
  });

  const [orders, setOrders] = useState(() => {
    const cached = localStorage.getItem('kiosk_orders');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed.length !== initialOrders.length) {
        localStorage.removeItem('kiosk_orders');
      } else {
        return parsed;
      }
    }
    return initialOrders;
  });

  const [payments, setPayments] = useState(() => {
    const cached = localStorage.getItem('kiosk_payments');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed.length !== initialPayments.length) {
        localStorage.removeItem('kiosk_payments');
      } else {
        return parsed;
      }
    }
    return initialPayments;
  });

  const [hardware, setHardware] = useState(() => {
    const cached = localStorage.getItem('kiosk_hardware');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed.length !== initialHardware.length) {
        localStorage.removeItem('kiosk_hardware');
      } else {
        return parsed;
      }
    }
    return initialHardware;
  });

  const [toasts, setToasts] = useState([]);

  // Auto-sync state variables to localStorage when changed
  useEffect(() => {
    localStorage.setItem('kiosk_customisations_master', JSON.stringify(customisations));
  }, [customisations]);

  useEffect(() => {
    localStorage.setItem('kiosk_business', JSON.stringify(business));
  }, [business]);

  useEffect(() => {
    localStorage.setItem('kiosk_branches', JSON.stringify(branches));
  }, [branches]);

  useEffect(() => {
    localStorage.setItem('kiosk_banners', JSON.stringify(banners));
  }, [banners]);

  useEffect(() => {
    localStorage.setItem('kiosk_default_content', JSON.stringify(defaultContent));
  }, [defaultContent]);

  useEffect(() => {
    localStorage.setItem('kiosk_playlists', JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    localStorage.setItem('kiosk_tvs', JSON.stringify(tvs));
  }, [tvs]);

  useEffect(() => {
    localStorage.setItem('kiosk_groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('kiosk_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('kiosk_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('kiosk_combos', JSON.stringify(combos));
  }, [combos]);

  useEffect(() => {
    localStorage.setItem('kiosk_taxes', JSON.stringify(taxes));
  }, [taxes]);

  useEffect(() => {
    localStorage.setItem('kiosk_offers', JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem('kiosk_kiosks', JSON.stringify(kiosks));
  }, [kiosks]);

  useEffect(() => {
    localStorage.setItem('kiosk_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('kiosk_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('kiosk_hardware', JSON.stringify(hardware));
  }, [hardware]);

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
      connectionStatus: 'Online', // Set to Online immediately upon registration
      lastSeen: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTvs(prev => [...prev, newTV]);
    showToast('TV registered successfully', 'success');
    return newId;
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

  const addCategory = (categoryData) => {
    const newId = `cat-${Date.now()}`;
    const generatedCode = `CAT-${categoryData.name.toUpperCase().replace(/[^A-Z0-9]/g, '-')}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    const newCategory = {
      description: '',
      ...categoryData,
      id: newId,
      categoryId: generatedCode,
      status: 'Active'
    };
    setCategories(prev => [...prev, newCategory]);
    showToast('Category created successfully', 'success');
    return true;
  };

  const editCategory = (id, updatedFields) => {
    setCategories(prev => prev.map(c => c.id === id ? {
      ...c,
      ...updatedFields
    } : c));
    showToast('Category updated successfully', 'success');
    return true;
  };

  const deleteCategory = (id) => {
    const hasProducts = products.some(p => p.categoryId === id);
    if (hasProducts) {
      showToast('Cannot delete category: products are assigned to it', 'error');
      return false;
    }
    setCategories(prev => prev.filter(c => c.id !== id));
    showToast('Category deleted successfully', 'success');
    return true;
  };

  const setCategoryStatus = (id, newStatus) => {
    setCategories(prev => prev.map(c => c.id === id ? {
      ...c,
      status: newStatus
    } : c));
    showToast(`Category ${newStatus === 'Active' ? 'activated' : 'deactivated'} successfully`, 'success');
  };

  const addProduct = (productData) => {
    const newId = `prod-${Date.now()}`;
    const generatedCode = `PROD-${productData.name.toUpperCase().replace(/[^A-Z0-9]/g, '-')}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    const newProduct = {
      ...productData,
      id: newId,
      productId: generatedCode,
      status: 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProducts(prev => [...prev, newProduct]);
    showToast('Product created successfully', 'success');
    return true;
  };

  const editProduct = (id, updatedFields) => {
    setProducts(prev => prev.map(p => p.id === id ? {
      ...p,
      ...updatedFields,
      updatedAt: new Date().toISOString()
    } : p));
    showToast('Product updated successfully', 'success');
    return true;
  };

  const deleteProduct = (id) => {
    // Safety check: prevent deletion if product is used in any combo
    const usedInCombos = combos.filter(c => c.items.some(item => item.productId === id));
    if (usedInCombos.length > 0) {
      const comboNames = usedInCombos.map(c => c.name).join(', ');
      showToast(`Cannot delete: Product is used in combo(s): ${comboNames}`, 'error');
      return false;
    }
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('Product deleted successfully', 'success');
    return true;
  };

  const setProductStatus = (id, newStatus) => {
    setProducts(prev => prev.map(p => p.id === id ? {
      ...p,
      status: newStatus,
      updatedAt: new Date().toISOString()
    } : p));
    showToast(`Product ${newStatus === 'Active' ? 'activated' : 'deactivated'} successfully`, 'success');
  };

  const addCustomisation = (optData) => {
    const newId = `opt-${Date.now()}`;
    const newOpt = {
      ...optData,
      id: newId,
      status: 'Active'
    };
    setCustomisations(prev => [...prev, newOpt]);
    showToast('Customisation option created successfully', 'success');
    return true;
  };

  const editCustomisation = (id, updatedFields) => {
    setCustomisations(prev => prev.map(c => c.id === id ? {
      ...c,
      ...updatedFields
    } : c));
    showToast('Customisation option updated successfully', 'success');
    return true;
  };

  const deleteCustomisation = (id) => {
    setCustomisations(prev => prev.filter(c => c.id !== id));
    setProducts(prev => prev.map(p => p.customisationId === id ? { ...p, customisationId: "" } : p));
    showToast('Customisation deleted successfully', 'success');
    return true;
  };

  const setCustomisationStatus = (id, newStatus) => {
    setCustomisations(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    showToast(`Customisation ${newStatus === 'Active' ? 'activated' : 'deactivated'} successfully`, 'success');
  };

  // ─── Combo CRUD ─────────────────────────
  const addCombo = (comboData) => {
    const newId = `combo-${Date.now()}`;
    const now = new Date().toISOString();
    const newCombo = {
      ...comboData,
      id: newId,
      status: 'Active',
      createdAt: now,
      updatedAt: now
    };
    setCombos(prev => [...prev, newCombo]);
    showToast('Combo created successfully', 'success');
    return true;
  };

  const editCombo = (id, updatedFields) => {
    setCombos(prev => prev.map(c => c.id === id ? {
      ...c,
      ...updatedFields,
      updatedAt: new Date().toISOString()
    } : c));
    showToast('Combo updated successfully', 'success');
    return true;
  };

  const deleteCombo = (id) => {
    setCombos(prev => prev.filter(c => c.id !== id));
    showToast('Combo deleted successfully', 'success');
    return true;
  };

  const setComboStatus = (id, newStatus) => {
    setCombos(prev => prev.map(c => c.id === id ? {
      ...c,
      status: newStatus,
      updatedAt: new Date().toISOString()
    } : c));
    showToast(`Combo ${newStatus === 'Active' ? 'activated' : 'deactivated'} successfully`, 'success');
  };

  const setComboAvailability = (id, newAvailability) => {
    setCombos(prev => prev.map(c => c.id === id ? {
      ...c,
      availability: newAvailability,
      updatedAt: new Date().toISOString()
    } : c));
    showToast(`Combo marked as ${newAvailability}`, 'success');
  };

  // ─── Tax CRUD ─────────────────────────────
  const addTax = (taxData) => {
    const newId = `tax-${Date.now()}`;
    const now = new Date().toISOString();
    setTaxes(prev => [...prev, { ...taxData, id: newId, status: 'Active', createdAt: now, updatedAt: now }]);
    showToast('Tax created successfully', 'success');
    return true;
  };

  const editTax = (id, updatedFields) => {
    setTaxes(prev => prev.map(t => t.id === id ? { ...t, ...updatedFields, updatedAt: new Date().toISOString() } : t));
    showToast('Tax updated successfully', 'success');
    return true;
  };

  const deleteTax = (id) => {
    setTaxes(prev => prev.filter(t => t.id !== id));
    showToast('Tax deleted successfully', 'success');
    return true;
  };

  const setTaxStatus = (id, newStatus) => {
    setTaxes(prev => prev.map(t => t.id === id ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t));
    showToast(`Tax ${newStatus === 'Active' ? 'activated' : 'deactivated'} successfully`, 'success');
  };

  // ─── Offer CRUD ───────────────────────────
  const addOffer = (offerData) => {
    const newId = `offer-${Date.now()}`;
    const now = new Date().toISOString();
    setOffers(prev => [...prev, { ...offerData, id: newId, status: 'Active', createdAt: now, updatedAt: now }]);
    showToast('Offer created successfully', 'success');
    return true;
  };

  const editOffer = (id, updatedFields) => {
    setOffers(prev => prev.map(o => o.id === id ? { ...o, ...updatedFields, updatedAt: new Date().toISOString() } : o));
    showToast('Offer updated successfully', 'success');
    return true;
  };

  const deleteOffer = (id) => {
    setOffers(prev => prev.filter(o => o.id !== id));
    showToast('Offer deleted successfully', 'success');
    return true;
  };

  const setOfferStatus = (id, newStatus) => {
    setOffers(prev => prev.map(o => o.id === id ? { ...o, status: newStatus, updatedAt: new Date().toISOString() } : o));
    showToast(`Offer ${newStatus === 'Active' ? 'activated' : 'deactivated'} successfully`, 'success');
  };

  // ─── Kiosk CRUD ───────────────────────────
  const addKiosk = (kioskData) => {
    const newId = `kisk-${Date.now()}`;
    const now = new Date().toISOString();
    setKiosks(prev => [...prev, { 
      ...kioskData, 
      id: newId, 
      status: 'Active', 
      availability: 'Available',
      connection: 'Online',
      lastActive: now,
      createdAt: now, 
      updatedAt: now 
    }]);
    showToast('Kiosk registered successfully', 'success');
    return true;
  };

  const editKiosk = (id, updatedFields) => {
    setKiosks(prev => prev.map(k => k.id === id ? { ...k, ...updatedFields, updatedAt: new Date().toISOString() } : k));
    showToast('Kiosk configuration updated successfully', 'success');
    return true;
  };

  const deleteKiosk = (id) => {
    setKiosks(prev => prev.filter(k => k.id !== id));
    showToast('Kiosk deleted successfully', 'success');
    return true;
  };

  const setKioskStatus = (id, newStatus) => {
    setKiosks(prev => prev.map(k => k.id === id ? { ...k, status: newStatus, updatedAt: new Date().toISOString() } : k));
    showToast(`Kiosk status marked as ${newStatus}`, 'success');
  };

  const setKioskAvailability = (id, newAvail) => {
    setKiosks(prev => prev.map(k => k.id === id ? { ...k, availability: newAvail, updatedAt: new Date().toISOString() } : k));
    showToast(`Kiosk marked as ${newAvail}`, 'success');
  };

  // ─── Hardware CRUD ───────────────────────────
  const updateHardwareConfig = (id, fields) => {
    setHardware(prev => prev.map(h => h.id === id ? { ...h, ...fields } : h));
    showToast('Hardware settings configured successfully', 'success');
  };

  const setHardwareConnection = (id, status) => {
    setHardware(prev => prev.map(h => h.id === id ? { ...h, connection: status } : h));
    showToast(`Hardware connection state marked as ${status}`, 'success');
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
      assignPlaylistToGroup,
      categories,
      products,
      addCategory,
      editCategory,
      deleteCategory,
      setCategoryStatus,
      addProduct,
      editProduct,
      deleteProduct,
      setProductStatus,
      customisations,
      addCustomisation,
      editCustomisation,
      deleteCustomisation,
      setCustomisationStatus,
      combos,
      addCombo,
      editCombo,
      deleteCombo,
      setComboStatus,
      setComboAvailability,
      taxes,
      addTax,
      editTax,
      deleteTax,
      setTaxStatus,
      offers,
      addOffer,
      editOffer,
      deleteOffer,
      setOfferStatus,
      kiosks,
      addKiosk,
      editKiosk,
      deleteKiosk,
      setKioskStatus,
      setKioskAvailability,
      orders,
      payments,
      hardware,
      updateHardwareConfig,
      setHardwareConnection
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
