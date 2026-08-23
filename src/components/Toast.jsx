import React from 'react';
import { CheckCircle2, AlertCircle, Sparkles, X, Info } from 'lucide-react';

export default function Toast({ toasts = [], onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '380px',
        width: '100%'
      }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="animate-scale-up"
          style={{
            background: '#07152B',
            color: '#FFFFFF',
            border: '1px solid rgba(0, 210, 180, 0.4)',
            borderRadius: '14px',
            padding: '14px 18px',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          {t.type === 'success' && <CheckCircle2 size={20} color="#00D2B4" />}
          {t.type === 'match' && <Sparkles size={20} color="#6366F1" />}
          {t.type === 'alert' && <AlertCircle size={20} color="#FF5252" />}
          {t.type === 'info' && <Info size={20} color="#38BDF8" />}

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#FFFFFF' }}>{t.title}</div>
            {t.message && (
              <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>{t.message}</div>
            )}
          </div>

          <button 
            onClick={() => onDismiss(t.id)}
            style={{ color: '#64748B', padding: '2px', background: 'none' }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
