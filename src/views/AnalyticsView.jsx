import React from 'react';
import { Clock, Award, ShieldCheck, Download } from 'lucide-react';
import AnalyticsCharts from '../components/AnalyticsCharts';
import { initialStats } from '../data/mockData';

export default function AnalyticsView() {
  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>Analytics & Recovery Insights</h1>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '3px' }}>
            Comprehensive performance metrics, return velocity, and regional recovery efficiency
          </p>
        </div>

        <button className="btn-secondary" style={{ gap: '6px' }}>
          <Download size={15} />
          <span>Export Analytics PDF</span>
        </button>
      </div>

      {/* Metric Highlights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', marginBottom: '28px' }}>
        <div className="bto-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0077EE', marginBottom: '8px' }}>
            <Clock size={20} />
            <span style={{ fontSize: '13px', fontWeight: 700 }}>Average Recovery Time</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A' }}>{initialStats.avgResolutionTime}</div>
          <div style={{ fontSize: '12px', color: '#059669', marginTop: '4px', fontWeight: 600 }}>↓ 3.2 hrs faster than last quarter</div>
        </div>

        <div className="bto-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F59E0B', marginBottom: '8px' }}>
            <Award size={20} />
            <span style={{ fontSize: '13px', fontWeight: 700 }}>Total Rewards Distributed</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A' }}>{initialStats.totalRewardsPaid}</div>
          <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>100% secured via Stripe & Escrow</div>
        </div>

        <div className="bto-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', marginBottom: '8px' }}>
            <ShieldCheck size={20} />
            <span style={{ fontSize: '13px', fontWeight: 700 }}>False Claim Rejection Rate</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A' }}>99.8%</div>
          <div style={{ fontSize: '12px', color: '#059669', marginTop: '4px', fontWeight: 600 }}>Zero fraudulent item handovers</div>
        </div>
      </div>

      <AnalyticsCharts />
    </div>
  );
}
