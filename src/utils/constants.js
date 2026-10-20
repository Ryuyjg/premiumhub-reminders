export const PLATFORMS = [
  { id: 'netflix', name: 'Netflix', color: '#e50914', bg: 'rgba(229, 9, 20, 0.15)', defaultPlan: '1-Screen UHD Profile' },
  { id: 'prime', name: 'Prime Video', color: '#00a8e1', bg: 'rgba(0, 168, 225, 0.15)', defaultPlan: '1-Screen HD' },
  { id: 'disney', name: 'Disney+ Hotstar', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)', defaultPlan: 'Super / Premium' },
  { id: 'spotify', name: 'Spotify Premium', color: '#1db954', bg: 'rgba(29, 185, 84, 0.15)', defaultPlan: 'Individual / Family Slot' },
  { id: 'youtube', name: 'YouTube Premium', color: '#ff0000', bg: 'rgba(255, 0, 0, 0.15)', defaultPlan: 'Family Invite' },
  { id: 'apple', name: 'Apple TV+', color: '#e2e8f0', bg: 'rgba(226, 232, 240, 0.15)', defaultPlan: 'Family Sharing' },
  { id: 'crunchyroll', name: 'Crunchyroll', color: '#f47521', bg: 'rgba(244, 117, 33, 0.15)', defaultPlan: 'Mega Fan' },
  { id: 'zee5', name: 'ZEE5', color: '#c084fc', bg: 'rgba(192, 132, 252, 0.15)', defaultPlan: '1-Screen VIP' },
  { id: 'sonyliv', name: 'Sony LIV', color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.15)', defaultPlan: 'Premium' },
  { id: 'jiocinema', name: 'JioCinema', color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.15)', defaultPlan: 'Premium' },
  { id: 'other', name: 'Other OTT', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)', defaultPlan: 'Standard' }
];

export const VALIDITY_PRESETS = [
  { label: '1 Month (30d)', days: 30 },
  { label: '2 Months (60d)', days: 60 },
  { label: '3 Months (90d)', days: 90 },
  { label: '6 Months (180d)', days: 180 },
  { label: '1 Year (365d)', days: 365 },
];

export const LOGIN_METHODS = [
  { id: 'password', label: 'Email & Password', icon: '🔑', desc: 'Netflix, Prime, Crunchyroll with email & password' },
  { id: 'otp', label: 'Phone Number & OTP', icon: '📱', desc: 'Zee5, Hotstar, SonyLiv, JioCinema where client requests OTP' },
  { id: 'invite', label: 'Invite / Activation Link', icon: '🔗', desc: 'Spotify Family, YouTube Premium invite link sent to user' },
  { id: 'profile', label: 'Profile Only (Pre-logged in)', icon: '📺', desc: 'User logs into TV using TV code or shared master profile' }
];

export const TEMPLATE_VARIABLES = [
  { key: '{client_name}', label: 'Client Name', sample: 'Rahul Sharma' },
  { key: '{platform}', label: 'Platform', sample: 'Netflix' },
  { key: '{plan}', label: 'Plan', sample: '1-Screen UHD Profile' },
  { key: '{login_type}', label: 'Login Method', sample: 'Email & Password' },
  { key: '{login_id}', label: 'Login ID / Email', sample: 'netflix.user42@gmail.com' },
  { key: '{password}', label: 'Password / Instructions', sample: 'StreamPass#2026' },
  { key: '{profile}', label: 'Profile Name', sample: 'Screen 2 (Rahul)' },
  { key: '{pin}', label: 'Profile PIN', sample: '4920' },
  { key: '{expiry_date}', label: 'Expiry Date', sample: 'Nov 20, 2026' },
  { key: '{days_left}', label: 'Days Remaining', sample: '1 day' },
  { key: '{price}', label: 'Price Amount', sample: '₹150' },
  { key: '{upi}', label: 'UPI ID', sample: 'premiumhub@upi' },
  { key: '{business_name}', label: 'Business Name', sample: 'Premium Hub' },
  { key: '{notes}', label: 'Client Notes', sample: 'Family plan' },
  { key: '{signature}', label: 'Signature', sample: '— Team Premium Hub' }
];

