import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://ioibfvtdacuakpckrllf.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvaWJmdnRkYWN1YWtwY2tybGxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI1MTgxOTQsImV4cCI6MjEwODA5NDE5NH0.6Qxxhc-SzTD5GcCCsKYYrcpmXEmt8-11-66uI00DZDk';

// Always initialized singleton client directly connected to your project
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
  realtime: { params: { eventsPerSecond: 10 } }
});

// Map database column names (snake_case) to application models (camelCase)
export function mapFromDb(row) {
  return {
    id: row.id,
    clientName: row.client_name,
    phone: row.phone,
    countryCode: row.country_code || '+91',
    platform: row.platform,
    planType: row.plan_type,
    accountEmail: row.account_email,
    accountPassword: row.account_password,
    profileName: row.profile_name,
    screenPin: row.screen_pin,
    purchaseDate: row.purchase_date,
    validityDays: row.validity_days || 30,
    expiryDate: row.expiry_date,
    costPrice: row.cost_price || 0,
    sellPrice: row.sell_price || 0,
    paymentStatus: row.payment_status || 'paid',
    notes: row.notes || ''
  };
}

export function mapToDb(sub) {
  return {
    id: sub.id,
    client_name: sub.clientName,
    phone: sub.phone,
    country_code: sub.countryCode || '+91',
    platform: sub.platform,
    plan_type: sub.planType,
    account_email: sub.accountEmail,
    account_password: sub.accountPassword,
    profile_name: sub.profileName,
    screen_pin: sub.screenPin,
    purchase_date: sub.purchaseDate,
    validity_days: parseInt(sub.validityDays || 30, 10),
    expiry_date: sub.expiryDate,
    cost_price: parseFloat(sub.costPrice) || 0,
    sell_price: parseFloat(sub.sellPrice) || 0,
    payment_status: sub.paymentStatus || 'paid',
    notes: sub.notes || '',
    updated_at: new Date().toISOString()
  };
}
