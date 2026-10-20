import React, { useState, useRef } from 'react';
import { 
  X, 
  FileSpreadsheet, 
  Download, 
  Upload, 
  Database, 
  Check, 
  AlertCircle 
} from 'lucide-react';

export default function BulkImportExportModal({
  isOpen,
  subscriptions,
  onClose,
  onImportSubscriptions,
  onRestoreAll,
  onShowToast
}) {
  const fileInputRef = useRef(null);
  const jsonInputRef = useRef(null);
  const [importSummary, setImportSummary] = useState(null);

  if (!isOpen) return null;

  // CSV Export
  const handleExportCSV = () => {
    if (subscriptions.length === 0) {
      onShowToast({ type: 'warning', message: 'No subscriptions to export!' });
      return;
    }

    const headers = [
      'Client Name',
      'Phone Number',
      'Country Code',
      'Platform',
      'Plan Type',
      'Account Email',
      'Account Password',
      'Profile Name',
      'Screen PIN',
      'Purchase Date',
      'Validity Days',
      'Expiry Date',
      'Cost Price',
      'Sell Price',
      'Notes'
    ];

    const rows = subscriptions.map(s => [
      `"${(s.clientName || '').replace(/"/g, '""')}"`,
      `"${s.phone || ''}"`,
      `"${s.countryCode || '+91'}"`,
      `"${s.platform || 'netflix'}"`,
      `"${(s.planType || '').replace(/"/g, '""')}"`,
      `"${(s.accountEmail || '').replace(/"/g, '""')}"`,
      `"${(s.accountPassword || '').replace(/"/g, '""')}"`,
      `"${(s.profileName || '').replace(/"/g, '""')}"`,
      `"${s.screenPin || ''}"`,
      `"${s.purchaseDate || ''}"`,
      s.validityDays || 30,
      `"${s.expiryDate || ''}"`,
      s.costPrice || 0,
      s.sellPrice || 0,
      `"${(s.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PremiumHub_Subscriptions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onShowToast({ type: 'success', message: 'CSV downloaded successfully!' });
  };

  // Download Sample Template CSV
  const handleDownloadSample = () => {
    const sample = [
      'Client Name,Phone Number,Country Code,Platform,Plan Type,Account Email,Account Password,Profile Name,Screen PIN,Purchase Date,Validity Days,Expiry Date,Cost Price,Sell Price,Notes',
      'Amit Verma,9811223344,+91,netflix,1-Screen UHD Profile,netflix.acc1@gmail.com,Pass#123,Amit,1234,2026-10-01,30,2026-10-31,80,150,Regular client',
      'Sneha Kapoor,9822334455,+91,prime,1-Screen HD,prime.hub@gmail.com,PrimePass,Sneha,0000,2026-10-15,30,2026-11-14,40,99,WhatsApp order'
    ].join('\n');

    const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + sample);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'PremiumHub_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Import parser
  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
        if (lines.length < 2) {
          onShowToast({ type: 'error', message: 'CSV file is empty or missing data rows.' });
          return;
        }

        const newSubs = [];
        for (let i = 1; i < lines.length; i++) {
          // simple csv split handling quotes
          const cols = lines[i].split(',').map(item => item.trim().replace(/^"|"$/g, ''));
          if (cols.length >= 2 && cols[0]) {
            newSubs.push({
              id: `sub-import-${Date.now()}-${i}`,
              clientName: cols[0] || 'Client',
              phone: cols[1] || '',
              countryCode: cols[2] || '+91',
              platform: (cols[3] || 'netflix').toLowerCase(),
              planType: cols[4] || '1-Screen',
              accountEmail: cols[5] || '',
              accountPassword: cols[6] || '',
              profileName: cols[7] || '',
              screenPin: cols[8] || '',
              purchaseDate: cols[9] || new Date().toISOString().split('T')[0],
              validityDays: parseInt(cols[10], 10) || 30,
              expiryDate: cols[11] || new Date().toISOString().split('T')[0],
              costPrice: parseFloat(cols[12]) || 0,
              sellPrice: parseFloat(cols[13]) || 0,
              paymentStatus: 'paid',
              notes: cols[14] || ''
            });
          }
        }

        if (newSubs.length > 0) {
          onImportSubscriptions(newSubs);
          onShowToast({ type: 'success', message: `Imported ${newSubs.length} subscriptions!` });
          onClose();
        } else {
          onShowToast({ type: 'warning', message: 'No valid records found in CSV.' });
        }
      } catch (err) {
        onShowToast({ type: 'error', message: `Failed to parse CSV: ${err.message}` });
      }
    };
    reader.readAsText(file);
  };

  // Full JSON Backup Export
  const handleExportJSON = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      subscriptions
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PremiumHub_CompleteBackup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast({ type: 'success', message: 'Full backup saved!' });
  };

  // Full JSON Restore
  const handleJSONRestore = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed && Array.isArray(parsed.subscriptions)) {
          if (confirm(`Restore will replace existing list with ${parsed.subscriptions.length} subscriptions. Proceed?`)) {
            onRestoreAll(parsed.subscriptions);
            onShowToast({ type: 'success', message: `Restored ${parsed.subscriptions.length} subscriptions!` });
            onClose();
          }
        } else {
          onShowToast({ type: 'error', message: 'Invalid backup format.' });
        }
      } catch (err) {
        onShowToast({ type: 'error', message: 'Invalid JSON file.' });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#0f172a',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '580px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
        overflow: 'hidden',
        animation: 'fadeIn 0.2s ease-out'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '18px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#38bdf8',
              color: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#f8fafc'
              }}>
                CSV & Data Backup
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Bulk import clients, export for Excel, and full backup
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: 'none',
              borderRadius: '8px',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* CSV Section */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '14px',
            padding: '16px'
          }}>
            <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc', marginBottom: '4px' }}>
              📊 Excel / CSV Spreadsheet
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '14px' }}>
              Import hundreds of client reminders at once or export for record keeping.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '10px' }}>
              <button
                onClick={handleExportCSV}
                style={{
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  color: '#38bdf8',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Download size={15} />
                <span>Export to CSV</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  background: 'rgba(34, 197, 94, 0.15)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  color: '#4ade80',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Upload size={15} />
                <span>Import CSV File</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                style={{ display: 'none' }}
              />
            </div>

            <button
              onClick={handleDownloadSample}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                fontSize: '0.75rem',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              📥 Download Sample CSV Template
            </button>
          </div>

          {/* Full Database Backup */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '14px',
            padding: '16px'
          }}>
            <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc', marginBottom: '4px' }}>
              🛡️ Complete JSON Backup & Restore
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '14px' }}>
              Full snapshot of all subscriptions, credentials, and settings.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              <button
                onClick={handleExportJSON}
                style={{
                  background: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  color: '#818cf8',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Download size={15} />
                <span>Save Full Backup</span>
              </button>

              <button
                onClick={() => jsonInputRef.current?.click()}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#cbd5e1',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Database size={15} />
                <span>Restore Backup</span>
              </button>
              <input
                ref={jsonInputRef}
                type="file"
                accept=".json"
                onChange={handleJSONRestore}
                style={{ display: 'none' }}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
