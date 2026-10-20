import React, { useState } from 'react';
import { 
  MessageCircle, 
  RotateCw, 
  Edit3, 
  Trash2, 
  Copy, 
  Check, 
  Lock, 
  Mail, 
  Calendar, 
  User, 
  Eye, 
  EyeOff, 
  Sparkles 
} from 'lucide-react';
import { 
  getPlatformInfo, 
  getExpiryStatus, 
  formatDate, 
  cleanPhoneNumber,
  getLoginMethodInfo
} from '../utils/helpers';

export default function SubscriptionCard({
  subscription,
  currency = '₹',
  onOpenWhatsApp,
  onOpenRenewalModal,
  onRenew30Days,
  onEdit,
  onDelete,
  onShowToast
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  const platform = getPlatformInfo(subscription.platform);
  const status = getExpiryStatus(subscription.expiryDate);
  const method = getLoginMethodInfo(subscription.loginMethod);
  const profit = (parseFloat(subscription.sellPrice) || 0) - (parseFloat(subscription.costPrice) || 0);

  const copyToClipboard = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    onShowToast({ type: 'success', message: `Copied ${fieldName}!` });
    setTimeout(() => setCopiedField(null), 1800);
  };

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        backdropFilter: 'blur(16px)',
        border: `1px solid ${status.isUrgent ? status.color + '55' : 'rgba(255, 255, 255, 0.08)'}`,
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: status.isUrgent ? `0 8px 30px ${status.color}25` : 'var(--shadow-sm)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        position: 'relative'
      }}
    >
      {/* Top Banner with Platform color accent */}
      <div style={{
        height: '4px',
        background: `linear-gradient(90deg, ${platform.color}, #6366f1)`
      }}></div>

      <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
        
        {/* Header: Platform Badge & Expiry Status */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: platform.bg,
            border: `1px solid ${platform.color}40`,
            borderRadius: '8px',
            padding: '4px 10px',
            color: '#ffffff',
            fontSize: '0.82rem',
            fontWeight: 700
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: platform.color,
              boxShadow: `0 0 8px ${platform.color}`
            }}></span>
            <span>{platform.name}</span>
          </div>

          <div style={{
            background: status.bg,
            border: `1px solid ${status.color}50`,
            color: status.color,
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            {status.isUrgent && (
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: status.color,
                boxShadow: `0 0 6px ${status.color}`
              }}></span>
            )}
            <span>{status.text}</span>
          </div>
        </div>

        {/* Client & Phone */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.15rem',
              fontWeight: 700,
              color: '#f8fafc',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {subscription.clientName}
            </h3>
            <span style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#34d399'
            }}>
              {currency}{subscription.sellPrice || 0}
            </span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.8rem',
            color: '#94a3b8',
            marginTop: '2px'
          }}>
            <span style={{ color: '#25d366', fontWeight: 600 }}>WhatsApp:</span>
            <span>{subscription.countryCode || '+91'} {subscription.phone}</span>
          </div>
        </div>

        {/* Plan & Profile Details Box */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '10px',
          padding: '10px 12px',
          fontSize: '0.8rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          {/* Plan & Method badge */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#cbd5e1' }}>
            <span style={{ color: '#64748b' }}>Plan:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: 600 }}>{subscription.planType || '1-Screen'}</span>
              <span style={{
                fontSize: '0.68rem',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '1px 6px',
                borderRadius: '4px',
                color: '#cbd5e1'
              }}>
                {method.icon} {method.label}
              </span>
            </div>
          </div>

          {/* Profile & PIN */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#64748b' }}>Profile / PIN:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: 600, color: '#f8fafc' }}>
                {subscription.profileName || 'Default'}
              </span>
              {subscription.screenPin ? (
                <button
                  onClick={() => copyToClipboard(subscription.screenPin, 'PIN')}
                  title="Click to copy PIN"
                  style={{
                    background: 'rgba(99, 102, 241, 0.2)',
                    border: '1px solid rgba(99, 102, 241, 0.4)',
                    color: '#a5b4fc',
                    borderRadius: '4px',
                    padding: '2px 6px',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {copiedField === 'PIN' ? <Check size={10} color="#10b981" /> : <Lock size={10} />}
                  <span>PIN: {subscription.screenPin}</span>
                </button>
              ) : (
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>No PIN</span>
              )}
            </div>
          </div>

          {/* Account Login ID (Phone or Email) */}
          {subscription.accountEmail && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
              <span style={{ color: '#64748b' }}>
                {subscription.loginMethod === 'otp' ? 'Login Phone:' : 'Login ID:'}
              </span>
              <button
                onClick={() => copyToClipboard(subscription.accountEmail, 'Login ID')}
                title="Click to copy"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  maxWidth: '180px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                <Mail size={12} color="#6366f1" />
                <span style={{ fontFamily: 'var(--font-mono)' }}>{subscription.accountEmail}</span>
                {copiedField === 'Login ID' ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
              </button>
            </div>
          )}

          {/* Password or OTP Note */}
          {subscription.accountPassword && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
              <span style={{ color: '#64748b' }}>
                {subscription.loginMethod === 'otp' ? 'Access:' : 'Password:'}
              </span>
              <button
                onClick={() => copyToClipboard(subscription.accountPassword, 'Password/Access')}
                title="Click to copy"
                style={{
                  background: 'none',
                  border: 'none',
                  color: subscription.loginMethod === 'otp' ? '#fde047' : '#94a3b8',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  maxWidth: '180px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                <span style={{ fontFamily: subscription.loginMethod === 'otp' ? 'inherit' : 'var(--font-mono)' }}>
                  {subscription.accountPassword}
                </span>
                {copiedField === 'Password/Access' ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
              </button>
            </div>
          )}
        </div>

        {/* Expiry Dates & Validity */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.78rem',
          color: '#94a3b8',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          paddingTop: '10px'
        }}>
          <div>
            <div style={{ color: '#64748b', fontSize: '0.7rem' }}>Expiry Date</div>
            <div style={{ fontWeight: 700, color: status.isUrgent ? status.color : '#e2e8f0' }}>
              {formatDate(subscription.expiryDate)}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#64748b', fontSize: '0.7rem' }}>Validity / Margin</div>
            <div style={{ fontWeight: 600, color: '#34d399' }}>
              +{currency}{profit} profit
            </div>
          </div>
        </div>

        {subscription.notes && (
          <div style={{
            fontSize: '0.72rem',
            color: '#64748b',
            fontStyle: 'italic',
            background: 'rgba(255, 255, 255, 0.02)',
            padding: '4px 8px',
            borderRadius: '6px'
          }}>
            💬 {subscription.notes}
          </div>
        )}
      </div>

      {/* Card Action Footer */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.4)',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px'
      }}>
        {/* WhatsApp Reminder Button (Main Action) */}
        <button
          onClick={() => onOpenWhatsApp(subscription)}
          title="Send 1-Click WhatsApp Reminder"
          style={{
            flex: 2,
            background: 'linear-gradient(135deg, #25d366 0%, #1ea952 100%)',
            border: 'none',
            borderRadius: '8px',
            color: '#ffffff',
            padding: '7px 12px',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: '0 2px 10px rgba(37, 211, 102, 0.3)'
          }}
        >
          <MessageCircle size={15} />
          <span>WhatsApp</span>
        </button>

        {/* Renewal Button */}
        <button
          onClick={() => (onOpenRenewalModal || onRenew30Days)(subscription)}
          title="Open Renewal Setup"
          style={{
            flex: 1,
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.35)',
            borderRadius: '8px',
            color: '#818cf8',
            padding: '7px 10px',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
        >
          <RotateCw size={13} />
          <span>Renew</span>
        </button>

        {/* Edit Button */}
        <button
          onClick={() => onEdit(subscription)}
          title="Edit Details"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            color: '#cbd5e1',
            padding: '7px 9px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Edit3 size={14} />
        </button>

        {/* Delete Button */}
        <button
          onClick={() => onDelete(subscription.id)}
          title="Delete Subscription"
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: '8px',
            color: '#f87171',
            padding: '7px 9px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
