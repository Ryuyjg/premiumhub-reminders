import { PLATFORMS, LOGIN_METHODS, DEFAULT_TEMPLATES } from './constants';

export function calculateExpiryDate(purchaseDateStr, days) {
  if (!purchaseDateStr) return '';
  const date = new Date(purchaseDateStr);
  date.setDate(date.getDate() + parseInt(days, 10));
  return date.toISOString().split('T')[0];
}

export function getDaysDifference(targetDateStr) {
  if (!targetDateStr) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(targetDateStr);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export function getExpiryStatus(expiryDateStr) {
  if (!expiryDateStr) {
    return {
      statusKey: 'unknown',
      text: 'No Date',
      color: '#94a3b8',
      bg: 'rgba(148, 163, 184, 0.1)',
      isUrgent: false,
      daysLeft: 0
    };
  }

  const days = getDaysDifference(expiryDateStr);

  if (days < 0) {
    const overdue = Math.abs(days);
    return {
      statusKey: 'expired',
      text: overdue === 1 ? 'Expired yesterday' : `Expired ${overdue}d ago`,
      color: '#ef4444',
      bg: 'rgba(239, 68, 68, 0.18)',
      isUrgent: true,
      daysLeft: days
    };
  }

  if (days === 0) {
    return {
      statusKey: 'today',
      text: 'Expires TODAY ⚠️',
      color: '#f87171',
      bg: 'rgba(239, 68, 68, 0.25)',
      isUrgent: true,
      daysLeft: 0
    };
  }

  if (days === 1) {
    return {
      statusKey: 'tomorrow',
      text: 'Expires Tomorrow',
      color: '#fb923c',
      bg: 'rgba(251, 146, 60, 0.2)',
      isUrgent: true,
      daysLeft: 1
    };
  }

  if (days <= 3) {
    return {
      statusKey: 'soon',
      text: `Expires in ${days}d`,
      color: '#facc15',
      bg: 'rgba(250, 204, 21, 0.18)',
      isUrgent: true,
      daysLeft: days
    };
  }

  if (days <= 7) {
    return {
      statusKey: 'week',
      text: `Expires in ${days}d`,
      color: '#60a5fa',
      bg: 'rgba(96, 165, 250, 0.15)',
      isUrgent: false,
      daysLeft: days
    };
  }

  return {
    statusKey: 'active',
    text: `Active (${days}d left)`,
    color: '#34d399',
    bg: 'rgba(52, 211, 153, 0.15)',
    isUrgent: false,
    daysLeft: days
  };
}

export function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function getPlatformInfo(platformId) {
  return PLATFORMS.find(p => p.id === platformId) || {
    id: platformId,
    name: platformId || 'Unknown',
    color: '#a855f7',
    bg: 'rgba(168, 85, 247, 0.15)'
  };
}

export function getLoginMethodInfo(methodId) {
  return LOGIN_METHODS.find(m => m.id === methodId) || LOGIN_METHODS[0];
}

export function cleanPhoneNumber(phone, countryCode = '+91') {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  const ccDigits = countryCode.replace(/\D/g, '');

  if (digits.startsWith(ccDigits)) {
    return digits;
  }
  return `${ccDigits}${digits}`;
}

export function generateWhatsAppUrl(phone, countryCode, message) {
  const fullPhone = cleanPhoneNumber(phone, countryCode);
  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${fullPhone}?text=${encodedMsg}`;
}

export function renderTemplate(templateStr, sub, settings) {
  if (!templateStr) return '';
  const p = getPlatformInfo(sub.platform);
  const method = getLoginMethodInfo(sub.loginMethod);
  const business = settings?.businessName || 'Premium Hub';
  const upi = settings?.upiId || 'premiumhub@upi';
  const curr = settings?.currency || '₹';
  const sig = settings?.whatsappSignature || `— Team ${business}`;
  const expiryFormatted = formatDate(sub.expiryDate);
  const daysDiff = getDaysDifference(sub.expiryDate);

  let daysLeftStr = 'today';
  if (daysDiff < 0) daysLeftStr = `expired ${Math.abs(daysDiff)} days ago`;
  else if (daysDiff === 0) daysLeftStr = 'expires today';
  else if (daysDiff === 1) daysLeftStr = 'expires tomorrow';
  else daysLeftStr = `${daysDiff} days left`;

  const passwordOrOtp = sub.loginMethod === 'otp'
    ? (sub.accountPassword || 'OTP Login (Request OTP on WhatsApp when logging in)')
    : (sub.accountPassword || 'Shared in Chat');

  // Multi-synonym lookup map for maximum user convenience
  const clientNameVal = sub.clientName || 'Customer';
  const platformVal = p.name || 'OTT Service';
  const planVal = sub.planType || '1-Screen Profile';
  const loginTypeVal = method.label;
  const loginIdVal = sub.accountEmail || 'Shared in Chat';
  const profileVal = sub.profileName || 'Assigned Profile';
  const pinVal = sub.screenPin ? sub.screenPin : 'No PIN';
  const priceVal = `${curr}${sub.sellPrice || 0}`;

  const tagMap = {
    // Client Name
    client_name: clientNameVal,
    clientname: clientNameVal,
    client: clientNameVal,
    name: clientNameVal,
    customer: clientNameVal,
    user: clientNameVal,

    // Platform
    platform: platformVal,
    service: platformVal,
    ott: platformVal,
    app: platformVal,

    // Plan
    plan: planVal,
    plan_type: planVal,
    plantype: planVal,

    // Login Method
    login_type: loginTypeVal,
    logintype: loginTypeVal,
    login_method: loginTypeVal,
    loginmethod: loginTypeVal,

    // Login ID / Email / Phone
    login_id: loginIdVal,
    loginid: loginIdVal,
    email: loginIdVal,
    account_email: loginIdVal,
    accountemail: loginIdVal,
    id: loginIdVal,
    phone: loginIdVal,
    login_phone: loginIdVal,

    // Password / OTP
    password: passwordOrOtp,
    pass: passwordOrOtp,
    otp: passwordOrOtp,
    account_password: passwordOrOtp,
    credentials: passwordOrOtp,

    // Profile & PIN
    profile: profileVal,
    profile_name: profileVal,
    profilename: profileVal,
    screen: profileVal,
    pin: pinVal,
    screen_pin: pinVal,
    screenpin: pinVal,
    profile_pin: pinVal,
    profilepin: pinVal,

    // Expiry Date & Duration
    expiry_date: expiryFormatted,
    expirydate: expiryFormatted,
    expiry: expiryFormatted,
    expire_date: expiryFormatted,
    date: expiryFormatted,
    days_left: daysLeftStr,
    daysleft: daysLeftStr,
    days: daysLeftStr,
    remaining: daysLeftStr,

    // Price & Payment
    price: priceVal,
    renewal_price: priceVal,
    amount: priceVal,
    cost: priceVal,
    upi: upi,
    upi_id: upi,
    upiid: upi,

    // Business & Signature
    business_name: business,
    businessname: business,
    business: business,
    shop: business,
    signature: sig,
    regards: sig,
    team: sig,

    // Notes
    notes: sub.notes || '',
    note: sub.notes || ''
  };

  // Replace all {bracket_tags} ignoring case, spaces, and hyphens
  return templateStr.replace(/\{([^{}]+)\}/g, (match, rawTag) => {
    const key = rawTag.trim().toLowerCase().replace(/[\s\-_]+/g, '_');
    if (tagMap[key] !== undefined) {
      return tagMap[key];
    }
    const keyNoUnderscore = key.replace(/_/g, '');
    if (tagMap[keyNoUnderscore] !== undefined) {
      return tagMap[keyNoUnderscore];
    }
    return match; // Keep unchanged if unrecognized bracket
  });
}

export function buildWhatsAppMessage(templateType, sub, settings) {
  const templates = settings?.templates || DEFAULT_TEMPLATES;
  const templateStr = templates[templateType] || DEFAULT_TEMPLATES[templateType] || DEFAULT_TEMPLATES.expiry_reminder;
  return renderTemplate(templateStr, sub, settings);
}

export async function sendTelegramMessage(botToken, chatId, message) {
  if (!botToken || !chatId) {
    throw new Error('Telegram Bot Token and Chat ID are required in Settings.');
  }

  const cleanToken = botToken.trim();
  const cleanChatId = chatId.trim();

  const url = `https://api.telegram.org/bot${cleanToken}/sendMessage`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: cleanChatId,
      text: message,
      parse_mode: 'HTML'
    })
  });

  const data = await response.json();
  if (!data.ok) {
    throw new Error(data.description || 'Failed to send message via Telegram Bot.');
  }
  return data;
}

