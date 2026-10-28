import React from 'react';
import { Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import StatsOverview from '../components/StatsOverview';
import QuickActions from '../components/QuickActions';
import RecentReports from '../components/RecentReports';
import MatchSuggestions from '../components/MatchSuggestions';
import AnalyticsCharts from '../components/AnalyticsCharts';
import '../styles/dashboard.css';

export default function DashboardView({
  stats,
  items,
  matchPairs,
  savedMatches = [],
  onSelectItem,
  onOpenMatchEngine,
  onVerifyMatch,
  onViewAllItems,
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
</div>

        {/* 4 Hero KPI Cards matching the mobile app stats */}
        <StatsOverview stats={stats} onSelectFilter={onFilterItemsByType} />
      </div>

      {/* 2. Quick Filter Feeds for User Uploads */}
      <QuickActions
        onFilterType={onFilterItemsByType}
        lostCount={items.filter(
          i => i.type === 'lost' &&
            !['returned', 'closed'].includes(i.status)
        ).length}
        foundCount={items.filter(
          i => i.type === 'found' &&
            !['returned', 'closed'].includes(i.status)
        ).length}
      />

      {/* 3. Two Column Grid: Recent User Reports & AI Match Hub */}
      <div className="dashboard-grid-2col">
        {/* Left Column: Recent Reports Feed */}
        <div>
          <RecentReports
            reports={items}
            matchPairs={matchPairs}
            savedMatches={savedMatches}
            onSelectItem={onSelectItem}
            onViewAll={onViewAllItems}
          />
        </div>

        {/* Right Column: AI Smart Match Hub */}
        <div>
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