export const DEFAULT_TEMPLATES = {
  expiry_reminder: `Hi {client_name} 👋,

This is a reminder from *{business_name}*!

Your *{platform}* subscription is expiring soon:
📺 *Plan:* {plan}
👤 *Profile:* {profile}
🔒 *PIN:* {pin}
📅 *Expiry Date:* {expiry_date}

Would you like to renew to keep your profile and watch history active without interruption?

💰 *Renewal Price:* {price}
💳 *UPI ID:* {upi}

Please reply with payment screenshot once completed! 🍿
{signature}`,

  expired_alert: `🚨 *URGENT RENEWAL NOTICE* 🚨

Hello {client_name},
Your *{platform}* subscription ({profile}) expired on *{expiry_date}*.

To prevent your profile and login access from being assigned to another customer, please renew today!

💰 *Renewal Amount:* {price}
💳 *UPI ID:* {upi}

Reply here if you wish to renew or need help!
{signature}`,

  credentials_delivery: `🎉 *Welcome to {business_name}!* 🎉

Thank you for your order! Here are your *{platform}* access details:

📺 *Service:* {platform}
📦 *Plan:* {plan}
🔐 *Login Method:* {login_type}
📧 *Login ID / Email:* {login_id}
🔑 *Password / Access:* {password}
👤 *Your Profile:* *{profile}*
🔒 *Profile PIN:* {pin}
📅 *Valid Until:* {expiry_date}

⚠️ *Rules & Instructions:*
1. Login only to your assigned profile.
2. Do not change master password or account email.
3. Stream on 1 screen at a time.

Enjoy your movies & shows! 🍿
{signature}`,

  renewal_confirmed: `✅ *Payment Received & Renewed!* ✅

Hello {client_name},
Thank you! Your *{platform}* subscription has been successfully renewed.

📅 *New Expiry Date:* *{expiry_date}*
📺 *Profile:* {profile}

Thank you for trusting *{business_name}*! Let us know if you need any other OTT service. 🍿
{signature}`
};

export const DEFAULT_SETTINGS = {
  businessName: 'Premium Hub',
  upiId: 'premiumhub@upi',
  currency: '₹',
  telegramBotToken: '',
  telegramChatId: '',
  defaultCountryCode: '+91',
  whatsappSignature: '— Team Premium Hub',
  autoTelegramAlerts: false,
  masterPin: '8590',
  supabaseUrl: 'https://ioibfvtdacuakpckrllf.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvaWJmdnRkYWN1YWtwY2tybGxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI1MTgxOTQsImV4cCI6MjEwODA5NDE5NH0.6Qxxhc-SzTD5GcCCsKYYrcpmXEmt8-11-66uI00DZDk',
  templates: DEFAULT_TEMPLATES
};

// Realistic seed data representing real OTT reseller orders
export const INITIAL_SUBSCRIPTIONS = [
  {
    id: 'sub-101',
    clientName: 'Rahul Sharma',
    phone: '9876543210',
    countryCode: '+91',
    platform: 'netflix',
    planType: '1-Screen 4K UHD',
    accountEmail: 'sub.netflix42@gmail.com',
    accountPassword: 'Password@2026',
    profileName: 'Rahul (Screen 2)',
    screenPin: '4920',
    purchaseDate: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 29 days ago -> expires tomorrow!
    validityDays: 30,
    expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    costPrice: 80,
    sellPrice: 150,
    paymentStatus: 'paid',
    notes: 'Renewed once before, regular customer'
  },
  {
    id: 'sub-102',
    clientName: 'Priya Patel',
    phone: '9812345678',
    countryCode: '+91',
    platform: 'prime',
    planType: '1-Screen Full HD',
    accountEmail: 'primehub.resell01@gmail.com',
    accountPassword: 'AmazonPass#77',
    profileName: 'Priya',
    screenPin: '1234',
    purchaseDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // expires today!
    validityDays: 30,
    expiryDate: new Date().toISOString().split('T')[0],
    costPrice: 40,
    sellPrice: 99,
    paymentStatus: 'paid',
    notes: 'Requested Prime Video profile lock'
  },
  {
    id: 'sub-103',
    clientName: 'Anand Kumar',
    phone: '9944556677',
    countryCode: '+91',
    platform: 'spotify',
    planType: 'Individual Family Slot',
    accountEmail: 'anand.music@gmail.com',
    accountPassword: 'N/A (Invite Sent)',
    profileName: 'Self Account',
    screenPin: '',
    purchaseDate: new Date(Date.now() - 88 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 month sub, expires in 2 days
    validityDays: 90,
    expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    costPrice: 90,
    sellPrice: 199,
    paymentStatus: 'paid',
    notes: 'Sent Spotify Family link'
  },
  {
    id: 'sub-104',
    clientName: 'Vikram Singh',
    phone: '9822334455',
    countryCode: '+91',
    platform: 'youtube',
    planType: 'YouTube Premium Family Slot',
    accountEmail: 'vikram.yt@gmail.com',
    accountPassword: 'N/A (Google Group)',
    profileName: 'Vikram',
    screenPin: '',
    purchaseDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // expires in 20 days
    validityDays: 30,
    expiryDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    costPrice: 35,
    sellPrice: 79,
    paymentStatus: 'paid',
    notes: 'Auto-renewal promised'
  },
  {
    id: 'sub-105',
    clientName: 'Sneha Roy',
    phone: '9733445566',
    countryCode: '+91',
    platform: 'disney',
    planType: 'Hotstar Super 4K',
    accountEmail: 'hotstar.acc9@gmail.com',
    accountPassword: 'OTP Login',
    profileName: 'Sneha',
    screenPin: '0091',
    purchaseDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // expired 5 days ago
    validityDays: 30,
    expiryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    costPrice: 50,
    sellPrice: 120,
    paymentStatus: 'paid',
    notes: 'Did not respond to last reminder'
  }
];
