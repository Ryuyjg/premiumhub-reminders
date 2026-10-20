import React, { useState, useEffect, useRef } from 'react';
import { Lock, ShieldCheck, Sparkles, KeyRound, AlertCircle } from 'lucide-react';

export default function LockScreen({ masterPin = '8590', onUnlock }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [remember, setRemember] = useState(true);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleDigit = (digit) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setError(false);
      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  const verifyPin = (candidatePin) => {
    if (candidatePin === masterPin) {
      if (remember) {
        localStorage.setItem('premium_hub_unlocked_v1', 'true');
      } else {
        sessionStorage.setItem('premium_hub_unlocked_v1', 'true');
      }
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => {
        setPin('');
      }, 500);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Backspace') {
      handleBackspace();
    } else if (e.key === 'Enter') {
      verifyPin(pin);
    } else if (/^[0-9]$/.test(e.key)) {
      handleDigit(e.key);
    }
  };

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#070a12',
        backgroundImage: `
          radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 20% 80%, rgba(229, 9, 20, 0.1) 0%, transparent 40%),
          radial-gradient(circle at 80% 80%, rgba(37, 211, 102, 0.08) 0%, transparent 40%)
        `,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        outline: 'none'
      }}
    >
      <div style={{
        background: 'rgba(15, 23, 42, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '380px',
        padding: '36px 28px',
        textAlign: 'center',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9)',
        animation: 'fadeIn 0.3s ease-out'
      }}>
        {/* Brand Icon */}
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #e50914 0%, #6366f1 50%, #00a8e1 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          boxShadow: '0 0 25px rgba(99, 102, 241, 0.5)',
          color: '#ffffff'
        }}>
          <Lock size={26} />
        </div>

        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.45rem',
          fontWeight: 800,
          color: '#ffffff',
          marginBottom: '4px'
        }}>
          Premium Hub
        </h2>
        <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '24px' }}>
          Enter your 4-digit Master PIN to unlock
        </p>

        {/* PIN Dots Indicator */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '14px',
          marginBottom: '20px'
        }}>
          {[0, 1, 2, 3].map(idx => {
            const isFilled = pin.length > idx;
            return (
              <div
                key={idx}
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: isFilled ? '#6366f1' : 'rgba(255, 255, 255, 0.1)',
                  border: `2px solid ${isFilled ? '#818cf8' : error ? '#ef4444' : 'rgba(255, 255, 255, 0.2)'}`,
                  boxShadow: isFilled ? '0 0 12px rgba(99, 102, 241, 0.6)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              />
            );
          })}
        </div>

        {error && (
          <div style={{
            color: '#f87171',
            fontSize: '0.8rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            marginBottom: '16px'
          }}>
            <AlertCircle size={15} />
            <span>Incorrect PIN. Try again.</span>
          </div>
        )}

        {/* Hidden Input for Mobile / Hardware Keyboard */}
        <input
          ref={inputRef}
          type="password"
          maxLength={4}
          pattern="[0-9]*"
          inputMode="numeric"
          value={pin}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, '').slice(0, 4);
            setPin(val);
            if (val.length === 4) verifyPin(val);
          }}
          style={{
            position: 'absolute',
            opacity: 0,
            pointerEvents: 'none'
          }}
        />

        {/* On-screen Numeric Keypad */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          maxWidth: '260px',
          margin: '0 auto 20px'
        }}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((item, idx) => {
            if (item === '') {
              return <div key={idx} />;
            }
            const isBackspace = item === '⌫';
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (isBackspace) handleBackspace();
                  else handleDigit(item);
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '14px',
                  height: '56px',
                  color: '#f8fafc',
                  fontSize: isBackspace ? '1.1rem' : '1.35rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.12s ease'
                }}
                onMouseDown={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.25)'}
                onMouseUp={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
              >
                {item}
              </button>
            );
          })}
        </div>

        {/* Remember on this device toggle */}
        <label style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          cursor: 'pointer',
          fontSize: '0.8rem',
          color: '#94a3b8'
        }}>
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            style={{ accentColor: '#6366f1', cursor: 'pointer' }}
          />
          <span>Remember unlock on this device</span>
        </label>
      </div>
    </div>
  );
}
