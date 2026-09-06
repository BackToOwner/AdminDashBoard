import React from 'react';
import { BarChart2, PieChart } from 'lucide-react';

const FALLBACK_PALETTE = ['#0284C7', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899', '#6366F1', '#F43F5E', '#14B8A6'];

function formatDayLabel(isoDay) {
  if (!isoDay) return '';
  const d = new Date(`${isoDay}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? isoDay : d.toLocaleDateString(undefined, { weekday: 'short' });
}

export default function AnalyticsCharts({ breakdown, categories = [] }) {
  const last14Days = breakdown?.last14Days ?? [];
  const byCategory = breakdown?.byCategory ?? [];

  const maxDailyCount = Math.max(1, ...last14Days.map(d => d.count));
  const totalCategoryItems = byCategory.reduce((sum, c) => sum + c.count, 0) || 1;
  const totalDailyReports = last14Days.reduce((sum, d) => sum + d.count, 0);

  const categoryColor = (categoryId, idx) =>
    categories.find(c => c.id === categoryId)?.color || FALLBACK_PALETTE[idx % FALLBACK_PALETTE.length];

  const categoryLabel = (categoryId) =>
    categories.find(c => c.id === categoryId)?.label || categoryId;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', marginBottom: '28px' }}>
      {/* 1. Reports Volume Chart */}
      <div className="bto-card" style={{ padding: '24px' }}>
        <div className="card-header-clean" style={{ marginBottom: '16px' }}>
          <div>
            <div className="card-title">
              <BarChart2 size={20} color="#0077EE" />
              <span>Reports Volume (Last 14 Days)</span>
            </div>
            <div className="card-subtitle">Daily count of new lost & found reports</div>
          </div>
        </div>

        {last14Days.length === 0 ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: '#94A3B8', fontSize: '13px' }}>
            No reports have been created in the last 14 days yet.
          </div>
        ) : (
          <>
            {/* Custom Bar Visualizer */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '4px', height: '180px', paddingTop: '20px', borderBottom: '1px solid #E2E8F0' }}>
              {last14Days.map((item, idx) => {
                const height = (item.count / maxDailyCount) * 140;
                return (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', height: '140px' }}>
                      <div
                        style={{
                          width: '16px',
                          height: `${Math.max(height, 2)}px`,
                          background: 'linear-gradient(180deg, #00E5BE 0%, #0077EE 100%)',
                          borderRadius: '4px 4px 0 0',
                          transition: 'height 0.4s ease'
                        }}
                        title={`${item.day}: ${item.count} reports`}
                      />
                    </div>
                    <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#64748B' }}>{formatDayLabel(item.day)}</span>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px', paddingTop: '10px', fontSize: '12px', color: '#64748B' }}>
              <span>14-Day Total: <strong style={{ color: '#0F172A' }}>{totalDailyReports.toLocaleString()} Reports</strong></span>
            </div>
          </>
        )}
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

        {byCategory.length === 0 ? (
          <div style={{ padding: '20px 0', textAlign: 'center', color: '#94A3B8', fontSize: '13px' }}>
            No reports yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {byCategory
              .slice()
              .sort((a, b) => b.count - a.count)
              .map((cat, idx) => {
                const percentage = ((cat.count / totalCategoryItems) * 100).toFixed(1);
                const color = categoryColor(cat.category, idx);
                return (
                  <div key={cat.category}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, marginBottom: '3px' }}>
                      <span style={{ color: '#1E293B' }}>{categoryLabel(cat.category)}</span>
                      <span style={{ color: '#64748B' }}>{percentage}% ({cat.count.toLocaleString()})</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${percentage}%`,
                          height: '100%',
                          background: color,
                          borderRadius: '3px',
                          transition: 'width 0.5s ease'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
