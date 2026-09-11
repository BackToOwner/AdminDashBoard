import { useState, useEffect, useCallback } from 'react';
import { ReportModel, filterReports } from '../models/ReportModel';
import { API_BASE_URL } from '../config';

export function useReportController() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [activeFilterType, setActiveFilterType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('adminToken');

      if (!token) {
        throw new Error('Admin authentication required');
      }

      console.log(
        'Fetching reports from:',
        `${API_BASE_URL}/reports`
      );

      const response = await fetch(
        `${API_BASE_URL}/reports`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        'Reports API status:',
        response.status
      );

      const result = await response.json();

      console.log(
        'REPORT API RESULT:',
        result
      );

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
          result.error ||
          `Failed to load reports (${response.status})`
        );
      }

      const loadedReports = (result.data || []).map(
        (data) =>
          new ReportModel({
            ...data,

            date:
              data.createdAt ||
              data.date,

            status:
              data.status ||
              'open',

            images:
              Array.isArray(data.images)
                ? data.images
                : data.image_url
                  ? [data.image_url]
                  : [],
          })
      );

      console.log(
        'Reports loaded into dashboard:',
        loadedReports.length
      );

      console.log(
        'Loaded reports:',
        loadedReports
      );

      setReports(loadedReports);

    } catch (err) {
      console.error(
        'Failed to fetch reports:',
        err
      );

      setError(
        err.message ||
        'Failed to load reports'
      );

      setReports([]);

    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);


  // ==================================================
  // UPDATE REPORT STATUS
  // ==================================================

  const updateReportStatus = async (
    reportId,
    newStatus
  ) => {
    try {
      console.log(
        'Updating report status:',
        reportId,
        newStatus
      );

      const token =
        localStorage.getItem('adminToken');

      if (!token) {
        throw new Error(
          'Admin authentication required'
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/reports/${reportId}`,
        {
          method: 'PATCH',

          headers: {
            'Content-Type': 'application/json',
            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      console.log(
        'Status update response:',
        response.status
      );

      const result =
        await response.json();

      console.log(
        'Status update result:',
        result
      );

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
          result.error ||
          `Failed to update report status (${response.status})`
        );
      }

      // Immediately update the local dashboard
      // so the UI reflects the new status.
      setReports((currentReports) =>
        currentReports.map((report) =>
          report.id === reportId
            ? new ReportModel({
                ...report,
                status: newStatus,
              })
            : report
        )
      );

      console.log(
        'Report status successfully updated:',
        reportId,
        newStatus
      );

      return result.data;

    } catch (err) {
      console.error(
        'Failed to update report status:',
        err
      );

      setError(
        err.message ||
        'Failed to update report status'
      );

      throw err;
    }
  };


  // ==================================================
  // CSV EXPORT
  // ==================================================

  const exportReportsToCsv = (
    itemsToExport = reports
  ) => {
    const headers =
      'ID,Title,Type,Category,Status,Location,Reward,Reporter/Finder,Date\n';

    const rows = itemsToExport.map(
      (item) => item.toCsvRow()
    );

    const blob = new Blob(
      [headers, ...rows],
      {
        type: 'text/csv;charset=utf-8;',
      }
    );

    const url =
      window.URL.createObjectURL(blob);

    const link =
      document.createElement('a');

    link.href = url;

    link.download =
      `backtoowner-reports-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;

    link.click();

    window.URL.revokeObjectURL(url);
  };


  return {
    reports,

    selectedReport,
    setSelectedReport,

    activeFilterType,
    setActiveFilterType,

    updateReportStatus,

    exportReportsToCsv,

    filterReports,

    loading,
    error,

    refreshReports:
      fetchReports,
  };
}