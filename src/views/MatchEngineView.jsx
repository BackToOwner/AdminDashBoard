import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Check, ArrowRight, RefreshCw, Zap, Sliders, CheckCircle2 } from 'lucide-react';

export default function MatchEngineView({ matchPairs, onVerifyMatch }) {
  const [minConfidence, setMinConfidence] = useState(80);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1200);
  };

  const filteredPairs = matchPairs.filter(p => p.matchScore >= minConfidence);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>AI Smart Match Engine</h1>
            <span style={{ background: 'linear-gradient(135deg, #6366F1 0%, #06B6D4 100%)', color: '#FFFFFF', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 800 }}>
              GPT-4o Vision + Geohash
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '3px' }}>
            Automated visual recognition, OCR receipt verification, and spatio-temporal correlation
          </p>
        </div>

        <button 
          className="btn-primary" 
          onClick={handleScan}
          disabled={isScanning}
          style={{ gap: '8px' }}
        >
          <RefreshCw size={16} className={isScanning ? 'animate-spin' : ''} />
          <span>{isScanning ? 'Scanning Active Database...' : 'Run Auto-Match Scanner'}</span>
        </button>
      </div>

      {/* Control Banner */}
      <div className="bto-card" style={{ padding: '18px 24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Sliders size={18} color="#0077EE" />
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A' }}>Minimum Match Confidence Threshold:</span>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#6366F1', background: '#EEF2FF', padding: '2px 8px', borderRadius: '8px' }}>
              {minConfidence}%
            </span>
          </div>

          <input 
            type="range" 
            min="60" 
            max="98" 
            value={minConfidence} 
            onChange={(e) => setMinConfidence(parseInt(e.target.value))}
            style={{ width: '220px', accentColor: '#6366F1' }} 
          />
        </div>
      </div>

      {/* Match Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {filteredPairs.map((pair) => (
          <div key={pair.id} className="bto-card" style={{ padding: '24px', borderLeft: '4px solid #6366F1' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="match-score-badge" style={{ fontSize: '13px', padding: '5px 14px' }}>
                  <Sparkles size={14} />
                  {pair.matchScore}% Match Score
                </span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#059669' }}>
                  ● {pair.confidenceLabel}
                </span>
                <span style={{ fontSize: '12px', color: '#94A3B8' }}>Pair ID: {pair.id}</span>
              </div>

              <button 
                className="btn-primary"
                onClick={() => onVerifyMatch(pair)}
                style={{ padding: '8px 20px', fontSize: '13px' }}
              >
                <ShieldCheck size={16} />
                <span>Verify & Reconcile Case</span>
              </button>
            </div>

            {/* Side-by-Side Comparison */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr auto 1.2fr', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
              {/* Lost Item */}
              <div style={{ background: '#FFF5F5', border: '1px solid #FECACA', borderRadius: '16px', padding: '18px', display: 'flex', gap: '14px' }}>
                <img 
                  src={pair.lostItem.image} 
                  alt={pair.lostItem.title} 
                  style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }} 
                />
                <div>
                  <span className="badge-lost" style={{ marginBottom: '6px' }}>LOST CLAIM</span>
                  <div style={{ fontWeight: 800, fontSize: '16px', color: '#991B1B' }}>{pair.lostItem.title}</div>
                  <div style={{ fontSize: '12px', color: '#4B5563', marginTop: '2px' }}>📍 {pair.lostItem.location}</div>
                  <div style={{ fontSize: '12px', color: '#1F2937', marginTop: '4px' }}><strong>Owner:</strong> {pair.lostItem.reporter}</div>
                  {pair.lostItem.reward && (
                    <div style={{ fontSize: '12px', color: '#D97706', fontWeight: 700, marginTop: '2px' }}>🏆 ${pair.lostItem.reward} Reward</div>
                  )}
                </div>
              </div>

              {/* Connecting Icon */}
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366F1' }}>
                <ArrowRight size={20} />
              </div>

              {/* Found Item */}
              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '16px', padding: '18px', display: 'flex', gap: '14px' }}>
                <img 
                  src={pair.foundItem.image} 
                  alt={pair.foundItem.title} 
                  style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }} 
                />
                <div>
                  <span className="badge-found" style={{ marginBottom: '6px' }}>FOUND ITEM</span>
                  <div style={{ fontWeight: 800, fontSize: '16px', color: '#065F46' }}>{pair.foundItem.title}</div>
                  <div style={{ fontSize: '12px', color: '#4B5563', marginTop: '2px' }}>📍 {pair.foundItem.location}</div>
                  <div style={{ fontSize: '12px', color: '#1F2937', marginTop: '4px' }}><strong>Finder:</strong> {pair.foundItem.finder}</div>
                  <div style={{ fontSize: '12px', color: '#047857', fontWeight: 600, marginTop: '2px' }}>Date: {pair.foundItem.date}</div>
                </div>
              </div>
            </div>

            {/* Match Evidence Criteria Matrix */}
            <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '14px 18px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '10px' }}>
                AI Correlation Factors & Visual Verification:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                {pair.matchFactors.map((factor, idx) => (
                  <div key={idx} style={{ background: '#FFFFFF', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>
                      <Check size={14} color="#10B981" />
                      <span>{factor.name}</span>
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '3px' }}>
                      {factor.detail}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
