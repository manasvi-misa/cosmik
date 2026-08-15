'use client';

import { useState } from 'react';
import type { BaziData } from '@/types';

const TABS = ['Four Pillars', 'Five Elements', 'Luck Pillars', 'Annual Luck', 'Analysis'];

const ELEMENT_COLORS: Record<string, string> = {
  Wood: '#10b981', Fire: '#ef4444', Earth: '#f59e0b', Metal: '#e2e8f0', Water: '#3b82f6',
};
const ELEMENT_ICONS: Record<string, string> = {
  Wood: '🌿', Fire: '🔥', Earth: '⛰️', Metal: '⚔️', Water: '💧',
};

function PillarCard({ title, pillar, highlight }: { title: string; pillar: any; highlight?: boolean }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1,
      padding: '20px 16px', borderRadius: 14,
      background: highlight ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.02)',
      border: `1px solid ${highlight ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.06)'}`,
      minWidth: 0,
    }}>
      <div style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 14 }}>{title}</div>

      {/* Heavenly Stem */}
      <div style={{ textAlign: 'center', marginBottom: 10, padding: '14px 18px', borderRadius: 10, background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', width: '100%' }}>
        <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Heavenly Stem</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#c4b5fd', fontFamily: 'Cinzel, serif', lineHeight: 1.2 }}>
          {pillar.heavenlyStem.split(' ')[0]}
        </div>
        <div style={{ fontSize: 12, color: '#a5b4fc', marginTop: 2 }}>{pillar.heavenlyStem.split(' ').slice(1).join(' ')}</div>
      </div>

      {/* Earthly Branch */}
      <div style={{ textAlign: 'center', marginBottom: 10, padding: '14px 18px', borderRadius: 10, background: 'rgba(8,145,178,0.1)', border: '1px solid rgba(8,145,178,0.2)', width: '100%' }}>
        <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Earthly Branch</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#67e8f9', fontFamily: 'Cinzel, serif', lineHeight: 1.2 }}>
          {pillar.earthlyBranch.split(' ')[0]}
        </div>
        <div style={{ fontSize: 12, color: '#22d3ee', marginTop: 2 }}>{pillar.earthlyBranch.split(' ').slice(1).join(' ')}</div>
      </div>

      {/* Hidden Stems */}
      <div style={{ width: '100%', marginBottom: 10 }}>
        <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 6, textAlign: 'center' }}>Hidden Stems</div>
        <div style={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
          {pillar.hiddenStems.map((s: string) => (
            <span key={s} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 8, background: 'rgba(245,158,11,0.1)', color: '#fde68a', border: '1px solid rgba(245,158,11,0.2)' }}>{s}</span>
          ))}
        </div>
      </div>

      {/* Ten God */}
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Ten God</div>
        <div style={{ fontSize: 12, color: '#c4b5fd', fontWeight: 500 }}>{pillar.tenGod.split(' ')[0]}</div>
        <div style={{ fontSize: 10, color: '#6b7280' }}>{pillar.tenGod.split(' ').slice(1).join(' ')}</div>
      </div>

      {/* Na Yin */}
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 2 }}>Na Yin</div>
        <div style={{ fontSize: 11, color: '#a5b4fc' }}>{pillar.naYin}</div>
      </div>

      {/* Void */}
      {pillar.isVoid && (
        <div style={{ padding: '4px 10px', borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', fontSize: 11, color: '#fca5a5' }}>
          Void (空亡)
        </div>
      )}
    </div>
  );
}

