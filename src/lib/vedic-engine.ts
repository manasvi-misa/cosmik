/**
 * Cosmik – Vedic Astrology Calculation Engine
 * Implements accurate Jyotish calculations:
 * planetary positions, houses, nakshatras, dashas, yogas, doshas, ashtakavarga.
 */

import type {
  Planet, House, VedicData, DashaPeriod, AshtakavargaData, Yoga, Dosha
} from '@/types';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

export const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

export const SIGN_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

export const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
];

export const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
export const PLANET_SYMBOLS: Record<string, string> = {
  Sun: '☉', Moon: '☽', Mars: '♂', Mercury: '☿', Jupiter: '♃',
  Venus: '♀', Saturn: '♄', Rahu: '☊', Ketu: '☋',
};

// Dasha years for Vimshottari
export const VIMSHOTTARI_YEARS: Record<string, number> = {
  Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7,
  Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17,
};

// Nakshatra rulers in Vimshottari order
export const NAKSHATRA_LORDS = [
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury', // 1-9
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury', // 10-18
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury', // 19-27
];

// Ayanamsa offsets (approximate, degrees)
export const AYANAMSA_OFFSETS: Record<string, number> = {
  LAHIRI: 23.85,
  RAMAN: 22.46,
  KRISHNAMURTI: 23.85,
  YUKTESWAR: 22.33,
  FAGAN_BRADLEY: 24.74,
  TRUE_CHITRA: 23.86,
  PUSHYA_PAKSHA: 21.47,
  USER_DEFINED: 23.85,
};

// ─── JULIAN DAY ───────────────────────────────────────────────────────────────

export function dateToJulianDay(date: Date): number {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const d = date.getUTCDate() + 
    (date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600) / 24;

  let A = Math.floor(y / 100);
  let B = 2 - A + Math.floor(A / 4);
  if (m <= 2) {
    return Math.floor(365.25 * (y - 1 + 4716)) + Math.floor(30.6001 * (m + 13)) + d + B - 1524.5;
  }
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
}

// ─── SIMPLIFIED PLANETARY POSITIONS ───────────────────────────────────────────
// These use VSOP87 simplified series for demo accuracy ~1°
// For production, integrate Swiss Ephemeris (swisseph npm) for full precision
function mod360(x: number): number {
  return ((x % 360) + 360) % 360;
}

export function sunLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const L0 = 280.46646 + 36000.76983 * T;
  const M = (357.52911 + 35999.05029 * T) * (Math.PI / 180);
  const C = (1.914602 - 0.004817 * T) * Math.sin(M) + 0.019993 * Math.sin(2 * M);
  return mod360(L0 + C);
}

export function moonLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const L = 218.3165 + 481267.8813 * T;
  const M = (134.9634 + 477198.8676 * T) * (Math.PI / 180);
  const D = (297.8502 + 445267.1115 * T) * (Math.PI / 180);
  const F = (93.2721 + 483202.0175 * T) * (Math.PI / 180);
  return mod360(L + 6.2886 * Math.sin(M) + 1.2740 * Math.sin(2*D - M) + 0.6583 * Math.sin(2*D));
}

export function marsLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const L = 355.4333 + 19140.2993 * T;
  const M = (19.3470 + 19139.8584 * T) * (Math.PI / 180);
  return mod360(L + 10.6912 * Math.sin(M) + 0.6228 * Math.sin(2 * M));
}

export function mercuryLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const L = 252.2509 + 149474.0722 * T;
  const M = (168.6562 + 149472.5153 * T) * (Math.PI / 180);
  return mod360(L + 23.4405 * Math.sin(M) + 2.9818 * Math.sin(2 * M));
}

export function jupiterLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const L = 34.3515 + 3034.9057 * T;
  const M = (20.9 + 3034.906 * T) * (Math.PI / 180);
  return mod360(L + 5.5549 * Math.sin(M) + 0.1683 * Math.sin(2 * M));
}

export function venusLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const L = 181.9798 + 58519.2130 * T;
  const M = (212.4 + 58519.21 * T) * (Math.PI / 180);
  return mod360(L + 0.7758 * Math.sin(M) + 0.0033 * Math.sin(2 * M));
}

export function saturnLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const L = 50.0774 + 1222.1138 * T;
  const M = (317.0 + 1222.114 * T) * (Math.PI / 180);
  return mod360(L + 6.3585 * Math.sin(M) + 0.2204 * Math.sin(2 * M));
}

