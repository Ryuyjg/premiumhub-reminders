import React from 'react';
import { 
  MessageCircle, 
  RotateCw, 
  Edit3, 
  Trash2, 
  Lock, 
  Mail, 
  Copy, 
  Check 
} from 'lucide-react';
import { 
  getPlatformInfo, 
  getExpiryStatus, 
  formatDate 
} from '../utils/helpers';

export default function SubscriptionTable({
  subscriptions,
  currency = '₹',
  onOpenWhatsApp,
  onRenew30Days,
  onEdit,
  onDelete,
  onShowToast
}) {
  const [copiedId, setCopiedId] = React.useState(null);

  const copyText = (text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onShowToast({ type: 'success', message: 'Copied!' });
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div style={{
      background: 'var(--bg-card)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: 'var(--radius-lg)',
      overflowX: 'auto',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'left',
        fontSize: '0.85rem'
      }}>
        <thead>
          <tr style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            color: '#94a3b8',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            <th style={{ padding: '14px 18px' }}>Client</th>
            <th style={{ padding: '14px 18px' }}>Platform & Plan</th>
            <th style={{ padding: '14px 18px' }}>Profile & PIN</th>
            <th style={{ padding: '14px 18px' }}>Account ID</th>
            <th style={{ padding: '14px 18px' }}>Expiry Date</th>
            <th style={{ padding: '14px 18px' }}>Price / Margin</th>
            <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map(sub => {
            const platform = getPlatformInfo(sub.platform);
            const status = getExpiryStatus(sub.expiryDate);
            const profit = (parseFloat(sub.sellPrice) || 0) - (parseFloat(sub.costPrice) || 0);

            return (
              <tr
                key={sub.id}
                style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                {/* Client */}
                <td style={{ padding: '12px 18px' }}>
                  <div style={{ fontWeight: 700, color: '#f8fafc' }}>{sub.clientName}</div>
                  <div style={{ fontSize: '0.75rem', color: '#25d366' }}>
                    {sub.countryCode || '+91'} {sub.phone}
                  </div>
                </td>

                {/* Platform & Plan */}
                <td style={{ padding: '12px 18px' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: platform.bg,
                    border: `1px solid ${platform.color}40`,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    marginBottom: '4px'
                  }}>
                    <span style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: platform.color
                    }}></span>
                    {platform.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {sub.planType || '1-Screen'}
                  </div>
                </td>

                {/* Profile & PIN */}
                <td style={{ padding: '12px 18px' }}>
                  <div style={{ color: '#cbd5e1', fontWeight: 600 }}>{sub.profileName || '—'}</div>
                  {sub.screenPin && (
                    <button
                      onClick={() => copyText(sub.screenPin, `pin-${sub.id}`)}
                      style={{
                        background: 'rgba(99, 102, 241, 0.15)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        borderRadius: '4px',
                        color: '#a5b4fc',
                        padding: '1px 5px',
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginTop: '2px'
                      }}
                    >
                      <Lock size={10} />
                      <span>PIN: {sub.screenPin}</span>
                      {copiedId === `pin-${sub.id}` ? <Check size={10} color="#10b981" /> : <Copy size={10} />}
                    </button>
                  )}
                </td>

                {/* Account Email */}
                <td style={{ padding: '12px 18px' }}>
                  {sub.accountEmail ? (
                    <button
                      onClick={() => copyText(sub.accountEmail, `email-${sub.id}`)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#94a3b8',
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Mail size={12} color="#6366f1" />
                      <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {sub.accountEmail}
                      </span>
                      {copiedId === `email-${sub.id}` ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                    </button>
                  ) : (
                    <span style={{ color: '#64748b' }}>—</span>
                  )}
                </td>

                {/* Expiry Date */}
                <td style={{ padding: '12px 18px' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: status.bg,
                    border: `1px solid ${status.color}50`,
                    color: status.color,
                    padding: '3px 8px',
                    borderRadius: '9999px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    marginBottom: '4px'
                  }}>
                    {status.text}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {formatDate(sub.expiryDate)}
                  </div>
                </td>

                {/* Price / Margin */}
                <td style={{ padding: '12px 18px' }}>
                  <div style={{ color: '#f8fafc', fontWeight: 700 }}>
                    {currency}{sub.sellPrice || 0}
                  </div>
                  <div style={{ color: '#34d399', fontSize: '0.72rem' }}>
                    +{currency}{profit} profit
                  </div>
                </td>

                {/* Actions */}
                <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                    <button
                      onClick={() => onOpenWhatsApp(sub)}
                      title="Send WhatsApp Message"
                      style={{
                        background: 'linear-gradient(135deg, #25d366 0%, #1ea952 100%)',
                        border: 'none',
                        borderRadius: '6px',
                        color: '#fff',
                        padding: '6px 10px',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <MessageCircle size={14} />
                      <span>WhatsApp</span>
                    </button>

                    <button
                      onClick={() => onRenew30Days(sub)}
                      title="Renew +30 Days"
                      style={{
                        background: 'rgba(99, 102, 241, 0.15)',
                        border: '1px solid rgba(99, 102, 241, 0.35)',
                        borderRadius: '6px',
                        color: '#818cf8',
                        padding: '6px 8px',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}
                    >
                      <RotateCw size={12} />
                      <span>+30d</span>
                    </button>

                    <button
                      onClick={() => onEdit(sub)}
                      title="Edit"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '6px',
                        color: '#cbd5e1',
                        padding: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <Edit3 size={13} />
                    </button>

                    <button
                      onClick={() => onDelete(sub.id)}
                      title="Delete"
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        borderRadius: '6px',
                        color: '#f87171',
                        padding: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
