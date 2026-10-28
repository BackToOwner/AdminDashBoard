import React from 'react';
import { 
  CheckCircle, 
  Search, 
  Target, 
  Sparkles, 
  TrendingUp, 
  ArrowUpRight 
} from 'lucide-react';

export default function StatsOverview({ stats, onSelectFilter }) {
  return (
    <div className="hero-stats-grid">
      {/* 1. Items Closed */}
      <div 
        className="stat-kpi-card"
        onClick={() => onSelectFilter && onSelectFilter('closed')}
      >
        <div className="stat-card-header">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.18)', color: '#34D399' }}>
            <CheckCircle size={18} />
          </div>
          <span className="stat-trend-tag trend-up">
            <TrendingUp size={11} />
            {stats.itemsClosedTrend}
          </span>
        </div>
        <div className="stat-value">{stats.itemsClosed.toLocaleString()}</div>
        <div className="stat-label">Items Successfully Closed</div>
        <div style={{ marginTop: '8px', height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: '92%', height: '100%', background: 'linear-gradient(90deg, #10B981, #00D2B4)', borderRadius: '2px' }}></div>
        </div>
      </div>

      {/* 2. Active Cases */}
      <div 
        className="stat-kpi-card"
        onClick={() => onSelectFilter && onSelectFilter('active')}
      >
        <div className="stat-card-header">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(2, 132, 199, 0.18)', color: '#38BDF8' }}>
            <Search size={18} />
          </div>
          <span className="stat-trend-tag trend-neutral">
            {stats.activeCasesTrend}
          </span>
        </div>
        <div className="stat-value">{stats.activeCases.toLocaleString()}</div>
        <div className="stat-label">Active User Uploaded Cases</div>
        <div style={{ marginTop: '8px', height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: '64%', height: '100%', background: 'linear-gradient(90deg, #0284C7, #38BDF8)', borderRadius: '2px' }}></div>
        </div>
      </div>

      {/* 3. Recovery Success Rate */}
      <div 
        className="stat-kpi-card"
        onClick={() => onSelectFilter && onSelectFilter('success')}
      >
        <div className="stat-card-header">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.18)', color: '#FBBF24' }}>
            <Target size={18} />
          </div>
          <span className="stat-trend-tag trend-up">
            <TrendingUp size={11} />
            {stats.successRateTrend}
          </span>
        </div>
        <div className="stat-value">{stats.successRate}%</div>
        <div className="stat-label">Recovery Success Rate</div>
        <div style={{ marginTop: '8px', height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: `${stats.successRate}%`, height: '100%', background: 'linear-gradient(90deg, #F59E0B, #10B981)', borderRadius: '2px' }}></div>
        </div>
      </div>

      {/* 4. AI Suggested Pending Matches */}
      <div 
        className="stat-kpi-card"
        onClick={() => onSelectFilter && onSelectFilter('matched')}
      >
        <div className="stat-card-header">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(139, 92, 246, 0.22)', color: '#A78BFA' }}>
            <Sparkles size={18} />
          </div>
          <span className="stat-trend-tag" style={{ background: 'rgba(139, 92, 246, 0.25)', color: '#DDD6FE' }}>
            <ArrowUpRight size={11} />
            {stats.pendingMatchesTrend}
          </span>
        </div>
        <div className="stat-value">{stats.pendingMatches}</div>
        <div className="stat-label">AI Suggested Pending Matches</div>
        <div style={{ marginTop: '8px', height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: '84%', height: '100%', background: 'linear-gradient(90deg, #8B5CF6, #00D2B4)', borderRadius: '2px' }}></div>
        </div>
      </div>
    </div>
  );
}