export default function BaziChartView({ chart }: { chart: any }) {
  const [activeTab, setActiveTab] = useState('Four Pillars');
  const data: BaziData | null = chart.calculatedData;

  if (!data) return (
    <div style={{ textAlign: 'center', padding: '60px 24px', color: '#6b7280' }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>☯️</div>
      <p>Chart data is being calculated. Please refresh.</p>
    </div>
  );

  const totalElements = Object.values(data.elementBalance).reduce((a: any, b: any) => a + b, 0) || 1;

  return (
    <div>
      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Day Master', value: data.dayMaster.split(' ')[0], sub: data.dayMaster.split('(')[1]?.replace(')', '') || '', color: '#7c3aed' },
          { label: 'Strength', value: data.dayMasterStrength.charAt(0).toUpperCase() + data.dayMasterStrength.slice(1), sub: 'Day Master', color: data.dayMasterStrength === 'strong' ? '#10b981' : data.dayMasterStrength === 'weak' ? '#ef4444' : '#f59e0b' },
          { label: 'Useful God', value: data.usefulGod, sub: 'Most favorable', color: ELEMENT_COLORS[data.usefulGod] || '#7c3aed' },
          { label: 'Current Luck', value: data.currentLuck.heavenlyStem.split(' ')[1] || '', sub: `Age ${data.currentLuck.startAge}–${data.currentLuck.endAge}`, color: '#06b6d4' },
        ].map((item) => (
          <div key={item.label} className="glass-card" style={{ padding: '16px 18px' }}>
            <div style={{ fontSize: 10, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 5 }}>{item.label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: item.color, fontFamily: 'Cinzel, serif', marginBottom: 2 }}>{item.value}</div>
            <div style={{ fontSize: 11, color: '#6b7280' }}>{item.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, overflowX: 'auto', marginBottom: 24, padding: '4px', background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(124,58,237,0.1)', width: 'fit-content' }}>
        {TABS.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', background: activeTab === tab ? 'linear-gradient(135deg, #7c3aed, #4f46e5)' : 'transparent', color: activeTab === tab ? 'white' : '#6b7280', transition: 'all 0.15s' }}>{tab}</button>
        ))}
      </div>

      {/* Four Pillars */}
      {activeTab === 'Four Pillars' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
            <PillarCard title="Year Pillar (年柱)" pillar={data.yearPillar} />
            <PillarCard title="Month Pillar (月柱)" pillar={data.monthPillar} />
            <PillarCard title="Day Pillar (日柱)" pillar={data.dayPillar} highlight />
            <PillarCard title="Hour Pillar (时柱)" pillar={data.hourPillar} />
          </div>
          <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 24 }}>ℹ️</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#f1f0ff', marginBottom: 2 }}>Day Pillar is Your Core Identity</div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>The Day Master (Day Stem) represents you. All Ten Gods are calculated relative to the Day Master's element: <strong style={{ color: '#c4b5fd' }}>{data.dayMaster}</strong>.</div>
            </div>
          </div>
        </div>
      )}

      {/* Five Elements */}
      {activeTab === 'Five Elements' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#f1f0ff', marginBottom: 20 }}>Five Element Balance (五行)</h3>
            {Object.entries(data.elementBalance).map(([el, count]) => (
              <div key={el} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{ELEMENT_ICONS[el]}</span>
                    <span style={{ fontSize: 14, color: ELEMENT_COLORS[el], fontWeight: 500 }}>{el}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: '#f1f0ff' }}>{(count as number).toFixed(1)}</span>
                    <span style={{ fontSize: 12, color: '#6b7280' }}>{Math.round(((count as number) / totalElements) * 100)}%</span>
                    {data.favorableElements.includes(el) && <span className="badge badge-green" style={{ fontSize: 10 }}>✓ Favorable</span>}
                    {data.unfavorableElements.includes(el) && <span className="badge badge-red" style={{ fontSize: 10 }}>✗ Avoid</span>}
                  </div>
                </div>
                <div className="progress-bar">
                  <div style={{ height: '100%', width: `${((count as number) / totalElements) * 100}%`, background: ELEMENT_COLORS[el], borderRadius: 3, transition: 'width 0.5s ease' }} />
                </div>
              </div>
            ))}
          </div>
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#f1f0ff', marginBottom: 16 }}>Day Master Analysis</h3>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#c4b5fd', fontFamily: 'Cinzel, serif', marginBottom: 4 }}>{data.dayMaster}</div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <span className={`badge ${data.dayMasterStrength === 'strong' ? 'badge-green' : data.dayMasterStrength === 'weak' ? 'badge-red' : 'badge-yellow'}`}>
                  {data.dayMasterStrength.charAt(0).toUpperCase() + data.dayMasterStrength.slice(1)} Day Master
                </span>
              </div>
              <p style={{ fontSize: 13, color: '#a5b4fc', lineHeight: 1.7 }}>
                {data.dayMasterStrength === 'strong'
                  ? 'A strong Day Master has abundant energy. It benefits from elements that control or output its energy: the controlling element (Officer/Wealth) and the output element (Eating God/Hurting Officer).'
                  : data.dayMasterStrength === 'weak'
                  ? 'A weak Day Master lacks support. It benefits from elements that produce or are the same as itself: the resource element (Resource/Indirect Resource) and the friend element (Friend/Rob Wealth).'
                  : 'A moderate Day Master is well-balanced. Context-dependent elements may help or hinder depending on the current luck pillar cycle.'}
              </p>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Favorable Elements</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {data.favorableElements.map((el) => (
                  <div key={el} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 10, background: `${ELEMENT_COLORS[el]}20`, border: `1px solid ${ELEMENT_COLORS[el]}40` }}>
                    <span>{ELEMENT_ICONS[el]}</span>
                    <span style={{ fontSize: 13, color: ELEMENT_COLORS[el], fontWeight: 500 }}>{el}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Unfavorable Elements</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {data.unfavorableElements.map((el) => (
                  <div key={el} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <span>{ELEMENT_ICONS[el]}</span>
                    <span style={{ fontSize: 13, color: '#fca5a5', fontWeight: 500 }}>{el}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Luck Pillars */}
      {activeTab === 'Luck Pillars' && (
        <div>
          <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 20 }}>
            Luck Pillars (大运 Dà Yùn) — Each pillar governs a 10-year cycle of life themes.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {data.luckPillars.map((lp, i) => {
              const currentYear = new Date().getFullYear();
              const isActive = currentYear >= lp.startYear && currentYear < lp.startYear + 10;
              return (
                <div key={i} style={{
                  padding: '16px 20px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 16,
                  background: isActive ? 'rgba(124,58,237,0.12)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isActive ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.05)'}`,
                }}>
                  <div style={{ width: 48, textAlign: 'center', flexShrink: 0 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: isActive ? '#c4b5fd' : '#6b7280', fontFamily: 'Cinzel, serif' }}>
                      {lp.heavenlyStem.split(' ')[0]}
                    </div>
                    <div style={{ fontSize: 14, color: isActive ? '#67e8f9' : '#4b5563' }}>
                      {lp.earthlyBranch.split(' ')[0]}
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#f1f0ff' }}>
                        {lp.heavenlyStem.split(' ').slice(1).join(' ')} · {lp.earthlyBranch.split(' ').slice(1).join(' ')}
                      </span>
                      {isActive && <span className="badge badge-violet">Current</span>}
                    </div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>
                      Age {lp.startAge}–{lp.endAge} · {lp.startYear}–{lp.startYear + 9} · {lp.tenGod.split(' ')[0]}
                    </div>
                  </div>
                  <div style={{ flexShrink: 0, textAlign: 'right' }}>
                    <div style={{ fontSize: 12, color: '#a5b4fc' }}>{lp.tenGod.split('(')[1]?.replace(')', '')}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Annual Luck */}
      {activeTab === 'Annual Luck' && (
        <div>
          <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 20 }}>
            Annual Luck (流年 Liúnián) — Yearly heavenly stem and earthly branch cycle for {new Date().getFullYear()}–{new Date().getFullYear() + 9}.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            {data.annualLuck.map((al, i) => {
              const year = new Date().getFullYear() + i;
              const isCurrent = i === 0;
              return (
                <div key={i} style={{
                  padding: '18px 16px', borderRadius: 12, textAlign: 'center',
                  background: isCurrent ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isCurrent ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.05)'}`,
                }}>
                  <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 10 }}>
                    {year} {isCurrent && <span className="badge badge-violet" style={{ marginLeft: 4, fontSize: 10 }}>Now</span>}
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#c4b5fd', fontFamily: 'Cinzel, serif', lineHeight: 1.2, marginBottom: 4 }}>
                    {al.heavenlyStem.split(' ')[0]}
                  </div>
                  <div style={{ fontSize: 18, color: '#67e8f9', marginBottom: 8 }}>
                    {al.earthlyBranch.split(' ')[0]}
                  </div>
                  <div style={{ fontSize: 11, color: '#6b7280' }}>
                    {al.heavenlyStem.split(' ').slice(1).join(' ')}
                  </div>
                  <div style={{ fontSize: 11, color: '#4b5563' }}>
                    {al.earthlyBranch.split(' ').slice(1).join(' ')}
                  </div>
                  {al.isVoid && (
                    <div style={{ marginTop: 8, fontSize: 10, color: '#f87171', padding: '2px 8px', borderRadius: 6, background: 'rgba(239,68,68,0.1)', display: 'inline-block' }}>Void</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Analysis */}
      {activeTab === 'Analysis' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#f1f0ff', marginBottom: 14 }}>Ten Gods Profile</h3>
            <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>The Ten Gods (十神) describe personality traits and life themes based on how each pillar relates to the Day Master.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
              {[data.yearPillar, data.monthPillar, data.dayPillar, data.hourPillar].map((p, i) => {
                const labels = ['Year (Ancestors)', 'Month (Career/Parents)', 'Day (Self/Spouse)', 'Hour (Children/Future)'];
                return (
                  <div key={i} style={{ padding: '14px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 8 }}>{labels[i]}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#c4b5fd', marginBottom: 4 }}>{p.tenGod.split(' ')[0]}</div>
                    <div style={{ fontSize: 11, color: '#6b7280' }}>{p.tenGod.split('(')[1]?.replace(')', '')}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#f1f0ff', marginBottom: 14 }}>Life Recommendations</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { title: 'Lucky Colors', desc: `Colors associated with favorable elements: ${data.favorableElements.map(e => ({ Wood: 'Green', Fire: 'Red', Earth: 'Yellow/Brown', Metal: 'White/Gold', Water: 'Black/Blue' }[e])).join(', ')}` },
                { title: 'Lucky Directions', desc: `${data.favorableElements.map(e => ({ Wood: 'East', Fire: 'South', Earth: 'Center', Metal: 'West', Water: 'North' }[e])).join(', ')}` },
                { title: 'Career Affinities', desc: `${data.favorableElements.map(e => ({ Wood: 'Education, Healthcare, Writing', Fire: 'Technology, Entertainment, Finance', Earth: 'Real Estate, Agriculture, Food', Metal: 'Law, Engineering, Manufacturing', Water: 'Shipping, Diplomacy, Philosophy' }[e])).join('; ')}` },
                { title: 'Favorable Seasons', desc: `${data.favorableElements.map(e => ({ Wood: 'Spring', Fire: 'Summer', Earth: 'Late Summer/Transitions', Metal: 'Autumn', Water: 'Winter' }[e])).join(', ')}` },
              ].map((item) => (
                <div key={item.title} style={{ display: 'flex', gap: 14, padding: '12px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ width: 8, borderRadius: 4, background: 'linear-gradient(180deg, #7c3aed, #4f46e5)', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f0ff', marginBottom: 4 }}>{item.title}</div>
                    <div style={{ fontSize: 13, color: '#a5b4fc' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
