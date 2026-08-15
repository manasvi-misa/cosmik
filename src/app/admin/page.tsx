'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(d => { setStats(d); setLoading(false); });
  }, [session, status]);

  if (loading) return (
    <div style={{ padding: '60px 40px', textAlign: 'center', color: '#6b7280' }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>⚡</div>
      <p>Loading admin data...</p>
    </div>
  );

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1000 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 className="font-display" style={{ fontSize: 26, color: '#f1f0ff', marginBottom: 6 }}>Admin Panel ⚡</h1>
        <p style={{ color: '#6b7280', fontSize: 14 }}>Platform-wide statistics and user management</p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 40 }}>
        {[
          { label: 'Total Users', value: stats?.totalUsers ?? '—', color: '#7c3aed', icon: '👤' },
          { label: 'Total Charts', value: stats?.totalCharts ?? '—', color: '#4f46e5', icon: '◉' },
          { label: 'Vedic Charts', value: stats?.systemBreakdown?.find((s: any) => s.astrologySystem === 'VEDIC')?._count ?? 0, color: '#ec4899', icon: '🪐' },
          { label: 'Western Charts', value: stats?.systemBreakdown?.find((s: any) => s.astrologySystem === 'WESTERN')?._count ?? 0, color: '#2563eb', icon: '⭐' },
          { label: 'BaZi Charts', value: stats?.systemBreakdown?.find((s: any) => s.astrologySystem === 'BAZI')?._count ?? 0, color: '#0891b2', icon: '☯️' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card" style={{ padding: '20px 24px' }}>
            <div style={{ fontSize: 24, marginBottom: 10 }}>{stat.icon}</div>
            <div style={{ fontSize: 30, fontWeight: 700, color: stat.color, fontFamily: 'Cinzel, serif', lineHeight: 1, marginBottom: 6 }}>{stat.value}</div>
            <div style={{ fontSize: 13, color: '#a5b4fc' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent users */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#f1f0ff', marginBottom: 16 }}>Recent Users</h2>
        <table className="cosmic-table">
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Role</th><th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {(stats?.recentUsers || []).map((u: any) => (
              <tr key={u.id}>
                <td style={{ fontWeight: 500 }}>{u.name || '—'}</td>
                <td style={{ color: '#a5b4fc' }}>{u.email}</td>
                <td>
                  <span className={`badge ${u.role === 'ADMIN' ? 'badge-violet' : 'badge-yellow'}`}>{u.role}</span>
                </td>
                <td style={{ color: '#6b7280', fontSize: 12 }}>{new Date(u.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Feature toggles */}
      <div className="glass-card" style={{ padding: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#f1f0ff', marginBottom: 16 }}>Feature Toggles</h2>
        <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>These are configured via environment variables and database feature flags.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { name: 'Vedic Astrology Module', enabled: true },
            { name: 'Western Astrology Module', enabled: true },
            { name: 'BaZi Module', enabled: true },
            { name: 'PDF Export', enabled: true },
            { name: 'AI Interpretations (Coming Soon)', enabled: false },
            { name: 'Kundli Matching (Coming Soon)', enabled: false },
            { name: 'Panchang Module (Coming Soon)', enabled: false },
            { name: 'Subscription Payments (Coming Soon)', enabled: false },
          ].map((f) => (
            <div key={f.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: 13, color: f.enabled ? '#f1f0ff' : '#4b5563' }}>{f.name}</span>
              <span className={`badge ${f.enabled ? 'badge-green' : 'badge-red'}`}>{f.enabled ? 'Active' : 'Inactive'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
