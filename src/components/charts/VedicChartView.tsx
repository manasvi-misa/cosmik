'use client';

import { useState } from 'react';
import type { VedicData, Planet } from '@/types';
import { SIGNS } from '@/lib/vedic-engine';
import VedicChartWheel from './VedicChartWheel';

const TABS = ['Chart', 'Planets', 'Divisional', 'Dashas', 'Yogas', 'Doshas', 'Ashtakavarga', 'Transits'];

const PLANET_GLYPHS: Record<string, string> = {
  Sun: '☉', Moon: '☽', Mars: '♂', Mercury: '☿', Jupiter: '♃', Venus: '♀', Saturn: '♄', Rahu: '☊', Ketu: '☋',
};

const PLANET_COLORS: Record<string, string> = {
  Sun: '#fbbf24', Moon: '#e2e8f0', Mars: '#ef4444', Mercury: '#06b6d4',
  Jupiter: '#f59e0b', Venus: '#ec4899', Saturn: '#10b981', Rahu: '#8b5cf6', Ketu: '#9ca3af',
};

const DIVISIONAL_CHARTS = ['D1','D2','D3','D4','D7','D9','D10','D12','D16','D20','D24','D27','D30','D40','D45','D60'];
const DIVISIONAL_NAMES: Record<string, string> = {
  D1:'Rasi (Birth)', D2:'Hora (Wealth)', D3:'Drekkana (Siblings)', D4:'Chaturthamsha (Fortune)',
  D7:'Saptamsha (Children)', D9:'Navamsha (Spouse)', D10:'Dashamsha (Career)', D12:'Dwadashamsha (Parents)',
  D16:'Shodashamsha (Vehicles)', D20:'Vimshamsha (Spirituality)', D24:'Chaturvimshamsha (Learning)',
  D27:'Saptavimshamsha (Strength)', D30:'Trimshamsha (Evils)', D40:'Khavedamsha (Auspiciousness)',
  D45:'Akshavedamsha (Conduct)', D60:'Shashtiamsha (Past Life)',
};

