'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const SYSTEM_COLORS: Record<string, string> = { VEDIC: '#7c3aed', WESTERN: '#2563eb', BAZI: '#0891b2' };
const SYSTEM_LABELS: Record<string, string> = { VEDIC: '🪐 Vedic', WESTERN: '⭐ Western', BAZI: '☯️ BaZi' };

export default function ChartsPage() {
  const [charts, setCharts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [remaining, setRemaining] = useState(10);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (filter) params.set('system', filter);
    const res = await fetch(`/api/charts?${params}`);
    const d = await res.json();
    setCharts(d.charts || []);
    setTotal(d.total || 0);
    setRemaining(d.remaining ?? 10);
    setLoading(false);
  }

  useEffect(() => { load(); }, [search, filter]);

  async function deleteChart(id: string) {
    if (!confirm('Delete this chart? This cannot be undone.')) return;
    setDeleting(id);
    await fetch(`/api/charts/${id}`, { method: 'DELETE' });
    setDeleting(null);
    load();
  }

  async function toggleFavorite(id: string, current: boolean) {
    await fetch(`/api/charts/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isFavorite: !current }) });
    load();
  }

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1000 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="font-display" style={{ fontSize: 26, color: '#f1f0ff', marginBottom: 6 }}>My Charts</h1>
          <p style={{ color: '#6b7280', fontSize: 14 }}>{total} / 10 chart slots used · {remaining} remaining</p>
        </div>
        {remaining > 0 && (
          <Link href="/dashboard/new-chart" style={{ padding: '11px 24px', borderRadius: 10, background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: 'white', textDecoration: 'none', fontSize: 14, fontWeight: 600, boxShadow: '0 4px 15px rgba(124,58,237,0.4)' }}>
            + New Chart
          </Link>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, city..." style={{ flex: 1, minWidth: 220, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 10, padding: '10px 14px', color: '#f1f0ff', fontSize: 14, outline: 'none' }} />
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 10, color: filter ? '#f1f0ff' : '#6b7280', fontSize: 14, cursor: 'pointer', outline: 'none' }}>
          <option value="">All Systems</option>
          <option value="VEDIC">🪐 Vedic</option>
          <option value="WESTERN">⭐ Western</option>
          <option value="BAZI">☯️ BaZi</option>
        </select>
      </div>

      {/* Chart usage bar */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6b7280', marginBottom: 6 }}>
          <span>Chart Slots</span><span>{total} / 10</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(total / 10) * 100}%` }} />
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[1,2,3,4].map((i) => <div key={i} className="skeleton" style={{ height: 80, borderRadius: 12 }} />)}
        </div>
      ) : charts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 24px', border: '1px dashed rgba(124,58,237,0.2)', borderRadius: 16 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✦</div>
          <p style={{ color: '#6b7280', marginBottom: 20, fontSize: 15 }}>{search || filter ? 'No charts match your search.' : 'No charts yet. Create your first!'}</p>
          {!search && !filter && remaining > 0 && (
            <Link href="/dashboard/new-chart" style={{ padding: '11px 24px', borderRadius: 10, background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: 'white', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>Create Chart →</Link>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {charts.map((chart) => (
            <div key={chart.id} className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0 }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: `${SYSTEM_COLORS[chart.astrologySystem]}22`, border: `1px solid ${SYSTEM_COLORS[chart.astrologySystem]}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                  {chart.astrologySystem === 'VEDIC' ? '🪐' : chart.astrologySystem === 'WESTERN' ? '⭐' : '☯️'}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#f1f0ff', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{chart.name}</div>
                  <div style={{ fontSize: 12, color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {new Date(chart.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} · {chart.city}, {chart.country}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <span className="badge" style={{ background: `${SYSTEM_COLORS[chart.astrologySystem]}15`, color: SYSTEM_COLORS[chart.astrologySystem], borderColor: `${SYSTEM_COLORS[chart.astrologySystem]}30`, border: '1px solid', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 500 }}>
                  {SYSTEM_LABELS[chart.astrologySystem]}
                </span>
                <button onClick={() => toggleFavorite(chart.id, chart.isFavorite)} title={chart.isFavorite ? 'Remove favorite' : 'Add to favorites'} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: chart.isFavorite ? '#f59e0b' : '#4b5563', padding: 4 }}>
                  {chart.isFavorite ? '★' : '☆'}
                </button>
                <Link href={`/chart/${chart.id}`} style={{ padding: '7px 14px', borderRadius: 8, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#c4b5fd', textDecoration: 'none', fontSize: 13, fontWeight: 500 }}>
                  View
                </Link>
                <button onClick={() => deleteChart(chart.id)} disabled={deleting === chart.id} style={{ padding: '7px 12px', borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', fontSize: 13, cursor: 'pointer' }}>
                  {deleting === chart.id ? '...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
