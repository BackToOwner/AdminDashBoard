import React from 'react';
import { Clock, Award, ShieldCheck, Download } from 'lucide-react';
import AnalyticsCharts from '../components/AnalyticsCharts';
import { useDashboardController } from '../controllers/useDashboardController';

export default function AnalyticsView() {
  const { stats, statsLoading: loading, statsError: error } = useDashboardController();

  const formatRewards = (value) => {
    const amount = Number(String(value ?? '0').replace(/,/g, ''));
    return Number.isFinite(amount)
      ? amount.toLocaleString(undefined, {
          style: 'decimal',
          maximumFractionDigits: 2,
        })
      : '0';
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>Analytics & Recovery Insights</h1>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '3px' }}>
            Comprehensive performance metrics, return velocity, and regional recovery efficiency
          </p>
        </div>

        <button className="btn-secondary" style={{ gap: '6px' }} onClick={() => window.print()}>
          <Download size={15} />
          <span>Export Analytics PDF</span>
        </button>
      </div>

      {error && (
        <p style={{ color: '#DC2626', marginBottom: '16px' }}>
          Failed to load live analytics: {error}
        </p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', marginBottom: '28px' }}>
        <div className="bto-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0077EE', marginBottom: '8px' }}>
            <Clock size={20} />
            <span style={{ fontSize: '13px', fontWeight: 700 }}>Average Recovery Time</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A' }}>
            {loading ? 'Loading...' : stats.avgResolutionTime}
          </div>
          <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
            Based on available recovery data
          </div>
        </div>

        <div className="bto-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F59E0B', marginBottom: '8px' }}>
            <Award size={20} />
            <span style={{ fontSize: '13px', fontWeight: 700 }}>Total Reward Value Recorded</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A' }}>
            {loading ? 'Loading...' : formatRewards(stats.totalRewardsPaid)}
          </div>
          <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
            Total reward value recorded in reports
          </div>
        </div>

        <div className="bto-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', marginBottom: '8px' }}>
            <ShieldCheck size={20} />
            <span style={{ fontSize: '13px', fontWeight: 700 }}>False Claim Rejection Rate</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A' }}>N/A</div>
          <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
            Requires claim-review statistics from the backend
          </div>
        </div>
      </div>

      <AnalyticsCharts />
    </div>
  );
}
