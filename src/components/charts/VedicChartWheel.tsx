'use client';

import type { Planet, House } from '@/types';

const PLANET_COLORS: Record<string, string> = {
  Sun: '#fbbf24', Moon: '#e2e8f0', Mars: '#ef4444', Mercury: '#06b6d4',
  Jupiter: '#f59e0b', Venus: '#ec4899', Saturn: '#10b981', Rahu: '#8b5cf6', Ketu: '#9ca3af',
};

const PLANET_SHORT: Record<string, string> = {
  Sun: 'Su', Moon: 'Mo', Mars: 'Ma', Mercury: 'Me', Jupiter: 'Ju', Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra', Ketu: 'Ke',
};

const SIGNS_SHORT = ['Ar', 'Ta', 'Ge', 'Ca', 'Le', 'Vi', 'Li', 'Sc', 'Sg', 'Cp', 'Aq', 'Pi'];

// South Indian chart: fixed sign positions in a 4x4 grid
// Grid positions: cell [row][col] -> sign index (0-based Aries = 0)
const SOUTH_INDIAN_LAYOUT: number[][] = [
  [11, 0, 1, 2],   // row 0: Pisces, Aries, Taurus, Gemini
  [10, -1, -1, 3], // row 1: Aquarius, [empty], [empty], Cancer
  [9, -1, -1, 4],  // row 2: Capricorn, [empty], [empty], Leo
  [8, 7, 6, 5],    // row 3: Sagittarius, Scorpio, Libra, Virgo — reversed for South Indian
];

// Actually: proper South Indian layout (signs are fixed)
const SI_SIGNS = [
  [11, 0, 1, 2],
  [10, -1, -1, 3],
  [9, -1, -1, 4],
  [8, 7, 6, 5],
];

interface Props {
  planets: Planet[];
  houses: House[];
  ascSign: number;
  compact?: boolean;
}

