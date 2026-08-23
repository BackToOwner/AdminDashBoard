import { useState, useCallback } from 'react';
import { initialStats } from '../data/mockData';
import { StatsModel } from '../models/StatsModel';

export function useDashboardController() {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [stats, setStats] = useState(() => new StatsModel(initialStats));

  /**
   * Recalculate stats on return
   */
  const recordItemResolved = useCallback(() => {
    setStats(prev => prev.resolveCase());
  }, []);

  /**
   * Recalculate stats on match approved
   */
  const recordMatchApproved = useCallback(() => {
    setStats(prev => prev.approveMatch());
  }, []);

  return {
    activeView,
    setActiveView,
    sidebarCollapsed,
    setSidebarCollapsed,
    globalSearch,
    setGlobalSearch,
    stats,
    recordItemResolved,
    recordMatchApproved
  };
}
