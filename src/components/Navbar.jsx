import { 
  Sparkles, 
  Plus, 
  Send, 
  Settings as SettingsIcon, 
  FileSpreadsheet, 
  LayoutGrid, 
  Table as TableIcon,
  BellRing,
  Lock
} from 'lucide-react';

export default function Navbar({
  urgentCount,
  totalCount,
  onOpenAddModal,
  onOpenSettings,
  onOpenImportExport,
  onSendTelegramAlert,
  isSendingTelegram,
  viewMode,
  setViewMode,
  onLock
}) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(11, 15, 23, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '14px 24px'
    }}>
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Brand Logo & Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #e50914 0%, #6366f1 50%, #00a8e1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
            color: '#fff'
          }}>
            <Sparkles size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.45rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(to right, #ffffff, #cbd5e1)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Premium Hub
              </h1>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                background: 'rgba(99, 102, 241, 0.2)',
                color: '#818cf8',
                border: '1px solid rgba(99, 102, 241, 0.4)',
                padding: '2px 7px',
                borderRadius: '6px'
              }}>
                PRO RESELLER
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>
              OTT Subscriptions, WhatsApp Reminders & Renewal Engine
            </p>
          </div>
        </div>

        {/* Right Side Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Urgent Alert Badge */}
          {urgentCount > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              padding: '6px 12px',
              borderRadius: '9999px',
              color: '#f87171',
              fontSize: '0.8rem',
              fontWeight: 600
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#ef4444',
                boxShadow: '0 0 8px #ef4444'
              }}></span>
              <BellRing size={14} />
              <span>{urgentCount} Expiring Soon</span>
            </div>
          )}

          {/* View Mode Toggle */}
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            padding: '3px'
          }}>
            <button
              onClick={() => setViewMode('grid')}
              title="Cards Grid View"
              style={{
                background: viewMode === 'grid' ? '#1e293b' : 'transparent',
                color: viewMode === 'grid' ? '#f8fafc' : '#94a3b8',
                border: 'none',
                borderRadius: '7px',
                padding: '6px 10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              title="Dense Table View"
              style={{
                background: viewMode === 'table' ? '#1e293b' : 'transparent',
                color: viewMode === 'table' ? '#f8fafc' : '#94a3b8',
                border: 'none',
                borderRadius: '7px',
                padding: '6px 10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <TableIcon size={16} />
            </button>
          </div>

          {/* Telegram Daily Alert Button */}
          <button
            onClick={onSendTelegramAlert}
            disabled={isSendingTelegram}
            title="Push alerts to your Telegram Bot"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(34, 158, 217, 0.15)',
              border: '1px solid rgba(34, 158, 217, 0.35)',
              color: '#38bdf8',
              padding: '8px 14px',
              borderRadius: '10px',
              cursor: isSendingTelegram ? 'not-allowed' : 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
              transition: 'all 0.2s'
            }}
          >
            <Send size={15} />
            <span>{isSendingTelegram ? 'Sending...' : 'Telegram Alert'}</span>
          </button>

          {/* Backup & CSV Button */}
          <button
            onClick={onOpenImportExport}
            title="CSV & Data Backup"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#cbd5e1',
              padding: '8px 12px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 500
            }}
          >
            <FileSpreadsheet size={15} />
            <span>CSV / Backup</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            title="Configure Telegram Bot, UPI & Templates"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#cbd5e1',
              padding: '8px 12px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 500
            }}
          >
            <SettingsIcon size={15} />
            <span>Settings</span>
          </button>

          {/* Quick Lock Button */}
          <button
            onClick={onLock}
            title="Lock Dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#f87171',
              padding: '8px 12px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600
            }}
          >
            <Lock size={14} />
            <span>Lock</span>
          </button>

          {/* Add Subscription Button */}
          <button
            onClick={onOpenAddModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.35)',
              transition: 'transform 0.15s, box-shadow 0.15s'
            }}
          >
            <Plus size={16} />
            <span>Add Subscription</span>
          </button>
        </div>
      </div>
    </header>
  );
}