export function buildTelegramDailyDigest(subscriptions, settings) {
  const business = settings?.businessName || 'Premium Hub';
  const curr = settings?.currency || '₹';

  const urgentList = subscriptions.filter(s => {
    const days = getDaysDifference(s.expiryDate);
    return days <= 2;
  });

  if (urgentList.length === 0) {
    return `🔔 <b>${business} Daily Reminder</b>\n\n🎉 Great news! No subscriptions are expiring today or tomorrow. All active accounts are in good standing!`;
  }

  let text = `🚨 <b>${business} Renewal Alerts</b>\n📅 <i>${new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}</i>\n\n`;
  text += `Found <b>${urgentList.length}</b> account(s) needing attention:\n\n`;

  urgentList.forEach((s, idx) => {
    const days = getDaysDifference(s.expiryDate);
    const p = getPlatformInfo(s.platform);
    let tag = '';
    if (days < 0) tag = `🔴 <b>EXPIRED (${Math.abs(days)}d ago)</b>`;
    else if (days === 0) tag = `⚠️ <b>EXPIRES TODAY</b>`;
    else tag = `🟡 <b>EXPIRES IN ${days}d</b>`;

    const waLink = `https://wa.me/${cleanPhoneNumber(s.phone, s.countryCode)}`;

    text += `${idx + 1}. <b>${s.clientName}</b> — <i>${p.name}</i>\n`;
    text += `   ${tag}\n`;
    text += `   📺 Profile: ${s.profileName || 'Main'}\n`;
    text += `   💰 Sell Price: ${curr}${s.sellPrice || 0}\n`;
    text += `   📲 WhatsApp: <a href="${waLink}">${s.countryCode || '+91'}${s.phone}</a>\n\n`;
  });

  text += `👉 <i>Tip: Tap the WhatsApp numbers above to message them directly!</i>`;
  return text;
}