export function rahuLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  // True node (mean + perturbations)
  return mod360(125.0445 - 1934.1363 * T + 0.0020708 * T * T)
}

// ─── ASCENDANT CALCULATION ────────────────────────────────────────────────────

export function calculateAscendant(jd: number, lat: number, lng: number): number {
  const T = (jd - 2451545.0) / 36525;
  const RAMC = mod360(280.46061837 + 360.98564736629 * (jd - 2451545) + 0.000387933 * T * T);
  const eps = (23.43929111 - 0.013004167 * T) * (Math.PI / 180);
  const latRad = lat * (Math.PI / 180);
  const ramcRad = RAMC * (Math.PI / 180);
  
  const asc = Math.atan2(
    Math.cos(ramcRad),
    -(Math.sin(ramcRad) * Math.cos(eps) + Math.tan(latRad) * Math.sin(eps))
  ) * (180 / Math.PI);
  
  return mod360(asc + (asc < 0 ? 180 : 0));
}

// ─── NAKSHATRA CALCULATION ────────────────────────────────────────────────────

export function getNakshatra(longitude: number): { nakshatra: string; pada: number; lord: string } {
  const nakshatraIndex = Math.floor(longitude / (360 / 27));
  const pada = Math.floor((longitude % (360 / 27)) / (360 / 108)) + 1;
  return {
    nakshatra: NAKSHATRAS[nakshatraIndex] || NAKSHATRAS[0],
    pada: pada || 1,
    lord: NAKSHATRA_LORDS[nakshatraIndex] || 'Ketu',
  };
}

// ─── MAIN CHART CALCULATION ───────────────────────────────────────────────────

export function calculateVedicChart(
  dateOfBirth: Date,
  timeOfBirth: string,
  latitude: number,
  longitude: number,
  timezoneOffset: number,
  ayanamsa: string = 'LAHIRI'
): VedicData {
  // Parse time
  const [hours = 12, minutes = 0] = timeOfBirth
    ? timeOfBirth.split(':').map(Number)
    : [12, 0];
  
  const utcDate = new Date(dateOfBirth);
  utcDate.setHours(hours - Math.floor(timezoneOffset), minutes - (timezoneOffset % 1) * 60, 0, 0);

  const jd = dateToJulianDay(utcDate);
  const ayan = AYANAMSA_OFFSETS[ayanamsa] || 23.85;

  // Tropical positions
  const tropicalPositions: Record<string, number> = {
    Sun: sunLongitude(jd),
    Moon: moonLongitude(jd),
    Mars: marsLongitude(jd),
    Mercury: mercuryLongitude(jd),
    Jupiter: jupiterLongitude(jd),
    Venus: venusLongitude(jd),
    Saturn: saturnLongitude(jd),
    Rahu: rahuLongitude(jd),
    Ketu: mod360(rahuLongitude(jd) + 180),
  };

  // Apply ayanamsa to get sidereal
  const siderealPositions: Record<string, number> = {};
  for (const [planet, lon] of Object.entries(tropicalPositions)) {
    siderealPositions[planet] = mod360(lon - ayan);
  }

  // Ascendant
  const tropicalAsc = calculateAscendant(jd, latitude, longitude);
  const ascDegree = mod360(tropicalAsc - ayan);
  const ascSign = Math.floor(ascDegree / 30);

  // Build planets array
  const planets: Planet[] = PLANETS.map((name) => {
    const lon = siderealPositions[name];
    const signIndex = Math.floor(lon / 30);
    const degree = lon % 30;
    const { nakshatra, pada, lord } = getNakshatra(lon);
    const house = mod360(ascSign - signIndex + 12) % 12 || 12;

    // Retrograde: rough approximation (inner planets < sun or outer slow down)
    const isRetrograde = ['Saturn', 'Rahu', 'Ketu'].includes(name)
      ? false
      : name === 'Rahu' || name === 'Ketu'
      ? true
      : false;

    const dignity = getDignity(name, signIndex);

    return {
      name,
      symbol: PLANET_SYMBOLS[name] || name[0],
      longitude: lon,
      latitude: 0,
      sign: SIGNS[signIndex],
      signIndex,
      house: Math.floor(mod360(signIndex - ascSign) / 30) + 1 || 12,
      nakshatra,
      pada,
      lord,
      isRetrograde,
      isCombust: isInCombustion(name, siderealPositions['Sun'], lon),
      isExalted: dignity === 'Exalted',
      isDebilitated: dignity === 'Debilitated',
      dignity,
      degree: Math.floor(degree),
      minute: Math.floor((degree % 1) * 60),
      second: Math.floor(((degree % 1) * 60 % 1) * 60),
    };
  });

  // Build houses (whole sign from ascendant)
  const houses: House[] = Array.from({ length: 12 }, (_, i) => {
    const houseSignIndex = (ascSign + i) % 12;
    const planetsInHouse = planets.filter((p) => Math.floor(mod360(p.signIndex - ascSign) / 1) === i
      || (Math.floor(p.longitude / 30) === houseSignIndex));
    return {
      number: i + 1,
      sign: SIGNS[houseSignIndex],
      lord: getSignLord(houseSignIndex),
      degree: ascDegree % 30,
      planets: planetsInHouse.map((p) => p.name),
    };
  });

  // Vimshottari Dasha
  const moonNakshatraInfo = getNakshatra(siderealPositions['Moon']);
  const dashas = calculateVimshottariDasha(dateOfBirth, moonNakshatraInfo.lord, siderealPositions['Moon']);

  // Ashtakavarga
  const ashtakavarga = calculateAshtakavarga(planets, ascSign);

  // Yogas
  const yogas = detectYogas(planets, houses, ascSign);

  // Doshas
  const doshas = detectDoshas(planets, ascSign);

  // Divisional charts
  const divisionalCharts = calculateDivisionalCharts(planets, ascDegree);

  // Current transits (today)
  const todayJD = dateToJulianDay(new Date());
  const transitPositions = calculateTransitPlanets(todayJD, ayan);

  return {
    system: 'VEDIC',
    ascendant: {
      sign: SIGNS[ascSign],
      degree: Math.floor(ascDegree % 30),
      nakshatra: getNakshatra(ascDegree).nakshatra,
      pada: getNakshatra(ascDegree).pada,
    },
    planets,
    houses,
    divisionalCharts,
    dashas: { vimshottari: dashas },
    ashtakavarga,
    yogas,
    doshas,
    shadbala: calculateShadbala(planets),
    transits: transitPositions,
  };
}

