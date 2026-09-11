import React, {
  useMemo
} from 'react';

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
import BroadcastModal from './components/BroadcastModal';
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
              'Item has been verified and returned to owner. Case closed.',

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
        // GET LOST ITEM ID
        // ======================================================

        const lostItemId =
          approvedMatch
            .lostItem
            .id;


        console.log(
          'Updating lost item:',
          lostItemId
        );


        // ======================================================
        // UPDATE SUPABASE
        // ======================================================

        /**
         * IMPORTANT:
         *
         * Only the LOST item is updated.
         *
         * status = matched
         */

        await reportCtrl.updateReportStatus(
          lostItemId,
          'matched'
        );


        console.log(
          'Lost item successfully marked as matched.'
        );


        // ======================================================
        // REFRESH REPORTS
        // ======================================================

        console.log(
          'Refreshing reports from Supabase...'
        );


        await reportCtrl.refreshReports();


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
            dashboard.stats
              .pendingMatches,

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

          onOpenBroadcastModal={() =>
            notifCtrl.setShowBroadcastModal(
              true
            )
          }
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
                dashboard.stats
              }

              items={
                reportCtrl.reports
              }

              matchPairs={
                matchCtrl.matchPairs
              }

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

              onOpenBroadcastModal={() =>
                notifCtrl.setShowBroadcastModal(
                  true
                )
              }

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
          BROADCAST MODAL
          ====================================================== */}

      {notifCtrl.showBroadcastModal && (

        <BroadcastModal

          onClose={() =>
            notifCtrl.setShowBroadcastModal(
              false
            )
          }

          onSendBroadcast={
            notifCtrl.dispatchGeoBroadcast
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

