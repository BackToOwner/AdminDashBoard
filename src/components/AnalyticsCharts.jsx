import React from 'react';
import { BarChart2, PieChart, Clock, Award, TrendingUp } from 'lucide-react';
import { weeklyRecoveryTrends, categoryBreakdown } from '../data/mockData';

export default function AnalyticsCharts() {
  const maxLost = Math.max(...weeklyRecoveryTrends.map(d => d.lost));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', marginBottom: '28px' }}>
      {/* 1. Weekly Recovery Volume Chart */}
      <div className="bto-card" style={{ padding: '24px' }}>
        <div className="card-header-clean" style={{ marginBottom: '16px' }}>
          <div>
            <div className="card-title">
              <BarChart2 size={20} color="#0077EE" />
              <span>Weekly Recovery Volume</span>
            </div>
            <div className="card-subtitle">Daily comparisons of reported lost vs returned items</div>
          </div>

          <div style={{ display: 'flex', gap: '12px', fontSize: '11.5px', fontWeight: 600 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#FF5252' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#FF5252' }}></span>
              Lost
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10B981' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#10B981' }}></span>
              Returned
            </span>
          </div>
        </div>

        {/* Custom Bar Visualizer */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', paddingTop: '20px', borderBottom: '1px solid #E2E8F0' }}>
          {weeklyRecoveryTrends.map((item, idx) => {
            const lostHeight = (item.lost / maxLost) * 140;
            const returnedHeight = (item.returned / maxLost) * 140;

            return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '140px' }}>
                  {/* Lost bar */}
                  <div 
                    style={{ 
                      width: '14px', 
                      height: `${lostHeight}px`, 
                      background: 'linear-gradient(180deg, #FF7B7B 0%, #EF4444 100%)', 
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.4s ease'
                    }} 
                    title={`${item.day} Lost: ${item.lost}`}
                  />
                  {/* Returned bar */}
                  <div 
                    style={{ 
                      width: '14px', 
                      height: `${returnedHeight}px`, 
                      background: 'linear-gradient(180deg, #34D399 0%, #059669 100%)', 
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.4s ease'
                    }} 
                    title={`${item.day} Returned: ${item.returned}`}
                  />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748B' }}>{item.day}</span>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px', paddingTop: '10px', fontSize: '12px', color: '#64748B' }}>
          <span>Weekly Total: <strong style={{ color: '#0F172A' }}>511 Items Reunited</strong></span>
          <span style={{ color: '#059669', fontWeight: 700 }}>+18.4% vs previous week</span>
        </div>
      </div>

      {/* 2. Category Distribution */}
      <div className="bto-card" style={{ padding: '24px' }}>
        <div className="card-header-clean" style={{ marginBottom: '14px' }}>
          <div>
            <div className="card-title">
              <PieChart size={20} color="#8B5CF6" />
              <span>Category Breakdown</span>
            </div>
            <div className="card-subtitle">Distribution by item classification</div>
          </div>
        </div>

        {/* Category breakdown bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {categoryBreakdown.map((cat, idx) => (
            <div key={idx}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, marginBottom: '3px' }}>
                <span style={{ color: '#1E293B' }}>{cat.category}</span>
                <span style={{ color: '#64748B' }}>{cat.percentage}% ({cat.count.toLocaleString()})</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    width: `${cat.percentage}%`, 
                    height: '100%', 
                    background: cat.color, 
                    borderRadius: '3px',
                    transition: 'width 0.5s ease'
                  }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
