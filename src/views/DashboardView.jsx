import React from 'react';
import { Sparkles, Radio, ShieldCheck, ArrowRight } from 'lucide-react';
import StatsOverview from '../components/StatsOverview';
import QuickActions from '../components/QuickActions';
import InteractiveMap from '../components/InteractiveMap';
import RecentReports from '../components/RecentReports';
import MatchSuggestions from '../components/MatchSuggestions';
import AnalyticsCharts from '../components/AnalyticsCharts';
import '../styles/dashboard.css';

export default function DashboardView({
  stats,
  items,
  matchPairs,
  onSelectItem,
  onOpenMatchEngine,
  onVerifyMatch,
  onViewAllItems,
  onViewFullMap,
  onOpenBroadcastModal,
  onFilterItemsByType
}) {
  return (
    <div className="animate-fade-in">
      {/* 1. Hero Navy Gradient Header */}
      <div className="dashboard-hero-banner">
        <div className="hero-banner-top">
          <div>
            <div className="hero-greeting-title">
              <span>BackToOwner Intelligence Center</span>
              <span style={{ fontSize: '12px', background: 'rgba(0, 210, 180, 0.2)', color: '#00E5BE', padding: '4px 10px', borderRadius: '20px', fontWeight: 700, border: '1px solid rgba(0, 210, 180, 0.4)' }}>
                ● Live Mobile Sync
              </span>
            </div>
            <p className="hero-subtitle-text">
              Lost Today, Found Tomorrow — Monitoring reports uploaded by mobile app users, tracking finders, and verifying smart matches.
            </p>
          </div>

          <div className="hero-actions-group">
            <button 
              className="btn-primary"
              onClick={onOpenBroadcastModal}
              style={{ padding: '9px 18px', fontSize: '13px' }}
            >
              <Radio size={16} />
              <span>Broadcast Area Alert</span>
            </button>
          </div>
        </div>

        {/* 4 Hero KPI Cards matching the mobile app stats */}
        <StatsOverview stats={stats} onSelectFilter={onFilterItemsByType} />
      </div>

      {/* 2. Quick Filter Feeds for User Uploads */}
      <QuickActions 
        onFilterType={onFilterItemsByType}
        lostCount={items.filter(i => i.type === 'lost').length * 200 + 40}
        foundCount={items.filter(i => i.type === 'found').length * 150 + 11}
      />

      {/* 3. Two Column Grid: Recent User Reports & Interactive Radar Map */}
      <div className="dashboard-grid-2col">
        {/* Left Column: Recent Reports Feed */}
        <div>
          <RecentReports 
            reports={items} 
            onSelectItem={onSelectItem} 
            onViewAll={onViewAllItems} 
          />
        </div>

        {/* Right Column: Interactive Radar Map & AI Match Widget */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <InteractiveMap 
            items={items} 
            onSelectItem={onSelectItem} 
            onViewFullMap={onViewFullMap} 
          />

          <MatchSuggestions 
            matchPairs={matchPairs} 
            onVerifyMatch={onVerifyMatch} 
            onOpenMatchEngine={onOpenMatchEngine} 
          />
        </div>
      </div>

      {/* 4. Analytics & Recovery Trends Charts */}
      <AnalyticsCharts />
    </div>
  );
}
