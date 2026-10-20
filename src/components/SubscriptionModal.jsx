import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  Calendar, 
  Shield, 
  User, 
  Phone, 
  Mail, 
  Lock, 
  Tv, 
  DollarSign, 
  Layers 
} from 'lucide-react';
import { PLATFORMS, VALIDITY_PRESETS } from '../utils/constants';
import { calculateExpiryDate } from '../utils/helpers';

export default function SubscriptionModal({
  isOpen,
  mode = 'add', // 'add' or 'edit'
  initialData = null,
  currency = '₹',
  defaultCountryCode = '+91',
  onClose,
  onSave
}) {
  const [formData, setFormData] = useState({
    clientName: '',
    phone: '',
    countryCode: defaultCountryCode,
    platform: 'netflix',
    planType: '1-Screen UHD Profile',
    accountEmail: '',
    accountPassword: '',
    profileName: '',
    screenPin: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    validityDays: 30,
    expiryDate: calculateExpiryDate(new Date().toISOString().split('T')[0], 30),
    costPrice: 0,
    sellPrice: 0,
    paymentStatus: 'paid',
    notes: ''
  });

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        ...initialData,
        costPrice: initialData.costPrice || 0,
        sellPrice: initialData.sellPrice || 0,
        countryCode: initialData.countryCode || defaultCountryCode
      });
    } else {
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        clientName: '',
        phone: '',
        countryCode: defaultCountryCode,
        platform: 'netflix',
        planType: '1-Screen UHD Profile',
        accountEmail: '',
        accountPassword: '',
        profileName: '',
        screenPin: '',
        purchaseDate: today,
        validityDays: 30,
        expiryDate: calculateExpiryDate(today, 30),
        costPrice: 0,
        sellPrice: 0,
        paymentStatus: 'paid',
        notes: ''
      });
    }
  }, [initialData, mode, defaultCountryCode, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };

      if (field === 'purchaseDate' || field === 'validityDays') {
        const pDate = field === 'purchaseDate' ? value : prev.purchaseDate;
        const vDays = field === 'validityDays' ? value : prev.validityDays;
        if (pDate && vDays) {
          updated.expiryDate = calculateExpiryDate(pDate, vDays);
        }
      }

      if (field === 'platform') {
        const p = PLATFORMS.find(item => item.id === value);
        if (p && !prev.planType) {
          updated.planType = p.defaultPlan;
        }
      }

      return updated;
    });
  };

  const handleValidityChipClick = (days) => {
    setFormData(prev => ({
      ...prev,
      validityDays: days,
      expiryDate: calculateExpiryDate(prev.purchaseDate, days)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.clientName.trim()) {
      alert('Please enter Client Name');
      return;
    }
    if (!formData.phone.trim()) {
      alert('Please enter Client WhatsApp Phone Number');
      return;
    }

    onSave({
      ...formData,
      id: initialData?.id || `sub-${Date.now()}`
    });
    onClose();
  };

  const currentPlatform = PLATFORMS.find(p => p.id === formData.platform) || PLATFORMS[0];
  const profit = (parseFloat(formData.sellPrice) || 0) - (parseFloat(formData.costPrice) || 0);

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
          maxWidth: '720px',
          maxHeight: '90vh',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out'
        }}
      >
        {/* Modal Header */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '18px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#f8fafc'
            }}>
              {mode === 'edit' ? 'Edit Subscription Record' : 'Add New Client & OTT Subscription'}
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Tracks validity, auto-calculates expiry, and sets up WhatsApp reminders
            </p>
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

        {/* Modal Scrollable Form */}
        <form onSubmit={handleSubmit} style={{ overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Section 1: Client Information */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <User size={16} color="#818cf8" />
              <h3 style={{ fontSize: '0.88rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#c7d2fe' }}>
                Client Details (WhatsApp)
              </h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                  Client Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.clientName}
                  onChange={(e) => handleInputChange('clientName', e.target.value)}
                  style={{
                    width: '100%',
                    background: '#090d16',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    color: '#f8fafc',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                  WhatsApp Phone Number *
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={formData.countryCode}
                    onChange={(e) => handleInputChange('countryCode', e.target.value)}
                    style={{
                      width: '64px',
                      background: '#090d16',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '10px',
                      padding: '10px 8px',
                      color: '#f8fafc',
                      fontSize: '0.9rem',
                      textAlign: 'center',
                      outline: 'none'
                    }}
                  />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    style={{
                      flex: 1,
                      background: '#090d16',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: '#f8fafc',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: OTT Platform & Plan */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Tv size={16} color="#818cf8" />
              <h3 style={{ fontSize: '0.88rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#c7d2fe' }}>
                OTT Service & Plan Details
              </h3>
            </div>

            {/* Platform Selector Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: '8px',
              marginBottom: '14px'
            }}>
              {PLATFORMS.map(p => {
                const isSelected = formData.platform === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleInputChange('platform', p.id)}
                    style={{
                      background: isSelected ? p.bg : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${isSelected ? p.color : 'rgba(255, 255, 255, 0.08)'}`,
                      color: isSelected ? '#ffffff' : '#94a3b8',
                      borderRadius: '10px',
                      padding: '8px 10px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: isSelected ? 700 : 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.15s'
                    }}
                  >
                    <span style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: p.color
                    }}></span>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.name}
                    </span>
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                  Plan / Slot Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1-Screen 4K UHD Profile"
                  value={formData.planType}
                  onChange={(e) => handleInputChange('planType', e.target.value)}
                  style={{
                    width: '100%',
                    background: '#090d16',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    color: '#f8fafc',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                  Profile Name & Screen PIN
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Profile name (e.g. User 2)"
                    value={formData.profileName}
                    onChange={(e) => handleInputChange('profileName', e.target.value)}
                    style={{
                      flex: 2,
                      background: '#090d16',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: '#f8fafc',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="PIN"
                    value={formData.screenPin}
                    onChange={(e) => handleInputChange('screenPin', e.target.value)}
                    style={{
                      flex: 1,
                      background: '#090d16',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '10px',
                      padding: '10px 8px',
                      color: '#f8fafc',
                      fontSize: '0.9rem',
                      textAlign: 'center',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Credentials (Private/Inventory) */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '12px',
            padding: '14px 16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Shield size={16} color="#f59e0b" />
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fcd34d' }}>
                Account Credentials (For Client Delivery & Reference)
              </h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                  Login Email / ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. netflix.shared44@gmail.com"
                  value={formData.accountEmail}
                  onChange={(e) => handleInputChange('accountEmail', e.target.value)}
                  style={{
                    width: '100%',
                    background: '#090d16',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    padding: '8px 12px',
                    color: '#f8fafc',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                  Login Password
                </label>
                <input
                  type="text"
                  placeholder="e.g. Pass#2026 or OTP login"
                  value={formData.accountPassword}
                  onChange={(e) => handleInputChange('accountPassword', e.target.value)}
                  style={{
                    width: '100%',
                    background: '#090d16',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    padding: '8px 12px',
                    color: '#f8fafc',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Section 4: Validity & Dates */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Calendar size={16} color="#818cf8" />
              <h3 style={{ fontSize: '0.88rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#c7d2fe' }}>
                Purchase Date & Validity Duration
              </h3>
            </div>

            {/* Quick Presets */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
              {VALIDITY_PRESETS.map(preset => {
                const isActive = parseInt(formData.validityDays, 10) === preset.days;
                return (
                  <button
                    key={preset.days}
                    type="button"
                    onClick={() => handleValidityChipClick(preset.days)}
                    style={{
                      background: isActive ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                      border: `1px solid ${isActive ? '#818cf8' : 'rgba(255, 255, 255, 0.08)'}`,
                      color: isActive ? '#ffffff' : '#94a3b8',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      fontSize: '0.8rem',
                      fontWeight: isActive ? 700 : 500,
                      cursor: 'pointer'
                    }}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                  Purchase Date
                </label>
                <input
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
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
                  Duration (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.validityDays}
                  onChange={(e) => handleInputChange('validityDays', e.target.value)}
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
                  Expiry / Renewal Date
                </label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                  style={{
                    width: '100%',
                    background: '#090d16',
                    border: '1px solid rgba(99, 102, 241, 0.4)',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    color: '#818cf8',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Section 5: Pricing & Margins */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                Your Buy / Cost Price ({currency})
              </label>
              <input
                type="number"
                placeholder="0"
                value={formData.costPrice}
                onChange={(e) => handleInputChange('costPrice', e.target.value)}
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
                Selling Price to Client ({currency})
              </label>
              <input
                type="number"
                placeholder="0"
                value={formData.sellPrice}
                onChange={(e) => handleInputChange('sellPrice', e.target.value)}
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
                Estimated Profit
              </label>
              <div style={{
                background: profit >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: `1px solid ${profit >= 0 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                borderRadius: '10px',
                padding: '10px 12px',
                color: profit >= 0 ? '#34d399' : '#f87171',
                fontWeight: 700,
                fontSize: '0.95rem'
              }}>
                {currency}{profit} profit
              </div>
            </div>
          </div>

          {/* Section 6: Notes */}
          <div>
            <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
              Notes / Special Instructions (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Paid via PhonePe, requested Malayalam audio"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              style={{
                width: '100%',
                background: '#090d16',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '10px',
                padding: '10px 14px',
                color: '#f8fafc',
                fontSize: '0.88rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Submit buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
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
                padding: '10px 24px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 700,
                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Check size={18} />
              <span>{mode === 'edit' ? 'Save Changes' : 'Save Subscription'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
