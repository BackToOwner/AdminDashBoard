import React from 'react';
import { 
  LayoutDashboard, 
  PackageSearch, 
  Sparkles, 
  Users, 
  BarChart3, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Layers
} from 'lucide-react';
import Logo from '../assets/Logo';
import '../styles/sidebar.css';

export default function Sidebar({
  activeView,
  setActiveView,
  collapsed,
  setCollapsed,
  counts,
  admin
}) {
  const adminName = admin?.name || 'Admin';
  const adminRole = (admin?.role || 'admin').replace('_', ' ');
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'items', label: 'Lost & Found Reports', icon: PackageSearch, badge: counts.activeCases, badgeColor: 'teal' },
    { id: 'matches', label: 'AI Smart Matches', icon: Sparkles, badge: counts.pendingMatches, badgeColor: 'coral' },
    { id: 'categories', label: 'Category Manager', icon: Layers, badge: counts.categoryCount, badgeColor: 'teal' },
    { id: 'users', label: 'Registered Users & Finders', icon: Users },
    { id: 'analytics', label: 'Analytics & Insights', icon: BarChart3 },
    { id: 'settings', label: 'System Settings', icon: Settings }
  ];

  return (
    <aside className={`bto-sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Brand Header with White Background theme */}
      <div className="sidebar-brand-container">
        {!collapsed ? (
          <Logo size="sm" theme="light" showTagline={true} />
        ) : (
          <Logo size="icon-only" theme="light" />
        )}
        <button 
          className="btn-icon" 
          onClick={() => setCollapsed(!collapsed)}
          style={{ width: '30px', height: '30px', background: '#F1F5F9', border: 'none', color: '#64748B', borderRadius: '6px' }}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        {!collapsed && <div className="nav-section-title">Admin Management</div>}
        
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveView(item.id)}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} style={{ flexShrink: 0 }} />
              {!collapsed && (
                <>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className={`nav-badge ${item.badgeColor === 'teal' ? 'nav-badge-teal' : 'nav-badge-coral'}`}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Admin Profile Footer */}
      <div className="sidebar-footer">
        <img
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
          alt={adminName}
          className="admin-avatar-mini"
        />
        {!collapsed && (
          <div className="admin-info-text">
            <div className="admin-name">{adminName}</div>
            <div className="admin-role-badge" style={{ textTransform: 'capitalize' }}>{adminRole}</div>
          </div>
        )}
      </div>
    </aside>
  );
}
