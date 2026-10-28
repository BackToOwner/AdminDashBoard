import React, { useState } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Radio
} from 'lucide-react';
import '../styles/topbar.css';

export default function Topbar({
  searchQuery,
  setSearchQuery,
  notifications = [],
  notificationsLoading = false,
  notificationsError = '',
  onRetryNotifications,
  onMarkNotificationRead,
  admin,
  onLogout
}) {
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  const safeNotifications = Array.isArray(notifications) ? notifications : [];
  const unreadCount = safeNotifications.filter(n => !n.read).length;

  const adminName = admin?.name || admin?.email || 'Admin';
  const adminEmail = admin?.email || '';
  const adminRole = admin?.role || 'Admin';
  const avatarLetter = adminName.trim().charAt(0).toUpperCase() || 'A';

  const handleLogout = () => {
    setShowAdminMenu(false);
    onLogout?.();
  };

  return (
    <header className="bto-topbar">
      <div className="topbar-left">
        <div className="topbar-search-wrapper">
          <Search size={16} className="topbar-search-icon" />
          <input
            type="text"
            className="topbar-search-input"
            placeholder="Search items, cases, or users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94A3B8'
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="topbar-right">
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className="notification-bell-btn"
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            title="Notifications"
            aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="bell-badge-pulse" />}
          </button>

          {showNotifMenu && (
            <div className="notification-dropdown">
              <div className="notif-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span style={{
                      padding: '2px 7px',
                      background: '#EF4444',
                      color: '#FFFFFF',
                      borderRadius: '10px',
                      fontSize: '10px',
                      fontWeight: 700
                    }}>
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  aria-label="Close notifications"
                  onClick={() => setShowNotifMenu(false)}
                  style={{ color: '#94A3B8' }}
                >
                  <X size={16} />
                </button>
              </div>

              <div className="notif-list">
                {notificationsLoading && safeNotifications.length === 0 ? (
                  <div style={{
                    padding: '24px 16px',
                    textAlign: 'center',
                    color: '#64748B',
                    fontSize: '13px'
                  }}>
                    Loading notifications...
                  </div>
                ) : notificationsError && safeNotifications.length === 0 ? (
                  <div style={{
                    padding: '24px 16px',
                    textAlign: 'center',
                    color: '#64748B',
                    fontSize: '13px'
                  }}>
                    <p style={{ margin: '0 0 10px', color: '#DC2626' }}>
                      {notificationsError}
                    </p>
                    <button
                      type="button"
                      onClick={() => onRetryNotifications?.()}
                      style={{
                        border: '1px solid #CBD5E1',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        background: 'white',
                        color: '#334155',
                        cursor: 'pointer'
                      }}
                    >
                      Retry
                    </button>
                  </div>
                ) : safeNotifications.length === 0 ? (
                  <div style={{
                    padding: '24px 16px',
                    textAlign: 'center',
                    color: '#64748B',
                    fontSize: '13px'
                  }}>
                    No notifications yet.
                  </div>
                ) : (
                  safeNotifications.map(n => (
                    <div
                      key={n.id}
                      className={`notif-item ${!n.read ? 'unread' : ''}`}
                      onClick={() => onMarkNotificationRead?.(n.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onMarkNotificationRead?.(n.id);
                        }
                      }}
                    >
                      <div style={{ marginTop: '2px' }}>
                        {n.type === 'match' && <Sparkles size={16} color="#6366F1" />}
                        {n.type === 'reward' && <AlertCircle size={16} color="#F59E0B" />}
                        {n.type === 'success' && <CheckCircle2 size={16} color="#10B981" />}
                        {n.type === 'location' && <Radio size={16} color="#0077EE" />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '13px',
                          fontWeight: 700,
                          color: '#0F172A',
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: '8px'
                        }}>
                          <span>{n.title}</span>
                          <span style={{
                            fontSize: '11px',
                            color: '#94A3B8',
                            fontWeight: 400,
                            whiteSpace: 'nowrap'
                          }}>
                            {n.time}
                          </span>
                        </div>
                        <p style={{
                          fontSize: '12px',
                          color: '#64748B',
                          marginTop: '2px',
                          lineHeight: 1.35
                        }}>
                          {n.message}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className="topbar-admin-profile"
            onClick={() => setShowAdminMenu(!showAdminMenu)}
            aria-expanded={showAdminMenu}
            aria-label="Open admin profile menu"
          >
            <div className="admin-avatar-top">{avatarLetter}</div>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#0A1931' }}>
                {adminName}
              </span>
              <span style={{
                fontSize: '10px',
                color: '#64748B',
                fontWeight: 600,
                textTransform: 'uppercase'
              }}>
                {adminRole}
              </span>
            </div>
            <ChevronDown size={14} color="#64748B" />
          </button>

          {showAdminMenu && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: '220px',
              background: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              boxShadow: 'var(--shadow-xl)',
              padding: '8px',
              zIndex: 100
            }}>
              <div style={{
                padding: '8px 12px',
                borderBottom: '1px solid #F1F5F9',
                marginBottom: '4px',
                overflowWrap: 'anywhere'
              }}>
                <div style={{ fontSize: '13px', fontWeight: 700 }}>{adminName}</div>
                {adminEmail && (
                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: '3px' }}>
                    {adminEmail}
                  </div>
                )}
                <div style={{
                  fontSize: '11px',
                  color: '#64748B',
                  marginTop: '3px',
                  textTransform: 'capitalize'
                }}>
                  {adminRole}
                </div>
              </div>

              <button
                type="button"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  textAlign: 'left',
                  fontSize: '13px',
                  borderRadius: '6px',
                  color: '#EF4444',
                  fontWeight: 600
                }}
                onClick={handleLogout}
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
