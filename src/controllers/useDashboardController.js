
import { useState, useCallback, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { StatsModel } from '../models/StatsModel';

export function useDashboardController() {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const [stats, setStats] = useState(() => new StatsModel({
    itemsReturned: 0,
    activeCases: 0,
    successRate: 0,
    pendingMatches: 0,
    totalRewardsPaid: 0,
    registeredUsers: 0,
    activeFinders: 0,
  }));

  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState('');

  const fetchStats = useCallback(async () => {
    const token = localStorage.getItem('adminToken');

    if (!token) {
      setStatsError('Please log in as an administrator.');
      setStatsLoading(false);
      return;
    }

    setStatsLoading(true);
    setStatsError('');

    try {
      const response = await fetch(`${API_BASE_URL}/stats/overview`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to load dashboard statistics.');
      }

      setStats(new StatsModel(result.data));
    } catch (error) {
      console.error('Dashboard statistics error:', error);
      setStatsError(
        error.message || 'Unable to connect to the backend.'
      );
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const recordItemResolved = useCallback(() => {
    fetchStats();
  }, [fetchStats]);

  const recordMatchApproved = useCallback(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    activeView,
    setActiveView,
    sidebarCollapsed,
    setSidebarCollapsed,
    globalSearch,
    setGlobalSearch,
    stats,
    statsLoading,
    statsError,
    refreshStats: fetchStats,
    recordItemResolved,
    recordMatchApproved,
  };
}