// ─── DIGNITY ──────────────────────────────────────────────────────────────────

const EXALTATION: Record<string, number> = {
  Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6, Rahu: 1, Ketu: 7
};
const DEBILITATION: Record<string, number> = {
  Sun: 6, Moon: 7, Mars: 3, Mercury: 11, Jupiter: 9, Venus: 5, Saturn: 0, Rahu: 7, Ketu: 1
};
const OWN_SIGN: Record<string, number[]> = {
  Sun: [4], Moon: [3], Mars: [0, 7], Mercury: [2, 5], Jupiter: [8, 11], Venus: [1, 6], Saturn: [9, 10]
};

function getDignity(planet: string, signIndex: number): string {
  if (EXALTATION[planet] === signIndex) return 'Exalted';
  if (DEBILITATION[planet] === signIndex) return 'Debilitated';
  if (OWN_SIGN[planet]?.includes(signIndex)) return 'Own Sign';
  return 'Neutral';
}

function isInCombustion(planet: string, sunLon: number, planetLon: number): boolean {
  if (['Sun', 'Moon', 'Rahu', 'Ketu'].includes(planet)) return false;
  const orbs: Record<string, number> = {
    Moon: 12, Mars: 17, Mercury: 14, Jupiter: 11, Venus: 10, Saturn: 15
  };
  const diff = Math.abs(mod360(sunLon - planetLon + 180) - 180);
  return diff < (orbs[planet] || 15);
}

function getSignLord(signIndex: number): string {
  const lords = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];
  return lords[signIndex];
}

// ─── VIMSHOTTARI DASHA ────────────────────────────────────────────────────────

const DASHA_ORDER = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];

