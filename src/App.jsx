import React, {
  useMemo
} from 'react';

import { API_BASE_URL } from './config';

import AdminLogin from './components/AdminLogin';

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
import CategoryManager from './components/CategoryManager';

// Page Views

import DashboardView from './views/DashboardView';
import ItemsListView from './views/ItemsListView';
import MatchEngineView from './views/MatchEngineView';
import UsersView from './views/UsersView';
import AnalyticsView from './views/AnalyticsView';
import SettingsView from './views/SettingsView';


/**
 * ============================================================
 * APP COMPONENT
 * ============================================================
 */

export default function App() {

  // ============================================================
  // CONTROLLERS
  // ============================================================

  const dashboard =
    useDashboardController();

  const reportCtrl =
    useReportController();

  const categoryCtrl =
    useCategoryController();

  const notifCtrl =
    useNotificationController();


  // ============================================================
  // LOST ITEMS FOR AI MATCHING
  // ============================================================

  /**
   * Only pass real LOST items to the AI engine.
   *
   * Found items are handled by the FastAPI/Supabase
   * matching service.
   */

  const lostItems =
    useMemo(
      () =>
        reportCtrl.reports.filter(
          (item) =>
            item.type === 'lost'
        ),
      [reportCtrl.reports]
    );


  // ============================================================
  // AI MATCH CONTROLLER
  // ============================================================

  /**
   * AI automatically matches pending lost items
   * against found items.
   *
   * Admin does NOT manually choose the pair.
   *
   * Admin only verifies the AI suggestion.
   */

  const matchCtrl =
    useMatchController(
      lostItems
    );


  // ============================================================
  // ADMIN AUTHENTICATION
  // ============================================================

  const [admin, setAdmin] =
    React.useState(() => {

      const savedAdmin =
        localStorage.getItem(
          'adminUser'
        );

      return savedAdmin
        ? JSON.parse(
            savedAdmin
          )
        : null;
    });


  // Persistent match records loaded from the authenticated backend.
  const [savedMatches, setSavedMatches] = React.useState([]);
  const [savedMatchesLoading, setSavedMatchesLoading] = React.useState(false);
  const [savedMatchesError, setSavedMatchesError] = React.useState('');

  // Count unique AI suggestions and saved pending matches together.
  // Match identity uses the real Lost/Found report IDs, never the
  // synthetic AI candidate ID.
  const pendingMatchCount = useMemo(() => {
    const getPairKey = (match) => {
      const lostId = match?.lostItem?.id;
      const foundId = match?.foundItem?.id;

      if (lostId == null || foundId == null) return null;

      return JSON.stringify([String(lostId), String(foundId)]);
    };

    const savedPairKeys = new Set();
    const pendingPairKeys = new Set();

    for (const match of savedMatches) {
      const key = getPairKey(match);
      if (!key) continue;

      savedPairKeys.add(key);

      if (
        String(match.status || '').toLowerCase() ===
        'pending_admin_approval'
      ) {
        pendingPairKeys.add(key);
      }
    }

    for (const pair of matchCtrl.matchPairs || []) {
      const key = getPairKey(pair);
      if (!key) continue;

      // Any existing saved record means this AI suggestion must not
      // be counted separately. Saved pending records were counted above;
      // approved/rejected/closed records are not awaiting review.
      if (savedPairKeys.has(key)) continue;

      pendingPairKeys.add(key);
    }

    return pendingPairKeys.size;
  }, [savedMatches, matchCtrl.matchPairs]);

  const displayedStats = useMemo(
    () => ({
      ...dashboard.stats,
      pendingMatches: pendingMatchCount,
    }),
    [dashboard.stats, pendingMatchCount]
  );

  const refreshSavedMatches = async () => {
    const token = localStorage.getItem('adminToken');

    if (!token) {
      setSavedMatchesError('Admin authentication required. Please sign in again.');
      setSavedMatches([]);
      return false;
    }

    setSavedMatchesLoading(true);
    setSavedMatchesError('');

    try {
      const response = await fetch(`${API_BASE_URL}/matches?status=all`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || result.error || `Failed to load matches (${response.status})`
        );
      }

      setSavedMatches(Array.isArray(result.data) ? result.data : []);
      return true;
    } catch (error) {
      console.error('Failed to fetch saved matches:', error);
      setSavedMatchesError(error.message || 'Could not load saved match records.');
      return false;
    } finally {
      setSavedMatchesLoading(false);
    }
  };

  React.useEffect(() => {
    if (admin && dashboard.activeView === 'matches') {
      refreshSavedMatches();
    }
  }, [admin, dashboard.activeView]);


  const handleLogin =
    (loggedInAdmin) => {

      setAdmin(
        loggedInAdmin
      );
    };


  const handleLogout =
    () => {

      localStorage.removeItem(
        'adminToken'
      );

      localStorage.removeItem(
        'adminUser'
      );

      setAdmin(null);
    };


  /**
   * IMPORTANT:
   *
   * Keep all hooks above this conditional.
   *
   * This prevents React Rules-of-Hooks errors.
   */

  if (!admin) {

    return (
      <AdminLogin
        onLogin={
          handleLogin
        }
      />
    );
  }


  // ============================================================
  // RESOLVE CASE
  // ============================================================

  const handleResolveCase =
    async (
      reportId,
      newStatus
    ) => {

      try {

        await reportCtrl.updateReportStatus(
          reportId,
          newStatus
        );


        // Reload latest data from Supabase.

        await reportCtrl.refreshReports();


        if (
          newStatus ===
          'returned'
        ) {

          dashboard.recordItemResolved();


          notifCtrl.showToast({

            title:
              'Case Successfully Resolved! 🎉',

            message:
              'Return recorded. The case can be closed after both participants confirm.',

            type:
              'success'
          });

        } else {

          notifCtrl.showToast({

            title:
              'Status Updated',

            message:
              `Case status set to ${newStatus.replace(
                '_',
                ' '
              )}.`,

            type:
              'info'
          });
        }

      } catch (error) {

        console.error(
          'Failed to update case status:',
          error
        );


        notifCtrl.showToast({

          title:
            'Status Update Failed',

          message:
            error.message ||
            'Could not update the report status.',

          type:
            'error'
        });
      }
    };


  // ============================================================
  // CLOSE CASE AFTER BOTH PARTICIPANTS CONFIRM
  // ============================================================

  const handleCloseMatchedCase = async (reportId) => {
    try {
      const result = await reportCtrl.closeMatchedCase(reportId);
      await reportCtrl.refreshReports();

      notifCtrl.showToast({
        title: 'Case Closed',
        message: 'Both participants confirmed the return. The matched case is now closed.',
        type: 'success',
      });

      reportCtrl.setSelectedReport(null);
      return result;
    } catch (error) {
      console.error('Failed to close matched case:', error);
      notifCtrl.showToast({
        title: 'Could Not Close Case',
        message: error.message || 'Both participants must confirm before closure.',
        type: 'error',
      });
      throw error;
    }
  };


  // ============================================================
  // VERIFY AI MATCH
  // ============================================================

  /**
   * AI suggests:
   *
   * Lost Item
   *      ↓
   * SigLIP AI
   *      ↓
   * Found Item
   *      ↓
   * Pending Admin Verification
   *
   * Admin:
   *
   * Verify & Reconcile
   *      ↓
   * lost_items.status = "matched"
   *
   * We intentionally DO NOT update found_items.status
   * because the current found_items table does not contain
   * a status column.
   */

  const handleVerifyMatch =
    async (matchId) => {

      console.log(
        '===================================='
      );

      console.log(
        'VERIFYING AI MATCH'
      );

      console.log(
        'Match ID:',
        matchId
      );


      // ========================================================
      // FIND MATCH
      // ========================================================

      const approvedMatch =
        matchCtrl.approveMatch(
          matchId
        );


      if (!approvedMatch) {

        console.error(
          'Could not find match:',
          matchId
        );


        notifCtrl.showToast({

          title:
            'Verification Failed',

          message:
            'The selected match could not be found.',

          type:
            'error'
        });

        return;
      }


      console.log(
        'Approved match:',
        approvedMatch
      );


      try {

        // ======================================================
        // VALIDATE THE REAL LOST AND FOUND REPORTS
        // ======================================================

        const lostItemId = approvedMatch.lostItem?.id;
        const foundItemId = approvedMatch.foundItem?.id;

        const lostReport = reportCtrl.reports.find(
          (item) => item.id === lostItemId && item.type === 'lost'
        );

        const foundReport = reportCtrl.reports.find(
          (item) => item.id === foundItemId && item.type === 'found'
        );

        if (!lostReport || !foundReport) {
          throw new Error(
            'The AI candidate could not be verified against the real Lost and Found reports. No match was saved.'
          );
        }

        if (
          ['returned', 'closed'].includes(String(lostReport.status || '').toLowerCase()) ||
          ['returned', 'closed'].includes(String(foundReport.status || '').toLowerCase())
        ) {
          throw new Error(
            'This report pair already contains a returned or closed case.'
          );
        }

        const token = localStorage.getItem('adminToken');

        if (!token) {
          throw new Error('Admin authentication required');
        }

        const requestOptions = {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };

        // ======================================================
        // FIND OR CREATE THE PERSISTENT MATCH IN SUPABASE
        // ======================================================

        const listResponse = await fetch(
          `${API_BASE_URL}/matches?status=all`,
          requestOptions
        );
        const listResult = await listResponse.json();

        if (!listResponse.ok || !listResult.success) {
          throw new Error(
            listResult.message || 'Could not load existing matches.'
          );
        }

        const existingMatch = (listResult.data || []).find((match) =>
          match.lostItem?.id === lostItemId &&
          match.foundItem?.id === foundItemId
        );

        if (existingMatch?.status === 'rejected') {
          throw new Error(
            'This exact report pair was previously rejected. It was not automatically reopened.'
          );
        }

        let persistentMatch = existingMatch;

        if (!persistentMatch) {
          const createResponse = await fetch(
            `${API_BASE_URL}/matches`,
            {
              ...requestOptions,
              method: 'POST',
              body: JSON.stringify({
                lostItemId,
                foundItemId,
                matchScore: approvedMatch.matchScore,
                matchFactors: approvedMatch.matchFactors || []
              })
            }
          );

          const createResult = await createResponse.json();

          if (!createResponse.ok || !createResult.success) {
            throw new Error(
              createResult.message ||
              createResult.error ||
              'Could not save the verified match.'
            );
          }

          persistentMatch = createResult.data;
        }

        // ======================================================
        // APPROVE THE PERSISTENT MATCH
        // The backend updates BOTH report statuses to matched.
        // ======================================================

        if (persistentMatch.status !== 'approved') {
          const approveResponse = await fetch(
            `${API_BASE_URL}/matches/${persistentMatch.id}/approve`,
            {
              ...requestOptions,
              method: 'POST'
            }
          );

          const approveResult = await approveResponse.json();

          if (!approveResponse.ok || !approveResult.success) {
            throw new Error(
              approveResult.message ||
              approveResult.error ||
              'The match was saved but could not be approved.'
            );
          }
        }

        console.log(
          'Verified Lost and Found reports are linked in Supabase:',
          lostItemId,
          foundItemId
        );

        // ======================================================
        // REFRESH REPORTS
        // ======================================================

        console.log(
          'Refreshing reports from Supabase...'
        );


        await reportCtrl.refreshReports();
        await refreshSavedMatches();


        console.log(
          'Reports refreshed.'
        );


        // ======================================================
        // REMOVE MATCH FROM AI UI
        // ======================================================

        /**
         * IMPORTANT:
         *
         * The pair has now been verified.
         *
         * Remove it from the current AI Smart Match
         * results immediately.
         */

        matchCtrl.removeMatch(
          matchId
        );


        console.log(
          'Verified match removed from AI Smart Match.'
        );


        // ======================================================
        // UPDATE DASHBOARD STATISTICS
        // ======================================================

        dashboard.recordMatchApproved();


        // ======================================================
        // SUCCESS MESSAGE
        // ======================================================

        notifCtrl.showToast({

          title:
            'Match Verified & Reconciled! ✨',

          message:
            'The match has been verified and the lost item is now marked as matched.',

          type:
            'match'
        });


        console.log(
          'MATCH VERIFICATION COMPLETE'
        );

        console.log(
          '===================================='
        );

        return true;

      } catch (error) {

        console.error(
          'Failed to verify and reconcile match:',
          error
        );


        notifCtrl.showToast({

          title:
            'Verification Failed',

          message:
            error.message ||
            'Could not update the report status.',

          type:
            'error'
        });

        return false;
      }
    };


  // ============================================================
  // FILTER ITEMS BY TYPE
  // ============================================================

  const handleFilterItemsByType =
    (typeKey) => {

      reportCtrl.setActiveFilterType(
        typeKey
      );

      dashboard.setActiveView(
        'items'
      );
    };


  // ============================================================
  // APPLICATION
  // ============================================================

  return (

    <div className="app-container">

      {/* ======================================================
          SIDEBAR
          ====================================================== */}

      <Sidebar
        admin={admin}

        activeView={
          dashboard.activeView
        }

        setActiveView={
          dashboard.setActiveView
        }

        collapsed={
          dashboard.sidebarCollapsed
        }

        setCollapsed={
          dashboard.setSidebarCollapsed
        }

        counts={{

          activeCases:
            dashboard.stats
              .activeCases,

          pendingMatches:
            pendingMatchCount,

          categoryCount:
            categoryCtrl.categories.filter(
              (c) =>
                c.id !== 'all'
            ).length
        }}
      />


      {/* ======================================================
          MAIN CONTENT
          ====================================================== */}

      <div className="main-content-wrapper">

        {/* ====================================================
            TOPBAR
            ==================================================== */}

        <Topbar
          admin={admin}
          onLogout={handleLogout}

          searchQuery={
            dashboard.globalSearch
          }

          setSearchQuery={
            dashboard.setGlobalSearch
          }

          notifications={
            notifCtrl.notifications
          }

          onMarkNotificationRead={
            notifCtrl.markNotificationRead
          }

          notificationsLoading={notifCtrl.notificationsLoading}
          notificationsError={notifCtrl.notificationsError}
          onRetryNotifications={notifCtrl.refreshNotifications}
        />


        {/* ====================================================
            PAGE BODY
            ==================================================== */}

        <main className="page-body">

          {/* ==================================================
              DASHBOARD
              ================================================== */}

          {dashboard.activeView ===
            'dashboard' && (

            <DashboardView

              stats={
                displayedStats
              }

              items={
                reportCtrl.reports
              }

              matchPairs={
                matchCtrl.matchPairs
              }
              savedMatches={savedMatches}
              savedMatchesLoading={savedMatchesLoading}
              savedMatchesError={savedMatchesError}
              onRefreshSavedMatches={refreshSavedMatches}


              onSelectItem={
                (item) =>
                  reportCtrl.setSelectedReport(
                    item
                  )
              }

              onOpenMatchEngine={() =>
                dashboard.setActiveView(
                  'matches'
                )
              }

              onVerifyMatch={
                (pair) =>
                  matchCtrl.setActiveVerificationPair(
                    pair
                  )
              }

              onViewAllItems={() => {

                reportCtrl.setActiveFilterType(
                  'all'
                );

                dashboard.setActiveView(
                  'items'
                );
              }}

              onFilterItemsByType={
                handleFilterItemsByType
              }
            />
          )}


          {/* ==================================================
              ITEMS
              ================================================== */}

          {dashboard.activeView ===
            'items' && (

            <ItemsListView

              items={
                reportCtrl.reports
              }

              categories={
                categoryCtrl.categories
              }

              onSelectItem={
                (item) =>
                  reportCtrl.setSelectedReport(
                    item
                  )
              }

              initialType={
                reportCtrl.activeFilterType
              }

              onExportCsv={
                reportCtrl.exportReportsToCsv
              }
            />
          )}


          {/* ==================================================
              CATEGORIES
              ================================================== */}

          {dashboard.activeView ===
            'categories' && (

            <div className="animate-fade-in">

              <div
                style={{
                  marginBottom:
                    '24px'
                }}
              >

                <h1
                  style={{
                    fontSize:
                      '24px',

                    fontWeight:
                      800,

                    color:
                      '#0F172A'
                  }}
                >
                  Category Management
                </h1>


                <p
                  style={{
                    fontSize:
                      '13px',

                    color:
                      '#64748B',

                    marginTop:
                      '3px'
                  }}
                >
                  Create, update, and
                  delete item categories
                  for the BackToOwner
                  mobile app
                </p>

              </div>


              <CategoryManager

                categories={
                  categoryCtrl.categories
                }

                items={
                  reportCtrl.reports
                }

                onAddCategory={
                  categoryCtrl.addCategory
                }

                onUpdateCategory={
                  categoryCtrl.updateCategory
                }

                onDeleteCategory={
                  categoryCtrl.deleteCategory
                }

                onShowToast={
                  notifCtrl.showToast
                }
              />

            </div>
          )}


          {/* ==================================================
              MATCH ENGINE
              ================================================== */}

          {dashboard.activeView ===
            'matches' && (

            <MatchEngineView

              /*
               * All current lost items.
               *
               * MatchEngineView can use this to show
               * pending/unmatched lost items.
               */

              lostItems={
                lostItems
              }

              /*
               * AI-generated match pairs.
               */

              matchPairs={
                matchCtrl.matchPairs
              }

              /*
               * Admin verification.
               */

              onVerifyMatch={
                (pair) =>
                  matchCtrl.setActiveVerificationPair(
                    pair
                  )
              }

              /*
               * Manual button only triggers another
               * AI scan.
               *
               * It does NOT allow the admin to manually
               * select a lost/found pair.
               */

              onRunAutoMatch={
                matchCtrl.runAutoMatch
              }

              isScanning={
                matchCtrl.isScanning
              }

              error={
                matchCtrl.error
              }
            />
          )}


          {/* ==================================================
              USERS
              ================================================== */}

          {dashboard.activeView ===
            'users' && (

            <UsersView />
          )}


          {/* ==================================================
              ANALYTICS
              ================================================== */}

          {dashboard.activeView ===
            'analytics' && (

            <AnalyticsView />
          )}


          {/* ==================================================
              SETTINGS
              ================================================== */}

          {dashboard.activeView ===
            'settings' && (

            <SettingsView

              onShowToast={
                notifCtrl.showToast
              }
            />
          )}

        </main>
      </div>


      {/* ======================================================
          ITEM DETAIL MODAL
          ====================================================== */}

      {reportCtrl.selectedReport && (

        <ItemDetailModal

          item={
            reportCtrl.selectedReport
          }

          onClose={() =>
            reportCtrl.setSelectedReport(
              null
            )
          }

          onUpdateStatus={
            handleResolveCase
          }

          onGetReturnConfirmation={
            reportCtrl.getReturnConfirmationProgress
          }

          onCloseCase={
            handleCloseMatchedCase
          }
        />
      )}


      {/* ======================================================
          VERIFY MATCH MODAL
          ====================================================== */}

      {matchCtrl.activeVerificationPair && (

        <VerifyMatchModal

          matchPair={
            matchCtrl.activeVerificationPair
          }

          onClose={() =>
            matchCtrl.setActiveVerificationPair(
              null
            )
          }

          onConfirmMatch={
            handleVerifyMatch
          }
        />
      )}
{/* ======================================================
          TOAST
          ====================================================== */}

      <Toast

        toasts={
          notifCtrl.toasts
        }

        onDismiss={
          notifCtrl.dismissToast
        }
      />

    </div>
  );
}

