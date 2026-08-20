import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Building2, MapPin, Monitor, Image, ListMusic, Calendar, 
  Tv, Layers, Settings, ChevronLeft, ChevronRight, LayoutDashboard
} from 'lucide-react';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const menuItems = [
    {
      section: "Business",
      items: [
        { name: "Business Settings", path: "/business", icon: Building2 },
        { name: "Branches", path: "/branches", icon: MapPin },
      ]
    },
    {
      section: "TV Display",
      items: [
        { name: "Overview", path: "/overview", icon: LayoutDashboard },
        { name: "Banners", path: "/banners", icon: Image },
        { name: "Playlists", path: "/playlists", icon: ListMusic, upcoming: true },
        { name: "Schedules", path: "/schedules", icon: Calendar, upcoming: true },
        { name: "TVs / Devices", path: "/devices", icon: Tv, upcoming: true },
        { name: "Display Groups", path: "/groups", icon: Layers, upcoming: true },
        { name: "Display Settings", path: "/display-settings", icon: Settings, upcoming: true }
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
      <div style={{ padding: '16px 0', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {menuItems.map((section, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {!collapsed && (
              <span style={{ 
                fontSize: '11px', 
                fontWeight: 600, 
                textTransform: 'uppercase', 
                color: '#64748b', 
                padding: '0 16px 4px 16px',
                letterSpacing: '0.05em'
              }}>
                {section.section}
              </span>
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
                        {item.upcoming && (
                          <span style={{ 
                            fontSize: '9px', 
                            padding: '1px 5px', 
                            borderRadius: '3px', 
                            backgroundColor: '#1e293b', 
                            color: '#64748b',
                            fontWeight: 600
                          }}>
                            SOON
                          </span>
                        )}
                      </span>
                    )}
                  </NavLink>
                  {collapsed && (
                    <span className="tooltip-text">
                      {item.name} {item.upcoming ? '(Soon)' : ''}
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
