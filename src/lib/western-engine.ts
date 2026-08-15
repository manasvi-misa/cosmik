/**
 * Cosmik – Western Astrology Calculation Engine
 */

import type { Planet, Aspect, WesternData, House } from '@/types';
import {
  dateToJulianDay, calculateAscendant, SIGNS, PLANET_SYMBOLS, NAKSHATRAS, getNakshatra,
  sunLongitude, moonLongitude, marsLongitude, mercuryLongitude,
  jupiterLongitude, venusLongitude, saturnLongitude, rahuLongitude
} from './vedic-engine';

// Re-export helpers that reference non-exported functions via closures
function mod360(x: number) { return ((x % 360) + 360) % 360; }

// ─── ASPECTS ──────────────────────────────────────────────────────────────────

const ASPECT_TYPES = [
  { name: 'Conjunction', angle: 0, orb: 8 },
  { name: 'Opposition', angle: 180, orb: 8 },
  { name: 'Trine', angle: 120, orb: 8 },
  { name: 'Square', angle: 90, orb: 7 },
  { name: 'Sextile', angle: 60, orb: 6 },
  { name: 'Quincunx', angle: 150, orb: 3 },
  { name: 'Semi-Sextile', angle: 30, orb: 3 },
  { name: 'Semi-Square', angle: 45, orb: 3 },
  { name: 'Sesquiquadrate', angle: 135, orb: 3 },
  { name: 'Quintile', angle: 72, orb: 2 },
  { name: 'Bi-Quintile', angle: 144, orb: 2 },
];

function calculateAspects(planets: Planet[]): Aspect[] {
  const aspects: Aspect[] = [];
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const diff = Math.abs(mod360(planets[i].longitude - planets[j].longitude + 180) - 180);
      for (const aspectType of ASPECT_TYPES) {
        const orb = Math.abs(diff - aspectType.angle);
        if (orb <= aspectType.orb) {
          aspects.push({
            planet1: planets[i].name,
            planet2: planets[j].name,
            type: aspectType.name,
            orb,
            applying: planets[i].longitude < planets[j].longitude,
            strength: 1 - orb / aspectType.orb,
          });
          break;
        }
      }
    }
  }
  return aspects;
}

// ─── ELEMENTS & MODALITIES ────────────────────────────────────────────────────

const ELEMENTS = ['Fire', 'Earth', 'Air', 'Water'];
const MODALITIES = ['Cardinal', 'Fixed', 'Mutable'];
const SIGN_ELEMENTS = [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3]; // per sign index
const SIGN_MODALITIES = [0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2];

function getElementBalance(planets: Planet[]): Record<string, number> {
  const counts: Record<string, number> = { Fire: 0, Earth: 0, Air: 0, Water: 0 };
  planets.forEach((p) => {
    const el = ELEMENTS[SIGN_ELEMENTS[p.signIndex]];
    counts[el]++;
  });
  return counts;
}

function getModalityBalance(planets: Planet[]): Record<string, number> {
  const counts: Record<string, number> = { Cardinal: 0, Fixed: 0, Mutable: 0 };
  planets.forEach((p) => {
    const mod = MODALITIES[SIGN_MODALITIES[p.signIndex]];
    counts[mod]++;
  });
  return counts;
}

// ─── CHART SHAPE ──────────────────────────────────────────────────────────────

function determineChartShape(planets: Planet[]): string {
  const lons = planets.map((p) => p.longitude).sort((a, b) => a - b);
  const gaps = lons.map((l, i) => mod360(lons[(i + 1) % lons.length] - l));
  const maxGap = Math.max(...gaps);

  if (maxGap > 180) return 'Bundle';
  if (maxGap > 120) return 'Locomotive';
  if (maxGap > 90) return 'Bowl';
  
  // Check for opposing clusters
  const opposing = planets.filter((p) => {
    const opp = mod360(p.longitude + 180);
    return planets.some((p2) => Math.abs(mod360(p2.longitude - opp + 180) - 180) < 30);
  });
  if (opposing.length >= 4) return 'Seesaw';

  return 'Splash';
}

// ─── WESTERN CHART CALCULATION ────────────────────────────────────────────────

