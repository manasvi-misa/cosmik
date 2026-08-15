'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function SettingsPage() {
  const { data: session } = useSession();
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState(session?.user?.name || '');

  return (
    <div style={{ padding: '32px 40px', maxWidth: 600 }}>
      <div style={{ marginBottom: 36 }}>
        <h1 className="font-display" style={{ fontSize: 26, color: '#f1f0ff', marginBottom: 6 }}>Account Settings</h1>
        <p style={{ color: '#6b7280', fontSize: 14 }}>Manage your profile and preferences</p>
      </div>

      {/* Profile */}
      <div className="glass-card" style={{ padding: 28, marginBottom: 20 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#f1f0ff', marginBottom: 20 }}>Profile</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: 'white' }}>
              {session?.user?.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#f1f0ff' }}>{session?.user?.name}</div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>{session?.user?.email}</div>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#a5b4fc', marginBottom: 6 }}>Display Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="cosmic-input" placeholder="Your name" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#a5b4fc', marginBottom: 6 }}>Email Address</label>
            <input type="email" value={session?.user?.email || ''} className="cosmic-input" disabled style={{ opacity: 0.5 }} />
            <p style={{ fontSize: 12, color: '#4b5563', marginTop: 4 }}>Email cannot be changed</p>
          </div>
          <button onClick={() => setSaved(true)} style={{ padding: '10px 24px', borderRadius: 10, background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: 'white', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', alignSelf: 'flex-start' }}>
            {saved ? '✓ Saved' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Chart Usage */}
      <div className="glass-card" style={{ padding: 28, marginBottom: 20 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#f1f0ff', marginBottom: 16 }}>Chart Usage</h2>
        <p style={{ fontSize: 14, color: '#a5b4fc', marginBottom: 12 }}>Each account supports up to <strong style={{ color: '#f1f0ff' }}>10 birth charts</strong>. Delete charts you no longer need to free up slots.</p>
        <a href="/dashboard/charts" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#a5b4fc', textDecoration: 'none', padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.1)' }}>
          Manage Charts →
        </a>
      </div>

      {/* Danger Zone */}
      <div style={{ padding: 28, border: '1px solid rgba(239,68,68,0.2)', borderRadius: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#f87171', marginBottom: 12 }}>Danger Zone</h2>
        <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 16 }}>Permanently delete your account and all associated charts. This action cannot be undone.</p>
        <button onClick={() => alert('Please contact support to delete your account.')} style={{ padding: '9px 20px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: 14, cursor: 'pointer' }}>
          Delete Account
        </button>
      </div>
    </div>
  );
}
