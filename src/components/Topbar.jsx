import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Radio, 
  ChevronDown,
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import '../styles/topbar.css';

export default function Topbar({ 
  searchQuery, 
  setSearchQuery, 
  notifications,
  onMarkNotificationRead,
  onOpenBroadcastModal
}) {
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bto-topbar">
      {/* Left side: Greeting & Global Search */}
      <div className="topbar-left">
        <div className="topbar-greeting-box">
          <div className="topbar-greeting">
            <span>Good morning 👋</span>
            <span style={{ color: '#0077EE' }}>Ahmed Khalid</span>
          </div>
          <span className="topbar-subtitle">Admin Oversight & Verification Desk</span>
        </div>

        <div className="topbar-search-wrapper">
          <Search size={16} className="topbar-search-icon" />
          <input
            type="text"
            className="topbar-search-input"
            placeholder="Search items uploaded by app users, finders, case IDs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Right side: Geo-Alert Broadcast, Notifications, Admin avatar */}
      <div className="topbar-right">
        {/* Geo-Broadcast Push Notification */}
        <button 
          className="btn-secondary"
          onClick={onOpenBroadcastModal}
          style={{ padding: '8px 14px', fontSize: '13px', gap: '6px', color: '#0F2E5C', borderColor: '#CBD5E1' }}
          title="Send Push Geo-Alert to mobile app users"
        >
          <Radio size={15} style={{ color: '#0077EE' }} />
          <span>Dispatch Area Alert</span>
        </button>

        {/* Notification Bell with Dropdown */}
        <div style={{ position: 'relative' }}>
          <button 
            className="notification-bell-btn"
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="bell-badge-pulse" />}
          </button>

          {showNotifMenu && (
            <div className="notification-dropdown">
              <div className="notif-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>App Upload & Match Alerts</span>
                  {unreadCount > 0 && (
                    <span style={{ padding: '2px 7px', background: '#EF4444', color: '#FFFFFF', borderRadius: '10px', fontSize: '10px', fontWeight: 700 }}>
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button 
                  onClick={() => setShowNotifMenu(false)}
                  style={{ color: '#94A3B8' }}
                >
                  <X size={16} />
                </button>
              </div>

              <div className="notif-list">
                {notifications.map(n => (
                  <div 
                    key={n.id} 
                    className={`notif-item ${!n.read ? 'unread' : ''}`}
                    onClick={() => onMarkNotificationRead(n.id)}
                  >
                    <div style={{ marginTop: '2px' }}>
                      {n.type === 'match' && <Sparkles size={16} color="#6366F1" />}
                      {n.type === 'reward' && <AlertCircle size={16} color="#F59E0B" />}
                      {n.type === 'success' && <CheckCircle2 size={16} color="#10B981" />}
                      {n.type === 'location' && <Radio size={16} color="#0077EE" />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', display: 'flex', justifyContent: 'space-between' }}>
                        <span>{n.title}</span>
                        <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 400 }}>{n.time}</span>
                      </div>
                      <p style={{ fontSize: '12px', color: '#64748B', marginTop: '2px', lineHeight: 1.35 }}>
                        {n.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Pill */}
        <div style={{ position: 'relative' }}>
          <div 
            className="topbar-admin-profile"
            onClick={() => setShowAdminMenu(!showAdminMenu)}
          >
            <div className="admin-avatar-top">A</div>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#0A1931' }}>Ahmed Khalid</span>
              <span style={{ fontSize: '10px', color: '#00D2B4', fontWeight: 700 }}>SUPER ADMIN</span>
            </div>
            <ChevronDown size={14} color="#64748B" />
          </div>

          {showAdminMenu && (
            <div 
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '200px',
                background: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                boxShadow: 'var(--shadow-xl)',
                padding: '8px',
                zIndex: 100
              }}
            >
              <div style={{ padding: '8px 12px', borderBottom: '1px solid #F1F5F9', marginBottom: '4px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700 }}>Ahmed Khalid</div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>ahmed.khalid@backtoowner.com</div>
              </div>
              <button 
                style={{ width: '100%', padding: '8px 12px', textAlign: 'left', fontSize: '13px', borderRadius: '6px', color: '#334155' }}
                onClick={() => setShowAdminMenu(false)}
              >
                Admin Profile
              </button>
              <button 
                style={{ width: '100%', padding: '8px 12px', textAlign: 'left', fontSize: '13px', borderRadius: '6px', color: '#334155' }}
                onClick={() => setShowAdminMenu(false)}
              >
                Verification Desk
              </button>
              <button 
                style={{ width: '100%', padding: '8px 12px', textAlign: 'left', fontSize: '13px', borderRadius: '6px', color: '#EF4444', fontWeight: 600 }}
                onClick={() => setShowAdminMenu(false)}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