export default function VedicChartView({ chart }: { chart: any }) {
  const [activeTab, setActiveTab] = useState('Chart');
  const [activeDiv, setActiveDiv] = useState('D1');
  const [activeDasha, setActiveDasha] = useState(0);

  const data: VedicData | null = chart.calculatedData;

  if (!data) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 24px', color: '#6b7280' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🪐</div>
        <p>Chart data is being calculated. Please refresh in a moment.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Ascendant summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Ascendant', value: data.ascendant.sign, sub: `${data.ascendant.nakshatra} Pada ${data.ascendant.pada}`, color: '#7c3aed' },
          { label: 'Moon Sign', value: data.planets.find(p => p.name === 'Moon')?.sign || '—', sub: data.planets.find(p => p.name === 'Moon')?.nakshatra || '', color: '#e2e8f0' },
          { label: 'Sun Sign', value: data.planets.find(p => p.name === 'Sun')?.sign || '—', sub: data.planets.find(p => p.name === 'Sun')?.nakshatra || '', color: '#fbbf24' },
          { label: 'Yoga Count', value: data.yogas.filter(y => y.isPresent).length, sub: 'active yogas', color: '#10b981' },
          { label: 'Dosha', value: data.doshas.filter(d => d.isPresent).length, sub: 'present', color: '#ef4444' },
        ].map((item) => (
          <div key={item.label} className="glass-card" style={{ padding: '16px 18px' }}>
            <div style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>{item.label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: item.color, fontFamily: 'Cinzel, serif', marginBottom: 2 }}>{item.value}</div>
            <div style={{ fontSize: 11, color: '#6b7280' }}>{item.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, overflowX: 'auto', marginBottom: 24, padding: '4px', background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(124,58,237,0.1)', width: 'fit-content' }}>
        {TABS.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap',
            background: activeTab === tab ? 'linear-gradient(135deg, #7c3aed, #4f46e5)' : 'transparent',
            color: activeTab === tab ? 'white' : '#6b7280',
            transition: 'all 0.15s',
          }}>{tab}</button>
        ))}
      </div>

      {/* ── Chart Tab ── */}
      {activeTab === 'Chart' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#f1f0ff', marginBottom: 16 }}>Rasi Chart (D1) — {chart.vedicSchool || 'Parashara'}</h3>
            <VedicChartWheel planets={data.planets} houses={data.houses} ascSign={SIGNS.indexOf(data.ascendant.sign)} />
          </div>
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#f1f0ff', marginBottom: 16 }}>House Overview</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {data.houses.map((h) => (
                <div key={h.number} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.02)' }}>
                  <span style={{ fontSize: 11, color: '#4b5563', width: 50, flexShrink: 0 }}>House {h.number}</span>
                  <span style={{ fontSize: 13, color: '#a5b4fc', width: 90, flexShrink: 0 }}>{h.sign}</span>
                  <span style={{ fontSize: 11, color: '#6b7280', marginRight: 6 }}>Lord: {h.lord}</span>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {h.planets.map((p) => (
                      <span key={p} style={{ fontSize: 11, padding: '1px 6px', borderRadius: 10, background: `${PLANET_COLORS[p] || '#7c3aed'}20`, color: PLANET_COLORS[p] || '#c4b5fd', border: `1px solid ${PLANET_COLORS[p] || '#7c3aed'}30` }}>{p}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Planets Tab ── */}
      {activeTab === 'Planets' && (
        <div className="glass-card" style={{ padding: 24, overflowX: 'auto' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#f1f0ff', marginBottom: 16 }}>Planetary Positions — {chart.ayanamsa || 'Lahiri'} Ayanamsa</h3>
          <table className="cosmic-table">
            <thead>
              <tr>
                <th>Planet</th><th>Sign</th><th>House</th><th>Degree</th>
                <th>Nakshatra</th><th>Pada</th><th>Lord</th><th>Dignity</th><th>Retrograde</th><th>Combust</th>
              </tr>
            </thead>
            <tbody>
              {data.planets.map((p) => (
                <tr key={p.name}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 16, color: PLANET_COLORS[p.name] }}>{PLANET_GLYPHS[p.name]}</span>
                      <span style={{ fontWeight: 500 }}>{p.name}</span>
                    </div>
                  </td>
                  <td style={{ color: '#a5b4fc' }}>{p.sign}</td>
                  <td style={{ color: '#f1f0ff' }}>{p.house}</td>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#6b7280' }}>{p.degree}° {p.minute}' {p.second}"</td>
                  <td style={{ color: '#c4b5fd', fontSize: 12 }}>{p.nakshatra}</td>
                  <td style={{ color: '#6b7280' }}>{p.pada}</td>
                  <td style={{ color: '#a5b4fc' }}>{p.lord}</td>
                  <td>
                    <span className={`badge ${p.dignity === 'Exalted' ? 'badge-green' : p.dignity === 'Debilitated' ? 'badge-red' : p.dignity === 'Own Sign' ? 'badge-violet' : ''}`} style={p.dignity === 'Neutral' ? { color: '#6b7280', padding: '2px 8px', borderRadius: 20, fontSize: 11 } : {}}>
                      {p.dignity}
                    </span>
                  </td>
                  <td style={{ color: p.isRetrograde ? '#f59e0b' : '#4b5563', fontWeight: p.isRetrograde ? 600 : 400 }}>{p.isRetrograde ? 'R' : '—'}</td>
                  <td style={{ color: p.isCombust ? '#ef4444' : '#4b5563' }}>{p.isCombust ? '🔥' : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Divisional Charts Tab ── */}
      {activeTab === 'Divisional' && (
        <div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
            {DIVISIONAL_CHARTS.map((d) => (
              <button key={d} onClick={() => setActiveDiv(d)} style={{
                padding: '6px 12px', borderRadius: 8, border: activeDiv === d ? '1px solid rgba(124,58,237,0.5)' : '1px solid rgba(255,255,255,0.06)',
                background: activeDiv === d ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.02)',
                color: activeDiv === d ? '#c4b5fd' : '#6b7280', cursor: 'pointer', fontSize: 13,
              }}>{d}</button>
            ))}
          </div>
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#f1f0ff', marginBottom: 4 }}>{activeDiv} — {DIVISIONAL_NAMES[activeDiv]}</h3>
            <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>Divisional chart showing planetary positions in the {activeDiv} harmonic.</p>
            {data.divisionalCharts?.[activeDiv] ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <VedicChartWheel
                    planets={data.divisionalCharts[activeDiv].planets}
                    houses={data.divisionalCharts[activeDiv].houses}
                    ascSign={0}
                    compact
                  />
                </div>
                <div>
                  <h4 style={{ fontSize: 13, color: '#a5b4fc', marginBottom: 12 }}>Planetary Positions in {activeDiv}</h4>
                  <table className="cosmic-table" style={{ fontSize: 12 }}>
                    <thead><tr><th>Planet</th><th>Sign</th><th>Nakshatra</th></tr></thead>
                    <tbody>
                      {data.divisionalCharts[activeDiv].planets.map((p: Planet) => (
                        <tr key={p.name}>
                          <td style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ color: PLANET_COLORS[p.name] }}>{PLANET_GLYPHS[p.name]}</span>{p.name}
                          </td>
                          <td style={{ color: '#a5b4fc' }}>{p.sign}</td>
                          <td style={{ color: '#6b7280', fontSize: 11 }}>{p.nakshatra}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : <p style={{ color: '#6b7280' }}>Divisional data unavailable.</p>}
          </div>
        </div>
      )}

      {/* ── Dashas Tab ── */}
      {activeTab === 'Dashas' && (
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#f1f0ff', marginBottom: 16 }}>Vimshottari Dasha Timeline</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {data.dashas.vimshottari.map((maha, i) => {
              const isActive = new Date() >= new Date(maha.startDate) && new Date() <= new Date(maha.endDate);
              return (
                <div key={maha.planet}>
                  <div onClick={() => setActiveDasha(activeDasha === i ? -1 : i)} style={{ padding: '14px 18px', borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: isActive ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.02)', border: `1px solid ${isActive ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.05)'}`, transition: 'all 0.15s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 20, color: PLANET_COLORS[maha.planet] }}>{PLANET_GLYPHS[maha.planet]}</span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#f1f0ff' }}>{maha.planet} Mahadasha {isActive && <span className="badge badge-violet" style={{ marginLeft: 8 }}>Active</span>}</div>
                        <div style={{ fontSize: 12, color: '#6b7280' }}>
                          {new Date(maha.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} – {new Date(maha.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                    <span style={{ color: '#4b5563' }}>{activeDasha === i ? '▲' : '▼'}</span>
                  </div>
                  {activeDasha === i && maha.subPeriods && (
                    <div style={{ marginLeft: 20, marginTop: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {maha.subPeriods.map((antar) => {
                        const isAntarActive = new Date() >= new Date(antar.startDate) && new Date() <= new Date(antar.endDate);
                        return (
                          <div key={antar.planet} style={{ padding: '10px 16px', borderRadius: 10, background: isAntarActive ? 'rgba(124,58,237,0.1)' : 'rgba(255,255,255,0.01)', border: `1px solid ${isAntarActive ? 'rgba(124,58,237,0.25)' : 'rgba(255,255,255,0.04)'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ color: PLANET_COLORS[antar.planet], fontSize: 14 }}>{PLANET_GLYPHS[antar.planet]}</span>
                              <span style={{ fontSize: 13, color: isAntarActive ? '#f1f0ff' : '#a5b4fc' }}>{antar.planet} Antardasha</span>
                              {isAntarActive && <span className="badge badge-violet" style={{ fontSize: 10 }}>Now</span>}
                            </div>
                            <span style={{ fontSize: 12, color: '#6b7280' }}>
                              {new Date(antar.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} – {new Date(antar.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Yogas Tab ── */}
      {activeTab === 'Yogas' && (
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#f1f0ff', marginBottom: 6 }}>Yoga Analysis</h3>
          <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>{data.yogas.filter(y => y.isPresent).length} yogas detected in this chart.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 12 }}>
            {data.yogas.map((yoga) => (
              <div key={yoga.name} className="glass-card" style={{ padding: '18px 20px', opacity: yoga.isPresent ? 1 : 0.5, border: `1px solid ${yoga.isPresent ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.05)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 600, color: '#f1f0ff' }}>{yoga.name}</h4>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <span className={`badge ${yoga.isPresent ? 'badge-green' : 'badge-red'}`}>{yoga.isPresent ? 'Present' : 'Absent'}</span>
                    {yoga.isPresent && <span className={`badge ${yoga.strength === 'strong' ? 'badge-violet' : 'badge-yellow'}`}>{yoga.strength}</span>}
                  </div>
                </div>
                <p style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.6 }}>{yoga.description}</p>
                {yoga.planets.length > 0 && (
                  <div style={{ display: 'flex', gap: 4, marginTop: 10, flexWrap: 'wrap' }}>
                    {yoga.planets.map((p) => (
                      <span key={p} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: `${PLANET_COLORS[p] || '#7c3aed'}20`, color: PLANET_COLORS[p] || '#c4b5fd', border: `1px solid ${PLANET_COLORS[p] || '#7c3aed'}30` }}>{p}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Doshas Tab ── */}
      {activeTab === 'Doshas' && (
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#f1f0ff', marginBottom: 20 }}>Dosha Analysis</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {data.doshas.map((dosha) => (
              <div key={dosha.name} className="glass-card" style={{ padding: '20px 24px', border: `1px solid ${dosha.isPresent ? (dosha.severity === 'high' ? 'rgba(239,68,68,0.3)' : 'rgba(251,191,36,0.3)') : 'rgba(255,255,255,0.05)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <h4 style={{ fontSize: 15, fontWeight: 600, color: '#f1f0ff' }}>{dosha.name}</h4>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span className={`badge ${dosha.isPresent ? (dosha.severity === 'high' ? 'badge-red' : 'badge-yellow') : 'badge-green'}`}>
                      {dosha.isPresent ? `${dosha.severity.charAt(0).toUpperCase() + dosha.severity.slice(1)} Severity` : 'Not Present'}
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: '#a5b4fc', lineHeight: 1.7, marginBottom: dosha.remedies.length > 0 ? 14 : 0 }}>{dosha.description}</p>
                {dosha.isPresent && dosha.remedies.length > 0 && (
                  <div>
                    <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 8, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Remedies</p>
                    <ul style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {dosha.remedies.map((r, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#a5b4fc' }}>
                          <span style={{ color: '#7c3aed', flexShrink: 0, marginTop: 2 }}>•</span>{r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Ashtakavarga Tab ── */}
      {activeTab === 'Ashtakavarga' && (
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#f1f0ff', marginBottom: 6 }}>Ashtakavarga</h3>
          <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>Bindus (benefic points) for each planet across all 12 signs.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {data.ashtakavarga.map((item) => (
              <div key={item.planet} className="glass-card" style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: PLANET_COLORS[item.planet], fontSize: 18 }}>{PLANET_GLYPHS[item.planet]}</span>
                    <span style={{ fontWeight: 600, color: '#f1f0ff' }}>{item.planet}</span>
                  </div>
                  <span style={{ fontSize: 13, color: '#a5b4fc' }}>Total: <strong style={{ color: '#f1f0ff' }}>{item.total}</strong></span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 4 }}>
                  {item.scores.map((score, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 10, color: '#6b7280', marginBottom: 3 }}>{SIGNS[i].slice(0, 3)}</div>
                      <div style={{ width: '100%', height: 4, borderRadius: 2, background: `rgba(${score >= 5 ? '16,185,129' : score >= 4 ? '251,191,36' : '239,68,68'},${0.2 + score * 0.08})` }} />
                      <div style={{ fontSize: 12, fontWeight: 600, color: score >= 5 ? '#6ee7b7' : score >= 4 ? '#fde68a' : '#fca5a5', marginTop: 3 }}>{score}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Transits Tab ── */}
      {activeTab === 'Transits' && (
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#f1f0ff', marginBottom: 6 }}>Current Transits (Gochar)</h3>
          <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>Current planetary positions as of today — {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          {data.transits && (
            <div className="glass-card" style={{ padding: 24, overflowX: 'auto' }}>
              <table className="cosmic-table">
                <thead><tr><th>Planet</th><th>Current Sign</th><th>Degree</th><th>Nakshatra</th><th>Natal Sign</th><th>Transit House</th></tr></thead>
                <tbody>
                  {data.transits.map((t) => {
                    const natal = data.planets.find(p => p.name === t.name);
                    return (
                      <tr key={t.name}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ color: PLANET_COLORS[t.name] }}>{PLANET_GLYPHS[t.name]}</span>
                            <span style={{ fontWeight: 500 }}>{t.name}</span>
                          </div>
                        </td>
                        <td style={{ color: '#a5b4fc' }}>{t.sign}</td>
                        <td style={{ fontFamily: 'monospace', fontSize: 12, color: '#6b7280' }}>{t.degree}°</td>
                        <td style={{ fontSize: 12, color: '#c4b5fd' }}>{t.nakshatra}</td>
                        <td style={{ color: natal?.sign === t.sign ? '#10b981' : '#6b7280' }}>{natal?.sign}</td>
                        <td style={{ color: '#f1f0ff' }}>{natal?.house || '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
