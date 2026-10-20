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

export const DEFAULT_SETTINGS = {
  businessName: 'Premium Hub',
  upiId: 'premiumhub@upi',
  currency: '₹',
  telegramBotToken: '',
  telegramChatId: '',
  defaultCountryCode: '+91',
  whatsappSignature: '— Team Premium Hub',
  autoTelegramAlerts: false
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
