'use client';

import type { Planet, Aspect } from '@/types';

const SIGN_COLORS = ['#ef4444','#10b981','#06b6d4','#3b82f6','#ef4444','#10b981','#06b6d4','#3b82f6','#ef4444','#10b981','#06b6d4','#3b82f6'];
const SIGN_GLYPHS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
const PLANET_GLYPHS: Record<string, string> = {
  Sun:'☉', Moon:'☽', Mars:'♂', Mercury:'☿', Jupiter:'♃', Venus:'♀', Saturn:'♄',
  'North Node':'☊', 'South Node':'☋', Chiron:'⚷', Lilith:'⚸', 'Part of Fortune':'⊕',
};
const PLANET_COLORS: Record<string, string> = {
  Sun:'#fbbf24', Moon:'#e2e8f0', Mars:'#ef4444', Mercury:'#06b6d4', Jupiter:'#f59e0b',
  Venus:'#ec4899', Saturn:'#10b981', 'North Node':'#8b5cf6', 'South Node':'#9ca3af',
  Chiron:'#06b6d4', Lilith:'#ec4899', 'Part of Fortune':'#f59e0b',
};
const ASPECT_COLORS: Record<string, string> = {
  Conjunction:'rgba(251,191,36,0.5)', Opposition:'rgba(239,68,68,0.4)', Trine:'rgba(16,185,129,0.4)',
  Square:'rgba(245,158,11,0.4)', Sextile:'rgba(59,130,246,0.4)', Quincunx:'rgba(139,92,246,0.3)',
};

interface Props { planets: Planet[]; ascDegree: number; aspects: Aspect[]; size?: number; }

export default function WesternWheel({ planets, ascDegree, aspects, size = 360 }: Props) {
  const cx = size / 2, cy = size / 2;
  const outerR = size / 2 - 8;
  const signR = outerR - 20;
  const houseR = signR - 24;
  const planetR = houseR - 20;
  const innerR = planetR - 28;

  function degToRad(deg: number) { return ((deg - 90) * Math.PI) / 180; }
  function lonToAngle(lon: number) { return mod360(lon - ascDegree + 180); }
  function mod360(x: number) { return ((x % 360) + 360) % 360; }

  function polarToXY(angle: number, r: number) {
    const rad = degToRad(angle);
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function arc(r: number, startAngle: number, endAngle: number) {
    const s = polarToXY(startAngle, r);
    const e = polarToXY(endAngle, r);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`;
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', maxWidth: '100%' }}>
      {/* Background */}
      <circle cx={cx} cy={cy} r={outerR} fill="rgba(8,6,24,0.6)" stroke="rgba(124,58,237,0.2)" strokeWidth={1} />
      <circle cx={cx} cy={cy} r={signR} fill="none" stroke="rgba(124,58,237,0.15)" strokeWidth={0.5} />
      <circle cx={cx} cy={cy} r={houseR} fill="none" stroke="rgba(124,58,237,0.1)" strokeWidth={0.5} />
      <circle cx={cx} cy={cy} r={innerR} fill="rgba(124,58,237,0.04)" stroke="rgba(124,58,237,0.1)" strokeWidth={0.5} />

      {/* Sign divisions */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = lonToAngle(i * 30);
        const p1 = polarToXY(angle, signR);
        const p2 = polarToXY(angle, outerR);
        const midAngle = lonToAngle(i * 30 + 15);
        const glyph = polarToXY(midAngle, (signR + outerR) / 2);
        return (
          <g key={i}>
            <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="rgba(124,58,237,0.2)" strokeWidth={0.5} />
            <text x={glyph.x} y={glyph.y} textAnchor="middle" dominantBaseline="middle" fontSize={11} fill={SIGN_COLORS[i]} opacity={0.8}>{SIGN_GLYPHS[i]}</text>
          </g>
        );
      })}

      {/* House divisions */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = lonToAngle(i * 30);
        const p1 = polarToXY(angle, innerR);
        const p2 = polarToXY(angle, houseR);
        const midAngle = lonToAngle(i * 30 + 15);
        const label = polarToXY(midAngle, (innerR + houseR) / 2);
        return (
          <g key={i}>
            <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="rgba(124,58,237,0.12)" strokeWidth={0.5} />
            <text x={label.x} y={label.y} textAnchor="middle" dominantBaseline="middle" fontSize={8} fill="rgba(124,58,237,0.4)" fontFamily="JetBrains Mono, monospace">{i + 1}</text>
          </g>
        );
      })}

      {/* Aspect lines */}
      {aspects.slice(0, 30).map((asp, i) => {
        const p1 = planets.find(p => p.name === asp.planet1);
        const p2 = planets.find(p => p.name === asp.planet2);
        if (!p1 || !p2) return null;
        const a1 = lonToAngle(p1.longitude);
        const a2 = lonToAngle(p2.longitude);
        const pt1 = polarToXY(a1, innerR - 4);
        const pt2 = polarToXY(a2, innerR - 4);
        return (
          <line key={i} x1={pt1.x} y1={pt1.y} x2={pt2.x} y2={pt2.y}
            stroke={ASPECT_COLORS[asp.type] || 'rgba(124,58,237,0.2)'}
            strokeWidth={asp.strength > 0.7 ? 1.5 : 0.8}
            strokeDasharray={asp.type === 'Sextile' || asp.type === 'Quincunx' ? '3,3' : undefined}
          />
        );
      })}

      {/* Planets */}
      {planets.map((p) => {
        const angle = lonToAngle(p.longitude);
        const pos = polarToXY(angle, planetR);
        const tickInner = polarToXY(angle, houseR + 2);
        const tickOuter = polarToXY(angle, houseR + 10);
        return (
          <g key={p.name}>
            <line x1={tickInner.x} y1={tickInner.y} x2={tickOuter.x} y2={tickOuter.y} stroke={PLANET_COLORS[p.name] || '#7c3aed'} strokeWidth={1.5} />
            <circle cx={pos.x} cy={pos.y} r={8} fill="rgba(8,6,24,0.9)" stroke={PLANET_COLORS[p.name] || '#7c3aed'} strokeWidth={1} />
            <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle" fontSize={9} fill={PLANET_COLORS[p.name] || '#c4b5fd'} fontWeight="bold">
              {PLANET_GLYPHS[p.name] || p.name[0]}
            </text>
          </g>
        );
      })}

      {/* ASC arrow */}
      <line x1={cx} y1={cy} x2={polarToXY(lonToAngle(0), houseR - 5).x} y2={polarToXY(lonToAngle(0), houseR - 5).y} stroke="rgba(124,58,237,0.8)" strokeWidth={1.5} strokeDasharray="4,3" />

      {/* Center */}
      <circle cx={cx} cy={cy} r={8} fill="rgba(124,58,237,0.3)" />
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize={8} fill="#c4b5fd">✦</text>
    </svg>
  );
}
