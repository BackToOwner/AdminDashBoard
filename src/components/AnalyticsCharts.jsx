import React, { useEffect, useState } from 'react';
import { BarChart2, PieChart } from 'lucide-react';
import { API_BASE_URL } from '../config';

const CATEGORY_COLORS = [
  '#8B5CF6',
  '#0077EE',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#06B6D4',
  '#64748B',
];

export default function AnalyticsCharts() {
  const [analytics, setAnalytics] = useState({
    byCategory: [],
    last7Days: [],
    weeklyClosed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function fetchAnalytics() {
      const token = localStorage.getItem('adminToken');

      if (!token) {
        setError('Please log in as an administrator to view analytics.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/stats/breakdown`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
          signal: controller.signal,
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Failed to load analytics.');
        }

        setAnalytics({
          byCategory: result.data?.byCategory || [],
          last7Days: result.data?.last7Days || [],
          weeklyClosed: Number(result.data?.weeklyClosed) || 0,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Analytics loading error:', err);
          setError(err.message || 'Unable to load analytics.');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchAnalytics();
    return () => controller.abort();
  }, []);

  const maxCount = Math.max(
    1,
    ...analytics.last7Days.flatMap((day) => [day.lost, day.closed])
  );

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
        gap: '24px',
        marginBottom: '28px',
      }}
    >
      <div className="bto-card" style={{ padding: '24px', minWidth: 0 }}>
        <div
          className="card-header-clean"
          style={{ marginBottom: '16px' }}
        >
          <div>
            <div className="card-title">
              <BarChart2 size={20} color="#0077EE" />
              <span>Weekly Recovery Volume</span>
            </div>
            <div className="card-subtitle">
              Daily comparisons of reported lost vs closed items
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '12px',
              fontSize: '11.5px',
              fontWeight: 600,
            }}
          >
            <span style={{ color: '#EF4444' }}>■ Lost</span>
            <span style={{ color: '#10B981' }}>■ Closed</span>
          </div>
        </div>

        {loading ? (
          <p>Loading weekly analytics...</p>
        ) : error ? (
          <p role="alert" style={{ color: '#DC2626' }}>{error}</p>
        ) : (
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                height: '180px',
                paddingTop: '20px',
                borderBottom: '1px solid #E2E8F0',
              }}
            >
              {analytics.last7Days.map((item) => {
                const lostHeight = (item.lost / maxCount) * 140;
                const closedHeight = (item.closed / maxCount) * 140;
                const dayLabel = new Date(
                  `${item.day}T00:00:00Z`
                ).toLocaleDateString(undefined, {
                  weekday: 'short',
                  timeZone: 'UTC',
                });

                return (
                  <div
                    key={item.day}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        gap: '4px',
                        height: '140px',
                      }}
                    >
                      <div
                        title={`${dayLabel} Lost: ${item.lost}`}
                        style={{
                          width: '14px',
                          height: `${lostHeight}px`,
                          background:
                            'linear-gradient(180deg, #FF7B7B 0%, #EF4444 100%)',
                          borderRadius: '4px 4px 0 0',
                        }}
                      />
                      <div
                        title={`${dayLabel} Closed: ${item.closed}`}
                        style={{
                          width: '14px',
                          height: `${closedHeight}px`,
                          background:
                            'linear-gradient(180deg, #34D399 0%, #059669 100%)',
                          borderRadius: '4px 4px 0 0',
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#64748B',
                      }}
                    >
                      {dayLabel}
                    </span>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                marginTop: '14px',
                paddingTop: '10px',
                fontSize: '12px',
                color: '#64748B',
              }}
            >
              <span>
                Items closed this week:{' '}
                <strong style={{ color: '#0F172A' }}>
                  {analytics.weeklyClosed.toLocaleString()}
                </strong>
              </span>
            </div>
          </>
        )}
      </div>

      <div className="bto-card" style={{ padding: '24px', minWidth: 0 }}>
        <div
          className="card-header-clean"
          style={{ marginBottom: '14px' }}
        >
          <div>
            <div className="card-title">
              <PieChart size={20} color="#8B5CF6" />
              <span>Category Breakdown</span>
            </div>
            <div className="card-subtitle">
              Distribution by item classification
            </div>
          </div>
        </div>

        {loading ? (
          <p>Loading category statistics...</p>
        ) : error ? (
          <p role="alert" style={{ color: '#DC2626' }}>{error}</p>
        ) : analytics.byCategory.length === 0 ? (
          <p>No report categories found.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {analytics.byCategory.map((cat, index) => {
              const color = CATEGORY_COLORS[index % CATEGORY_COLORS.length];

              return (
                <div key={cat.category}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: '8px',
                      fontSize: '12px',
                      fontWeight: 600,
                      marginBottom: '3px',
                    }}
                  >
                    <span style={{ color: '#1E293B' }}>
                      {cat.category
                        .replace(/[_-]+/g, ' ')
                        .replace(/\b\w/g, (char) => char.toUpperCase())}
                    </span>
                    <span style={{ color: '#64748B', whiteSpace: 'nowrap' }}>
                      {cat.percentage}% ({cat.count.toLocaleString()})
                    </span>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '6px',
                      background: '#F1F5F9',
                      borderRadius: '3px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.min(100, Math.max(0, cat.percentage))}%`,
                        height: '100%',
                        background: color,
                        borderRadius: '3px',
                        transition: 'width 0.5s ease',
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