export default function VedicChartWheel({ planets, houses, ascSign, compact = false }: Props) {
  const size = compact ? 280 : 380;
  const cellSize = size / 4;

  function getPlanetsInSign(signIndex: number): Planet[] {
    return planets.filter((p) => p.signIndex === signIndex);
  }

  return (
    <div style={{ position: 'relative', width: size, height: size, maxWidth: '100%' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
        {/* Background */}
        <rect width={size} height={size} fill="rgba(8,6,24,0.5)" rx={4} />

        {/* Draw grid cells */}
        {SI_SIGNS.map((row, rowIdx) =>
          row.map((signIdx, colIdx) => {
            if (signIdx === -1) {
              // Center cells
              return (
                <g key={`${rowIdx}-${colIdx}`}>
                  <rect
                    x={colIdx * cellSize} y={rowIdx * cellSize}
                    width={cellSize} height={cellSize}
                    fill="rgba(124,58,237,0.04)"
                  />
                </g>
              );
            }

            const cellPlanets = getPlanetsInSign(signIdx);
            const isAsc = signIdx === ascSign;

            return (
              <g key={`${rowIdx}-${colIdx}`}>
                <rect
                  x={colIdx * cellSize + 1} y={rowIdx * cellSize + 1}
                  width={cellSize - 2} height={cellSize - 2}
                  fill={isAsc ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.01)'}
                  stroke={isAsc ? 'rgba(124,58,237,0.5)' : 'rgba(124,58,237,0.15)'}
                  strokeWidth={isAsc ? 1.5 : 0.8}
                  rx={2}
                />

                {/* House number (from ascendant) */}
                <text
                  x={colIdx * cellSize + 6}
                  y={rowIdx * cellSize + 14}
                  fontSize={compact ? 8 : 9}
                  fill="rgba(124,58,237,0.6)"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {((signIdx - ascSign + 12) % 12) + 1}
                </text>

                {/* Sign abbreviation */}
                <text
                  x={colIdx * cellSize + cellSize - 6}
                  y={rowIdx * cellSize + 14}
                  fontSize={compact ? 8 : 9}
                  fill="rgba(165,180,252,0.5)"
                  textAnchor="end"
                  fontFamily="Inter, sans-serif"
                >
                  {SIGNS_SHORT[signIdx]}
                </text>

                {/* ASC marker */}
                {isAsc && (
                  <text
                    x={colIdx * cellSize + cellSize / 2}
                    y={rowIdx * cellSize + cellSize - 8}
                    fontSize={compact ? 8 : 9}
                    fill="rgba(124,58,237,0.8)"
                    textAnchor="middle"
                    fontWeight="bold"
                    fontFamily="Inter, sans-serif"
                  >
                    ASC
                  </text>
                )}

                {/* Planet abbreviations */}
                {cellPlanets.map((p, pi) => {
                  const col = pi % 2;
                  const row2 = Math.floor(pi / 2);
                  const px = colIdx * cellSize + 8 + col * (cellSize / 2 - 6);
                  const py = rowIdx * cellSize + 28 + row2 * 14;
                  return (
                    <text
                      key={p.name}
                      x={px} y={py}
                      fontSize={compact ? 9 : 10}
                      fill={PLANET_COLORS[p.name] || '#c4b5fd'}
                      fontWeight="600"
                      fontFamily="Inter, sans-serif"
                    >
                      {PLANET_SHORT[p.name]}{p.isRetrograde ? 'R' : ''}
                    </text>
                  );
                })}
              </g>
            );
          })
        )}

        {/* Center decorative element */}
        <g transform={`translate(${size / 2}, ${size / 2})`}>
          <rect x={-cellSize + 2} y={-cellSize + 2} width={cellSize * 2 - 4} height={cellSize * 2 - 4} fill="rgba(124,58,237,0.06)" stroke="rgba(124,58,237,0.2)" strokeWidth={0.5} />
          <text y={-12} textAnchor="middle" fontSize={compact ? 14 : 18} fill="rgba(124,58,237,0.4)" fontFamily="Cinzel, serif">✦</text>
          <text y={8} textAnchor="middle" fontSize={compact ? 8 : 9} fill="rgba(165,180,252,0.4)" fontFamily="Cinzel, serif">COSMIK</text>
        </g>

        {/* Diagonal lines in center cells */}
        <line x1={cellSize} y1={cellSize} x2={cellSize * 2} y2={cellSize * 2} stroke="rgba(124,58,237,0.1)" strokeWidth={0.5} />
        <line x1={cellSize * 2} y1={cellSize} x2={cellSize} y2={cellSize * 2} stroke="rgba(124,58,237,0.1)" strokeWidth={0.5} />
        <line x1={cellSize * 2} y1={cellSize} x2={cellSize * 3} y2={cellSize * 2} stroke="rgba(124,58,237,0.1)" strokeWidth={0.5} />
        <line x1={cellSize * 3} y1={cellSize} x2={cellSize * 2} y2={cellSize * 2} stroke="rgba(124,58,237,0.1)" strokeWidth={0.5} />
        <line x1={cellSize} y1={cellSize * 2} x2={cellSize * 2} y2={cellSize * 3} stroke="rgba(124,58,237,0.1)" strokeWidth={0.5} />
        <line x1={cellSize * 2} y1={cellSize * 2} x2={cellSize} y2={cellSize * 3} stroke="rgba(124,58,237,0.1)" strokeWidth={0.5} />
        <line x1={cellSize * 2} y1={cellSize * 2} x2={cellSize * 3} y2={cellSize * 3} stroke="rgba(124,58,237,0.1)" strokeWidth={0.5} />
        <line x1={cellSize * 3} y1={cellSize * 2} x2={cellSize * 2} y2={cellSize * 3} stroke="rgba(124,58,237,0.1)" strokeWidth={0.5} />
      </svg>
    </div>
  );
}
