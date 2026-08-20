import React, { createContext, useState, useContext } from 'react';
import { initialBusiness, initialBranches } from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('kiosk_admin_auth') === 'true';
  });
  
  const [business, setBusiness] = useState(initialBusiness);
  const [branches, setBranches] = useState(initialBranches);
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

  return (
    <AppContext.Provider value={{
      isAuthenticated,
      business,
      branches,
      toasts,
      showToast,
      login,
      logout,
      updateBusiness,
      addBranch,
      editBranch,
      setBranchStatus
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
