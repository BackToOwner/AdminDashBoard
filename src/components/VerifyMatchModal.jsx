import React, { useState } from 'react';
import { X, Sparkles, ShieldCheck, Check, ArrowRight, Bell, AlertCircle, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function VerifyMatchModal({ matchPair, onClose, onConfirmMatch }) {
  if (!matchPair) return null;

  const [verifiedFactors, setVerifiedFactors] = useState(
    matchPair.matchFactors.map(() => true)
  );
  const [notifyOwner, setNotifyOwner] = useState(true);
  const [notifyFinder, setNotifyFinder] = useState(true);
  const [releaseRewardEscrow, setReleaseRewardEscrow] = useState(true);

  const toggleFactor = (idx) => {
    const next = [...verifiedFactors];
    next[idx] = !next[idx];
    setVerifiedFactors(next);
  };

  const handleConfirm = () => {
    // Trigger confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00D2B4', '#0077EE', '#FF5252', '#F59E0B']
      });
    } catch (e) {
      // ignore in test env
    }

    onConfirmMatch(matchPair.id);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px' }}>
        {/* Header */}
        <div className="modal-header" style={{ background: 'linear-gradient(135deg, #0A1931 0%, #164584 100%)', color: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(0, 210, 180, 0.2)', color: '#00E5BE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={18} />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800 }}>AI Match Verification Protocol</div>
              <div style={{ fontSize: '11.5px', color: '#CBD5E1' }}>Match ID: {matchPair.id} • Score: {matchPair.matchScore}%</div>
            </div>
          </div>

          <button className="btn-icon" onClick={onClose} style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#FFFFFF' }}>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Side by side comparison */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
            {/* Lost Case */}
            <div style={{ background: '#FFF5F5', border: '1px solid #FECACA', borderRadius: '14px', padding: '16px' }}>
              <span className="badge-lost" style={{ marginBottom: '8px' }}>LOST REPORT</span>
              <div style={{ fontWeight: 800, fontSize: '15px', color: '#991B1B', marginBottom: '4px' }}>
                {matchPair.lostItem.title}
              </div>
              <div style={{ fontSize: '12px', color: '#4B5563', marginBottom: '8px' }}>
                📍 {matchPair.lostItem.location}
              </div>
              <div style={{ fontSize: '12px', color: '#1F2937' }}>
                <strong>Owner:</strong> {matchPair.lostItem.reporter}
              </div>
              {matchPair.lostItem.reward && (
                <div style={{ marginTop: '8px', fontSize: '12px', fontWeight: 700, color: '#D97706' }}>
                  🏆 ${matchPair.lostItem.reward} Reward Offered
                </div>
              )}
            </div>

            {/* Connection Arrow */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#00A896', background: '#ECFDF5', padding: '2px 8px', borderRadius: '10px' }}>
                {matchPair.matchScore}%
              </span>
              <ArrowRight size={20} color="#00D2B4" />
            </div>

            {/* Found Case */}
            <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '14px', padding: '16px' }}>
              <span className="badge-found" style={{ marginBottom: '8px' }}>FOUND REPORT</span>
              <div style={{ fontWeight: 800, fontSize: '15px', color: '#065F46', marginBottom: '4px' }}>
                {matchPair.foundItem.title}
              </div>
              <div style={{ fontSize: '12px', color: '#4B5563', marginBottom: '8px' }}>
                📍 {matchPair.foundItem.location}
              </div>
              <div style={{ fontSize: '12px', color: '#1F2937' }}>
                <strong>Finder:</strong> {matchPair.foundItem.finder}
              </div>
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#047857', fontWeight: 600 }}>
                Status: In Custody
              </div>
            </div>
          </div>

          {/* Verification Checklist */}
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '16px', marginBottom: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} color="#0077EE" />
              <span>Confirm Verification Evidence Points:</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {matchPair.matchFactors.map((factor, idx) => (
                <label 
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    background: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    cursor: 'pointer'
                  }}
                >
                  <input 
                    type="checkbox" 
                    checked={verifiedFactors[idx]} 
                    onChange={() => toggleFactor(idx)}
                    style={{ width: '16px', height: '16px', accentColor: '#00D2B4' }} 
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>{factor.name}</div>
                    <div style={{ fontSize: '11.5px', color: '#64748B' }}>{factor.detail}</div>
                  </div>
                  <Check size={16} color="#10B981" />
                </label>
              ))}
            </div>
          </div>

          {/* Dispatch Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#334155' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={notifyOwner} 
                onChange={(e) => setNotifyOwner(e.target.checked)}
                style={{ accentColor: '#0077EE' }}
              />
              <span>Send instant Push Notification & SMS to Owner ({matchPair.lostItem.reporter})</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={notifyFinder} 
                onChange={(e) => setNotifyFinder(e.target.checked)}
                style={{ accentColor: '#0077EE' }}
              />
              <span>Send Handover Authorization QR Code to Finder ({matchPair.foundItem.finder})</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button 
            className="btn-primary" 
            onClick={handleConfirm}
            style={{ padding: '10px 24px', fontSize: '14px' }}
          >
            <ShieldCheck size={16} />
            <span>Approve Match & Dispatch Notifications</span>
          </button>
        </div>
      </div>
    </div>
  );
}
