import React, { useState } from 'react';
import { 
  X, 
  Settings as SettingsIcon, 
  Send, 
  Check, 
  HelpCircle, 
  ExternalLink, 
  DollarSign, 
  MessageSquare, 
  Bot 
} from 'lucide-react';
import { sendTelegramMessage } from '../utils/helpers';

export default function SettingsModal({
  isOpen,
  settings,
  onClose,
  onSaveSettings,
  onShowToast
}) {
  const [formData, setFormData] = useState({ ...settings });
  const [isTestingTelegram, setIsTestingTelegram] = useState(false);
  const [showTelegramGuide, setShowTelegramGuide] = useState(false);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTestTelegram = async () => {
    if (!formData.telegramBotToken || !formData.telegramChatId) {
      onShowToast({ type: 'warning', message: 'Enter both Bot Token and Chat ID to test!' });
      return;
    }

    setIsTestingTelegram(true);
    try {
      await sendTelegramMessage(
        formData.telegramBotToken,
        formData.telegramChatId,
        `🚀 <b>Connection Successful!</b>\n\nYour <b>${formData.businessName || 'Premium Hub'}</b> reminder bot is ready to send instant renewal alerts!`
      );
      onShowToast({ type: 'success', message: 'Test message sent to Telegram successfully!' });
    } catch (err) {
      onShowToast({ type: 'error', message: `Telegram Error: ${err.message}` });
    } finally {
      setIsTestingTelegram(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings(formData);
    onShowToast({ type: 'success', message: 'Settings saved!' });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#0f172a',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '640px',
        maxHeight: '90vh',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        animation: 'fadeIn 0.2s ease-out'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '18px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#6366f1',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <SettingsIcon size={20} />
            </div>
            <div>
              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#f8fafc'
              }}>
                Settings & Integrations
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Telegram Bot, UPI details & WhatsApp configurations
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Business & Payment Settings */}
          <div>
            <h3 style={{ fontSize: '0.88rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#818cf8', marginBottom: '12px' }}>
              Business & Payment Info
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                  Business Name
                </label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => handleChange('businessName', e.target.value)}
                  style={{
                    width: '100%',
                    background: '#090d16',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    color: '#f8fafc',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                  UPI ID (Inserted in Reminders)
                </label>
                <input
                  type="text"
                  placeholder="e.g. premiumhub@upi"
                  value={formData.upiId}
                  onChange={(e) => handleChange('upiId', e.target.value)}
                  style={{
                    width: '100%',
                    background: '#090d16',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    color: '#f8fafc',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                  Currency Symbol
                </label>
                <input
                  type="text"
                  value={formData.currency}
                  onChange={(e) => handleChange('currency', e.target.value)}
                  style={{
                    width: '100%',
                    background: '#090d16',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    color: '#f8fafc',
                    fontSize: '0.88rem',
                    textAlign: 'center',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                  Default Country Code
                </label>
                <input
                  type="text"
                  value={formData.defaultCountryCode}
                  onChange={(e) => handleChange('defaultCountryCode', e.target.value)}
                  style={{
                    width: '100%',
                    background: '#090d16',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    color: '#f8fafc',
                    fontSize: '0.88rem',
                    textAlign: 'center',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginTop: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                  WhatsApp Footer Signature
                </label>
                <input
                  type="text"
                  value={formData.whatsappSignature}
                  onChange={(e) => handleChange('whatsappSignature', e.target.value)}
                  style={{
                    width: '100%',
                    background: '#090d16',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    color: '#f8fafc',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#f87171', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                  🔒 4-Digit Master PIN (App Lock)
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={formData.masterPin || '8590'}
                  onChange={(e) => handleChange('masterPin', e.target.value.replace(/\D/g, '').slice(0, 4))}
                  style={{
                    width: '100%',
                    background: '#090d16',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    color: '#f87171',
                    fontSize: '1rem',
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    textAlign: 'center',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Telegram Bot Setup */}
          <div style={{
            background: 'rgba(34, 158, 217, 0.08)',
            border: '1px solid rgba(34, 158, 217, 0.25)',
            borderRadius: '14px',
            padding: '16px 18px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bot size={18} color="#38bdf8" />
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#38bdf8' }}>
                  Telegram Bot (Direct Reseller Notifications)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTelegramGuide(!showTelegramGuide)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#38bdf8',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <HelpCircle size={14} />
                <span>{showTelegramGuide ? 'Hide Guide' : 'How to get Bot Token?'}</span>
              </button>
            </div>

            {showTelegramGuide && (
              <div style={{
                background: 'rgba(0, 0, 0, 0.4)',
                borderRadius: '10px',
                padding: '12px 14px',
                fontSize: '0.75rem',
                color: '#cbd5e1',
                lineHeight: 1.6,
                marginBottom: '14px'
              }}>
                <strong>How to setup in 2 minutes:</strong>
                <ol style={{ paddingLeft: '18px', marginTop: '6px' }}>
                  <li>Open Telegram and message <strong>@BotFather</strong>. Type <code>/newbot</code> and follow steps to get your <strong>Bot Token</strong>.</li>
                  <li>Press <strong>START</strong> on your new bot in Telegram.</li>
                  <li>Message <strong>@userinfobot</strong> in Telegram to get your numeric <strong>Id</strong> (this is your Chat ID).</li>
                  <li>Paste both below and click <strong>"Test Connection"</strong>!</li>
                </ol>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                  Telegram Bot Token
                </label>
                <input
                  type="text"
                  placeholder="e.g. 123456789:ABCdefGhIJKlmNo..."
                  value={formData.telegramBotToken}
                  onChange={(e) => handleChange('telegramBotToken', e.target.value)}
                  style={{
                    width: '100%',
                    background: '#090d16',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    padding: '8px 12px',
                    color: '#f8fafc',
                    fontSize: '0.82rem',
                    outline: 'none',
                    fontFamily: 'var(--font-mono)'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                  Telegram Chat ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. 987654321"
                  value={formData.telegramChatId}
                  onChange={(e) => handleChange('telegramChatId', e.target.value)}
                  style={{
                    width: '100%',
                    background: '#090d16',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    padding: '8px 12px',
                    color: '#f8fafc',
                    fontSize: '0.82rem',
                    outline: 'none',
                    fontFamily: 'var(--font-mono)'
                  }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleTestTelegram}
              disabled={isTestingTelegram}
              style={{
                background: 'rgba(34, 158, 217, 0.2)',
                border: '1px solid rgba(34, 158, 217, 0.4)',
                color: '#38bdf8',
                padding: '8px 14px',
                borderRadius: '8px',
                cursor: isTestingTelegram ? 'not-allowed' : 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Send size={14} />
              <span>{isTestingTelegram ? 'Testing Connection...' : 'Test Telegram Connection'}</span>
            </button>
          </div>

          {/* Footer Save */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#cbd5e1',
                padding: '10px 18px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                border: 'none',
                color: '#ffffff',
                padding: '10px 22px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Check size={18} />
              <span>Save Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
