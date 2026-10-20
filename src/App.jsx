import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import SubscriptionCard from './components/SubscriptionCard';
import SubscriptionTable from './components/SubscriptionTable';
import WhatsAppModal from './components/WhatsAppModal';
import SubscriptionModal from './components/SubscriptionModal';
import SettingsModal from './components/SettingsModal';
import BulkImportExportModal from './components/BulkImportExportModal';
import Toast from './components/Toast';
import LockScreen from './components/LockScreen';

import { PLATFORMS, DEFAULT_SETTINGS } from './utils/constants';
import { 
  getDaysDifference, 
  calculateExpiryDate, 
  buildTelegramDailyDigest, 
  sendTelegramMessage 
} from './utils/helpers';
import { supabase, mapFromDb, mapToDb } from './utils/supabase';

import { 
  Search, 
  ArrowUpDown, 
  Plus, 
  Loader2, 
  RefreshCw 
} from 'lucide-react';

export default function App() {
  // Master PIN Lock State
  const [isLocked, setIsLocked] = useState(() => {
    return localStorage.getItem('premium_hub_unlocked_v1') !== 'true' &&
           sessionStorage.getItem('premium_hub_unlocked_v1') !== 'true';
  });

  // Database Subscriptions state (Supabase is single source of truth)
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Settings state
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('premium_hub_settings_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading settings', e);
    }
    return DEFAULT_SETTINGS;
  });

  // UI state
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('expiry_asc');

  // Modals state
  const [whatsAppSub, setWhatsAppSub] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  const [isSendingTelegram, setIsSendingTelegram] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (toastObj) => {
    setToast(toastObj);
  };

  // Lock handler
  const handleLock = () => {
    localStorage.removeItem('premium_hub_unlocked_v1');
    sessionStorage.removeItem('premium_hub_unlocked_v1');
    setIsLocked(true);
  };

  // Sync settings changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('premium_hub_settings_v1', JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  }, [settings]);

  // Direct Fetch from Supabase
  const fetchCloudSubscriptions = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .order('expiry_date', { ascending: true });

      if (error) {
        console.error('Supabase fetch error:', error);
        showToast({ type: 'error', message: `Database error: ${error.message}` });
      } else if (data) {
        setSubscriptions(data.map(mapFromDb));
      }
    } catch (err) {
      console.error('Network / Supabase error:', err);
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  // Load from Supabase on mount + Realtime Sync across Phone & PC
  useEffect(() => {
    fetchCloudSubscriptions();

    // Subscribe to live database changes from any device (phone, laptop, desktop)
    const channel = supabase
      .channel('schema_subscriptions_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'subscriptions' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newSub = mapFromDb(payload.new);
            setSubscriptions(prev => {
              if (prev.some(s => s.id === newSub.id)) return prev;
              return [newSub, ...prev];
            });
            showToast({ type: 'info', message: `⚡ Added from another device: ${newSub.clientName}` });
          } else if (payload.eventType === 'UPDATE') {
            const updated = mapFromDb(payload.new);
            setSubscriptions(prev => prev.map(s => s.id === updated.id ? updated : s));
          } else if (payload.eventType === 'DELETE') {
            setSubscriptions(prev => prev.filter(s => s.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Urgent counts (expiring today or tomorrow)
  const urgentCount = useMemo(() => {
    return subscriptions.filter(s => {
      const days = getDaysDifference(s.expiryDate);
      return days === 0 || days === 1;
    }).length;
  }, [subscriptions]);

  // Filter & sort logic
  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter(sub => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        sub.clientName.toLowerCase().includes(q) ||
        (sub.phone && sub.phone.includes(q)) ||
        (sub.accountEmail && sub.accountEmail.toLowerCase().includes(q)) ||
        (sub.profileName && sub.profileName.toLowerCase().includes(q)) ||
        (sub.planType && sub.planType.toLowerCase().includes(q));

      if (!matchSearch) return false;

      if (selectedPlatform !== 'all' && sub.platform !== selectedPlatform) {
        return false;
      }

      const days = getDaysDifference(sub.expiryDate);
      if (selectedStatusFilter === 'urgent') return days === 0 || days === 1;
      if (selectedStatusFilter === 'active') return days >= 0;
      if (selectedStatusFilter === 'expiring_week') return days >= 0 && days <= 7;
      if (selectedStatusFilter === 'expired') return days < 0;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'expiry_asc') {
        return new Date(a.expiryDate) - new Date(b.expiryDate);
      }
      if (sortBy === 'expiry_desc') {
        return new Date(b.expiryDate) - new Date(a.expiryDate);
      }
      if (sortBy === 'name') {
        return a.clientName.localeCompare(b.clientName);
      }
      if (sortBy === 'profit_desc') {
        const profitA = (parseFloat(a.sellPrice) || 0) - (parseFloat(a.costPrice) || 0);
        const profitB = (parseFloat(b.sellPrice) || 0) - (parseFloat(b.costPrice) || 0);
        return profitB - profitA;
      }
      return 0;
    });
  }, [subscriptions, searchQuery, selectedPlatform, selectedStatusFilter, sortBy]);

  // Save new or updated subscription directly to Supabase
  const handleSaveSubscription = async (subData) => {
    // Optimistic UI update
    if (editingSub) {
      setSubscriptions(prev => prev.map(s => s.id === subData.id ? subData : s));
      showToast({ type: 'success', message: `Saved ${subData.clientName}!` });
      setEditingSub(null);
    } else {
      setSubscriptions(prev => [subData, ...prev]);
      showToast({ type: 'success', message: `Added ${subData.clientName} to Supabase!` });
    }

    // Persist to Supabase
    const { error } = await supabase.from('subscriptions').upsert(mapToDb(subData));
    if (error) {
      console.error('Supabase save error:', error);
      showToast({ type: 'error', message: `Save error: ${error.message}` });
      fetchCloudSubscriptions(true);
    }
  };

  // Delete subscription from Supabase
  const handleDeleteSubscription = async (id) => {
    const target = subscriptions.find(s => s.id === id);
    const name = target ? target.clientName : 'subscription';
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      setSubscriptions(prev => prev.filter(s => s.id !== id));
      showToast({ type: 'info', message: `Removed ${name}` });

      const { error } = await supabase.from('subscriptions').delete().eq('id', id);
      if (error) {
        console.error('Supabase delete error:', error);
        showToast({ type: 'error', message: `Delete error: ${error.message}` });
        fetchCloudSubscriptions(true);
      }
    }
  };

  // 1-Click Renew +30 Days
  const handleRenew30Days = async (sub) => {
    const daysLeft = getDaysDifference(sub.expiryDate);
    const baseDate = daysLeft < 0 ? new Date().toISOString().split('T')[0] : sub.expiryDate;
    const newExpiryDate = calculateExpiryDate(baseDate, 30);

    const updated = {
      ...sub,
      expiryDate: newExpiryDate,
      validityDays: parseInt(sub.validityDays || 30, 10) + 30,
      paymentStatus: 'paid'
    };

    setSubscriptions(prev => prev.map(s => s.id === sub.id ? updated : s));
    showToast({ 
      type: 'success', 
      message: `🎉 Renewed ${sub.clientName} (+30d until ${newExpiryDate})!` 
    });

    const { error } = await supabase.from('subscriptions').upsert(mapToDb(updated));
    if (error) {
      console.error('Supabase renew error:', error);
      showToast({ type: 'error', message: `Renew error: ${error.message}` });
      fetchCloudSubscriptions(true);
    }

    if (confirm(`Renewed! Would you like to send WhatsApp confirmation to ${sub.clientName}?`)) {
      setWhatsAppSub(updated);
    }
  };

  // Send Daily Telegram Alert
  const handleSendTelegramAlert = async () => {
    if (!settings.telegramBotToken || !settings.telegramChatId) {
      showToast({ type: 'warning', message: 'Configure Telegram Bot Token & Chat ID in Settings first!' });
      setIsSettingsOpen(true);
      return;
    }

    setIsSendingTelegram(true);
    try {
      const message = buildTelegramDailyDigest(subscriptions, settings);
      await sendTelegramMessage(settings.telegramBotToken, settings.telegramChatId, message);
      showToast({ type: 'success', message: '🔔 Telegram reminder summary sent to your bot!' });
    } catch (err) {
      showToast({ type: 'error', message: `Telegram Error: ${err.message}` });
    } finally {
      setIsSendingTelegram(false);
    }
  };

  // Bulk Import
  const handleImportSubscriptions = async (imported) => {
    const dbRecords = imported.map(mapToDb);
    const { error } = await supabase.from('subscriptions').upsert(dbRecords);
    if (!error) {
      setSubscriptions(prev => [...imported, ...prev]);
      showToast({ type: 'success', message: `Uploaded ${imported.length} subscriptions to Supabase Cloud!` });
    } else {
      showToast({ type: 'error', message: `Import error: ${error.message}` });
    }
  };

  // Restore All
  const handleRestoreAll = async (restored) => {
    const dbRecords = restored.map(mapToDb);
    const { error } = await supabase.from('subscriptions').upsert(dbRecords);
    if (!error) {
      setSubscriptions(restored);
      showToast({ type: 'success', message: `Restored ${restored.length} subscriptions to Supabase!` });
    } else {
      showToast({ type: 'error', message: `Restore error: ${error.message}` });
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Master Security Lock Screen */}
      {isLocked && (
        <LockScreen
          masterPin={settings.masterPin || '8590'}
          onUnlock={() => setIsLocked(false)}
        />
      )}

      {/* Top Navigation */}
      <Navbar
        urgentCount={urgentCount}
        totalCount={subscriptions.length}
        onOpenAddModal={() => { setEditingSub(null); setIsAddModalOpen(true); }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenImportExport={() => setIsImportExportOpen(true)}
        onSendTelegramAlert={handleSendTelegramAlert}
        isSendingTelegram={isSendingTelegram}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onLock={handleLock}
      />

      {/* Main Content Container */}
      <main style={{
        maxWidth: '1440px',
        width: '100%',
        margin: '0 auto',
        padding: '24px',
        flex: 1
      }}>
        {/* KPI Statistics Bar */}
        <StatsCards
          subscriptions={subscriptions}
          currency={settings.currency || '₹'}
          activeFilter={selectedStatusFilter}
          onFilterSelect={(filterKey) => setSelectedStatusFilter(filterKey)}
        />

        {/* Search, Filter & Controls Toolbar */}
        <div
          className="toolbar-container"
          style={{
            background: 'var(--bg-card)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}
        >
          {/* Top row: Search & Sorting */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            {/* Search Input */}
            <div style={{
              position: 'relative',
              flex: '1 1 240px'
            }}>
              <Search
                size={18}
                color="#64748b"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                placeholder="Search clients, phone, email, profile..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: '#090d16',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  padding: '10px 14px 10px 42px',
                  color: '#f8fafc',
                  outline: 'none'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Refresh & Sort & Platform Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => fetchCloudSubscriptions()}
                title="Sync from Supabase"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: '#cbd5e1',
                  padding: '8px 10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.8rem'
                }}
              >
                <RefreshCw size={14} />
                <span>Sync</span>
              </button>

              {/* Platform Selector */}
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                style={{
                  background: '#090d16',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  padding: '8px 12px',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="all">All Platforms ({subscriptions.length})</option>
                {PLATFORMS.map(p => {
                  const count = subscriptions.filter(s => s.platform === p.id).length;
                  return (
                    <option key={p.id} value={p.id}>
                      {p.name} {count > 0 ? `(${count})` : ''}
                    </option>
                  );
                })}
              </select>

              {/* Sort By Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ArrowUpDown size={14} color="#64748b" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    background: '#090d16',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    padding: '8px 12px',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  <option value="expiry_asc">Expiry (Soonest first)</option>
                  <option value="expiry_desc">Expiry (Furthest first)</option>
                  <option value="name">Client Name (A - Z)</option>
                  <option value="profit_desc">Highest Profit</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quick Filter Tabs */}
          <div
            className="filter-pills-row"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '4px'
            }}
          >
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, flexShrink: 0 }}>Filter:</span>
            {[
              { id: 'all', label: 'All' },
              { id: 'urgent', label: `⚠️ Urgent (${urgentCount})`, highlight: urgentCount > 0 },
              { id: 'expiring_week', label: '📅 Next 7 Days' },
              { id: 'active', label: '🟢 Active' },
              { id: 'expired', label: '🔴 Expired' },
            ].map(tab => {
              const isActive = selectedStatusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedStatusFilter(tab.id)}
                  style={{
                    background: isActive ? '#6366f1' : 'rgba(255, 255, 255, 0.04)',
                    border: `1px solid ${isActive ? '#818cf8' : 'rgba(255, 255, 255, 0.08)'}`,
                    color: isActive ? '#ffffff' : tab.highlight ? '#f87171' : '#cbd5e1',
                    borderRadius: '9999px',
                    padding: '6px 14px',
                    fontSize: '0.78rem',
                    fontWeight: isActive || tab.highlight ? 700 : 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    transition: 'all 0.15s'
                  }}
                >
                  {tab.label}
                </button>
              );
            })}

            <div style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#64748b', whiteSpace: 'nowrap' }}>
              Showing <strong>{filteredSubscriptions.length}</strong> of {subscriptions.length}
            </div>
          </div>
        </div>

        {/* Content View: Loading, Empty, Grid or Table */}
        {isLoading ? (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 'var(--radius-lg)',
            padding: '60px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}>
            <Loader2 size={32} color="#6366f1" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              Syncing with Supabase Cloud Database...
            </p>
          </div>
        ) : filteredSubscriptions.length === 0 ? (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px dashed rgba(255, 255, 255, 0.1)',
            borderRadius: 'var(--radius-lg)',
            padding: '60px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>
              No subscriptions found
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', maxWidth: '380px' }}>
              No records match your filters. Click below to add a new subscription.
            </p>
            <button
              onClick={() => { setEditingSub(null); setIsAddModalOpen(true); }}
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                border: 'none',
                color: '#ffffff',
                padding: '10px 20px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '0.88rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Plus size={16} />
              <span>Add First Client</span>
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '16px'
          }}>
            {filteredSubscriptions.map(sub => (
              <SubscriptionCard
                key={sub.id}
                subscription={sub}
                currency={settings.currency || '₹'}
                onOpenWhatsApp={(item) => setWhatsAppSub(item)}
                onRenew30Days={handleRenew30Days}
                onEdit={(item) => { setEditingSub(item); setIsAddModalOpen(true); }}
                onDelete={handleDeleteSubscription}
                onShowToast={showToast}
              />
            ))}
          </div>
        ) : (
          <SubscriptionTable
            subscriptions={filteredSubscriptions}
            currency={settings.currency || '₹'}
            onOpenWhatsApp={(item) => setWhatsAppSub(item)}
            onRenew30Days={handleRenew30Days}
            onEdit={(item) => { setEditingSub(item); setIsAddModalOpen(true); }}
            onDelete={handleDeleteSubscription}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Mobile Floating Action Button (FAB) for fast 1-thumb client adding */}
      <button
        onClick={() => { setEditingSub(null); setIsAddModalOpen(true); }}
        title="Add New Client"
        style={{
          position: 'fixed',
          bottom: '22px',
          right: '22px',
          zIndex: 90,
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
          color: '#ffffff',
          border: 'none',
          boxShadow: '0 8px 24px rgba(99, 102, 241, 0.6)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.15s ease'
        }}
      >
        <Plus size={26} />
      </button>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '24px',
        color: '#64748b',
        fontSize: '0.78rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        marginTop: 'auto'
      }}>
        <strong>{settings.businessName || 'Premium Hub'}</strong> • Supabase Cloud Realtime Sync • 1-Click WhatsApp Reminders
      </footer>

      {/* Modals */}
      <WhatsAppModal
        subscription={whatsAppSub}
        settings={settings}
        onClose={() => setWhatsAppSub(null)}
        onShowToast={showToast}
      />

      <SubscriptionModal
        isOpen={isAddModalOpen}
        mode={editingSub ? 'edit' : 'add'}
        initialData={editingSub}
        currency={settings.currency || '₹'}
        defaultCountryCode={settings.defaultCountryCode || '+91'}
        onClose={() => { setIsAddModalOpen(false); setEditingSub(null); }}
        onSave={handleSaveSubscription}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        settings={settings}
        onClose={() => setIsSettingsOpen(false)}
        onSaveSettings={(newSettings) => setSettings(newSettings)}
        onShowToast={showToast}
      />

      <BulkImportExportModal
        isOpen={isImportExportOpen}
        subscriptions={subscriptions}
        onClose={() => setIsImportExportOpen(false)}
        onImportSubscriptions={handleImportSubscriptions}
        onRestoreAll={handleRestoreAll}
        onShowToast={showToast}
      />

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
