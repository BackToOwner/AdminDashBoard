import React, { useState } from 'react';
import { Settings, ShieldCheck, Bell, DollarSign, Database, Save, CheckCircle2, Layers } from 'lucide-react';
import CategoryManager from '../components/CategoryManager';

export default function SettingsView({ 
  categories = [], 
  items = [], 
  onAddCategory, 
  onUpdateCategory, 
  onDeleteCategory, 
  onShowToast 
}) {
  const [activeTab, setActiveTab] = useState('categories'); // 'categories', 'general'
  const [escrowFee, setEscrowFee] = useState('5.0');
  const [autoMatchThreshold, setAutoMatchThreshold] = useState('85');
  const [geoRadiusDefault, setGeoRadiusDefault] = useState('5.0');
  const [pushNotificationSound, setPushNotificationSound] = useState(true);

  const handleSaveGeneral = (e) => {
    e.preventDefault();
    if (onShowToast) {
      onShowToast({
        title: 'System Settings Saved',
        message: 'BackToOwner parameters and match configurations updated.',
        type: 'success'
      });
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>System Settings & Categories</h1>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '3px' }}>
            Manage category classifications, matching thresholds, reward escrow rules, and mobile notifications
          </p>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px', marginBottom: '24px' }}>
        <button 
          className={`filter-tab-pill-btn ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13.5px', padding: '8px 18px' }}
        >
          <Layers size={16} />
          <span>Category Management ({categories.filter(c => c.id !== 'all').length})</span>
        </button>

        <button 
          className={`filter-tab-pill-btn ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13.5px', padding: '8px 18px' }}
        >
          <Settings size={16} />
          <span>AI Matching & Escrow Rules</span>
        </button>
      </div>

      {/* Tab 1: Category Management */}
      {activeTab === 'categories' && (
        <CategoryManager 
          categories={categories}
          items={items}
          onAddCategory={onAddCategory}
          onUpdateCategory={onUpdateCategory}
          onDeleteCategory={onDeleteCategory}
          onShowToast={onShowToast}
        />
      )}

      {/* Tab 2: General & Matching Parameters */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveGeneral}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* AI Match Engine Configuration */}
            <div className="bto-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <ShieldCheck size={20} color="#6366F1" />
                <h2 style={{ fontSize: '17px', fontWeight: 800 }}>AI Auto-Match & OCR Engine</h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                <div className="form-group">
                  <label className="form-label">Auto-Match Score Cutoff (%)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={autoMatchThreshold} 
                    onChange={(e) => setAutoMatchThreshold(e.target.value)} 
                  />
                  <span style={{ fontSize: '11px', color: '#94A3B8' }}>Cases scoring above this threshold trigger instant admin match review</span>
                </div>

                <div className="form-group">
                  <label className="form-label">Default Geo-Fencing Proximity Radius (km)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={geoRadiusDefault} 
                    onChange={(e) => setGeoRadiusDefault(e.target.value)} 
                  />
                  <span style={{ fontSize: '11px', color: '#94A3B8' }}>Initial search boundary for lost item proximity correlation</span>
                </div>
              </div>
            </div>

            {/* Reward Escrow & Payout Rules */}
            <div className="bto-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <DollarSign size={20} color="#F59E0B" />
                <h2 style={{ fontSize: '17px', fontWeight: 800 }}>Reward Escrow & Payout Protocol</h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                <div className="form-group">
                  <label className="form-label">Platform Maintenance & Insurance Fee (%)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={escrowFee} 
                    onChange={(e) => setEscrowFee(e.target.value)} 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Reward Payout Hold Period</label>
                  <select className="form-select" defaultValue="24">
                    <option value="0">Instant Handover QR Release</option>
                    <option value="24">24 Hours (Fraud prevention grace period)</option>
                    <option value="48">48 Hours</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Mobile Push Broadcast Preferences */}
            <div className="bto-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <Bell size={20} color="#00D2B4" />
                <h2 style={{ fontSize: '17px', fontWeight: 800 }}>Mobile Push Notification Broadcaster</h2>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13.5px', color: '#1E293B' }}>
                <input 
                  type="checkbox" 
                  checked={pushNotificationSound} 
                  onChange={(e) => setPushNotificationSound(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#00D2B4' }} 
                />
                <span>Enable emergency audio chime on mobile devices when high-priority pet or passport alert is sent</span>
              </label>
            </div>

            {/* Save Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn-primary" style={{ padding: '12px 28px', fontSize: '14px' }}>
                <Save size={16} />
                <span>Save System Settings</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
