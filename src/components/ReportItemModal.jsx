import React, { useState } from 'react';
import { X, Upload, MapPin, DollarSign, Tag, CheckCircle2, AlertCircle } from 'lucide-react';
import { categoriesList } from '../data/mockData';

export default function ReportItemModal({ defaultType = 'lost', onClose, onSubmitReport }) {
  const [reportType, setReportType] = useState(defaultType); // 'lost' or 'found'
  const [formData, setFormData] = useState({
    title: '',
    category: 'electronics',
    location: '',
    description: '',
    reward: '',
    contactName: 'Ahmed Khalid',
    contactEmail: 'ahmed.khalid@backtoowner.com',
    contactPhone: '+1 (555) 100-2000',
    imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.location) {
      alert('Please fill in the item title and location.');
      return;
    }

    const newReport = {
      id: `REP-${Math.floor(10500 + Math.random() * 900)}`,
      title: formData.title,
      type: reportType,
      category: formData.category,
      status: 'open',
      location: formData.location,
      distanceKm: (Math.random() * 2 + 0.3).toFixed(1),
      timeAgo: 'Just now',
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      reward: formData.reward ? parseFloat(formData.reward) : null,
      matched: false,
      reporter: reportType === 'lost' ? {
        name: formData.contactName,
        email: formData.contactEmail,
        phone: formData.contactPhone,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        trustScore: 100,
        verified: true
      } : null,
      finder: reportType === 'found' ? {
        name: formData.contactName,
        email: formData.contactEmail,
        phone: formData.contactPhone,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        trustScore: 100,
        verified: true
      } : null,
      description: formData.description || 'No additional details provided.',
      images: [formData.imageUrl]
    };

    onSubmitReport(newReport);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className={reportType === 'lost' ? 'badge-lost' : 'badge-found'} style={{ fontSize: '13px', padding: '6px 14px' }}>
              NEW {reportType.toUpperCase()} REPORT
            </span>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>File Case in BackToOwner</span>
          </div>

          <button className="btn-icon" onClick={onClose} style={{ width: '36px', height: '36px', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Toggle Report Type */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <button
                type="button"
                onClick={() => setReportType('lost')}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '14px',
                  background: reportType === 'lost' ? 'var(--bto-lost-gradient)' : '#F1F5F9',
                  color: reportType === 'lost' ? '#FFFFFF' : '#475569',
                  boxShadow: reportType === 'lost' ? 'var(--shadow-glow-lost)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <span>🥺 Report Lost Item</span>
              </button>

              <button
                type="button"
                onClick={() => setReportType('found')}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '14px',
                  background: reportType === 'found' ? 'var(--bto-found-gradient)' : '#F1F5F9',
                  color: reportType === 'found' ? '#FFFFFF' : '#475569',
                  boxShadow: reportType === 'found' ? 'var(--shadow-glow-found)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <span>🎉 Report Found Item</span>
              </button>
            </div>

            {/* Item Title & Category */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '14px', marginBottom: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Item Name / Title *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., iPhone 15 Pro, Black Leather Wallet"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Category *</label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categoriesList.filter(c => c.id !== 'all').map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location & Reward */}
            <div style={{ display: 'grid', gridTemplateColumns: reportType === 'lost' ? '1.4fr 1fr' : '1fr', gap: '14px', marginBottom: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Location / Landmark *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Times Square Station, Central Park Bethesda"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>

              {reportType === 'lost' && (
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Reward Amount ($)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 50"
                    value={formData.reward}
                    onChange={(e) => setFormData({ ...formData, reward: e.target.value })}
                  />
                </div>
              )}
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Identifying Description & Distinctive Features</label>
              <textarea
                className="form-textarea"
                rows="3"
                placeholder="Serial number hint, color, stickers, scratches, contents..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Photo URL / Preset */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Item Photo Reference</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <img 
                  src={formData.imageUrl} 
                  alt="Preview" 
                  style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #CBD5E1' }} 
                />
                <input
                  type="text"
                  className="form-input"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="Image URL"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className={reportType === 'lost' ? 'btn-lost' : 'btn-found'}
              style={{ padding: '10px 24px', fontSize: '14px' }}
            >
              <CheckCircle2 size={16} />
              <span>Submit & Broadcast Report</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
