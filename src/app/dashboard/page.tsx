'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ChartSummary {
  id: string;
  name: string;
  dateOfBirth: string;
  city: string;
  country: string;
  astrologySystem: string;
  isFavorite: boolean;
  lastViewedAt?: string;
  createdAt: string;
}

const SYSTEM_COLORS: Record<string, string> = {
  VEDIC: '#7c3aed',
  WESTERN: '#2563eb',
  BAZI: '#0891b2',
};

const SYSTEM_LABELS: Record<string, string> = {
  VEDIC: '🪐 Vedic',
  WESTERN: '⭐ Western',
  BAZI: '☯️ BaZi',
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const [charts, setCharts] = useState<ChartSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [remaining, setRemaining] = useState(10);
  const [max] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/charts')
      .then((r) => r.json())
      .then((d) => {
        setCharts(d.charts || []);
        setTotal(d.total || 0);
        setRemaining(d.remaining ?? 10);
      })
      .finally(() => setLoading(false));
  }, []);

  const firstName = session?.user?.name?.split(' ')[0] || 'Seeker';
  const recentCharts = charts.slice(0, 4);
  const favorites = charts.filter((c) => c.isFavorite).slice(0, 3);

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <h1 className="font-display" style={{ fontSize: 30, color: '#f1f0ff', marginBottom: 6 }}>
          Welcome back, {firstName} ✦
        </h1>
        <p style={{ color: '#6b7280', fontSize: 15 }}>Your cosmic library awaits.</p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 40 }}>
        {[
          { label: 'Charts Created', value: total, sub: `of ${max} max`, color: '#7c3aed' },
          { label: 'Remaining Slots', value: remaining, sub: 'available', color: remaining > 3 ? '#10b981' : '#f59e0b' },
          { label: 'Favorites', value: favorites.length, sub: 'starred', color: '#ec4899' },
          { label: 'Recent Views', value: charts.filter((c) => c.lastViewedAt).length, sub: 'charts', color: '#06b6d4' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card" style={{ padding: '20px 24px' }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: stat.color, fontFamily: 'Cinzel, serif', lineHeight: 1, marginBottom: 6 }}>{stat.value}</div>
            <div style={{ fontSize: 13, color: '#f1f0ff', fontWeight: 500, marginBottom: 2 }}>{stat.label}</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Chart usage bar */}
      <div className="glass-card" style={{ padding: '20px 24px', marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 14, color: '#a5b4fc', fontWeight: 500 }}>Chart Slots Used</span>
          <span style={{ fontSize: 14, color: '#f1f0ff', fontWeight: 600 }}>{total} / {max}</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(total / max) * 100}%` }} />
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: '#6b7280' }}>
          {remaining > 0 ? `${remaining} slot${remaining === 1 ? '' : 's'} remaining` : 'All slots used — delete a chart to create a new one'}
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 40 }}>
        {remaining > 0 && (
          <Link href="/dashboard/new-chart" style={{ textDecoration: 'none' }}>
            <div style={{ padding: '20px 24px', borderRadius: 16, background: 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(79,70,229,0.15))', border: '1px solid rgba(124,58,237,0.4)', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'none'; }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>✦</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#f1f0ff', marginBottom: 4 }}>New Chart</div>
              <div style={{ fontSize: 13, color: '#a5b4fc' }}>Vedic, Western or BaZi</div>
            </div>
          </Link>
        )}
        <Link href="/dashboard/charts" style={{ textDecoration: 'none' }}>
          <div className="glass-card" style={{ padding: '20px 24px', cursor: 'pointer' }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>◉</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#f1f0ff', marginBottom: 4 }}>All Charts</div>
            <div style={{ fontSize: 13, color: '#a5b4fc' }}>Browse and manage</div>
          </div>
        </Link>
        <Link href="/dashboard/settings" style={{ textDecoration: 'none' }}>
          <div className="glass-card" style={{ padding: '20px 24px', cursor: 'pointer' }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>⚙</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#f1f0ff', marginBottom: 4 }}>Settings</div>
            <div style={{ fontSize: 13, color: '#a5b4fc' }}>Profile & preferences</div>
          </div>
        </Link>
      </div>

      {/* Recent charts */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ height: 72, borderRadius: 12 }} />)}
        </div>
      ) : recentCharts.length > 0 ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#f1f0ff' }}>Recent Charts</h2>
            <Link href="/dashboard/charts" style={{ fontSize: 13, color: '#a5b4fc', textDecoration: 'none' }}>View all →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recentCharts.map((chart) => (
              <Link key={chart.id} href={`/chart/${chart.id}`} style={{ textDecoration: 'none' }}>
                <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${SYSTEM_COLORS[chart.astrologySystem]}22`, border: `1px solid ${SYSTEM_COLORS[chart.astrologySystem]}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                      {chart.astrologySystem === 'VEDIC' ? '🪐' : chart.astrologySystem === 'WESTERN' ? '⭐' : '☯️'}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#f1f0ff', marginBottom: 2 }}>{chart.name}</div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>
                        {new Date(chart.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} · {chart.city}, {chart.country}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="badge badge-violet" style={{ background: `${SYSTEM_COLORS[chart.astrologySystem]}22`, color: SYSTEM_COLORS[chart.astrologySystem], borderColor: `${SYSTEM_COLORS[chart.astrologySystem]}44` }}>
                      {SYSTEM_LABELS[chart.astrologySystem]}
                    </span>
                    {chart.isFavorite && <span style={{ color: '#f59e0b' }}>★</span>}
                    <span style={{ color: '#a5b4fc', fontSize: 18 }}>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 24px', border: '1px dashed rgba(124,58,237,0.2)', borderRadius: 16 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✦</div>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#f1f0ff', marginBottom: 8 }}>No charts yet</h3>
          <p style={{ color: '#6b7280', marginBottom: 24, fontSize: 14 }}>Create your first birth chart to begin your astrological journey.</p>
          <Link href="/dashboard/new-chart" style={{ padding: '12px 28px', borderRadius: 10, background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: 'white', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
            Create First Chart →
          </Link>
        </div>
      )}
    </div>
  );
}
