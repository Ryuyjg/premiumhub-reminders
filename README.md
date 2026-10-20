# Premium Hub — OTT Subscription & Reminder Command Center 🚀

A high-performance management dashboard and 1-click WhatsApp reminder system built specifically for OTT and digital subscription resellers.

![Live Dashboard Preview](src/assets/hero.png)

## 🌟 Key Features

* **📲 1-Click WhatsApp Reminders (Zero Contact Saving)**:
  * Message clients on WhatsApp directly without having to save their numbers in your phone contacts!
  * 4 ready-to-use professional message templates:
    * ⏰ *Upcoming Expiry Reminder (1–2 days before)*
    * 🚨 *Urgent Expired Alert*
    * 📦 *New Order Credentials Delivery (Email, Password, Profile & Screen PIN)*
    * ✅ *Renewal Confirmation (New date & thank you)*
* **🤖 Telegram Bot Integration**:
  * Private alerts sent straight to your Telegram bot.
  * Instant "Send Telegram Alert" summary of accounts expiring today/tomorrow with direct clickable WhatsApp links for each client.
* **⚡ 1-Click Renewal**:
  * Tap `+30d` on any client card to immediately extend validity, recalculate expiry date, and prompt to send a WhatsApp confirmation message.
* **📊 Business KPIs & Margins**:
  * Real-time metrics for Active subscriptions, Urgent renewals, Expired accounts, and Estimated Net Profit.
* **👥 Complete Credential Management**:
  * Tracks Master Email, Password, Profile Name, and Screen PIN with 1-click copy buttons.
* **📑 Dense Table & Card Grid Views**:
  * Switch between a visual card grid and a fast dense table for managing huge lists.
* **📂 CSV & JSON Backup**:
  * Bulk import existing customer lists from CSV.
  * Export to CSV for Excel / Google Sheets.
  * 1-Click full JSON database backup and restore.

---

## 🚀 Instant Deployment to Vercel

### Option 1: Import via Vercel Dashboard (Recommended)
1. Go to [vercel.com/new](https://vercel.com/new).
2. Connect your GitHub account (`Ryuyjg`).
3. Select **`Ryuyjg/premiumhub-reminders`**.
4. Click **Deploy**! Vercel will auto-detect Vite and deploy in seconds.

### Option 2: Run Locally
```bash
# Clone the repository
git clone https://github.com/Ryuyjg/premiumhub-reminders.git

# Enter project directory
cd premiumhub-reminders

# Install dependencies
npm install

# Start local development server
npm run dev
```

---

## 🛠️ Tech Stack
* **Framework**: React 19 + Vite 8
* **Styling**: Custom Obsidian Dark Glassmorphism CSS Design System
* **Icons**: Lucide React
* **Storage**: LocalStorage with CSV / JSON backup export & restore
