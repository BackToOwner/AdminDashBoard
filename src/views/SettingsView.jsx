import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config';
import { Settings, ShieldCheck, DollarSign, Save } from 'lucide-react';

export default function SettingsView({ onShowToast }) {
  const [escrowFee, setEscrowFee] = useState('5.0');
  const [autoMatchThreshold, setAutoMatchThreshold] = useState('85');
  const [geoRadiusDefault, setGeoRadiusDefault] = useState('5.0');

  const [platformStatus, setPlatformStatus] = useState(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [statusError, setStatusError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;

    const checkPlatformStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/health/status`, {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`Health endpoint returned HTTP ${response.status}`);
        }

        const data = await response.json();
        if (!data.services || !data.checkedAt) {
          throw new Error('Health endpoint returned an unexpected response.');
        }

        if (active) {
          setPlatformStatus(data);
          setStatusError('');
        }
      } catch (error) {
        if (active) {
          setStatusError(error.message || 'Could not reach the backend health endpoint.');
        }
      } finally {
        if (active) setStatusLoading(false);
      }
    };

    setStatusLoading(true);
    checkPlatformStatus();
    const intervalId = setInterval(checkPlatformStatus, 15000);

    return () => {
      active = false;
      clearInterval(intervalId);
    };
  }, [refreshKey]);

  const statusColor = (status) =>
    status === 'online' ? '#16A34A' : status === 'offline' ? '#DC2626' : '#64748B';

  const statusLabel = (status) =>
    status === 'online' ? 'Online' : status === 'offline' ? 'Offline' : 'Checking';


  const handleSave = (e) => {
    e.preventDefault();
    if (onShowToast) {
      onShowToast({
        title: 'System Settings Saved',
        message: 'AI matching thresholds and reward escrow settings updated.',
        type: 'success'
      });
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>System Settings</h1>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '3px' }}>
            Configure AI matching thresholds, reward escrow rules, and security
          </p>
        </div>
      </div>


      {/* Live Platform Status */}
      <section className="bto-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          marginBottom: '8px'
        }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
              Platform Status
            </h2>
            <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
              Live checks for the backend, Supabase database, and AI matching service
            </p>
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={() => setRefreshKey((value) => value + 1)}
            disabled={statusLoading}
            style={{ padding: '9px 14px', fontSize: '12px', opacity: statusLoading ? 0.65 : 1 }}
          >
            {statusLoading ? 'Checking…' : 'Refresh Status'}
          </button>
        </div>

        {statusError && (
          <div role="alert" style={{
            marginTop: '16px',
            padding: '12px 14px',
            borderRadius: '10px',
            background: '#FEF2F2',
            color: '#B91C1C',
            fontSize: '12px'
          }}>
            Could not retrieve live platform status: {statusError}
            <div style={{ marginTop: '4px' }}>
              Check that the backend is running on port 5001.
            </div>
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
          gap: '14px',
          marginTop: '18px'
        }}>
          {[
            { key: 'backend', title: 'Backend API', detail: 'Express server' },
            { key: 'database', title: 'Supabase Database', detail: 'Live database query' },
            { key: 'ai', title: 'AI Matching Service', detail: platformStatus?.services?.ai?.model || 'FastAPI / SigLIP' },
          ].map((service) => {
            const status = platformStatus?.services?.[service.key]?.status;
            const message = platformStatus?.services?.[service.key]?.message;
            const color = statusColor(status);

            return (
              <div key={service.key} style={{
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '16px',
                background: '#FFFFFF'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '13px', fontWeight: 750, color: '#0F172A' }}>
                    {service.title}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 750,
                    color,
                    background: status === 'online' ? '#F0FDF4' : status === 'offline' ? '#FEF2F2' : '#F1F5F9',
                    padding: '4px 8px',
                    borderRadius: '999px',
                    whiteSpace: 'nowrap'
                  }}>
                    {statusLabel(status || (statusLoading ? 'checking' : 'offline'))}
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: '#64748B', marginTop: '10px' }}>
                  {service.detail}
                </p>
                <p style={{ fontSize: '12px', color: '#475569', marginTop: '6px' }}>
                  {message || (statusError ? 'Status unavailable' : 'Waiting for health check…')}
                </p>
              </div>
            );
          })}
        </div>

        <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '16px' }}>
          {platformStatus?.checkedAt
            ? `Last successful check: ${new Date(platformStatus.checkedAt).toLocaleString()}`
            : 'No successful status check yet'}
          {' · '}
          Automatically checks every 15 seconds.
        </p>
      </section>

      <form onSubmit={handleSave}>
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
{/* Save Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn-primary" style={{ padding: '12px 28px', fontSize: '14px' }}>
              <Save size={16} />
              <span>Save System Settings</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
