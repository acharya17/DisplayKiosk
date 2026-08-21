import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import AdminLayout from './components/layout/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BusinessSettings from './pages/BusinessSettings';
import Branches from './pages/Branches';
import Banners from './pages/Banners';
import Playlists from './pages/Playlists';
import Devices from './pages/Devices';
import Groups from './pages/Groups';
import TvPlayer from './pages/TvPlayer';
import KioskProducts from './pages/KioskProducts';
import KioskCustomisations from './pages/KioskCustomisations';
import KioskCombos from './pages/KioskCombos';
import KioskTaxOffers from './pages/KioskTaxOffers';
import PlaceholderPage from './pages/PlaceholderPage';

// Import CSS Styles
import './styles/index.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes (Wrapped in Layout) */}
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Navigate to="/overview" replace />} />
            <Route path="overview" element={<Dashboard />} />
            <Route path="business" element={<BusinessSettings />} />
            <Route path="branches" element={<Branches />} />
            
            {/* Future Phase Placeholders */}
            <Route path="banners" element={<Banners />} />
            <Route path="playlists" element={<Playlists />} />
            <Route path="schedules" element={<PlaceholderPage />} />
            <Route path="devices" element={<Devices />} />
            <Route path="groups" element={<Groups />} />
            <Route path="display-settings" element={<PlaceholderPage />} />
            
            {/* Module 2 Placeholders */}
            <Route path="kiosk-products" element={<KioskProducts />} />
            <Route path="kiosk-customisations" element={<KioskCustomisations />} />
            <Route path="kiosk-combos" element={<KioskCombos />} />
            <Route path="kiosk-discounts" element={<KioskTaxOffers />} />
            <Route path="kiosks" element={<PlaceholderPage />} />
            <Route path="kiosk-orders" element={<PlaceholderPage />} />
            <Route path="kiosk-settings" element={<PlaceholderPage />} />
            
            {/* Fallback inside portal */}
            <Route path="*" element={<Navigate to="/overview" replace />} />
          </Route>
          
          {/* Global Fallback */}
          <Route path="/player/:tvId" element={<TvPlayer />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
