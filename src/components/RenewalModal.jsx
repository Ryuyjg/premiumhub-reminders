import React, { useState, useEffect } from 'react';
import { 
  X, 
  RotateCw, 
  Calendar, 
  Check, 
  DollarSign, 
  MessageCircle, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { 
  getPlatformInfo, 
  getExpiryStatus, 
  formatDate, 
  calculateExpiryDate, 
  getDaysDifference,
  renderTemplate
} from '../utils/helpers';
import { VALIDITY_PRESETS, DEFAULT_TEMPLATES } from '../utils/constants';

export default function RenewalModal({
  isOpen,
  subscription,
  settings,
  onClose,
  onConfirmRenewal,
  onShowToast
}) {
  const [durationDays, setDurationDays] = useState(30);
  const [isCustomDays, setIsCustomDays] = useState(false);
  const [customDaysVal, setCustomDaysVal] = useState('30');
  const [renewalPrice, setRenewalPrice] = useState(0);
  const [startFromToday, setStartFromToday] = useState(false);
  const [sendWhatsApp, setSendWhatsApp] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState('paid');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (subscription) {
      setDurationDays(30);
      setIsCustomDays(false);
      setCustomDaysVal('30');
      setRenewalPrice(subscription.sellPrice || 0);
      setPaymentStatus('paid');
      setSendWhatsApp(true);

      const daysDiff = getDaysDifference(subscription.expiryDate);
      // If already expired, default to renewing from today
      setStartFromToday(daysDiff < 0);
    }
  }, [subscription, isOpen]);

  if (!isOpen || !subscription) return null;

  const platform = getPlatformInfo(subscription.platform);
  const currentStatus = getExpiryStatus(subscription.expiryDate);
  const isExpired = currentStatus.statusKey === 'expired';

  // Calculate base date for renewal
  const todayStr = new Date().toISOString().split('T')[0];
  const baseDate = startFromToday || !subscription.expiryDate ? todayStr : subscription.expiryDate;
  const newExpiryDate = calculateExpiryDate(baseDate, durationDays);

  const handlePresetSelect = (days) => {
    setDurationDays(days);
    setIsCustomDays(false);
  };

  const handleCustomDaysChange = (val) => {
    setCustomDaysVal(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setDurationDays(parsed);
    }
  };

  const handleConfirm = async () => {
    if (durationDays <= 0) {
      onShowToast({ type: 'warning', message: 'Please select a valid renewal duration.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedSub = {
        ...subscription,
        expiryDate: newExpiryDate,
        validityDays: parseInt(subscription.validityDays || 0, 10) + parseInt(durationDays, 10),
        sellPrice: parseFloat(renewalPrice) || subscription.sellPrice || 0,
        paymentStatus: paymentStatus
      };

      await onConfirmRenewal(updatedSub, sendWhatsApp);
      onClose();
    } catch (err) {
      console.error('Renewal error:', err);
      onShowToast({ type: 'error', message: `Renewal failed: ${err.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Preview of the renewal confirmed message
  const previewMessage = renderTemplate(
    settings?.templates?.renewal_confirmed || DEFAULT_TEMPLATES.renewal_confirmed,
    {
      ...subscription,
      expiryDate: newExpiryDate,
      sellPrice: renewalPrice
    },
    settings
  );

  return (
    <div
      className="modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        className="modal-dialog"
        style={{
          background: '#0f172a',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '580px',
          maxHeight: '92vh',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out'
        }}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(15, 23, 42, 0.9) 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '18px 22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(99, 102, 241, 0.4)'
            }}>
              <RotateCw size={22} />
            </div>
            <div>
              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.2rem',
                fontWeight: 700,
                color: '#f8fafc'
              }}>
                Renew Subscription
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Extend access & auto-calculate new expiry
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: 'none',
              borderRadius: '8px',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ overflowY: 'auto', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Target Customer Card */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '14px',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: platform.bg,
                  border: `1px solid ${platform.color}50`,
                  borderRadius: '6px',
                  padding: '2px 8px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#fff'
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: platform.color }}></span>
                  {platform.name}
                </span>
                <strong style={{ color: '#f8fafc', fontSize: '1rem' }}>{subscription.clientName}</strong>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                Profile: <span style={{ color: '#cbd5e1', fontWeight: 600 }}>{subscription.profileName || 'Main'}</span>
                {subscription.screenPin ? ` • PIN: ${subscription.screenPin}` : ''}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{
                background: currentStatus.bg,
                border: `1px solid ${currentStatus.color}50`,
                color: currentStatus.color,
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '9999px',
                display: 'inline-block',
                marginBottom: '4px'
              }}>
                {currentStatus.text}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Expiry: {formatDate(subscription.expiryDate)}
              </div>
            </div>
          </div>

          {/* Renewal Duration Selector */}
          <div>
            <label style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
              Select Renewal Duration:
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
              gap: '8px'
            }}>
              {VALIDITY_PRESETS.map(preset => {
                const isSelected = !isCustomDays && durationDays === preset.days;
                return (
                  <button
                    key={preset.days}
                    type="button"
                    onClick={() => handlePresetSelect(preset.days)}
                    style={{
                      background: isSelected ? '#6366f1' : 'rgba(255, 255, 255, 0.04)',
                      border: `1px solid ${isSelected ? '#818cf8' : 'rgba(255, 255, 255, 0.08)'}`,
                      color: isSelected ? '#ffffff' : '#94a3b8',
                      borderRadius: '10px',
                      padding: '10px 8px',
                      fontSize: '0.8rem',
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.15s'
                    }}
                  >
                    <div>+{preset.days} Days</div>
                    <div style={{ fontSize: '0.68rem', opacity: 0.8 }}>
                      {preset.days === 30 ? '1 Month' : preset.days === 60 ? '2 Months' : preset.days === 90 ? '3 Months' : preset.days === 180 ? '6 Months' : '1 Year'}
                    </div>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setIsCustomDays(true)}
                style={{
                  background: isCustomDays ? '#6366f1' : 'rgba(255, 255, 255, 0.04)',
                  border: `1px solid ${isCustomDays ? '#818cf8' : 'rgba(255, 255, 255, 0.08)'}`,
                  color: isCustomDays ? '#ffffff' : '#94a3b8',
                  borderRadius: '10px',
                  padding: '10px 8px',
                  fontSize: '0.8rem',
                  fontWeight: isCustomDays ? 700 : 500,
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <div>Custom</div>
                <div style={{ fontSize: '0.68rem', opacity: 0.8 }}>Any days</div>
              </button>
            </div>

            {isCustomDays && (
              <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Enter number of days:</span>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={customDaysVal}
                  onChange={(e) => handleCustomDaysChange(e.target.value)}
                  style={{
                    width: '90px',
                    background: '#090d16',
                    border: '1px solid rgba(99, 102, 241, 0.5)',
                    borderRadius: '8px',
                    padding: '6px 10px',
                    color: '#f8fafc',
                    fontSize: '0.9rem',
                    textAlign: 'center',
                    outline: 'none'
                  }}
                />
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>days (+{durationDays}d)</span>
              </div>
            )}
          </div>

          {/* Start Date Option for Expired Accounts */}
          {isExpired && (
            <div style={{
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: '10px',
              padding: '10px 14px',
              fontSize: '0.78rem',
              color: '#fef3c7'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, marginBottom: '6px', color: '#f59e0b' }}>
                <AlertCircle size={15} />
                <span>Account is currently expired</span>
              </div>
              <div style={{ display: 'flex', gap: '14px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="startFrom"
                    checked={startFromToday}
                    onChange={() => setStartFromToday(true)}
                  />
                  <span>Start from <strong>Today</strong> ({formatDate(todayStr)})</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="startFrom"
                    checked={!startFromToday}
                    onChange={() => setStartFromToday(false)}
                  />
                  <span>From old expiry ({formatDate(subscription.expiryDate)})</span>
                </label>
              </div>
            </div>
          )}

          {/* Result Calculation Preview */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.12) 0%, rgba(15, 23, 42, 0.6) 100%)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '12px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#86efac', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                New Expiry Date
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginTop: '2px' }}>
                {formatDate(newExpiryDate)}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                +{durationDays} days from {startFromToday ? 'today' : formatDate(subscription.expiryDate)}
              </div>
            </div>

            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(34, 197, 94, 0.2)',
              color: '#4ade80',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircle2 size={24} />
            </div>
          </div>

          {/* Renewal Price & Payment Status */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                Renewal Price ({settings?.currency || '₹'})
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '10px', color: '#64748b', fontSize: '0.85rem' }}>
                  {settings?.currency || '₹'}
                </span>
                <input
                  type="number"
                  value={renewalPrice}
                  onChange={(e) => setRenewalPrice(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#090d16',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    padding: '10px 12px 10px 28px',
                    color: '#f8fafc',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                style={{
                  width: '100%',
                  background: '#090d16',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  color: paymentStatus === 'paid' ? '#4ade80' : '#f59e0b',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  outline: 'none'
                }}
              >
                <option value="paid">✅ Paid (Received)</option>
                <option value="pending">⏳ Payment Pending</option>
              </select>
            </div>
          </div>

          {/* Instant WhatsApp Confirmation Checkbox */}
          <div style={{
            background: 'rgba(37, 211, 102, 0.08)',
            border: '1px solid rgba(37, 211, 102, 0.25)',
            borderRadius: '12px',
            padding: '12px 14px'
          }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={sendWhatsApp}
                onChange={(e) => setSendWhatsApp(e.target.checked)}
                style={{ marginTop: '3px', width: '16px', height: '16px', accentColor: '#25d366' }}
              />
              <div>
                <strong style={{ color: '#86efac', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MessageCircle size={15} />
                  Open WhatsApp Renewal Confirmation Immediately
                </strong>
                <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: '3px 0 0' }}>
                  Will open the pre-formatted receipt to send to <strong>{subscription.clientName}</strong> with new expiry date {formatDate(newExpiryDate)}.
                </p>
              </div>
            </label>
          </div>

        </div>

        {/* Modal Footer */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.4)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '16px 22px',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              padding: '10px 18px',
              color: '#cbd5e1',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleConfirm}
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 22px',
              color: '#ffffff',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 18px rgba(99, 102, 241, 0.4)',
              opacity: isSubmitting ? 0.7 : 1
            }}
          >
            <RotateCw size={16} className={isSubmitting ? 'animate-spin' : ''} />
            <span>{isSubmitting ? 'Saving to Cloud...' : 'Confirm Renewal'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