export function calculateWesternChart(
  dateOfBirth: Date,
  timeOfBirth: string,
  latitude: number,
  longitude: number,
  timezoneOffset: number,
  houseSystem: string = 'PLACIDUS'
): WesternData {
  const [hours = 12, minutes = 0] = timeOfBirth
    ? timeOfBirth.split(':').map(Number)
    : [12, 0];

  const utcDate = new Date(dateOfBirth);
  utcDate.setHours(hours - Math.floor(timezoneOffset), minutes, 0, 0);
  const jd = dateToJulianDay(utcDate);

  // Tropical positions (no ayanamsa for Western)
  const positions: Record<string, number> = {
    Sun: sunLongitude(jd),
    Moon: moonLongitude(jd),
    Mars: marsLongitude(jd),
    Mercury: mercuryLongitude(jd),
    Jupiter: jupiterLongitude(jd),
    Venus: venusLongitude(jd),
    Saturn: saturnLongitude(jd),
    'North Node': rahuLongitude(jd),
    'South Node': mod360(rahuLongitude(jd) + 180),
    Chiron: mod360(50.07 + 1.8 * (jd - 2451545) / 365.25), // simplified
    Lilith: mod360(83.35 + 40.66 * (jd - 2451545) / 365.25), // mean apogee
    'Part of Fortune': 0, // calculated below
  };

  const ascDegree = calculateAscendant(jd, latitude, longitude);
  const mcDegree = mod360(ascDegree + 90); // simplified MC

  // Part of Fortune = Asc + Moon - Sun
  positions['Part of Fortune'] = mod360(ascDegree + positions['Moon'] - positions['Sun']);

  const planets: Planet[] = Object.entries(positions).map(([name, lon]) => {
    const signIndex = Math.floor(lon / 30);
    const { nakshatra, pada, lord } = getNakshatra(lon);
    return {
      name, symbol: PLANET_SYMBOLS[name] || name[0], longitude: lon, latitude: 0,
      sign: SIGNS[signIndex], signIndex,
      house: Math.floor(mod360(signIndex - Math.floor(ascDegree / 30)) / 30) + 1,
      nakshatra, pada, lord,
      isRetrograde: false, isCombust: false, isExalted: false, isDebilitated: false,
      dignity: 'Neutral',
      degree: Math.floor(lon % 30), minute: 0, second: 0,
    };
  });

  const ascSign = Math.floor(ascDegree / 30);
  const houses: House[] = Array.from({ length: 12 }, (_, i) => {
    const houseSignIndex = (ascSign + i) % 12;
    return {
      number: i + 1,
      sign: SIGNS[houseSignIndex],
      lord: '',
      degree: ascDegree % 30,
      planets: planets.filter((p) => Math.floor(p.longitude / 30) === houseSignIndex).map((p) => p.name),
    };
  });

  const aspects = calculateAspects(planets);
  const elementBalance = getElementBalance(planets);
  const modalityBalance = getModalityBalance(planets);
  const chartShape = determineChartShape(planets);

  // Dominant element
  const dominantElement = Object.entries(elementBalance).sort((a, b) => b[1] - a[1])[0][0];

  // Chart ruler = ruler of ascendant sign
  const chartRulerMap = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Pluto', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];
  const chartRuler = chartRulerMap[ascSign];

  // Dominant planet (most aspects)
  const aspectCounts: Record<string, number> = {};
  aspects.forEach((a) => {
    aspectCounts[a.planet1] = (aspectCounts[a.planet1] || 0) + 1;
    aspectCounts[a.planet2] = (aspectCounts[a.planet2] || 0) + 1;
  });
  const dominantPlanet = Object.entries(aspectCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Sun';

  const northNodeLon = positions['North Node'];
  const northNodeSign = Math.floor(northNodeLon / 30);
  const southNodeLon = positions['South Node'];
  const southNodeSign = Math.floor(southNodeLon / 30);
  const chironLon = positions['Chiron'];
  const chironSign = Math.floor(chironLon / 30);
  const lilithLon = positions['Lilith'];
  const lilithSign = Math.floor(lilithLon / 30);
  const pofLon = positions['Part of Fortune'];
  const pofSign = Math.floor(pofLon / 30);

  return {
    system: 'WESTERN',
    ascendant: { sign: SIGNS[ascSign], degree: Math.floor(ascDegree % 30) },
    midheaven: { sign: SIGNS[Math.floor(mcDegree / 30)], degree: Math.floor(mcDegree % 30) },
    planets,
    houses,
    aspects,
    elementBalance,
    modalityBalance,
    chartShape,
    dominantPlanet,
    dominantElement,
    chartRuler,
    northNode: { sign: SIGNS[northNodeSign], house: Math.floor(mod360(northNodeSign - ascSign) / 30) + 1, degree: Math.floor(northNodeLon % 30) },
    southNode: { sign: SIGNS[southNodeSign], house: Math.floor(mod360(southNodeSign - ascSign) / 30) + 1, degree: Math.floor(southNodeLon % 30) },
    chiron: { sign: SIGNS[chironSign], house: Math.floor(mod360(chironSign - ascSign) / 30) + 1, degree: Math.floor(chironLon % 30) },
    lilith: { sign: SIGNS[lilithSign], house: Math.floor(mod360(lilithSign - ascSign) / 30) + 1, degree: Math.floor(lilithLon % 30) },
    partOfFortune: { sign: SIGNS[pofSign], house: Math.floor(mod360(pofSign - ascSign) / 30) + 1, degree: Math.floor(pofLon % 30) },
  };
}
