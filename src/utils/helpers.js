import { PLATFORMS } from './constants';

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
      text: overdue === 1 ? 'Expired yesterday' : `Expired ${overdue} days ago`,
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
      text: `Expires in ${days} days`,
      color: '#facc15',
      bg: 'rgba(250, 204, 21, 0.18)',
      isUrgent: true,
      daysLeft: days
    };
  }

  if (days <= 7) {
    return {
      statusKey: 'week',
      text: `Expires in ${days} days`,
      color: '#60a5fa',
      bg: 'rgba(96, 165, 250, 0.15)',
      isUrgent: false,
      daysLeft: days
    };
  }

  return {
    statusKey: 'active',
    text: `Active (${days} days left)`,
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

export function buildWhatsAppMessage(templateType, sub, settings) {
  const p = getPlatformInfo(sub.platform);
  const business = settings.businessName || 'Premium Hub';
  const upi = settings.upiId || 'premiumhub@upi';
  const curr = settings.currency || '₹';
  const sig = settings.whatsappSignature || `— Team ${business}`;
  const expiryFormatted = formatDate(sub.expiryDate);

  switch (templateType) {
    case 'expiry_reminder':
      return (
`Hi ${sub.clientName} 👋,

This is a friendly reminder from *${business}*!

Your *${p.name}* subscription is expiring soon:
📺 *Plan:* ${sub.planType || 'OTT Access'}
👤 *Profile:* ${sub.profileName || 'Your profile'}
📅 *Expiry Date:* ${expiryFormatted}

Would you like to renew to keep your profile and watch history active without interruption?

💰 *Renewal Price:* ${curr}${sub.sellPrice || '0'}
💳 *UPI ID:* ${upi}

Please reply with the payment screenshot once done! 🍿
${sig}`
      );

    case 'expired_alert':
      return (
`🚨 *URGENT RENEWAL NOTICE* 🚨

Hello ${sub.clientName},
Your *${p.name}* subscription (${sub.profileName || 'Profile'}) expired on *${expiryFormatted}*.

To prevent your profile and login access from being assigned to another customer, please renew today!

💰 *Amount:* ${curr}${sub.sellPrice || '0'}
💳 *UPI:* ${upi}

Reply here if you wish to renew or need help!
${sig}`
      );

    case 'credentials_delivery':
      return (
`🎉 *Welcome to ${business}!* 🎉

Thank you for your order! Here are your *${p.name}* login credentials:

📺 *Service:* ${p.name}
📦 *Plan:* ${sub.planType || '1-Screen'}
📧 *Login Email:* \`${sub.accountEmail || 'Shared in Chat'}\`
🔑 *Password:* \`${sub.accountPassword || 'Shared in Chat'}\`
👤 *Your Profile:* *${sub.profileName || 'Assigned Profile'}*
🔒 *Profile PIN:* \`${sub.screenPin || 'No PIN'}\`
📅 *Valid Until:* ${expiryFormatted}

⚠️ *Rules & Instructions:*
1. Login only to your assigned profile.
2. Do NOT change password or email.
3. Stream on 1 screen at a time.

Enjoy your movies & shows! 🍿
${sig}`
      );

    case 'renewal_confirmed':
      return (
`✅ *Payment Received & Renewed!* ✅

Hello ${sub.clientName},
Thank you! Your *${p.name}* subscription has been successfully renewed.

📅 *New Expiry Date:* *${expiryFormatted}*
📺 *Profile:* ${sub.profileName || 'Your profile'}

Thank you for trusting *${business}*! Let us know if you need any other OTT service. 🍿
${sig}`
      );

    default:
      return `Hello ${sub.clientName}, reminder from ${business} regarding your ${p.name} subscription expiring on ${expiryFormatted}.`;
  }
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
  const business = settings.businessName || 'Premium Hub';
  const curr = settings.currency || '₹';
  const today = new Date().toISOString().split('T')[0];

  const urgentList = subscriptions.filter(s => {
    const days = getDaysDifference(s.expiryDate);
    return days <= 2; // expired or expiring within 48h
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
