import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Smartphone, AlertTriangle, Search, X, ChevronRight, ShoppingBag, ArrowLeft, Plus, Minus
} from 'lucide-react';

const ImageWithFallback = ({ src, alt, style }) => {
  const [isBroken, setIsBroken] = useState(false);
  if (isBroken || !src) {
    return (
      <div style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff7ed', color: '#ea580c' }}>
        <ShoppingBag size={28} />
      </div>
    );
  }
  return (
    <img 
      src={src} 
      alt={alt} 
      style={style} 
      onError={() => setIsBroken(true)} 
    />
  );
};

const KioskPlayer = () => {
  const { kioskId: urlKioskId } = useParams();
  const navigate = useNavigate();
  const { kiosks, categories, products, combos, logout } = useApp();

  // Kiosk pairing and session states
  const [pairedKioskId, setPairedKioskId] = useState(() => {
    return urlKioskId || localStorage.getItem('paired_kiosk_id') || '';
  });
  const [pairingInput, setPairingInput] = useState('');
  const [pairingError, setPairingError] = useState('');

  // UI state management inside kiosk app
  const [kioskState, setKioskState] = useState('welcome'); // 'welcome' | 'menu' | 'product_details'
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);

  // Menu filters & search state
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderType, setOrderType] = useState('Dine In'); // 'Dine In' | 'Takeaway'
  const [dietFilter, setDietFilter] = useState('All'); // 'All' | 'Veg' | 'Non-Veg'
  const [sortBy, setSortBy] = useState('default'); // 'default' | 'priceAsc' | 'priceDesc' | 'rating'

  // Selected product details
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailQuantity, setDetailQuantity] = useState(1);

  // Cart count placeholder (Phase 4 Cart integration ready)
  const [cartCount, setCartCount] = useState(0);

  // Logout confirmation modal state
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Update pairing state when url param changes
  useEffect(() => {
    if (urlKioskId && urlKioskId !== 'pair') {
      setPairedKioskId(urlKioskId);
      localStorage.setItem('paired_kiosk_id', urlKioskId);
    }
  }, [urlKioskId]);

  // Load Kiosk configuration simulation on pairing change
  useEffect(() => {
    if (pairedKioskId && pairedKioskId !== 'pair') {
      setIsLoadingConfig(true);
      const timer = setTimeout(() => {
        setIsLoadingConfig(false);
        setKioskState('welcome');
      }, 15000 / 10); // 1.5 seconds loading config state
      return () => clearTimeout(timer);
    }
  }, [pairedKioskId]);

  // Find active kiosk details
  const kiosk = kiosks.find(k => k.kioskId === pairedKioskId);
  const isKioskValid = kiosk && kiosk.status === 'Active';

  // Handle pairing form submit
  const handlePairSubmit = (e) => {
    e.preventDefault();
    const enteredCode = pairingInput.trim().toUpperCase();
    const matchedKiosk = kiosks.find(k => k.kioskId === enteredCode);

    if (matchedKiosk) {
      if (matchedKiosk.status === 'Active') {
        setPairedKioskId(enteredCode);
        localStorage.setItem('paired_kiosk_id', enteredCode);
        setPairingError('');
        navigate(`/kiosk/${enteredCode}`);
      } else {
        setPairingError('This kiosk device is currently Inactive. Please activate it first.');
      }
    } else {
      setPairingError('Invalid Kiosk ID. Ensure the kiosk is registered in Admin.');
    }
  };

  const handleStartOrder = () => {
    setKioskState('menu');
    setSelectedCategory('all');
    setSearchQuery('');
  };

  const handleBackToWelcome = () => {
    setKioskState('welcome');
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setDetailQuantity(1);
    setKioskState('product_details');
  };

  const handleBackToMenu = () => {
    setKioskState('menu');
    setSelectedProduct(null);
  };

  const handleUnpairKiosk = () => {
    localStorage.removeItem('paired_kiosk_id');
    setPairedKioskId('');
    setKioskState('welcome');
    setIsLoadingConfig(true);
    navigate('/kiosk/pair');
  };

  // Resolve categories allowed on this specific kiosk
  const allowedCategories = categories.filter(cat => {
    if (cat.status !== 'Active') return false;
    // Check if kiosk limits categories
    if (kiosk && kiosk.categoriesAvailability) {
      return kiosk.categoriesAvailability.includes(cat.id);
    }
    return true;
  });

  // Resolve products allowed on this specific kiosk
  const allowedProducts = products.filter(prod => {
    if (prod.status !== 'Active') return false;
    if (kiosk && kiosk.productsAvailability) {
      return kiosk.productsAvailability.includes(prod.id);
    }
    return true;
  });

  // Veg / Non-Veg detection helper
  const isVegProduct = (prod) => {
    const lowerName = prod.name.toLowerCase();
    const lowerDesc = (prod.description || '').toLowerCase();
    return !lowerName.includes('chicken') && !lowerName.includes('mutton') && !lowerName.includes('fish') && !lowerName.includes('egg') &&
           !lowerDesc.includes('chicken') && !lowerDesc.includes('mutton') && !lowerDesc.includes('fish') && !lowerDesc.includes('egg');
  };

  // Filter products based on selected category, search queries, and diet classifications
  const filteredProducts = allowedProducts.filter(prod => {
    const matchesCategory = selectedCategory === 'all' || prod.categoryId === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prod.description && prod.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDiet = dietFilter === 'All' ||
      (dietFilter === 'Veg' && isVegProduct(prod)) ||
      (dietFilter === 'Non-Veg' && !isVegProduct(prod));
    return matchesCategory && matchesSearch && matchesDiet;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'priceAsc') return Number(a.price) - Number(b.price);
    if (sortBy === 'priceDesc') return Number(b.price) - Number(a.price);
    if (sortBy === 'rating') {
      const ratingA = (a.id.charCodeAt(a.id.length - 1) % 10) / 10 + 4.0; // 4.0 to 4.9
      const ratingB = (b.id.charCodeAt(b.id.length - 1) % 10) / 10 + 4.0;
      return ratingB - ratingA;
    }
    return 0; // default
  });

  // 1. Kiosk Login / Pairing Setup Screen
  if (!pairedKioskId || pairedKioskId === 'pair' || !isKioskValid) {
    return (
      <div style={{
        height: '100vh',
        width: '100vw',
        backgroundColor: 'var(--color-background)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-text-primary)',
        fontFamily: 'system-ui, sans-serif',
        padding: '24px',
        position: 'relative'
      }}>
        <div className="card" style={{ 
          width: '100%', 
          maxWidth: '380px', 
          backgroundColor: '#ffffff', 
          padding: '32px', 
          borderRadius: '8px', 
          boxShadow: 'var(--shadow-lg)', 
          border: '1px solid var(--color-border)' 
        }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '8px', backgroundColor: 'rgba(249, 115, 22, 0.1)', color: '#f97316', marginBottom: '16px' }}>
              <Smartphone size={24} />
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 6px 0', color: 'var(--color-text-primary)' }}>Link Order Kiosk</h2>
            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0 }}>Register this display screen as a self-order kiosk</p>
          </div>

          <form onSubmit={handlePairSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Kiosk ID / Serial Code</label>
              <input 
                type="text"
                value={pairingInput}
                onChange={(e) => setPairingInput(e.target.value)}
                placeholder="e.g. K-UD-01"
                style={{
                  width: '100%',
                  height: '40px',
                  backgroundColor: '#ffffff',
                  border: pairingError ? '1px solid var(--color-error)' : '1px solid #cbd5e1',
                  borderRadius: '6px',
                  color: 'var(--color-text-primary)',
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
              style={{ width: '100%', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '14px', fontWeight: 600 }}
            >
              <span>Initialize Kiosk</span>
            </button>
          </form>

          {/* Quick registry helper for development testing */}
          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase' }}>Registered Kiosk Codes:</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {kiosks.map(k => (
                <span 
                  key={k.id} 
                  onClick={() => setPairingInput(k.kioskId)}
                  style={{ 
                    fontSize: '10px', 
                    padding: '4px 8px', 
                    backgroundColor: '#f8fafc', 
                    borderRadius: '4px', 
                    color: k.status === 'Active' ? '#ea580c' : '#64748b', 
                    cursor: 'pointer', 
                    border: k.status === 'Active' ? '1px solid #fdba74' : '1px solid #cbd5e1',
                    fontWeight: 600
                  }}
                >
                  {k.kioskId} ({k.status})
                </span>
              ))}
            </div>
          </div>
        </div>

        <button 
          onClick={() => navigate('/kiosks')}
          style={{ position: 'absolute', bottom: '24px', background: 'none', border: 'none', color: '#64748b', fontSize: '12px', cursor: 'pointer' }}
        >
          Back to Portal Admin
        </button>
      </div>
    );
  }

  // 2. Kiosk Loading Config state
  if (isLoadingConfig) {
    return (
      <div style={{
        height: '100vh',
        width: '100vw',
        backgroundColor: 'var(--color-background)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-text-primary)',
        fontFamily: 'system-ui, sans-serif',
        padding: '24px',
        userSelect: 'none'
      }}>
        <style>{`
          @keyframes fillProgress {
            0% { width: 0%; transform: translateX(-100%); }
            50% { width: 60%; transform: translateX(0%); }
            100% { width: 100%; transform: translateX(100%); }
          }
        `}</style>
        
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: '24px',
          maxWidth: '380px',
          width: '100%',
          backgroundColor: '#ffffff',
          padding: '48px 32px',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: 'var(--shadow-lg)',
          textAlign: 'center'
        }}>
          {/* Centered Logo container matching touch page */}
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: '72px', 
            height: '72px', 
            borderRadius: '50%', 
            backgroundColor: 'rgba(59, 130, 246, 0.08)',
            color: '#3b82f6', 
            marginBottom: '4px'
          }}>
            <ShoppingBag size={32} />
          </div>

          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b', margin: '0 0 4px 0' }}>Bistro Self-Order Kiosk</h1>
            <p style={{ fontSize: '12px', color: '#64748b', margin: 0, fontWeight: 500 }}>Fresh Food, Instantly Ordered</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%', marginTop: '8px' }}>
            {/* Clean Progress Bar */}
            <div style={{ 
              width: '100%', 
              height: '4px', 
              backgroundColor: '#f1f5f9', 
              borderRadius: '2px', 
              overflow: 'hidden',
              position: 'relative'
            }}>
              <div style={{ 
                position: 'absolute',
                top: 0, left: 0, bottom: 0,
                backgroundColor: '#3b82f6', 
                borderRadius: '2px',
                animation: 'fillProgress 1.6s infinite ease-in-out',
                transformOrigin: 'left'
              }}></div>
            </div>
            
            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.02em' }}>
              Loading your experience...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 3. Welcome / Start Order screen
  if (kioskState === 'welcome') {
    return (
      <div 
        onClick={handleStartOrder}
        style={{
          height: '100vh',
          width: '100vw',
          backgroundColor: 'var(--color-background)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: 'var(--color-text-primary)',
          fontFamily: 'system-ui, sans-serif',
          padding: '48px 24px',
          textAlign: 'center',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <style>{`
          @keyframes pulseIcon {
            0%, 100% { transform: scale(1); background-color: rgba(59, 130, 246, 0.1); }
            50% { transform: scale(1.08); background-color: rgba(59, 130, 246, 0.18); }
          }
        `}</style>

        {/* Top Branding */}
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '0.05em', color: '#1e293b', margin: '0 0 4px 0' }}>Bistro Self-Order Kiosk</h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0, fontWeight: 500 }}>Fresh Food, Instantly Ordered</p>
        </div>

        {/* Centered Start Order Card */}
        <div style={{ 
          width: '100%',
          maxWidth: '380px', 
          backgroundColor: '#ffffff', 
          padding: '48px 32px', 
          borderRadius: '16px', 
          border: '1px solid #e2e8f0',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          transition: 'transform 0.2s',
        }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            color: '#3b82f6', 
            animation: 'pulseIcon 2s infinite',
            marginBottom: '8px'
          }}>
            <ShoppingBag size={38} />
          </div>

          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>Touch screen to begin</h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Tap anywhere on the display to place your order</p>
          </div>
        </div>

        {/* Bottom Kiosk Details */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ fontSize: '11px', color: '#64748b', backgroundColor: '#f1f5f9', padding: '6px 14px', borderRadius: '20px', border: '1px solid #e2e8f0', fontWeight: 600 }}>
            Terminal: {kiosk.name} • Branch: {kiosk.location}
          </div>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleUnpairKiosk();
            }}
            style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '10px', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Unpair Terminal
          </button>
        </div>
      </div>
    );
  }

  // 4. Products Listing & Categories Menu View
  if (kioskState === 'menu') {
    return (
      <div style={{
        height: '100vh',
        width: '100vw',
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text-primary)',
        fontFamily: 'system-ui, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Kiosk Header */}
        <header style={{ 
          height: '64px', 
          backgroundColor: '#ffffff', 
          borderBottom: '1px solid #e2e8f0', 
          padding: '0 24px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          flexShrink: 0,
          boxShadow: '0 1px 3px 0 rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 800, fontSize: '16px', color: '#1e293b', letterSpacing: '0.02em' }}>Bistro Self-Order Kiosk</span>
            <span style={{ fontSize: '10px', backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '10px', fontWeight: 600, color: '#64748b' }}>
              Terminal: {kiosk.kioskId}
            </span>
          </div>

          {/* Menu Search in Header */}
          <div style={{ position: 'relative', width: '220px' }}>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search menu..."
              style={{
                width: '100%',
                height: '34px',
                borderRadius: '17px',
                border: '1px solid #cbd5e1',
                padding: '0 32px 0 12px',
                fontSize: '12px',
                outline: 'none',
                backgroundColor: '#f8fafc'
              }}
            />
            {searchQuery ? (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '10px', top: '9px', border: 'none', background: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                <X size={14} />
              </button>
            ) : (
              <Search size={14} style={{ position: 'absolute', right: '12px', top: '10px', color: '#94a3b8' }} />
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Cart Trigger */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              backgroundColor: '#fff7ed', 
              color: '#ea580c', 
              padding: '6px 14px', 
              borderRadius: '20px', 
              border: '1px solid #fdba74',
              fontSize: '12px', 
              fontWeight: 700 
            }}>
              <ShoppingBag size={14} />
              <span>Cart ({cartCount})</span>
            </div>

            {/* Logout button (returns to login) */}
            <button 
              onClick={() => {
                setShowLogoutConfirm(true);
              }}
              style={{ 
                background: 'none', 
                border: '1px solid #e2e8f0', 
                color: '#64748b', 
                fontSize: '12px', 
                cursor: 'pointer', 
                fontWeight: 600,
                padding: '6px 12px',
                borderRadius: '6px',
                backgroundColor: '#ffffff'
              }}
            >
              Logout
            </button>
          </div>
        </header>

        {/* Sub-Header controls: Takeaway + Categories + Filters & Sorting */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          borderBottom: '1px solid #e2e8f0', 
          padding: '12px 24px', 
          display: 'flex', 
          flexDirection: 'column',
          gap: '12px',
          flexShrink: 0
        }}>
          {/* Order Type (Takeaway option) & Filter and Sort controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            
            {/* Takeaway Option Selectors */}
            <div style={{ display: 'flex', backgroundColor: '#f1f5f9', padding: '3px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              {['Dine In', 'Takeaway'].map((type) => {
                const isActive = orderType === type;
                return (
                  <button
                    key={type}
                    onClick={() => setOrderType(type)}
                    style={{
                      padding: '6px 16px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      backgroundColor: isActive ? '#ffffff' : 'transparent',
                      color: isActive ? '#ea580c' : '#64748b',
                      boxShadow: isActive ? '0 1px 3px 0 rgba(0,0,0,0.08)' : 'none'
                    }}
                  >
                    {type}
                  </button>
                );
              })}
            </div>

            {/* Diet Filters & Sorting Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Veg / Non-Veg diet pills */}
              <div style={{ display: 'flex', gap: '4px', backgroundColor: '#f1f5f9', padding: '3px', borderRadius: '8px' }}>
                {['All', 'Veg', 'Non-Veg'].map((diet) => {
                  const isActive = dietFilter === diet;
                  return (
                    <button
                      key={diet}
                      onClick={() => setDietFilter(diet)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        backgroundColor: isActive ? '#ea580c' : 'transparent',
                        color: isActive ? '#ffffff' : '#64748b'
                      }}
                    >
                      {diet}
                    </button>
                  );
                })}
              </div>

              {/* Sort selector dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  height: '32px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#475569',
                  padding: '0 8px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="default">Default Sort</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Categories Bar */}
          <div style={{ 
            display: 'flex', 
            gap: '8px', 
            overflowX: 'auto',
            paddingTop: '4px'
          }}>
            <button 
              onClick={() => setSelectedCategory('all')}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: selectedCategory === 'all' ? '1px solid #fdba74' : '1px solid #e2e8f0',
                backgroundColor: selectedCategory === 'all' ? '#fff7ed' : '#f8fafc',
                color: selectedCategory === 'all' ? '#ea580c' : '#64748b',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap'
              }}
            >
              All Items
            </button>
            {allowedCategories.map(cat => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button 
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: isSelected ? '1px solid #fdba74' : '1px solid #e2e8f0',
                    backgroundColor: isSelected ? '#fff7ed' : '#f8fafc',
                    color: isSelected ? '#ea580c' : '#64748b',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Products Grid Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {sortedProducts.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 0', gap: '12px', color: '#64748b' }}>
              <AlertTriangle size={36} style={{ color: '#94a3b8' }} />
              <span style={{ fontSize: '13px', fontWeight: 500 }}>No products match the selected filters.</span>
              {(searchQuery || dietFilter !== 'All') && (
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setDietFilter('All');
                  }}
                  style={{ background: 'none', border: 'none', color: '#1d4ed8', fontSize: '12px', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Reset filters
                </button>
              )}
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
              gap: '20px' 
            }}>
              {sortedProducts.map(prod => {
                const isOutOfStock = prod.availability === 'Out of Stock' || prod.stockQty <= 0;
                // Generate a rating based on product properties
                const itemRating = ((prod.id.charCodeAt(prod.id.length - 1) % 10) / 10 + 4.0).toFixed(1);
                
                return (
                  <div 
                    key={prod.id}
                    onClick={() => !isOutOfStock && handleProductClick(prod)}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      overflow: 'hidden',
                      boxShadow: '0 2px 8px -2px rgba(0,0,0,0.05)',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                      position: 'relative',
                      opacity: isOutOfStock ? 0.6 : 1,
                      transition: 'transform 0.15s, box-shadow 0.15s'
                    }}
                  >
                    <div style={{ width: '100%', aspectRatio: '4/3', backgroundColor: '#f8fafc', position: 'relative', overflow: 'hidden' }}>
                      <ImageWithFallback 
                        src={prod.image} 
                        alt={prod.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                      

                    {/* Rating Badge */}
                    {!isOutOfStock && (
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: 700,
                        color: '#475569',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px'
                      }}>
                        <span>⭐</span>
                        <span>{itemRating}</span>
                      </div>
                    )}

                    {isOutOfStock && (
                      <div style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#64748b',
                        fontWeight: 700,
                        fontSize: '11px',
                        letterSpacing: '0.05em'
                      }}>
                        OUT OF STOCK
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', flex: 1, gap: '6px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginBottom: '2px', lineHeight: '1.3' }}>
                        {prod.name}
                      </div>
                      {prod.description && (
                        <div style={{ fontSize: '11px', color: '#64748b', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.4' }}>
                          {prod.description}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
                      <span style={{ fontSize: '15px', fontWeight: 800, color: '#ea580c' }}>
                        ₹{Number(prod.price || 0).toFixed(2)}
                      </span>
                      <button 
                        disabled={isOutOfStock}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isOutOfStock) handleProductClick(prod);
                        }}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '16px',
                          backgroundColor: isOutOfStock ? '#cbd5e1' : '#fff7ed',
                          color: isOutOfStock ? '#64748b' : '#ea580c',
                          border: isOutOfStock ? 'none' : '1px solid #fdba74',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                          transition: 'all 0.15s'
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              );
              })}
            </div>
          )}
        </div>

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.3)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '24px'
          }}>
            <div className="card" style={{
              width: '100%',
              maxWidth: '340px',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--color-border)',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                Confirm Logout
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '20px', lineHeight: '1.5' }}>
                Are you sure you want to log out from this kiosk terminal? This will return you to the login screen.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="btn btn-outline"
                  style={{ flex: 1, height: '38px', fontSize: '13px', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowLogoutConfirm(false);
                    logout();
                    navigate('/login');
                  }}
                  className="btn btn-primary"
                  style={{ flex: 1, height: '38px', fontSize: '13px', fontWeight: 600, backgroundColor: '#ea580c', borderColor: '#fdba74' }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 5. Product Details Modal / Card View (Placeholder Bridge to Phase 2 modifiers)
  if (kioskState === 'product_details' && selectedProduct) {
    return (
      <div style={{
        height: '100vh',
        width: '100vw',
        backgroundColor: '#f8fafc',
        color: '#0f172a',
        fontFamily: 'system-ui, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <header style={{ 
          height: '60px', 
          backgroundColor: '#ffffff', 
          borderBottom: '1px solid #e2e8f0', 
          padding: '0 24px', 
          display: 'flex', 
          alignItems: 'center',
          flexShrink: 0
        }}>
          <button 
            onClick={handleBackToMenu}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#1e293b', 
              fontSize: '14px', 
              fontWeight: 600, 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Menu</span>
          </button>
        </header>

        {/* Content Container */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '640px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
            {/* Image banner */}
            <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: '#f1f5f9', position: 'relative' }}>
              <ImageWithFallback 
                src={selectedProduct.image} 
                alt={selectedProduct.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>

            {/* Product description & selections */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 850, color: '#1e293b', margin: '0 0 4px 0' }}>{selectedProduct.name}</h2>
                <span style={{ fontSize: '18px', fontWeight: 800, color: '#ea580c' }}>
                  ₹{Number(selectedProduct.price || 0).toFixed(2)}
                </span>
              </div>

              {selectedProduct.description && (
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.5' }}>
                  {selectedProduct.description}
                </p>
              )}

              <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {/* Quantity adjustments */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', border: '1px solid #cbd5e1', borderRadius: '20px', padding: '4px 12px' }}>
                  <button 
                    onClick={() => setDetailQuantity(q => Math.max(1, q - 1))}
                    style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                    <Minus size={14} />
                  </button>
                  <span style={{ fontSize: '14px', fontWeight: 700, width: '20px', textAlign: 'center' }}>{detailQuantity}</span>
                  <button 
                    onClick={() => setDetailQuantity(q => q + 1)}
                    style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Primary CTA (Ready for Phase 2 Customisation hook) */}
                <button 
                  onClick={() => {
                    setCartCount(prev => prev + detailQuantity);
                    handleBackToMenu();
                  }}
                  style={{
                    height: '42px',
                    padding: '0 24px',
                    borderRadius: '21px',
                    backgroundColor: '#fff7ed',
                    border: '1px solid #fdba74',
                    color: '#ea580c',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Add to Order — ₹{Number(selectedProduct.price * detailQuantity).toFixed(2)}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default KioskPlayer;
