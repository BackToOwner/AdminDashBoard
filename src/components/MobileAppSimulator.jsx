import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Bell, 
  MapPin, 
  Clock, 
  Sparkles, 
  Home, 
  Compass, 
  PlusCircle, 
  User, 
  ShieldCheck, 
  ChevronRight,
  Lock,
  Mail,
  Smartphone
} from 'lucide-react';
import Logo from '../assets/Logo';
import '../styles/mobile-simulator.css';

export default function MobileAppSimulator({ items = [], onClose }) {
  const [mobileScreen, setMobileScreen] = useState('home'); // 'home', 'signin', 'lost', 'found'
  const [mobileFilter, setMobileFilter] = useState('all');
  const [authTab, setAuthTab] = useState('signin'); // 'signin' or 'signup'
  const [selectedMobileItem, setSelectedMobileItem] = useState(null);

  const filteredItems = items.filter(item => {
    if (mobileFilter === 'all') return true;
    if (mobileFilter === 'lost') return item.type === 'lost';
    if (mobileFilter === 'found') return item.type === 'found';
    return true;
  });

  return (
    <div className="mobile-sim-drawer">
      {/* Drawer Control Header */}
      <div className="sim-drawer-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Smartphone size={18} color="#00D2B4" />
          <span style={{ fontSize: '14px', fontWeight: 800 }}>Mobile App Simulator</span>
        </div>

        {/* Screen Switcher */}
        <div className="sim-screen-switch-tabs">
          <button 
            className={`sim-tab-btn ${mobileScreen === 'home' ? 'active' : ''}`}
            onClick={() => { setMobileScreen('home'); setSelectedMobileItem(null); }}
          >
            App Home
          </button>
          <button 
            className={`sim-tab-btn ${mobileScreen === 'signin' ? 'active' : ''}`}
            onClick={() => { setMobileScreen('signin'); setSelectedMobileItem(null); }}
          >
            Sign In
          </button>
        </div>

        <button 
          onClick={onClose}
          style={{ color: '#94A3B8', padding: '4px', background: 'none' }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Viewport Chassis */}
      <div className="sim-body-viewport">
        <div className="phone-chassis">
          {/* Status Notch */}
          <div className="phone-notch-bar">
            <span>9:41</span>
            <div className="phone-notch-pill" />
            <div style={{ display: 'flex', gap: '4px' }}>
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>

          {/* ===============================================================
              SCREEN 1: SIGN IN / SIGN UP SCREEN (Matching User Screenshot)
              =============================================================== */}
          {mobileScreen === 'signin' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg, #0A1931 0%, #103467 45%, #184A88 100%)' }}>
              {/* Logo Area */}
              <div style={{ padding: '36px 20px 24px', textAlign: 'center', color: '#FFFFFF' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                  <Logo size="icon-only" theme="dark" />
                </div>
                <div style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em' }}>
                  Back<span style={{ color: '#00D2B4' }}>To</span>Owner
                </div>
                <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                  Welcome back!
                </div>
              </div>

              {/* White Curved Card */}
              <div style={{ flex: 1, background: '#FFFFFF', borderTopLeftRadius: '32px', borderTopRightRadius: '32px', padding: '24px 20px', display: 'flex', flexDirection: 'column' }}>
                {/* Segmented Sign In / Sign Up pill */}
                <div style={{ display: 'flex', background: '#F1F5F9', borderRadius: 'var(--radius-pill)', padding: '4px', marginBottom: '20px' }}>
                  <button
                    onClick={() => setAuthTab('signin')}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      background: authTab === 'signin' ? '#0A1E4A' : 'transparent',
                      color: authTab === 'signin' ? '#FFFFFF' : '#64748B',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setAuthTab('signup')}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      background: authTab === 'signup' ? '#0A1E4A' : 'transparent',
                      color: authTab === 'signup' ? '#FFFFFF' : '#64748B',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Email input */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '11.5px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                    <input 
                      type="text" 
                      defaultValue="you@example.com" 
                      style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '13px', background: '#F8FAFC' }} 
                    />
                  </div>
                </div>

                {/* Password input */}
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ fontSize: '11.5px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                    <input 
                      type="password" 
                      defaultValue="••••••••••••" 
                      style={{ width: '100%', padding: '10px 48px 10px 36px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '13px', background: '#F8FAFC' }} 
                    />
                    <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: '#0077EE', fontWeight: 700, cursor: 'pointer' }}>
                      Show
                    </span>
                  </div>
                </div>

                {/* Forgot password */}
                <div style={{ textAlign: 'center', margin: '8px 0 16px' }}>
                  <span style={{ fontSize: '11.5px', color: '#0077EE', fontWeight: 600, cursor: 'pointer' }}>
                    Forgot password?
                  </span>
                </div>

                {/* Sign In Gradient Button */}
                <button
                  onClick={() => setMobileScreen('home')}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #0077EE 0%, #00D2B4 100%)',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '14px',
                    boxShadow: '0 8px 20px rgba(0, 210, 180, 0.3)',
                    marginBottom: '16px'
                  }}
                >
                  Sign In
                </button>

                {/* Google Sign In */}
                <div style={{ textAlign: 'center', fontSize: '11px', color: '#94A3B8', marginBottom: '12px' }}>
                  or continue with
                </div>
                <button
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '12px',
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    fontWeight: 700,
                    fontSize: '13px',
                    color: '#1E293B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '16px', height: '16px' }} />
                  <span>Google</span>
                </button>
              </div>
            </div>
          )}

          {/* ===============================================================
              SCREEN 2: MOBILE HOME SCREEN (Matching User Screenshot)
              =============================================================== */}
          {mobileScreen === 'home' && (
            <div className="mobile-app-content-scroll">
              {/* Header Gradient (Navy Blue) */}
              <div className="mobile-header-blue-section">
                <div className="mobile-user-row">
                  <div>
                    <div className="mobile-user-greeting">Good morning 👋</div>
                    <div className="mobile-user-name">Ahmed Khalid</div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ position: 'relative', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Bell size={15} color="#FFFFFF" />
                      <span style={{ position: 'absolute', top: '5px', right: '5px', width: '6px', height: '6px', borderRadius: '50%', background: '#00D2B4' }} />
                    </div>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#00D2B4', color: '#07152B', fontWeight: 800, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      A
                    </div>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="mobile-search-bar">
                  <Search size={14} color="#94A3B8" />
                  <span>Search lost or found items...</span>
                </div>

                {/* 3 Stats Pills */}
                <div className="mobile-stats-row">
                  <div className="mobile-stat-pill">
                    <span style={{ color: '#10B981', fontSize: '12px' }}>✓</span>
                    <div className="mobile-stat-value">12,483</div>
                    <div className="mobile-stat-title">Items Returned</div>
                  </div>

                  <div className="mobile-stat-pill">
                    <span style={{ color: '#38BDF8', fontSize: '12px' }}>🔍</span>
                    <div className="mobile-stat-value">3,291</div>
                    <div className="mobile-stat-title">Active Cases</div>
                  </div>

                  <div className="mobile-stat-pill">
                    <span style={{ color: '#F59E0B', fontSize: '12px' }}>🎯</span>
                    <div className="mobile-stat-value">78%</div>
                    <div className="mobile-stat-title">Success Rate</div>
                  </div>
                </div>
              </div>

              {/* Quick Actions (Red & Green cards) */}
              <div style={{ padding: '14px 16px 0' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                  Quick Actions
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {/* Report Lost */}
                  <div className="mobile-action-card-lost">
                    <div style={{ fontSize: '24px' }}>🥺</div>
                    <div style={{ fontSize: '13px', fontWeight: 800 }}>Report Lost</div>
                    <div style={{ fontSize: '9.5px', opacity: 0.9 }}>Lost something?</div>
                  </div>

                  {/* Report Found */}
                  <div className="mobile-action-card-found">
                    <div style={{ fontSize: '24px' }}>🎉</div>
                    <div style={{ fontSize: '13px', fontWeight: 800 }}>Report Found</div>
                    <div style={{ fontSize: '9.5px', opacity: 0.9 }}>Found something?</div>
                  </div>
                </div>
              </div>

              {/* Nearby Items Radar */}
              <div className="mobile-nearby-section">
                <div className="mobile-section-header-row">
                  <span className="mobile-section-heading">Nearby Items</span>
                  <span className="mobile-link-blue">View Map →</span>
                </div>

                <div className="mobile-radar-box">
                  <div className="map-grid-overlay" style={{ backgroundSize: '35px 35px' }} />
                  {/* Center Dot */}
                  <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '8px', height: '8px', borderRadius: '50%', background: '#0077EE', border: '2px solid #FFFFFF' }} />
                  {/* Pins */}
                  <div style={{ position: 'absolute', left: '32%', top: '38%', width: '10px', height: '10px', borderRadius: '50%', background: '#FF5252', border: '1.5px solid #fff' }} />
                  <div style={{ position: 'absolute', left: '60%', top: '42%', width: '10px', height: '10px', borderRadius: '50%', background: '#0077EE', border: '1.5px solid #fff' }} />
                  <div style={{ position: 'absolute', left: '65%', top: '65%', width: '10px', height: '10px', borderRadius: '50%', background: '#10B981', border: '1.5px solid #fff' }} />
                  <div style={{ position: 'absolute', left: '80%', top: '30%', width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B', border: '1.5px solid #fff' }} />

                  {/* Badge */}
                  <div style={{ position: 'absolute', bottom: '8px', left: '10px', background: 'rgba(255,255,255,0.95)', padding: '3px 8px', borderRadius: '10px', fontSize: '9.5px', fontWeight: 700, color: '#0F172A', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                    📍 3 items within 1km
                  </div>
                </div>
              </div>

              {/* Recent Reports Section */}
              <div className="mobile-reports-section">
                <div className="mobile-section-header-row">
                  <span className="mobile-section-heading">Recent Reports</span>
                  <span className="mobile-link-blue">See all →</span>
                </div>

                {/* Filter Pills */}
                <div className="mobile-filter-pills-row">
                  <button 
                    className={`mobile-filter-chip ${mobileFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setMobileFilter('all')}
                  >
                    All
                  </button>
                  <button 
                    className={`mobile-filter-chip ${mobileFilter === 'lost' ? 'active' : ''}`}
                    onClick={() => setMobileFilter('lost')}
                  >
                    💛 Lost
                  </button>
                  <button 
                    className={`mobile-filter-chip ${mobileFilter === 'found' ? 'active' : ''}`}
                    onClick={() => setMobileFilter('found')}
                  >
                    💙 Found
                  </button>
                </div>

                {/* Item List */}
                {filteredItems.slice(0, 5).map((item) => (
                  <div key={item.id} className="mobile-report-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img 
                        src={item.images ? item.images[0] : 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=150&auto=format&fit=crop&q=80'} 
                        alt={item.title}
                        style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover' }} 
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0F172A' }}>{item.title}</span>
                          {item.matched && (
                            <span style={{ fontSize: '8px', padding: '1px 4px', borderRadius: '4px', background: 'rgba(0,210,180,0.15)', color: '#00A896', fontWeight: 800 }}>
                              MATCHED
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '9.5px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '2px', marginTop: '1px' }}>
                          <MapPin size={9} />
                          <span>{item.location}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                          <span style={{ fontSize: '8.5px', fontWeight: 800, color: item.type === 'lost' ? '#EF4444' : '#10B981', textTransform: 'uppercase' }}>
                            {item.type} {item.timeAgo}
                          </span>
                          {item.reward && (
                            <span style={{ fontSize: '8.5px', fontWeight: 700, color: '#D97706' }}>
                              🏆 ${item.reward} reward
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <ChevronRight size={14} color="#94A3B8" />
                  </div>
                ))}
              </div>

              {/* Bottom Navigation */}
              <div className="mobile-bottom-nav">
                <div className="mobile-nav-btn active">
                  <Home size={18} />
                  <span>Home</span>
                </div>
                <div className="mobile-nav-btn">
                  <Compass size={18} />
                  <span>Lost</span>
                </div>
                <div className="mobile-nav-btn">
                  <CheckCircle2 size={18} />
                  <span>Found</span>
                </div>
                <div className="mobile-nav-btn">
                  <User size={18} />
                  <span>Profile</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
