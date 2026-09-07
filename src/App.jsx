import React from 'react';
import { Loader2 } from 'lucide-react';
import {
  useAuthController,
  useDashboardController,
  useReportController,
  useCategoryController,
  useMatchController,
  useNotificationController,
  useUserController
} from './controllers';

// View & Presentational Components
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Toast from './components/Toast';
import ItemDetailModal from './components/ItemDetailModal';
import VerifyMatchModal from './components/VerifyMatchModal';
import BroadcastModal from './components/BroadcastModal';
import CategoryManager from './components/CategoryManager';

// Page Views
import LoginView from './views/LoginView';
import DashboardView from './views/DashboardView';
import ItemsListView from './views/ItemsListView';
import MatchEngineView from './views/MatchEngineView';
import UsersView from './views/UsersView';
import AnalyticsView from './views/AnalyticsView';
import SettingsView from './views/SettingsView';

/**
 * App Component - MVC Presentation Entrypoint
 * Wires Controller business logic (backed by the BackToOwner Admin API) with
 * View presentation components.
 */
export default function App() {
  const auth = useAuthController();

  // Gate everything else behind a signed-in admin session so we don't fire
  // authenticated API calls (and get 401s) before login.
  if (auth.checkingSession) {
    return <FullScreenLoader label="Restoring your session…" />;
  }
  if (!auth.isAuthenticated) {
    return <LoginView onLogin={auth.login} loginError={auth.loginError} loggingIn={auth.loggingIn} />;
  }

  return <AuthenticatedApp auth={auth} />;
}

function FullScreenLoader({ label }) {
  return (
    <div style={{ minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', color: '#64748B' }}>
      <Loader2 size={28} className="animate-spin" color="#00A896" />
      <span style={{ fontSize: '13px', fontWeight: 600 }}>{label}</span>
    </div>
  );
}

function AuthenticatedApp({ auth }) {
  // Initialize Domain Controllers (C)
  const dashboard = useDashboardController();
  const reportCtrl = useReportController();
  const categoryCtrl = useCategoryController();
  const matchCtrl = useMatchController();
  const notifCtrl = useNotificationController();
  const userCtrl = useUserController();

  // Controller Orchestration Handlers
  const handleResolveCase = async (reportId, newStatus) => {
    try {
      await reportCtrl.updateReportStatus(reportId, newStatus);
      dashboard.refreshStats();
      if (newStatus === 'returned') {
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
    } catch (err) {
      notifCtrl.showToast({ title: 'Update Failed', message: err.message, type: 'alert' });
    }
  };

  const handleVerifyMatch = async (matchId) => {
    try {
      const approvedMatch = await matchCtrl.approveMatch(matchId);
      if (approvedMatch) {
        await reportCtrl.refetchReports();
        dashboard.recordMatchApproved();
        notifCtrl.showToast({
          title: 'Match Verified & Reconciled! ✨',
          message: 'Owner and Finder connected. Handover QR and alerts dispatched.',
          type: 'match'
        });
      }
    } catch (err) {
      notifCtrl.showToast({ title: 'Verification Failed', message: err.message, type: 'alert' });
    }
  };

  const handleFilterItemsByType = (typeKey) => {
    reportCtrl.setActiveFilterType(typeKey);
    dashboard.setActiveView('items');
  };

  const handleAddCategory = async (categoryData) => {
    await categoryCtrl.addCategory(categoryData);
  };

  const handleUpdateCategory = async (categoryData) => {
    await categoryCtrl.updateCategory(categoryData);
  };

  const handleDeleteCategory = async (categoryId) => {
    await categoryCtrl.deleteCategory(categoryId);
  };

  return (
    <div className="app-container">
      {/* View: Sidebar Navigation */}
      <Sidebar
        activeView={dashboard.activeView}
        setActiveView={dashboard.setActiveView}
        collapsed={dashboard.sidebarCollapsed}
        setCollapsed={dashboard.setSidebarCollapsed}
        admin={auth.admin}
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
          admin={auth.admin}
          onLogout={auth.logout}
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
              onOpenBroadcastModal={() => notifCtrl.setShowBroadcastModal(true)}
              onFilterItemsByType={handleFilterItemsByType}
              breakdown={dashboard.breakdown}
              categories={categoryCtrl.categories}
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
                onAddCategory={handleAddCategory}
                onUpdateCategory={handleUpdateCategory}
                onDeleteCategory={handleDeleteCategory}
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

          {dashboard.activeView === 'users' && (
            <UsersView users={userCtrl.users} loading={userCtrl.loading} />
          )}

          {dashboard.activeView === 'analytics' && (
            <AnalyticsView stats={dashboard.stats} breakdown={dashboard.breakdown} categories={categoryCtrl.categories} />
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
