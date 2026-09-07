import { useState, useCallback, useEffect } from 'react';
import { reportsApi } from '../api';
import { ReportModel, ReportStatus, filterReports } from '../models/ReportModel';
import { formatTimeAgo, formatDate } from '../utils/format';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';

/**
 * The admin backend stores reporter/finder as a simple {name, contact} pair
 * (the citizen/finder profile lives in the mobile app's own database, not
 * here). Enrich it just enough for the existing UI components to render
 * something sensible instead of "undefined".
 */
function enrichPerson(person) {
  if (!person) return null;
  return {
    ...person,
    avatar: person.avatar || DEFAULT_AVATAR,
    email: person.email || person.contact || null,
    phone: person.phone || person.contact || null,
  };
}

function mapApiReportToModel(apiReport) {
  return new ReportModel({
    ...apiReport,
    reporter: enrichPerson(apiReport.reporter),
    finder: enrichPerson(apiReport.finder),
    timeAgo: formatTimeAgo(apiReport.createdAt),
    date: formatDate(apiReport.createdAt),
  });
}

export function useReportController() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [activeFilterType, setActiveFilterType] = useState('all');

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await reportsApi.list();
      setReports(data.map(mapApiReportToModel));
    } catch (err) {
      setError(err.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  /**
   * Update report status (e.g. mark returned). Persists to the API, then
   * syncs local state from the server's response.
   */
  const updateReportStatus = useCallback(async (reportId, newStatus) => {
    const updated = await reportsApi.update(reportId, {
      status: newStatus,
      matched: newStatus === ReportStatus.MATCHED ? true : undefined,
    });
    const model = mapApiReportToModel(updated);

    setReports(prev => prev.map(report => (report.id === reportId ? model : report)));
    setSelectedReport(prev => (prev && prev.id === reportId ? model : prev));
    return model;
  }, []);

  /**
   * Export given reports to CSV
   */
  const exportReportsToCsv = (itemsToExport = reports) => {
    const headers = ['ID,Title,Type,Category,Status,Location,Reward,Reporter/Finder,Date\n'];
    const rows = itemsToExport.map(item => item.toCsvRow());
    const blob = new Blob([headers.concat(rows).join('')], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backtoowner-reports-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return {
    reports,
    loading,
    error,
    selectedReport,
    setSelectedReport,
    activeFilterType,
    setActiveFilterType,
    updateReportStatus,
    exportReportsToCsv,
    filterReports,
    refetchReports: fetchReports,
  };
}
