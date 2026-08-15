export type AstrologySystem = 'VEDIC' | 'WESTERN' | 'BAZI';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type VedicSchool = 'PARASHARA' | 'KP' | 'JAIMINI' | 'NADI' | 'TAJIKA' | 'LAL_KITAB' | 'BHRIGU';
export type Ayanamsa = 'LAHIRI' | 'RAMAN' | 'KRISHNAMURTI' | 'YUKTESWAR' | 'FAGAN_BRADLEY' | 'TRUE_CHITRA' | 'PUSHYA_PAKSHA' | 'USER_DEFINED';
export type HouseSystem = 'PLACIDUS' | 'WHOLE_SIGN' | 'EQUAL' | 'PORPHYRY' | 'CAMPANUS' | 'REGIOMONTANUS' | 'KOCH' | 'TOPOCENTRIC' | 'MORINUS';

export interface BirthData {
  name: string;
  gender: Gender;
  dateOfBirth: string;
  timeOfBirth?: string;
  unknownTime: boolean;
  country: string;
  state?: string;
  city: string;
  latitude: number;
  longitude: number;
  timezone: string;
  notes?: string;
}

export interface BirthChart {
  id: string;
  userId: string;
  name: string;
  gender: Gender;
  dateOfBirth: Date;
  timeOfBirth?: string;
  unknownTime: boolean;
  country: string;
  state?: string;
  city: string;
  latitude: number;
  longitude: number;
  timezone: string;
  notes?: string;
  astrologySystem: AstrologySystem;
  vedicSchool?: string;
  ayanamsa?: string;
  houseSystem?: string;
  calculatedData?: VedicData | WesternData | BaziData;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastViewedAt?: Date;
}

// ─── VEDIC TYPES ──────────────────────────────────────────────────────────────

export interface Planet {
  name: string;
  symbol: string;
  longitude: number;
  latitude: number;
  sign: string;
  signIndex: number;
  house: number;
  nakshatra: string;
  pada: number;
  lord: string;
  isRetrograde: boolean;
  isCombust: boolean;
  isExalted: boolean;
  isDebilitated: boolean;
  dignity: string;
  degree: number;
  minute: number;
  second: number;
}

export interface House {
  number: number;
  sign: string;
  lord: string;
  degree: number;
  planets: string[];
}

export interface DashaPeriod {
  planet: string;
  startDate: Date;
  endDate: Date;
  level: 'maha' | 'antar' | 'pratyantar' | 'sookshma' | 'prana';
  subPeriods?: DashaPeriod[];
}

export interface AshtakavargaData {
  planet: string;
  scores: number[];
  total: number;
}

export interface Yoga {
  name: string;
  description: string;
  isPresent: boolean;
  planets: string[];
  strength: 'strong' | 'moderate' | 'weak';
}

export interface Dosha {
  name: string;
  isPresent: boolean;
  severity: 'high' | 'medium' | 'low' | 'none';
  description: string;
  remedies: string[];
}

export interface VedicData {
  system: 'VEDIC';
  ascendant: { sign: string; degree: number; nakshatra: string; pada: number };
  planets: Planet[];
  houses: House[];
  divisionalCharts: Record<string, { planets: Planet[]; houses: House[] }>;
  dashas: { vimshottari: DashaPeriod[]; yogini?: DashaPeriod[]; kalachakra?: DashaPeriod[] };
  ashtakavarga: AshtakavargaData[];
  yogas: Yoga[];
  doshas: Dosha[];
  shadbala: Record<string, number>;
  transits: Planet[];
}

// ─── WESTERN TYPES ────────────────────────────────────────────────────────────

export interface Aspect {
  planet1: string;
  planet2: string;
  type: string;
  orb: number;
  applying: boolean;
  strength: number;
}

export interface WesternData {
  system: 'WESTERN';
  ascendant: { sign: string; degree: number };
  midheaven: { sign: string; degree: number };
  planets: Planet[];
  houses: House[];
  aspects: Aspect[];
  elementBalance: Record<string, number>;
  modalityBalance: Record<string, number>;
  chartShape: string;
  dominantPlanet: string;
  dominantElement: string;
  chartRuler: string;
  northNode: { sign: string; house: number; degree: number };
  southNode: { sign: string; house: number; degree: number };
  chiron: { sign: string; house: number; degree: number };
  lilith: { sign: string; house: number; degree: number };
  partOfFortune: { sign: string; house: number; degree: number };
}

// ─── BAZI TYPES ───────────────────────────────────────────────────────────────

export interface BaziPillar {
  heavenlyStem: string;
  earthlyBranch: string;
  hiddenStems: string[];
  tenGod: string;
  naYin: string;
  isVoid: boolean;
}

export interface LuckPillar {
  startAge: number;
  endAge: number;
  startYear: number;
  heavenlyStem: string;
  earthlyBranch: string;
  tenGod: string;
}

export interface BaziData {
  system: 'BAZI';
  yearPillar: BaziPillar;
  monthPillar: BaziPillar;
  dayPillar: BaziPillar;
  hourPillar: BaziPillar;
  dayMaster: string;
  dayMasterStrength: 'strong' | 'moderate' | 'weak';
  favorableElements: string[];
  unfavorableElements: string[];
  usefulGod: string;
  elementBalance: Record<string, number>;
  luckPillars: LuckPillar[];
  currentLuck: LuckPillar;
  annualLuck: BaziPillar[];
}

// ─── UI TYPES ─────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name?: string;
  email: string;
  image?: string;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
  chartCount: number;
}

export interface LocationResult {
  name: string;
  country: string;
  state?: string;
  city: string;
  latitude: number;
  longitude: number;
  timezone: string;
  displayName: string;
}