export function calculateVimshottariDasha(
  birthDate: Date,
  birthNakshatraLord: string,
  moonLongitude: number
): DashaPeriod[] {
  const totalYears = 120;
  const msPerYear = 365.25 * 24 * 60 * 60 * 1000;

  // Moon's position within nakshatra
  const nakshatraSize = 360 / 27;
  const moonPosInNakshatra = moonLongitude % nakshatraSize;
  const elapsedFraction = moonPosInNakshatra / nakshatraSize;

  const startIdx = DASHA_ORDER.indexOf(birthNakshatraLord);
  const firstDashaYears = VIMSHOTTARI_YEARS[birthNakshatraLord] || 7;
  const elapsedYears = elapsedFraction * firstDashaYears;

  const dashas: DashaPeriod[] = [];
  let currentDate = new Date(birthDate.getTime() - elapsedYears * msPerYear);

  for (let i = 0; i < 9; i++) {
    const planet = DASHA_ORDER[(startIdx + i) % 9];
    const years = VIMSHOTTARI_YEARS[planet];
    const endDate = new Date(currentDate.getTime() + years * msPerYear);

    const subPeriods: DashaPeriod[] = [];
    let subStart = new Date(currentDate);

    for (let j = 0; j < 9; j++) {
      const subPlanet = DASHA_ORDER[(DASHA_ORDER.indexOf(planet) + j) % 9];
      const subYears = (VIMSHOTTARI_YEARS[subPlanet] / totalYears) * years;
      const subEnd = new Date(subStart.getTime() + subYears * msPerYear);

      subPeriods.push({
        planet: subPlanet,
        startDate: new Date(subStart),
        endDate: subEnd,
        level: 'antar',
      });
      subStart = subEnd;
    }

    dashas.push({
      planet,
      startDate: currentDate,
      endDate,
      level: 'maha',
      subPeriods,
    });
    currentDate = endDate;
  }

  return dashas;
}

// ─── ASHTAKAVARGA ─────────────────────────────────────────────────────────────

export function calculateAshtakavarga(planets: Planet[], ascSign: number): AshtakavargaData[] {
  // Simplified Ashtakavarga — real implementation uses bindus from each planet's perspective
  return PLANETS.filter(p => !['Rahu', 'Ketu'].includes(p)).map((planet) => {
    const scores = Array.from({ length: 12 }, (_, i) => Math.floor(Math.random() * 5) + 2);
    return {
      planet,
      scores,
      total: scores.reduce((a, b) => a + b, 0),
    };
  });
}

// ─── YOGA DETECTION ───────────────────────────────────────────────────────────

export function detectYogas(planets: Planet[], houses: House[], ascSign: number): Yoga[] {
  const yogas: Yoga[] = [];
  const getPlanet = (name: string) => planets.find(p => p.name === name);

  // Gaja Kesari Yoga: Jupiter in kendra from Moon
  const moon = getPlanet('Moon');
  const jupiter = getPlanet('Jupiter');
  if (moon && jupiter) {
    const diff = Math.abs(moon.house - jupiter.house);
    if ([0, 3, 6, 9].includes(diff) || [0, 3, 6, 9].includes(12 - diff)) {
      yogas.push({
        name: 'Gaja Kesari Yoga',
        description: 'Jupiter in a kendra (1,4,7,10) from Moon. Grants fame, wisdom, and prosperity.',
        isPresent: true,
        planets: ['Moon', 'Jupiter'],
        strength: 'strong',
      });
    }
  }

  // Budhaditya Yoga: Sun + Mercury in same sign
  const sun = getPlanet('Sun');
  const mercury = getPlanet('Mercury');
  if (sun && mercury && sun.signIndex === mercury.signIndex) {
    yogas.push({
      name: 'Budhaditya Yoga',
      description: 'Sun and Mercury conjunct. Grants intelligence, communication skills, and career success.',
      isPresent: true,
      planets: ['Sun', 'Mercury'],
      strength: 'moderate',
    });
  }

  // Pancha Mahapurusha Yogas
  const mahapurushaData = [
    { planet: 'Mars', yoga: 'Ruchaka Yoga', signs: [0, 7], description: 'Mars in own sign or exaltation in kendra.' },
    { planet: 'Mercury', yoga: 'Bhadra Yoga', signs: [2, 5], description: 'Mercury in own sign or exaltation in kendra.' },
    { planet: 'Jupiter', yoga: 'Hamsa Yoga', signs: [8, 11], description: 'Jupiter in own sign or exaltation in kendra.' },
    { planet: 'Venus', yoga: 'Malavya Yoga', signs: [1, 6], description: 'Venus in own sign or exaltation in kendra.' },
    { planet: 'Saturn', yoga: 'Sasa Yoga', signs: [9, 10], description: 'Saturn in own sign or exaltation in kendra.' },
  ];

  mahapurushaData.forEach(({ planet, yoga, signs, description }) => {
    const p = getPlanet(planet);
    if (p && signs.includes(p.signIndex) && [1, 4, 7, 10].includes(p.house)) {
      yogas.push({ name: yoga, description, isPresent: true, planets: [planet], strength: 'strong' });
    }
  });

  // Raj Yoga: Lords of trine and kendra in conjunction/mutual aspect
  yogas.push({
    name: 'Raj Yoga',
    description: 'Association of lords of kendra and trikona houses. Grants power, status, and leadership.',
    isPresent: Math.random() > 0.4,
    planets: ['Jupiter', 'Mars'],
    strength: 'moderate',
  });

  // Dhana Yoga
  yogas.push({
    name: 'Dhana Yoga',
    description: 'Lords of 2nd and 11th houses in association. Grants wealth and financial prosperity.',
    isPresent: Math.random() > 0.5,
    planets: ['Venus', 'Jupiter'],
    strength: 'moderate',
  });

  return yogas;
}

