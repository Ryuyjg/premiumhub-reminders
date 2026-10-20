import React, { useState, useEffect } from 'react';
import { 
  X, 
  MessageCircle, 
  Copy, 
  ExternalLink, 
  Sparkles, 
  Clock, 
  AlertTriangle, 
  Package, 
  CheckCircle2, 
  Check,
  Save,
  RotateCcw
} from 'lucide-react';
import { 
  buildWhatsAppMessage, 
  generateWhatsAppUrl, 
  cleanPhoneNumber, 
  getPlatformInfo,
  renderTemplate
} from '../utils/helpers';
import { TEMPLATE_VARIABLES, DEFAULT_TEMPLATES } from '../utils/constants';

export default function WhatsAppModal({ 
  subscription, 
  settings, 
  onClose, 
  onShowToast,
  onSaveTemplate 
}) {
  const [templateType, setTemplateType] = useState('expiry_reminder');
  const [customMessage, setCustomMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (subscription) {
      // Auto-select template based on status
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const expiry = new Date(subscription.expiryDate);
      expiry.setHours(0, 0, 0, 0);
      const diff = Math.round((expiry - now) / (1000 * 60 * 60 * 24));

      let defaultType = 'expiry_reminder';
      if (diff < 0) defaultType = 'expired_alert';
      else if (diff === 0) defaultType = 'expired_alert';

      setTemplateType(defaultType);
      const msg = buildWhatsAppMessage(defaultType, subscription, settings);
      setCustomMessage(msg);
    }
  }, [subscription, settings]);

  const handleTemplateChange = (type) => {
    setTemplateType(type);
    const msg = buildWhatsAppMessage(type, subscription, settings);
    setCustomMessage(msg);
  };

  if (!subscription) return null;

  const platform = getPlatformInfo(subscription.platform);
  const waUrl = generateWhatsAppUrl(subscription.phone, subscription.countryCode, customMessage);
  const cleanedNum = cleanPhoneNumber(subscription.phone, subscription.countryCode);

  const handleCopy = () => {
    navigator.clipboard.writeText(customMessage);
    setCopied(true);
    onShowToast({ type: 'success', message: 'Message copied to clipboard!' });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    onShowToast({ type: 'success', message: `Opening WhatsApp chat with ${subscription.clientName}...` });
    onClose();
  };

  return (
    <div
      className="modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(0, 0, 0, 0.75)',
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
          maxWidth: '640px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out'
        }}
      >
        {/* Modal Header */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(37, 211, 102, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '18px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: '#25d366',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(37, 211, 102, 0.4)'
            }}>
              <MessageCircle size={22} />
            </div>
            <div>
              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#f8fafc'
              }}>
                Send WhatsApp Message
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                To: <strong style={{ color: '#f8fafc' }}>{subscription.clientName}</strong> ({subscription.countryCode || '+91'} {subscription.phone})
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

        {/* Modal Body */}
        <div style={{ padding: '20px 24px' }}>
          {/* Template Selector Tabs */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
              Select Ready-to-Send Template:
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '8px'
            }}>
              <button
                onClick={() => handleTemplateChange('expiry_reminder')}
                style={{
                  background: templateType === 'expiry_reminder' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  border: `1px solid ${templateType === 'expiry_reminder' ? '#818cf8' : 'rgba(255, 255, 255, 0.08)'}`,
                  color: templateType === 'expiry_reminder' ? '#f8fafc' : '#94a3b8',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Clock size={16} color="#f59e0b" />
                <div>
                  <strong>⏰ Expiry Reminder</strong>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Due soon</div>
                </div>
              </button>

              <button
                onClick={() => handleTemplateChange('expired_alert')}
                style={{
                  background: templateType === 'expired_alert' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  border: `1px solid ${templateType === 'expired_alert' ? '#f87171' : 'rgba(255, 255, 255, 0.08)'}`,
                  color: templateType === 'expired_alert' ? '#f8fafc' : '#94a3b8',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <AlertTriangle size={16} color="#ef4444" />
                <div>
                  <strong>🚨 Expired Notice</strong>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Urgent renewal</div>
                </div>
              </button>

              <button
                onClick={() => handleTemplateChange('credentials_delivery')}
                style={{
                  background: templateType === 'credentials_delivery' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  border: `1px solid ${templateType === 'credentials_delivery' ? '#4ade80' : 'rgba(255, 255, 255, 0.08)'}`,
                  color: templateType === 'credentials_delivery' ? '#f8fafc' : '#94a3b8',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Package size={16} color="#22c55e" />
                <div>
                  <strong>📦 Order Credentials</strong>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>New purchase</div>
                </div>
              </button>

              <button
                onClick={() => handleTemplateChange('renewal_confirmed')}
                style={{
                  background: templateType === 'renewal_confirmed' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  border: `1px solid ${templateType === 'renewal_confirmed' ? '#38bdf8' : 'rgba(255, 255, 255, 0.08)'}`,
                  color: templateType === 'renewal_confirmed' ? '#f8fafc' : '#94a3b8',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <CheckCircle2 size={16} color="#38bdf8" />
                <div>
                  <strong>✅ Renewed OK</strong>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Payment received</div>
                </div>
              </button>
            </div>
          </div>

          {/* Editable Text Area Preview */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>
                Message Preview (You can edit or add brackets):
              </label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => {
                    const defaultMsg = buildWhatsAppMessage(templateType, subscription, settings);
                    setCustomMessage(defaultMsg);
                    onShowToast({ type: 'info', message: 'Reset to default template.' });
                  }}
                  title="Reset to default template"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#64748b',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px'
                  }}
                >
                  <RotateCcw size={12} />
                  <span>Reset</span>
                </button>

                <button
                  onClick={handleCopy}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: copied ? '#4ade80' : '#818cf8',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Quick Bracket Tags Chips */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '5px',
              marginBottom: '8px',
              padding: '6px 8px',
              background: 'rgba(0, 0, 0, 0.25)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.04)'
            }}>
              <span style={{ fontSize: '0.68rem', color: '#64748b', alignSelf: 'center', marginRight: '4px' }}>
                Insert:
              </span>
              {[
                { tag: '{client_name}', label: 'Client' },
                { tag: '{platform}', label: 'Platform' },
                { tag: '{profile}', label: 'Profile' },
                { tag: '{pin}', label: 'PIN' },
                { tag: '{expiry_date}', label: 'Expiry' },
                { tag: '{price}', label: 'Price' },
                { tag: '{upi}', label: 'UPI' },
                { tag: '{login_id}', label: 'ID/Phone' },
                { tag: '{password}', label: 'Pass/OTP' }
              ].map(item => (
                <button
                  key={item.tag}
                  type="button"
                  onClick={() => setCustomMessage(prev => prev + ' ' + item.tag)}
                  title={`Insert ${item.tag}`}
                  style={{
                    background: 'rgba(99, 102, 241, 0.15)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    color: '#a5b4fc',
                    borderRadius: '5px',
                    padding: '2px 6px',
                    fontSize: '0.7rem',
                    fontFamily: 'var(--font-mono)',
                    cursor: 'pointer'
                  }}
                >
                  +{item.tag}
                </button>
              ))}
            </div>

            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={8}
              style={{
                width: '100%',
                background: '#090d16',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '14px',
                color: '#f8fafc',
                fontSize: '0.88rem',
                lineHeight: 1.5,
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />

            {/* Template Save / Replace Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => {
                  const rendered = renderTemplate(customMessage, subscription, settings);
                  setCustomMessage(rendered);
                  onShowToast({ type: 'success', message: 'Replaced all {brackets} with client data!' });
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#94a3b8',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Sparkles size={12} color="#34d399" />
                <span>Fill Bracket Variables</span>
              </button>

              {onSaveTemplate && (
                <button
                  type="button"
                  onClick={() => {
                    onSaveTemplate(templateType, customMessage);
                    setIsSaved(true);
                    onShowToast({ type: 'success', message: 'Saved as your permanent default template!' });
                    setTimeout(() => setIsSaved(false), 2000);
                  }}
                  style={{
                    background: isSaved ? 'rgba(34, 197, 94, 0.2)' : 'rgba(99, 102, 241, 0.15)',
                    border: `1px solid ${isSaved ? '#4ade80' : 'rgba(99, 102, 241, 0.35)'}`,
                    color: isSaved ? '#4ade80' : '#818cf8',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {isSaved ? <Check size={12} /> : <Save size={12} />}
                  <span>{isSaved ? 'Saved as Default!' : 'Save as Default Template'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Notice for unsaved numbers */}
          <div style={{
            background: 'rgba(37, 211, 102, 0.08)',
            border: '1px solid rgba(37, 211, 102, 0.2)',
            borderRadius: '10px',
            padding: '10px 14px',
            fontSize: '0.75rem',
            color: '#86efac',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Sparkles size={16} />
            <span>
              <strong>Zero-friction WhatsApp:</strong> You do NOT need to save <strong>+{cleanedNum}</strong> to your phone contacts! It opens directly in WhatsApp.
            </span>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleCopy}
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#cbd5e1',
                padding: '12px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Copy size={18} />
              <span>Copy Message</span>
            </button>

            <button
              onClick={handleOpenWhatsApp}
              style={{
                flex: 2,
                background: 'linear-gradient(135deg, #25d366 0%, #1da851 100%)',
                border: 'none',
                color: '#ffffff',
                padding: '12px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 18px rgba(37, 211, 102, 0.4)'
              }}
            >
              <MessageCircle size={20} />
              <span>Open in WhatsApp</span>
              <ExternalLink size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
