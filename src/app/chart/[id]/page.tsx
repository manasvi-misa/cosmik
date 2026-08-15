'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import VedicChartView from '@/components/charts/VedicChartView';
import WesternChartView from '@/components/charts/WesternChartView';
import BaziChartView from '@/components/charts/BaziChartView';

export default function ChartPage() {
  const params = useParams();
  const router = useRouter();
  const [chart, setChart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!params?.id) return;
    fetch(`/api/charts/${params.id}`)
      .then(async (r) => {
        if (!r.ok) { setError('Chart not found'); return; }
        const d = await r.json();
        setChart(d.chart);
      })
      .catch(() => setError('Failed to load chart'))
      .finally(() => setLoading(false));
  }, [params?.id]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', border: '3px solid rgba(124,58,237,0.3)', borderTopColor: '#7c3aed', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ color: '#a5b4fc', fontSize: 14 }}>Calculating your chart...</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (error || !chart) return (
    <div style={{ padding: '60px 40px', textAlign: 'center' }}>
      <p style={{ color: '#f87171', fontSize: 16, marginBottom: 20 }}>{error || 'Chart not found'}</p>
      <Link href="/dashboard/charts" style={{ color: '#a5b4fc', textDecoration: 'none' }}>← Back to charts</Link>
    </div>
  );

  return (
    <div style={{ padding: '24px 32px' }}>
      {/* Breadcrumb + header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Link href="/dashboard/charts" style={{ color: '#6b7280', fontSize: 13, textDecoration: 'none' }}>My Charts</Link>
            <span style={{ color: '#4b5563' }}>›</span>
            <span style={{ color: '#a5b4fc', fontSize: 13 }}>{chart.name}</span>
          </div>
          <h1 className="font-display" style={{ fontSize: 26, color: '#f1f0ff', marginBottom: 4 }}>{chart.name}</h1>
          <p style={{ color: '#6b7280', fontSize: 14 }}>
            {new Date(chart.dateOfBirth).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            {chart.timeOfBirth && ` at ${chart.timeOfBirth}`}
            {' · '}
            {chart.city}, {chart.country}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => window.print()} style={{ padding: '9px 18px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(124,58,237,0.2)', color: '#a5b4fc', fontSize: 13, cursor: 'pointer' }}>
            🖨 Print
          </button>
          <Link href="/dashboard/new-chart" style={{ padding: '9px 18px', borderRadius: 10, background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: 'white', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
            + New Chart
          </Link>
        </div>
      </div>

      {/* Render by system */}
      {chart.astrologySystem === 'VEDIC' && <VedicChartView chart={chart} />}
      {chart.astrologySystem === 'WESTERN' && <WesternChartView chart={chart} />}
      {chart.astrologySystem === 'BAZI' && <BaziChartView chart={chart} />}
    </div>
  );
}
