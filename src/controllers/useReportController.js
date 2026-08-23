import { useState, useMemo } from 'react';
import { initialReports } from '../data/mockData';
import { ReportModel, ReportStatus, filterReports } from '../models/ReportModel';

export function useReportController() {
  const [reports, setReports] = useState(() => 
    initialReports.map(data => new ReportModel(data))
  );
  const [selectedReport, setSelectedReport] = useState(null);
  const [activeFilterType, setActiveFilterType] = useState('all');

  /**
   * Update report status (e.g. mark returned)
   */
  const updateReportStatus = (reportId, newStatus) => {
    setReports(prev => prev.map(report => {
      if (report.id === reportId) {
        return new ReportModel({
          ...report,
          status: newStatus,
          matched: newStatus === ReportStatus.MATCHED ? true : report.matched
        });
      }
      return report;
    }));

    if (selectedReport && selectedReport.id === reportId) {
      setSelectedReport(prev => new ReportModel({ ...prev, status: newStatus }));
    }
  };

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
    selectedReport,
    setSelectedReport,
    activeFilterType,
    setActiveFilterType,
    updateReportStatus,
    exportReportsToCsv,
    filterReports
  };
}
