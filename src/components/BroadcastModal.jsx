import React, { useState } from 'react';
import { X, Radio, Send, Bell, MapPin, AlertCircle, ShieldAlert, CheckCircle } from 'lucide-react';

export default function BroadcastModal({ onClose, onSendBroadcast }) {
  const [title, setTitle] = useState('URGENT: Lost Golden Retriever in Central Park');
  const [message, setMessage] = useState('Friendly dog named Charlie wearing blue harness was lost near Bethesda Terrace. $200 reward offered. Please check your immediate surroundings!');
  const [radius, setRadius] = useState('3.0');
  const [priority, setPriority] = useState('high');

  const handleSend = (e) => {
    e.preventDefault();
    onSendBroadcast({
      title,
      message,
      radius,
      priority,
      sentAt: new Date().toLocaleTimeString()
    });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
        {/* Header */}
        <div className="modal-header" style={{ background: 'linear-gradient(135deg, #071325 0%, #0F3460 100%)', color: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(0, 119, 238, 0.25)', color: '#38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Radio size={20} />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800 }}>Mobile Geo-Alert Dispatch</div>
              <div style={{ fontSize: '11.5px', color: '#94A3B8' }}>Broadcast instant push notifications to active mobile app devices</div>
            </div>
          </div>

          <button className="btn-icon" onClick={onClose} style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#FFFFFF' }}>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSend}>
          <div className="modal-body">
            <div style={{ background: 'rgba(0, 119, 238, 0.08)', border: '1px solid rgba(0, 119, 238, 0.25)', borderRadius: '12px', padding: '12px 16px', marginBottom: '18px', display: 'flex', gap: '10px' }}>
              <AlertCircle size={18} color="#0077EE" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '12.5px', color: '#1E293B', lineHeight: 1.4 }}>
                Geo-alerts trigger real-time vibration and push notifications to all BackToOwner mobile users currently within the selected radar radius.
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Alert Headline *</label>
              <input 
                type="text" 
                className="form-input" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Notification Message Body *</label>
              <textarea 
                className="form-textarea" 
                rows="3" 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                required 
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Broadcast Geo-Radius</label>
                <select 
                  className="form-select" 
                  value={radius} 
                  onChange={(e) => setRadius(e.target.value)}
                >
                  <option value="1.0">1.0 km radius (~ 1,420 users)</option>
                  <option value="3.0">3.0 km radius (~ 4,890 users)</option>
                  <option value="5.0">5.0 km radius (~ 12,300 users)</option>
                  <option value="15.0">City-wide 15 km (~ 48,000 users)</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Priority Level</label>
                <select 
                  className="form-select" 
                  value={priority} 
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="high">🚨 High (Sound + Heads Up)</option>
                  <option value="standard">Standard Push Notification</option>
                  <option value="silent">Silent Feed Alert</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ padding: '10px 22px' }}>
              <Send size={16} />
              <span>Broadcast Now</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
