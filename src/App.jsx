import React from 'react';
import { 
  useDashboardController,
  useReportController,
  useCategoryController,
  useMatchController,
  useNotificationController
} from './controllers';

// Views & Presentational Components
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Toast from './components/Toast';
import ItemDetailModal from './components/ItemDetailModal';
import VerifyMatchModal from './components/VerifyMatchModal';
import BroadcastModal from './components/BroadcastModal';
import CategoryManager from './components/CategoryManager';

// Page Views
import DashboardView from './views/DashboardView';
import ItemsListView from './views/ItemsListView';
import MatchEngineView from './views/MatchEngineView';
import LiveMapView from './views/LiveMapView';
import UsersView from './views/UsersView';
import AnalyticsView from './views/AnalyticsView';
import SettingsView from './views/SettingsView';

/**
 * App Component - MVC Presentation Entrypoint
 * Wires Controller business logic with View presentation components.
 */
export default function App() {
  // Initialize Domain Controllers (C)
  const dashboard = useDashboardController();
  const reportCtrl = useReportController();
  const categoryCtrl = useCategoryController();
  const matchCtrl = useMatchController();
  const notifCtrl = useNotificationController();

  // Controller Orchestration Handlers
  const handleResolveCase = (reportId, newStatus) => {
    reportCtrl.updateReportStatus(reportId, newStatus);
    if (newStatus === 'returned') {
      dashboard.recordItemResolved();
      notifCtrl.showToast({
        title: 'Case Successfully Resolved! 🎉',
        message: 'Item has been verified and returned to owner. Case closed.',
        type: 'success'
      });
    } else {
      notifCtrl.showToast({
        title: 'Status Updated',
        message: `Case status set to ${newStatus.replace('_', ' ')}.`,
        type: 'info'
      });
    }
  };

  const handleVerifyMatch = (matchId) => {
    const approvedMatch = matchCtrl.approveMatch(matchId);
    if (approvedMatch) {
      reportCtrl.updateReportStatus(approvedMatch.lostItem.id, 'matched');
      reportCtrl.updateReportStatus(approvedMatch.foundItem.id, 'matched');
      dashboard.recordMatchApproved();
      notifCtrl.showToast({
        title: 'Match Verified & Reconciled! ✨',
        message: 'Owner and Finder connected. Handover QR and alerts dispatched.',
        type: 'match'
      });
    }
  };

  const handleFilterItemsByType = (typeKey) => {
    reportCtrl.setActiveFilterType(typeKey);
    dashboard.setActiveView('items');
  };

  return (
    <div className="app-container">
      {/* View: Sidebar Navigation */}
      <Sidebar
        activeView={dashboard.activeView}
        setActiveView={dashboard.setActiveView}
        collapsed={dashboard.sidebarCollapsed}
        setCollapsed={dashboard.setSidebarCollapsed}
        counts={{
          activeCases: dashboard.stats.activeCases,
          pendingMatches: dashboard.stats.pendingMatches,
          categoryCount: categoryCtrl.categories.filter(c => c.id !== 'all').length
        }}
      />

      {/* Main Content Area */}
      <div className="main-content-wrapper">
        {/* View: Topbar */}
        <Topbar
          searchQuery={dashboard.globalSearch}
          setSearchQuery={dashboard.setGlobalSearch}
          notifications={notifCtrl.notifications}
          onMarkNotificationRead={notifCtrl.markNotificationRead}
          onOpenBroadcastModal={() => notifCtrl.setShowBroadcastModal(true)}
        />

        {/* Dynamic Page Views (V) */}
        <main className="page-body">
          {dashboard.activeView === 'dashboard' && (
            <DashboardView
              stats={dashboard.stats}
              items={reportCtrl.reports}
              matchPairs={matchCtrl.matchPairs}
              onSelectItem={(item) => reportCtrl.setSelectedReport(item)}
              onOpenMatchEngine={() => dashboard.setActiveView('matches')}
              onVerifyMatch={(pair) => matchCtrl.setActiveVerificationPair(pair)}
              onViewAllItems={() => { reportCtrl.setActiveFilterType('all'); dashboard.setActiveView('items'); }}
              onViewFullMap={() => dashboard.setActiveView('map')}
              onOpenBroadcastModal={() => notifCtrl.setShowBroadcastModal(true)}
              onFilterItemsByType={handleFilterItemsByType}
            />
          )}

          {dashboard.activeView === 'items' && (
            <ItemsListView
              items={reportCtrl.reports}
              categories={categoryCtrl.categories}
              onSelectItem={(item) => reportCtrl.setSelectedReport(item)}
              initialType={reportCtrl.activeFilterType}
              onExportCsv={reportCtrl.exportReportsToCsv}
            />
          )}

          {dashboard.activeView === 'categories' && (
            <div className="animate-fade-in">
              <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>Category Management</h1>
                <p style={{ fontSize: '13px', color: '#64748B', marginTop: '3px' }}>
                  Create, update, and delete item categories for the BackToOwner mobile app
                </p>
              </div>

              <CategoryManager
                categories={categoryCtrl.categories}
                items={reportCtrl.reports}
                onAddCategory={categoryCtrl.addCategory}
                onUpdateCategory={categoryCtrl.updateCategory}
                onDeleteCategory={categoryCtrl.deleteCategory}
                onShowToast={notifCtrl.showToast}
              />
            </div>
          )}

          {dashboard.activeView === 'matches' && (
            <MatchEngineView
              matchPairs={matchCtrl.matchPairs}
              onVerifyMatch={(pair) => matchCtrl.setActiveVerificationPair(pair)}
            />
          )}

          {dashboard.activeView === 'map' && (
            <LiveMapView
              items={reportCtrl.reports}
              onSelectItem={(item) => reportCtrl.setSelectedReport(item)}
              onOpenBroadcastModal={() => notifCtrl.setShowBroadcastModal(true)}
            />
          )}

          {dashboard.activeView === 'users' && (
            <UsersView />
          )}

          {dashboard.activeView === 'analytics' && (
            <AnalyticsView />
          )}

          {dashboard.activeView === 'settings' && (
            <SettingsView onShowToast={notifCtrl.showToast} />
          )}
        </main>
      </div>

      {/* Modal Views (V) */}
      {reportCtrl.selectedReport && (
        <ItemDetailModal
          item={reportCtrl.selectedReport}
          onClose={() => reportCtrl.setSelectedReport(null)}
          onUpdateStatus={handleResolveCase}
        />
      )}

      {matchCtrl.activeVerificationPair && (
        <VerifyMatchModal
          matchPair={matchCtrl.activeVerificationPair}
          onClose={() => matchCtrl.setActiveVerificationPair(null)}
          onConfirmMatch={handleVerifyMatch}
        />
      )}

      {notifCtrl.showBroadcastModal && (
        <BroadcastModal
          onClose={() => notifCtrl.setShowBroadcastModal(false)}
          onSendBroadcast={notifCtrl.dispatchGeoBroadcast}
        />
      )}

      {/* Floating Feedback View */}
      <Toast toasts={notifCtrl.toasts} onDismiss={notifCtrl.dismissToast} />
    </div>
  );
}