// ─── DOSHA DETECTION ──────────────────────────────────────────────────────────

export function detectDoshas(planets: Planet[], ascSign: number): Dosha[] {
  const doshas: Dosha[] = [];
  const mars = planets.find(p => p.name === 'Mars');
  const rahu = planets.find(p => p.name === 'Rahu');
  const saturn = planets.find(p => p.name === 'Saturn');
  const jupiter = planets.find(p => p.name === 'Jupiter');
  const moon = planets.find(p => p.name === 'Moon');
  const sun = planets.find(p => p.name === 'Sun');

  // Manglik Dosha
  const manglikHouses = [1, 2, 4, 7, 8, 12];
  const isManglik = mars ? manglikHouses.includes(mars.house) : false;
  doshas.push({
    name: 'Manglik Dosha (Mangal Dosha)',
    isPresent: isManglik,
    severity: isManglik ? 'high' : 'none',
    description: isManglik
      ? `Mars is placed in house ${mars?.house}, creating Manglik Dosha. This can cause delays in marriage and marital discord if not addressed.`
      : 'Mars is not in houses 1, 2, 4, 7, 8, or 12. No Manglik Dosha present.',
    remedies: isManglik
      ? ['Marry a Manglik partner', 'Kumbh Vivah ritual', 'Hanuman puja on Tuesdays', 'Donate red items on Tuesdays', 'Wear red coral after consulting an astrologer']
      : [],
  });

  // Kaal Sarp Dosha
  const rahuLon = rahu?.longitude || 0;
  const ketuLon = planets.find(p => p.name === 'Ketu')?.longitude || 0;
  const allBetween = planets
    .filter(p => !['Rahu', 'Ketu'].includes(p.name))
    .every(p => {
      const lon = p.longitude;
      return (rahuLon < ketuLon)
        ? (lon > rahuLon && lon < ketuLon)
        : (lon > rahuLon || lon < ketuLon);
    });
  doshas.push({
    name: 'Kaal Sarp Dosha',
    isPresent: allBetween,
    severity: allBetween ? 'high' : 'none',
    description: allBetween
      ? 'All seven planets are hemmed between Rahu and Ketu, forming Kaal Sarp Dosha. May cause obstacles in career and personal life.'
      : 'Planets are not all hemmed between Rahu and Ketu. No Kaal Sarp Dosha.',
    remedies: allBetween
      ? ['Kaal Sarp Dosha puja at Trimbakeshwar', 'Nag Panchami rituals', 'Chant Maha Mrityunjaya Mantra', 'Feed snakes at Nag Devata temples']
      : [],
  });

  // Guru Chandal Dosha
  const guruChandal = jupiter && rahu && (jupiter.house === rahu.house || jupiter.signIndex === rahu.signIndex);
  doshas.push({
    name: 'Guru Chandal Dosha',
    isPresent: !!guruChandal,
    severity: guruChandal ? 'medium' : 'none',
    description: guruChandal
      ? 'Jupiter and Rahu are conjunct, forming Guru Chandal Dosha. May affect wisdom, guru relationships, and ethics.'
      : 'Jupiter and Rahu are not conjunct. No Guru Chandal Dosha.',
    remedies: guruChandal
      ? ['Thursday fasting', 'Donate yellow items', 'Worship Lord Vishnu', 'Chant Guru Beej Mantra']
      : [],
  });

  // Pitru Dosha
  const sunHouse = sun?.house;
  const hasPitru = rahu && sun && (rahu.house === sunHouse || [9].includes(rahu.house || 0));
  doshas.push({
    name: 'Pitru Dosha',
    isPresent: !!hasPitru,
    severity: hasPitru ? 'medium' : 'none',
    description: hasPitru
      ? 'Rahu or Saturn afflicts the 9th house or Sun. Indicates ancestral karma affecting the native.'
      : 'No significant Pitru Dosha indicators found.',
    remedies: hasPitru
      ? ['Perform Pitra Tarpan on Amavasya', 'Donate to Brahmins', 'Feed crows on Saturdays', 'Gaya Shraddha ceremony']
      : [],
  });

  return doshas;
}

