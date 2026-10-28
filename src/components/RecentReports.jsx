import React, { useState } from 'react';
import { 
  FileText, 
  MapPin, 
  Clock, 
  DollarSign, 
  ChevronRight, 
  Sparkles, 
  Search,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Wallet,
  Dog,
  Key,
  Briefcase
} from 'lucide-react';

export default function RecentReports({ 
  reports = [], 
  matchPairs = [],
  savedMatches = [],
  onSelectItem, 
  onViewAll 
}) {
  const [filterType, setFilterType] = useState('all'); // 'all', 'lost', 'found', 'matched'
  const aiSuggestedReportIds = new Set(
    matchPairs
      .flatMap(pair => [pair?.lostItem?.id, pair?.foundItem?.id])
      .filter(id => id != null)
      .map(String)
  );

  // Only persistent, approved matches count as verified matches.
  const approvedReportIds = new Set(
    savedMatches
      .filter(match => match?.status === 'approved')
      .flatMap(match => [match?.lostItem?.id, match?.foundItem?.id])
      .filter(id => id != null)
      .map(String)
  );

  const filteredReports = reports.filter(item => {
    // Hide returned/closed cases from every Recent Reports tab.
    if (['returned', 'closed'].includes(item.status)) {
      return false;
    }

    if (filterType === 'all') return true;
    if (filterType === 'lost') return item.type === 'lost';
    if (filterType === 'found') return item.type === 'found';

    // Keep active AI-matched cases visible until they are resolved.
    if (filterType === 'matched') {
      return (
        item.matched ||
        item.status === 'matched' ||
        approvedReportIds.has(String(item.id)) ||
        aiSuggestedReportIds.has(String(item.id))
      );
    }

    return true;
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'electronics': return <Smartphone size={20} color="#0284C7" />;
      case 'wallets': return <Wallet size={20} color="#8B5CF6" />;
      case 'pets': return <Dog size={20} color="#F59E0B" />;
      case 'keys': return <Key size={20} color="#10B981" />;
      case 'bags': return <Briefcase size={20} color="#EC4899" />;
      default: return <FileText size={20} color="#6366F1" />;
    }
  };

  return (
    <div className="bto-card" style={{ padding: '24px' }}>
      {/* Header with Title & Filter Pills matching Mobile UI */}
      <div className="card-header-clean" style={{ flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
        <div>
          <div className="card-title">
            <span>Recent Reports</span>
          </div>
          <div className="card-subtitle">Live real-time feed from mobile and web app users</div>
        </div>

        {/* Filter Pills matching mobile app [All, Lost, Found] */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="filter-tabs-pills">
            <button 
              className={`filter-tab-pill-btn ${filterType === 'all' ? 'active' : ''}`}
              onClick={() => setFilterType('all')}
            >
              All
            </button>
            <button 
              className={`filter-tab-pill-btn ${filterType === 'lost' ? 'active' : ''}`}
              onClick={() => setFilterType('lost')}
            >
              💛 Lost
            </button>
            <button 
              className={`filter-tab-pill-btn ${filterType === 'found' ? 'active' : ''}`}
              onClick={() => setFilterType('found')}
            >
              💙 Found
            </button>
            <button 
              className={`filter-tab-pill-btn ${filterType === 'matched' ? 'active' : ''}`}
              onClick={() => setFilterType('matched')}
            >
              ✨ Matched
            </button>
          </div>

          {onViewAll && (
            <button 
              onClick={onViewAll}
              style={{ fontSize: '13px', fontWeight: 700, color: '#0077EE', display: 'flex', alignItems: 'center', gap: '2px', background: 'none' }}
            >
              <span>See all</span>
              <ChevronRight size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Reports Feed List */}
      <div className="reports-feed-list">
        {filteredReports.slice(0, 6).map((item) => (
          <div 
            key={item.id} 
            className="report-feed-item"
            onClick={() => onSelectItem(item)}
          >
            {/* Left: Thumbnail & Details */}
            <div className="feed-item-left">
              {item.images && item.images.length > 0 ? (
                <img 
                  src={item.images[0]} 
                  alt={item.title} 
                  className="feed-item-thumb" 
                />
              ) : (
                <div className="feed-item-icon-box" style={{ background: '#F1F5F9' }}>
                  {getCategoryIcon(item.category)}
                </div>
              )}

              <div className="feed-item-info">
                <div className="feed-item-title-row">
                  <span className="feed-item-title">{item.title}</span>
                  {(item.matched ||
                    item.status === 'matched' ||
                    approvedReportIds.has(String(item.id)) ||
                    aiSuggestedReportIds.has(String(item.id))) && (
                    <span className="badge-matched">
                      <Sparkles size={11} />
                      {aiSuggestedReportIds.has(String(item.id)) &&
                      !approvedReportIds.has(String(item.id)) &&
                      !item.matched &&
                      item.status !== 'matched'
                        ? 'AI SUGGESTION · PENDING'
                        : 'MATCHED'}
                    </span>
                  )}
                </div>

                <div className="feed-item-location">
                  <MapPin size={12} color="#64748B" />
                  <span>{item.location}</span>
                </div>
              </div>
            </div>

            {/* Right: Badges, Time, Reward & Chevron */}
            <div className="feed-item-right">
              {/* Type Badge (LOST / FOUND) */}
              <span className={item.type === 'lost' ? 'badge-lost' : 'badge-found'}>
                {item.type}
              </span>

              {/* Reward Badge if present */}
              {item.reward && (
                <span className="badge-reward">
                  🏆 LKR {item.reward} reward
                </span>
              )}

              {/* Time Ago */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#94A3B8' }}>
                <Clock size={12} />
                <span>{item.timeAgo}</span>
              </div>

              <ChevronRight size={18} color="#CBD5E1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
