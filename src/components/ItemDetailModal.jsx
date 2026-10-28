import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  DollarSign, 
  User, 
  Mail, 
  Phone, 
  CheckCircle2, 
  Sparkles, 
  Tag,
  AlertTriangle,
  Award
} from 'lucide-react';

export default function ItemDetailModal({
  item,
  onClose,
  onUpdateStatus,
  onTriggerMatch,
  onGetReturnConfirmation,
  onCloseCase,
}) {
  const [activeTab, setActiveTab] = useState('details');
  const [currentStatus, setCurrentStatus] = useState(item?.status || 'open');
  const [confirmationProgress, setConfirmationProgress] = useState(null);
  const [confirmationLoading, setConfirmationLoading] = useState(false);
  const [confirmationError, setConfirmationError] = useState('');
  const [closingCase, setClosingCase] = useState(false);

  useEffect(() => {
    setCurrentStatus(item?.status || 'open');
  }, [item?.id, item?.status]);

  useEffect(() => {
    let active = true;

    if (!item || currentStatus !== 'returned' || !onGetReturnConfirmation) {
      setConfirmationProgress(null);
      setConfirmationError('');
      setConfirmationLoading(false);
      return () => { active = false; };
    }

    setConfirmationLoading(true);
    setConfirmationError('');

    onGetReturnConfirmation(item.id)
      .then((progress) => {
        if (active) setConfirmationProgress(progress);
      })
      .catch((error) => {
        if (active) setConfirmationError(
          error.message || 'Could not load participant confirmations.'
        );
      })
      .finally(() => {
        if (active) setConfirmationLoading(false);
      });

    return () => { active = false; };
  }, [item?.id, currentStatus, onGetReturnConfirmation]);

  if (!item) return null;

  const handleStatusChange = (newStatus) => {
    setCurrentStatus(newStatus);
    if (onUpdateStatus) {
      onUpdateStatus(item.id, newStatus);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '820px' }}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className={item.type === 'lost' ? 'badge-lost' : 'badge-found'} style={{ fontSize: '12px', padding: '5px 12px' }}>
              {item.type.toUpperCase()} ITEM CASE
            </span>
            <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>ID: {item.id}</span>
            {item.matched && (
              <span className="badge-matched">
                <Sparkles size={12} />
                MATCHED CASE
              </span>
            )}
          </div>

          <button 
            className="btn-icon" 
            onClick={onClose}
            style={{ width: '36px', height: '36px', borderRadius: '50%' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Main Title & Reward Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
                {item.title}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '13px', color: '#64748B' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={14} color="#0077EE" />
                  {item.location}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={14} />
                  {item.date || item.timeAgo}
                </span>
              </div>
            </div>

            {item.reward && (
              <div style={{ background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)', border: '1px solid #F59E0B', borderRadius: '14px', padding: '10px 16px', textAlign: 'right' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#B45309', textTransform: 'uppercase' }}>Finder Reward</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#92400E' }}>LKR {item.reward}</div>
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px', marginBottom: '20px' }}>
            <button 
              className={`filter-tab-pill-btn ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              Item Overview & Photos
            </button>
            <button 
              className={`filter-tab-pill-btn ${activeTab === 'verification' ? 'active' : ''}`}
              onClick={() => setActiveTab('verification')}
            >
              Ownership Verification Checklist
            </button>
            <button 
              className={`filter-tab-pill-btn ${activeTab === 'timeline' ? 'active' : ''}`}
              onClick={() => setActiveTab('timeline')}
            >
              Contact & Case History
            </button>
          </div>

          {/* Tab 1: Details & Photos */}
          {activeTab === 'details' && (
            <div>
              {/* Photo Gallery */}
              {item.images && item.images.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: item.images.length > 1 ? '1.2fr 1fr' : '1fr', gap: '14px', marginBottom: '20px' }}>
                  {item.images.map((imgSrc, idx) => (
                    <img 
                      key={idx} 
                      src={imgSrc} 
                      alt={item.title} 
                      style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '14px', border: '1px solid #E2E8F0' }} 
                    />
                  ))}
                </div>
              )}

              {/* Description */}
              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Detailed Description & Identifying Features
                </div>
                <p style={{ fontSize: '14px', color: '#1E293B', lineHeight: 1.6 }}>
                  {item.description}
                </p>
              </div>

              {/* Status Selector */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: '#F1F5F9', borderRadius: '12px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                  Current Case Status:
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['open', 'in_review', 'returned'].map(statusKey => (
                    <button
                      key={statusKey}
                      onClick={() => handleStatusChange(statusKey)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-pill)',
                        fontSize: '12px',
                        fontWeight: 700,
                        textTransform: 'capitalize',
                        background: currentStatus === statusKey ? '#0A1931' : '#FFFFFF',
                        color: currentStatus === statusKey ? '#FFFFFF' : '#475569',
                        border: '1px solid #CBD5E1',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {statusKey.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStatus === 'returned' && (
            <div style={{
              marginTop: '16px',
              padding: '16px',
              border: '1px solid #CBD5E1',
              borderRadius: '12px',
              background: '#F8FAFC',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                    Participant return confirmations
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                    Both participants must confirm before the case can be closed.
                  </div>
                </div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#0F766E', whiteSpace: 'nowrap' }}>
                  {confirmationLoading
                    ? '…'
                    : `${confirmationProgress?.confirmedCount ?? 0}/2`}
                </div>
              </div>

              <div style={{ height: '8px', background: '#E2E8F0', borderRadius: '99px', marginTop: '12px', overflow: 'hidden' }}>
                <div style={{
                  width: `${Math.min(100, ((confirmationProgress?.confirmedCount ?? 0) / 2) * 100)}%`,
                  height: '100%',
                  background: '#0D9488',
                  transition: 'width 0.2s ease',
                }} />
              </div>

              {confirmationError && (
                <div style={{ marginTop: '10px', color: '#B91C1C', fontSize: '12px' }}>
                  {confirmationError}
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ marginLeft: '8px', padding: '4px 10px' }}
                    onClick={() => setCurrentStatus('in_review')}
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {!confirmationLoading && !confirmationError && (
                <div style={{ marginTop: '10px', fontSize: '12px', color: '#475569' }}>
                  {confirmationProgress?.canClose
                    ? 'Both participants have confirmed. This case is ready to close.'
                    : 'Waiting for both participants to confirm the return in the app.'}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Verification Checklist */}
          {activeTab === 'verification' && (
            <div>
              <div style={{ background: 'rgba(0, 210, 180, 0.08)', border: '1px solid rgba(0, 210, 180, 0.3)', borderRadius: '12px', padding: '14px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00A896', fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>
                  <ShieldCheck size={18} />
                  <span>BackToOwner Claim Verification Protocol</span>
                </div>
                <p style={{ fontSize: '12px', color: '#334155' }}>
                  Compare private registered keys, proof of purchase, serial numbers, and security questions before releasing item to claimant.
                </p>
              </div>

              {item.verificationDetails ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  {Object.entries(item.verificationDetails).map(([key, val]) => (
                    <div key={key} style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
                        {key.replace(/([A-Z])/g, ' $1')}
                      </div>
                      <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A', marginTop: '3px' }}>
                        {typeof val === 'boolean' ? (val ? 'Yes (Verified)' : 'No') : String(val)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#64748B', fontSize: '13px' }}>No specific verification credentials submitted for this item.</p>
              )}
            </div>
          )}

          {/* Tab 3: Reporter/Finder & Timeline */}
          {activeTab === 'timeline' && (
            <div>
              {/* Reporter or Finder Info Box */}
              {(item.reporter || item.finder) && (
                <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '14px', border: '1px solid #E2E8F0', marginBottom: '20px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '10px' }}>
                    {item.reporter ? 'Reporter / Owner Details' : 'Finder Information'}
                  </div>

                  {(() => {
                    const person = item.reporter || item.finder;
                    return (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <img 
                          src={person.avatar} 
                          alt={person.name} 
                          style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #00D2B4' }} 
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>{person.name}</span>
                            {person.verified && (
                              <span style={{ fontSize: '10.5px', background: '#ECFDF5', color: '#059669', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
                                Verified Member
                              </span>
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: '14px', fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={13} /> {person.email}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={13} /> {person.phone}</span>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '11px', color: '#64748B' }}>Trust Score</div>
                          <div style={{ fontSize: '18px', fontWeight: 800, color: '#00A896' }}>{person.trustScore}%</div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Activity Timeline */}
              <div style={{ borderLeft: '2px solid #E2E8F0', paddingLeft: '16px', marginLeft: '10px' }}>
                <div style={{ position: 'relative', marginBottom: '14px' }}>
                  <span style={{ position: 'absolute', left: '-22px', top: '2px', width: '10px', height: '10px', borderRadius: '50%', background: '#00D2B4' }}></span>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A' }}>Case Registered in BackToOwner</div>
                  <div style={{ fontSize: '11px', color: '#94A3B8' }}>{item.date || 'Today'} • GPS Coordinates Logged</div>
                </div>
                <div style={{ position: 'relative', marginBottom: '14px' }}>
                  <span style={{ position: 'absolute', left: '-22px', top: '2px', width: '10px', height: '10px', borderRadius: '50%', background: '#0077EE' }}></span>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A' }}>AI Proximity Scanner Checked</div>
                  <div style={{ fontSize: '11px', color: '#94A3B8' }}>Radar radius 5km scanned across active reports</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
          {currentStatus !== 'returned' && currentStatus !== 'closed' && (
            <button
              className="btn-primary"
              onClick={() => handleStatusChange('returned')}
            >
              <CheckCircle2 size={16} />
              <span>Mark as Returned</span>
            </button>
          )}

          {currentStatus === 'returned' && (
            <button
              className="btn-primary"
              disabled={
                closingCase ||
                confirmationLoading ||
                !confirmationProgress?.canClose ||
                Boolean(confirmationError) ||
                !onCloseCase
              }
              title={
                confirmationProgress?.canClose
                  ? 'Both participants have confirmed'
                  : 'Requires confirmation from both participants'
              }
              onClick={async () => {
                setClosingCase(true);
                setConfirmationError('');
                try {
                  await onCloseCase(item.id);
                } catch (error) {
                  setConfirmationError(
                    error.message || 'Could not close this case.'
                  );
                } finally {
                  setClosingCase(false);
                }
              }}
            >
              <CheckCircle2 size={16} />
              <span>{closingCase ? 'Closing Case…' : 'Close Case'}</span>
            </button>
          )}

          {currentStatus === 'closed' && (
            <span style={{ color: '#047857', fontWeight: 800, fontSize: '13px' }}>
              CASE CLOSED
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
