import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Building2, Image, ListMusic, Tv, Layers, ChevronLeft, ChevronRight, LayoutDashboard,
  ShoppingBag, Sliders, Gift, Percent, Smartphone, Receipt, Wrench
} from 'lucide-react';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const sections = [
    {
      title: "General",
      items: [
        { name: "Dashboard", path: "/overview", icon: LayoutDashboard }
      ]
    },
    {
      title: "TV Display (M1)",
      items: [
        { name: "Banners", path: "/banners", icon: Image },
        { name: "Playlists", path: "/playlists", icon: ListMusic },
        { name: "TVs / Devices", path: "/devices", icon: Tv }
      ]
    },
    {
      title: "Self-Order Kiosk (M2)",
      items: [
        { name: "Products & Cats", path: "/kiosk-products", icon: ShoppingBag },
        { name: "Customisations", path: "/kiosk-customisations", icon: Sliders },
        { name: "Combos", path: "/kiosk-combos", icon: Gift },
        { name: "Taxes & Offers", path: "/kiosk-discounts", icon: Percent },
        { name: "Kiosks", path: "/kiosks", icon: Smartphone },
        { name: "Orders & Payments", path: "/kiosk-orders", icon: Receipt },
        { name: "Settings & Hardware", path: "/kiosk-settings", icon: Wrench }
      ]
    }
  ];

  return (
    <aside className="sidebar">
      {/* Sidebar Header / Toggle */}
      <div style={{
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: collapsed ? 'center' : 'space-between',
        padding: '16px',
        borderBottom: '1px solid #1e293b'
      }}>
        {!collapsed && <span style={{ fontWeight: 600, fontSize: '14px', letterSpacing: '0.05em', color: '#94a3b8' }}>ADMIN PANEL</span>}
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          style={{
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            color: '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px',
            borderRadius: '4px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation List */}
      <div style={{ padding: '16px 0', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
        {sections.map((section, sIdx) => (
          <div key={sIdx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {!collapsed && (
              <div style={{ 
                fontSize: '10px', 
                fontWeight: 700, 
                color: '#64748b', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em', 
                padding: '0 16px',
                marginBottom: '4px',
                marginTop: sIdx > 0 ? '8px' : '0'
              }}>
                {section.title}
              </div>
            )}
            {section.items.map((item, itemIdx) => {
              const Icon = item.icon;
              return (
                <div key={itemIdx} className="tooltip-container" style={{ width: '100%' }}>
                  <NavLink 
                    to={item.path}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 16px',
                      fontSize: '13px',
                      color: isActive ? '#ffffff' : '#94a3b8',
                      backgroundColor: isActive ? '#1e293b' : 'transparent',
                      borderLeft: isActive ? '3px solid var(--color-primary)' : '3px solid transparent',
                      transition: 'all 150ms ease',
                      cursor: 'pointer'
                    })}
                    onMouseEnter={(e) => {
                      if (!e.currentTarget.classList.contains('active')) {
                        e.currentTarget.style.color = '#ffffff';
                        e.currentTarget.style.backgroundColor = '#0f172a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!e.currentTarget.classList.contains('active')) {
                        e.currentTarget.style.color = '#94a3b8';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <Icon size={18} style={{ flexShrink: 0 }} />
                    {!collapsed && (
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        {item.name}
                      </span>
                    )}
                  </NavLink>
                  {collapsed && (
                    <span className="tooltip-text">
                      {item.name}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
