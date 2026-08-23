import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Toast from './components/Toast';
import ItemDetailModal from './components/ItemDetailModal';
import VerifyMatchModal from './components/VerifyMatchModal';
import BroadcastModal from './components/BroadcastModal';
import CategoryManager from './components/CategoryManager';

import DashboardView from './views/DashboardView';
import ItemsListView from './views/ItemsListView';
import MatchEngineView from './views/MatchEngineView';
import LiveMapView from './views/LiveMapView';
import UsersView from './views/UsersView';
import AnalyticsView from './views/AnalyticsView';
import SettingsView from './views/SettingsView';

import { initialStats, initialReports, aiMatchPairs, notificationsList, categoriesList } from './data/mockData';

export default function App() {
  // Navigation & UI state
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [itemsInitialFilter, setItemsInitialFilter] = useState('all');

  // Core Data States (All submitted by mobile users & finders)
  const [stats, setStats] = useState(initialStats);
  const [items, setItems] = useState(initialReports);
  const [categories, setCategories] = useState(categoriesList);
  const [matchPairs, setMatchPairs] = useState(aiMatchPairs);
  const [notifications, setNotifications] = useState(notificationsList);
  const [toasts, setToasts] = useState([]);

  // Modals state
  const [selectedItem, setSelectedItem] = useState(null);
  const [verifyMatchPair, setVerifyMatchPair] = useState(null);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  // Toast Helper
  const showToast = ({ title, message, type = 'success' }) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Category CRUD Handlers
  const handleAddCategory = (newCategory) => {
    setCategories(prev => [...prev, newCategory]);
  };

  const handleUpdateCategory = (updatedCategory) => {
    setCategories(prev => prev.map(cat => cat.id === updatedCategory.id ? updatedCategory : cat));
  };

  const handleDeleteCategory = (categoryId) => {
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
  };

  // Action: Update item status (e.g., mark returned to owner)
  const handleUpdateItemStatus = (itemId, newStatus) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, status: newStatus };
      }
      return item;
    }));

    if (newStatus === 'returned') {
      setStats(prev => ({
        ...prev,
        itemsReturned: prev.itemsReturned + 1,
        activeCases: Math.max(0, prev.activeCases - 1)
      }));
      showToast({
        title: 'Case Successfully Resolved! 🎉',
        message: `Item has been verified and returned to owner. Case closed.`,
        type: 'success'
      });
    } else {
      showToast({
        title: 'Status Updated',
        message: `Case status set to ${newStatus.replace('_', ' ')}.`,
        type: 'info'
      });
    }

    if (selectedItem && selectedItem.id === itemId) {
      setSelectedItem(prev => ({ ...prev, status: newStatus }));
    }
  };

  // Action: Verify AI Match
  const handleConfirmMatch = (matchId) => {
    const pair = matchPairs.find(p => p.id === matchId);
    if (!pair) return;

    // Update match pairs and item statuses
    setMatchPairs(prev => prev.filter(p => p.id !== matchId));
    setItems(prev => prev.map(item => {
      if (item.id === pair.foundItem.id || item.id === pair.lostItem.id) {
        return { ...item, matched: true, status: 'matched' };
      }
      return item;
    }));

    setStats(prev => ({
      ...prev,
      pendingMatches: Math.max(0, prev.pendingMatches - 1)
    }));

    showToast({
      title: 'Match Verified & Reconciled! ✨',
      message: `Owner and Finder connected. Handover QR and alerts dispatched.`,
      type: 'match'
    });
  };

  // Action: Dispatch Geo-Broadcast
  const handleSendBroadcast = ({ title, message, radius }) => {
    showToast({
      title: 'Geo-Alert Dispatched 📡',
      message: `Broadcasted to active mobile devices within ${radius}km radius.`,
      type: 'info'
    });
    setNotifications(prev => [
      {
        id: `NOTIF-${Date.now()}`,
        title: `Geo-Alert: ${title}`,
        message: `${message} (${radius}km radius)`,
        time: 'Just now',
        read: false,
        type: 'location'
      },
      ...prev
    ]);
  };

  // Action: Mark notification read
  const handleMarkNotificationRead = (notifId) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  const handleFilterItemsByType = (typeKey) => {
    setItemsInitialFilter(typeKey);
    setActiveView('items');
  };

  return (
    <div className="app-container">
      {/* Clean White Sidebar Navigation */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        counts={{
          activeCases: stats.activeCases,
          pendingMatches: stats.pendingMatches,
          categoryCount: categories.filter(c => c.id !== 'all').length
        }}
      />

      {/* Main Content Area */}
      <div className="main-content-wrapper">
        {/* Topbar */}
        <Topbar
          searchQuery={globalSearch}
          setSearchQuery={setGlobalSearch}
          notifications={notifications}
          onMarkNotificationRead={handleMarkNotificationRead}
          onOpenBroadcastModal={() => setShowBroadcastModal(true)}
        />

        {/* Dynamic View Body */}
        <main className="page-body">
          {activeView === 'dashboard' && (
            <DashboardView
              stats={stats}
              items={items}
              matchPairs={matchPairs}
              onSelectItem={(item) => setSelectedItem(item)}
              onOpenMatchEngine={() => setActiveView('matches')}
              onVerifyMatch={(pair) => setVerifyMatchPair(pair)}
              onViewAllItems={() => { setItemsInitialFilter('all'); setActiveView('items'); }}
              onViewFullMap={() => setActiveView('map')}
              onOpenBroadcastModal={() => setShowBroadcastModal(true)}
              onFilterItemsByType={handleFilterItemsByType}
            />
          )}

          {activeView === 'items' && (
            <ItemsListView
              items={items}
              categories={categories}
              onSelectItem={(item) => setSelectedItem(item)}
              initialType={itemsInitialFilter}
            />
          )}

          {activeView === 'categories' && (
            <div className="animate-fade-in">
              <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>Category Management</h1>
                <p style={{ fontSize: '13px', color: '#64748B', marginTop: '3px' }}>
                  Create, update, and delete item categories for the BackToOwner mobile app
                </p>
              </div>

              <CategoryManager
                categories={categories}
                items={items}
                onAddCategory={handleAddCategory}
                onUpdateCategory={handleUpdateCategory}
                onDeleteCategory={handleDeleteCategory}
                onShowToast={showToast}
              />
            </div>
          )}

          {activeView === 'matches' && (
            <MatchEngineView
              matchPairs={matchPairs}
              onVerifyMatch={(pair) => setVerifyMatchPair(pair)}
            />
          )}

          {activeView === 'map' && (
            <LiveMapView
              items={items}
              onSelectItem={(item) => setSelectedItem(item)}
              onOpenBroadcastModal={() => setShowBroadcastModal(true)}
            />
          )}

          {activeView === 'users' && (
            <UsersView />
          )}

          {activeView === 'analytics' && (
            <AnalyticsView />
          )}

          {activeView === 'settings' && (
            <SettingsView 
              categories={categories}
              items={items}
              onAddCategory={handleAddCategory}
              onUpdateCategory={handleUpdateCategory}
              onDeleteCategory={handleDeleteCategory}
              onShowToast={showToast} 
            />
          )}
        </main>
      </div>

      {/* Item Detail Inspector Modal */}
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onUpdateStatus={handleUpdateItemStatus}
        />
      )}

      {/* Verify AI Match Modal */}
      {verifyMatchPair && (
        <VerifyMatchModal
          matchPair={verifyMatchPair}
          onClose={() => setVerifyMatchPair(null)}
          onConfirmMatch={handleConfirmMatch}
        />
      )}

      {/* Broadcast Push Alert Modal */}
      {showBroadcastModal && (
        <BroadcastModal
          onClose={() => setShowBroadcastModal(false)}
          onSendBroadcast={handleSendBroadcast}
        />
      )}

      {/* Floating Toast Notification Center */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
