import React from 'react';
import { Sparkles, CheckCircle, ArrowRight, ShieldCheck, Check, AlertCircle } from 'lucide-react';

export default function MatchSuggestions({ 
  matchPairs = [], 
  onVerifyMatch,
  onOpenMatchEngine 
}) {
  return (
    <div className="bto-card" style={{ padding: '24px' }}>
      <div className="card-header-clean">
        <div>
          <div className="card-title">
            <Sparkles size={20} color="#6366F1" />
            <span>AI Smart Match Engine</span>
          </div>
          <div className="card-subtitle">Automated visual & metadata similarity matching</div>
        </div>

        {onOpenMatchEngine && (
          <button 
            className="btn-secondary"
            onClick={onOpenMatchEngine}
            style={{ padding: '6px 12px', fontSize: '12.5px', color: '#6366F1', fontWeight: 700 }}
          >
            Open Match Hub
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {matchPairs.map((pair) => (
          <div key={pair.id} className="ai-match-card">
            {/* Header with Score and Confidence */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span className="match-score-badge">
                <Sparkles size={12} />
                {pair.matchScore}% Match Score
              </span>
              <span style={{ fontSize: '12px', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle size={13} />
                {pair.confidenceLabel}
              </span>
            </div>

            {/* Comparison Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '12px', alignItems: 'center', marginBottom: '14px' }}>
              {/* Lost Item */}
              <div style={{ background: '#FFFFFF', padding: '10px 12px', borderRadius: '12px', border: '1px solid #F1F5F9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
                  <span className="badge-lost" style={{ fontSize: '9.5px', padding: '2px 6px' }}>LOST</span>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>{pair.lostItem.date}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '13px', color: '#0F172A', lineHeight: 1.2 }}>
                  {pair.lostItem.title}
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
                  By: {pair.lostItem.reporter}
                </div>
              </div>

              {/* Connecting Icon */}
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366F1' }}>
                <ArrowRight size={14} />
              </div>

              {/* Found Item */}
              <div style={{ background: '#FFFFFF', padding: '10px 12px', borderRadius: '12px', border: '1px solid #F1F5F9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
                  <span className="badge-found" style={{ fontSize: '9.5px', padding: '2px 6px' }}>FOUND</span>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>{pair.foundItem.date}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '13px', color: '#0F172A', lineHeight: 1.2 }}>
                  {pair.foundItem.title}
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
                  By: {pair.foundItem.finder}
                </div>
              </div>
            </div>

            {/* Matched Factors Checklist */}
            <div style={{ background: 'rgba(255, 255, 255, 0.7)', borderRadius: '8px', padding: '8px 12px', marginBottom: '12px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                Verified Match Criteria:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                {pair.matchFactors.map((factor, idx) => (
                  <div key={idx} style={{ fontSize: '11px', color: '#334155', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Check size={12} color="#10B981" />
                    <span>{factor.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                className="btn-primary"
                onClick={() => onVerifyMatch(pair)}
                style={{ padding: '8px 16px', fontSize: '12.5px', width: '100%', gap: '6px' }}
              >
                <ShieldCheck size={15} />
                <span>Verify & Connect Owner</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
