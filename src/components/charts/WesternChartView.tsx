'use client';

import { useState } from 'react';
import type { WesternData } from '@/types';
import WesternWheel from './WesternWheel';

const TABS = ['Wheel', 'Planets', 'Aspects', 'Elements', 'Special Points'];

const PLANET_COLORS: Record<string, string> = {
  Sun: '#fbbf24', Moon: '#e2e8f0', Mars: '#ef4444', Mercury: '#06b6d4',
  Jupiter: '#f59e0b', Venus: '#ec4899', Saturn: '#10b981',
  'North Node': '#8b5cf6', 'South Node': '#6b7280',
  Chiron: '#06b6d4', Lilith: '#ec4899', 'Part of Fortune': '#f59e0b',
};

const ELEMENT_COLORS: Record<string, string> = { Fire: '#ef4444', Earth: '#10b981', Air: '#06b6d4', Water: '#3b82f6' };

const ASPECT_COLORS: Record<string, string> = {
  Conjunction: '#fbbf24', Opposition: '#ef4444', Trine: '#10b981', Square: '#f59e0b',
  Sextile: '#3b82f6', Quincunx: '#8b5cf6',
};

export default function WesternChartView({ chart }: { chart: any }) {
  const [activeTab, setActiveTab] = useState('Wheel');
  const data: WesternData | null = chart.calculatedData;

  if (!data) return (
    <div style={{ textAlign: 'center', padding: '60px 24px', color: '#6b7280' }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>⭐</div>
      <p>Chart data is being calculated. Please refresh.</p>
    </div>
  );

  const totalElements = Object.values(data.elementBalance).reduce((a, b) => a + b, 0) || 1;
  const totalModalities = Object.values(data.modalityBalance).reduce((a, b) => a + b, 0) || 1;

  return (
    <div>
      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Rising Sign', value: data.ascendant.sign, color: '#7c3aed' },
          { label: 'Midheaven', value: data.midheaven.sign, color: '#4f46e5' },
          { label: 'Chart Shape', value: data.chartShape, color: '#06b6d4' },
          { label: 'Chart Ruler', value: data.chartRuler, color: '#f59e0b' },
          { label: 'Dominant Element', value: data.dominantElement, color: ELEMENT_COLORS[data.dominantElement] || '#7c3aed' },
        ].map((item) => (
          <div key={item.label} className="glass-card" style={{ padding: '14px 16px' }}>
            <div style={{ fontSize: 10, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 5 }}>{item.label}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: item.color, fontFamily: 'Cinzel, serif' }}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, overflowX: 'auto', marginBottom: 24, padding: '4px', background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(124,58,237,0.1)', width: 'fit-content' }}>
        {TABS.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', background: activeTab === tab ? 'linear-gradient(135deg, #7c3aed, #4f46e5)' : 'transparent', color: activeTab === tab ? 'white' : '#6b7280', transition: 'all 0.15s' }}>{tab}</button>
        ))}
      </div>

      {activeTab === 'Wheel' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div className="glass-card" style={{ padding: 24, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <WesternWheel planets={data.planets} ascDegree={data.ascendant.degree} aspects={data.aspects} />
          </div>
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#f1f0ff', marginBottom: 16 }}>House Cusps ({chart.houseSystem || 'Placidus'})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {data.houses.map((h) => (
                <div key={h.number} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.02)' }}>
                  <span style={{ fontSize: 11, color: '#4b5563', width: 52, flexShrink: 0 }}>House {h.number}</span>
                  <span style={{ fontSize: 13, color: '#a5b4fc', flex: 1 }}>{h.sign} {h.degree}°</span>
                  <span style={{ fontSize: 11, color: '#6b7280' }}>{h.planets.slice(0, 2).join(', ')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Planets' && (
        <div className="glass-card" style={{ padding: 24, overflowX: 'auto' }}>
          <table className="cosmic-table">
            <thead><tr><th>Planet</th><th>Sign</th><th>House</th><th>Degree</th><th>Retrograde</th></tr></thead>
            <tbody>
              {data.planets.map((p) => (
                <tr key={p.name}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: PLANET_COLORS[p.name] || '#7c3aed', display: 'inline-block', flexShrink: 0 }} />
                      <span style={{ fontWeight: 500 }}>{p.name}</span>
                    </div>
                  </td>
                  <td style={{ color: '#a5b4fc' }}>{p.sign}</td>
                  <td style={{ color: '#f1f0ff' }}>{p.house}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: 12, color: '#6b7280' }}>{p.degree}° {p.minute}'</td>
                  <td style={{ color: p.isRetrograde ? '#f59e0b' : '#4b5563' }}>{p.isRetrograde ? 'R' : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'Aspects' && (
        <div className="glass-card" style={{ padding: 24, overflowX: 'auto' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#f1f0ff', marginBottom: 16 }}>Aspect Grid ({data.aspects.length} aspects)</h3>
          <table className="cosmic-table">
            <thead><tr><th>Planet 1</th><th>Aspect</th><th>Planet 2</th><th>Orb</th><th>Applying</th><th>Strength</th></tr></thead>
            <tbody>
              {data.aspects.sort((a, b) => b.strength - a.strength).map((asp, i) => (
                <tr key={i}>
                  <td style={{ color: PLANET_COLORS[asp.planet1] || '#f1f0ff', fontWeight: 500 }}>{asp.planet1}</td>
                  <td><span style={{ color: ASPECT_COLORS[asp.type] || '#c4b5fd', fontWeight: 600 }}>{asp.type}</span></td>
                  <td style={{ color: PLANET_COLORS[asp.planet2] || '#f1f0ff', fontWeight: 500 }}>{asp.planet2}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: 12, color: '#6b7280' }}>{asp.orb.toFixed(2)}°</td>
                  <td style={{ color: asp.applying ? '#10b981' : '#6b7280' }}>{asp.applying ? 'Applying' : 'Separating'}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 60, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                        <div style={{ width: `${asp.strength * 100}%`, height: '100%', background: 'linear-gradient(90deg, #7c3aed, #4f46e5)', borderRadius: 2 }} />
                      </div>
                      <span style={{ fontSize: 11, color: '#6b7280' }}>{Math.round(asp.strength * 100)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'Elements' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#f1f0ff', marginBottom: 20 }}>Element Balance</h3>
            {Object.entries(data.elementBalance).map(([el, count]) => (
              <div key={el} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: ELEMENT_COLORS[el], fontWeight: 500 }}>{el}</span>
                  <span style={{ fontSize: 13, color: '#f1f0ff' }}>{count} planets</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${(count / totalElements) * 100}%`, background: ELEMENT_COLORS[el] }} />
                </div>
              </div>
            ))}
          </div>
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#f1f0ff', marginBottom: 20 }}>Modality Balance</h3>
            {Object.entries(data.modalityBalance).map(([mod, count]) => (
              <div key={mod} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: '#a5b4fc', fontWeight: 500 }}>{mod}</span>
                  <span style={{ fontSize: 13, color: '#f1f0ff' }}>{count} planets</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${(count / totalModalities) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Special Points' && (
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#f1f0ff', marginBottom: 16 }}>Special Points & Sensitive Degrees</h3>
          <table className="cosmic-table">
            <thead><tr><th>Point</th><th>Sign</th><th>House</th><th>Degree</th></tr></thead>
            <tbody>
              {[
                { name: 'Ascendant (ASC)', ...data.ascendant, house: 1 },
                { name: 'Midheaven (MC)', ...data.midheaven, house: 10 },
                { name: 'North Node (Rahu)', sign: data.northNode.sign, degree: data.northNode.degree, house: data.northNode.house },
                { name: 'South Node (Ketu)', sign: data.southNode.sign, degree: data.southNode.degree, house: data.southNode.house },
                { name: 'Chiron (Wounded Healer)', sign: data.chiron.sign, degree: data.chiron.degree, house: data.chiron.house },
                { name: 'Black Moon Lilith', sign: data.lilith.sign, degree: data.lilith.degree, house: data.lilith.house },
                { name: 'Part of Fortune', sign: data.partOfFortune.sign, degree: data.partOfFortune.degree, house: data.partOfFortune.house },
              ].map((pt) => (
                <tr key={pt.name}>
                  <td style={{ fontWeight: 500, color: '#f1f0ff' }}>{pt.name}</td>
                  <td style={{ color: '#a5b4fc' }}>{pt.sign}</td>
                  <td style={{ color: '#6b7280' }}>{pt.house}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: 12, color: '#6b7280' }}>{pt.degree}°</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
