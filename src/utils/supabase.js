import { createClient } from '@supabase/supabase-js';

export const DEFAULT_SUPABASE_URL = 'https://ioibfvtdacuakpckrllf.supabase.co';

let supabaseInstance = null;

export function getSupabaseClient(customUrl, customKey) {
  const url = customUrl || import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const key = customKey || import.meta.env.VITE_SUPABASE_ANON_KEY || localStorage.getItem('premium_hub_supabase_key');

  if (!url || !key) {
    return null;
  }

  try {
    if (!supabaseInstance || supabaseInstance.supabaseUrl !== url) {
      supabaseInstance = createClient(url, key);
    }
    return supabaseInstance;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

// Map database column names (snake_case) to client models (camelCase)
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
