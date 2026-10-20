import React from 'react';
import { 
  Users, 
  AlertCircle, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2 
} from 'lucide-react';
import { getDaysDifference } from '../utils/helpers';

export default function StatsCards({ subscriptions, currency = '₹', onFilterSelect, activeFilter }) {
  let activeCount = 0;
  let todayCount = 0;
  let tomorrowCount = 0;
  let next7DaysCount = 0;
  let expiredCount = 0;
  let totalRevenue = 0;
  let totalCost = 0;

  subscriptions.forEach(sub => {
    const days = getDaysDifference(sub.expiryDate);
    const sell = parseFloat(sub.sellPrice) || 0;
    const cost = parseFloat(sub.costPrice) || 0;

    totalRevenue += sell;
    totalCost += cost;

    if (days < 0) {
      expiredCount++;
    } else {
      activeCount++;
      if (days === 0) todayCount++;
      else if (days === 1) tomorrowCount++;
      else if (days <= 7) next7DaysCount++;
    }
  });

  const urgentTotal = todayCount + tomorrowCount;
  const netProfit = totalRevenue - totalCost;

  const cards = [
    {
      id: 'urgent',
      title: 'Urgent Reminders',
      value: urgentTotal,
      subtitle: `${todayCount} today, ${tomorrowCount} tomorrow`,
      icon: <AlertCircle size={22} color="#ef4444" />,
      color: '#ef4444',
      bg: 'rgba(239, 68, 68, 0.1)',
      border: 'rgba(239, 68, 68, 0.25)',
      isPulse: urgentTotal > 0
    },
    {
      id: 'active',
      title: 'Active Accounts',
      value: activeCount,
      subtitle: `${subscriptions.length} total tracked`,
      icon: <CheckCircle2 size={22} color="#10b981" />,
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.1)',
      border: 'rgba(16, 185, 129, 0.25)'
    },
    {
      id: 'expiring_week',
      title: 'Expiring in 7 Days',
      value: next7DaysCount,
      subtitle: 'Upcoming renewals',
      icon: <Clock size={22} color="#f59e0b" />,
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.1)',
      border: 'rgba(245, 158, 11, 0.25)'
    },
    {
      id: 'expired',
      title: 'Expired / Inactive',
      value: expiredCount,
      subtitle: 'Needs renewal or reassignment',
      icon: <AlertTriangle size={22} color="#dc2626" />,
      color: '#dc2626',
      bg: 'rgba(220, 38, 38, 0.1)',
      border: 'rgba(220, 38, 38, 0.25)'
    },
    {
      id: 'financials',
      title: 'Est. Net Profit',
      value: `${currency}${netProfit.toLocaleString()}`,
      subtitle: `Revenue: ${currency}${totalRevenue.toLocaleString()}`,
      icon: <TrendingUp size={22} color="#6366f1" />,
      color: '#818cf8',
      bg: 'rgba(99, 102, 241, 0.1)',
      border: 'rgba(99, 102, 241, 0.25)'
    }
  ];

  return (
    <div
      className="stats-grid-container"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '28px'
      }}
    >
      {cards.map(c => {
        const isSelected = activeFilter === c.id;
        return (
          <div
            key={c.id}
            onClick={() => onFilterSelect && c.id !== 'financials' && onFilterSelect(isSelected ? 'all' : c.id)}
            className={`stats-card-item ${c.isPulse ? 'pulse-urgent' : ''}`}
            style={{
              background: c.bg,
              border: `1px solid ${isSelected ? c.color : c.border}`,
              borderRadius: 'var(--radius-lg)',
              padding: '18px 20px',
              cursor: c.id !== 'financials' ? 'pointer' : 'default',
              transition: 'all 0.2s ease',
              transform: isSelected ? 'scale(1.02)' : 'none',
              boxShadow: isSelected ? `0 0 15px ${c.color}40` : 'var(--shadow-sm)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
                {c.title}
              </span>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(0, 0, 0, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {c.icon}
              </div>
            </div>

            <div
              className="stats-card-value"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.85rem',
                fontWeight: 800,
                color: c.color,
                lineHeight: 1.2
              }}
            >
              {c.value}
            </div>

            <div style={{
              fontSize: '0.75rem',
              color: '#94a3b8',
              marginTop: '4px',
              fontWeight: 500
            }}>
              {c.subtitle}
            </div>

            {c.id !== 'financials' && (
              <div style={{
                position: 'absolute',
                bottom: '8px',
                right: '12px',
                fontSize: '0.65rem',
                color: c.color,
                opacity: 0.8,
                fontWeight: 600
              }}>
                {isSelected ? '✓ Filter active' : 'Click to filter'}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
