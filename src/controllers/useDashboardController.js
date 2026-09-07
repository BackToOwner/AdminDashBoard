import { useState, useCallback, useEffect } from 'react';
import { statsApi } from '../api';
import { StatsModel } from '../models/StatsModel';
import { formatMoney } from '../utils/format';

export function useDashboardController() {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [stats, setStats] = useState(() => new StatsModel());
  const [breakdown, setBreakdown] = useState({ byCategory: [], byType: [], byStatus: [], last14Days: [] });
  const [loadingStats, setLoadingStats] = useState(true);

  /**
   * Pull the latest KPI overview + chart breakdown from the API. The backend
   * doesn't track historical trend deltas or average resolution time, so
   * StatsModel's own cosmetic defaults for those fields are left in place -
   * only the real, counted metrics are overwritten.
   */
  const refreshStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const [overview, breakdownData] = await Promise.all([statsApi.overview(), statsApi.breakdown()]);
      setStats(prev => new StatsModel({
        ...prev,
        ...overview,
        totalRewardsPaid: formatMoney(overview.totalRewardsPaid),
      }));
      setBreakdown(breakdownData);
    } catch {
      // Leave existing (default) stats in place if the API call fails.
    } finally {
      setLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  return {
    activeView,
    setActiveView,
    sidebarCollapsed,
    setSidebarCollapsed,
    globalSearch,
    setGlobalSearch,
    stats,
    breakdown,
    loadingStats,
    refreshStats,
    // Kept for callers that just resolved a case / approved a match - re-pulls
    // real numbers from the API rather than guessing at a client-side delta.
    recordItemResolved: refreshStats,
    recordMatchApproved: refreshStats,
  };
}