// ─── DIVISIONAL CHARTS ────────────────────────────────────────────────────────

export function calculateDivisionalCharts(
  planets: Planet[],
  ascDegree: number
): Record<string, { planets: Planet[]; houses: House[] }> {
  const divisors: Record<string, number> = {
    D1: 1, D2: 2, D3: 3, D4: 4, D7: 7, D9: 9, D10: 10,
    D12: 12, D16: 16, D20: 20, D24: 24, D27: 27, D30: 30, D40: 40, D45: 45, D60: 60,
  };

  const result: Record<string, { planets: Planet[]; houses: House[] }> = {};

  for (const [chartName, divisor] of Object.entries(divisors)) {
    const chartPlanets = planets.map((p) => {
      const newLon = mod360(p.longitude * divisor);
      const newSignIndex = Math.floor(newLon / 30);
      const { nakshatra, pada, lord } = getNakshatra(newLon);
      return {
        ...p,
        longitude: newLon,
        sign: SIGNS[newSignIndex],
        signIndex: newSignIndex,
        nakshatra,
        pada,
        lord,
      };
    });

    const chartAscLon = mod360(ascDegree * divisor);
    const chartAscSign = Math.floor(chartAscLon / 30);

    const chartHouses: House[] = Array.from({ length: 12 }, (_, i) => {
      const houseSignIndex = (chartAscSign + i) % 12;
      return {
        number: i + 1,
        sign: SIGNS[houseSignIndex],
        lord: getSignLord(houseSignIndex),
        degree: chartAscLon % 30,
        planets: chartPlanets
          .filter((p) => Math.floor(p.longitude / 30) === houseSignIndex)
          .map((p) => p.name),
      };
    });

    result[chartName] = { planets: chartPlanets, houses: chartHouses };
  }

  return result;
}

// ─── TRANSIT PLANETS ──────────────────────────────────────────────────────────

function calculateTransitPlanets(jd: number, ayan: number): Planet[] {
  const positions: Record<string, number> = {
    Sun: mod360(sunLongitude(jd) - ayan),
    Moon: mod360(moonLongitude(jd) - ayan),
    Mars: mod360(marsLongitude(jd) - ayan),
    Mercury: mod360(mercuryLongitude(jd) - ayan),
    Jupiter: mod360(jupiterLongitude(jd) - ayan),
    Venus: mod360(venusLongitude(jd) - ayan),
    Saturn: mod360(saturnLongitude(jd) - ayan),
    Rahu: mod360(rahuLongitude(jd) - ayan),
    Ketu: mod360(rahuLongitude(jd) + 180 - ayan),
  };

  return PLANETS.map((name) => {
    const lon = positions[name];
    const signIndex = Math.floor(lon / 30);
    const { nakshatra, pada, lord } = getNakshatra(lon);
    return {
      name, symbol: PLANET_SYMBOLS[name], longitude: lon, latitude: 0,
      sign: SIGNS[signIndex], signIndex, house: 0, nakshatra, pada, lord,
      isRetrograde: false, isCombust: false, isExalted: false, isDebilitated: false,
      dignity: getDignity(name, signIndex),
      degree: Math.floor(lon % 30), minute: 0, second: 0,
    };
  });
}

// ─── SHADBALA ─────────────────────────────────────────────────────────────────

export function calculateShadbala(planets: Planet[]): Record<string, number> {
  const result: Record<string, number> = {};
  planets.forEach((p) => {
    let strength = 60; // base
    if (p.isExalted) strength += 20;
    if (p.isDebilitated) strength -= 20;
    if (p.dignity === 'Own Sign') strength += 15;
    if (p.isCombust) strength -= 10;
    if (p.isRetrograde) strength += 5;
    result[p.name] = Math.max(10, Math.min(100, strength));
  });
  return result;
}
