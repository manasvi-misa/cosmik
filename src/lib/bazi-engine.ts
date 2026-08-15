/**
 * Cosmik – BaZi (Four Pillars of Destiny) Calculation Engine
 * Implements traditional Chinese astrology calculations.
 */

import type { BaziData, BaziPillar, LuckPillar } from '@/types';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

export const HEAVENLY_STEMS = ['甲 Jiǎ', '乙 Yǐ', '丙 Bǐng', '丁 Dīng', '戊 Wù', '己 Jǐ', '庚 Gēng', '辛 Xīn', '壬 Rén', '癸 Guǐ'];
export const STEM_SHORT = ['Jiǎ', 'Yǐ', 'Bǐng', 'Dīng', 'Wù', 'Jǐ', 'Gēng', 'Xīn', 'Rén', 'Guǐ'];
export const STEM_ELEMENTS = ['Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth', 'Metal', 'Metal', 'Water', 'Water'];
export const STEM_POLARITY = ['+', '-', '+', '-', '+', '-', '+', '-', '+', '-'];

export const EARTHLY_BRANCHES = ['子 Zǐ', '丑 Chǒu', '寅 Yín', '卯 Mǎo', '辰 Chén', '巳 Sì', '午 Wǔ', '未 Wèi', '申 Shēn', '酉 Yǒu', '戌 Xū', '亥 Hài'];
export const BRANCH_SHORT = ['Zǐ', 'Chǒu', 'Yín', 'Mǎo', 'Chén', 'Sì', 'Wǔ', 'Wèi', 'Shēn', 'Yǒu', 'Xū', 'Hài'];
export const BRANCH_ELEMENTS = ['Water', 'Earth', 'Wood', 'Wood', 'Earth', 'Fire', 'Fire', 'Earth', 'Metal', 'Metal', 'Earth', 'Water'];
export const BRANCH_ANIMALS = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];

// Hidden stems in each branch
export const HIDDEN_STEMS: Record<number, number[]> = {
  0: [9],           // Zǐ: Guǐ
  1: [5, 9, 7],     // Chǒu: Jǐ, Guǐ, Xīn
  2: [0, 2, 6],     // Yín: Jiǎ, Bǐng, Wù
  3: [1],           // Mǎo: Yǐ
  4: [4, 1, 9],     // Chén: Wù, Yǐ, Guǐ
  5: [2, 6, 4],     // Sì: Bǐng, Wù, Gēng (approximation)
  6: [3, 5],        // Wǔ: Dīng, Jǐ
  7: [5, 3, 1],     // Wèi: Jǐ, Dīng, Yǐ
  8: [6, 8, 4],     // Shēn: Gēng, Rén, Wù
  9: [7],           // Yǒu: Xīn
  10: [4, 7, 3],    // Xū: Wù, Xīn, Dīng
  11: [8, 0],       // Hài: Rén, Jiǎ
};

export const NA_YIN = [
  'Sea Metal', 'Sea Metal', 'Furnace Fire', 'Furnace Fire', 'Forest Wood', 'Forest Wood',
  'Road Earth', 'Road Earth', 'Sword Metal', 'Sword Metal', 'Mountain Fire', 'Mountain Fire',
  'Mulberry Wood', 'Mulberry Wood', 'Sand Earth', 'Sand Earth', 'Swords Metal', 'Swords Metal',
  'Mountain Head Fire', 'Mountain Head Fire', 'Poplar Wood', 'Poplar Wood', 'White Wax Gold', 'White Wax Gold',
  'Flowing Water', 'Flowing Water', 'Firehouse Earth', 'Firehouse Earth', 'Thunder Fire', 'Thunder Fire',
  'Pine Wood', 'Pine Wood', 'City Earth', 'City Earth', 'Wax Metal', 'Wax Metal',
  'River Water', 'River Water', 'Sand Clay Earth', 'Sand Clay Earth', 'Pomegranate Wood', 'Pomegranate Wood',
  'Great Sea Water', 'Great Sea Water', 'Sand Metal', 'Sand Metal', 'Heaven Fire', 'Heaven Fire',
  'Willow Wood', 'Willow Wood', 'Well Water', 'Well Water', 'Big Earth', 'Big Earth',
  'Gold Foil Metal', 'Gold Foil Metal', 'Covering Lamp Fire', 'Covering Lamp Fire', 'Forest Wood', 'Forest Wood',
];

// ─── TEN GODS ─────────────────────────────────────────────────────────────────

const TEN_GODS_MAP: Record<string, Record<string, string>> = {
  Wood: {
    'Wood+': 'Friend (Bǐjiān)', 'Wood-': 'Rob Wealth (Jiécái)',
    'Fire+': 'Eating God (Shíshén)', 'Fire-': 'Hurting Officer (Shāngguān)',
    'Earth+': 'Indirect Wealth (Piāncái)', 'Earth-': 'Direct Wealth (Zhèngcái)',
    'Metal+': 'Indirect Officer (Qīshā)', 'Metal-': 'Direct Officer (Zhèngguān)',
    'Water+': 'Indirect Resource (Piānyin)', 'Water-': 'Direct Resource (Zhèngyìn)',
  },
  Fire: {
    'Fire+': 'Friend (Bǐjiān)', 'Fire-': 'Rob Wealth (Jiécái)',
    'Earth+': 'Eating God (Shíshén)', 'Earth-': 'Hurting Officer (Shāngguān)',
    'Metal+': 'Indirect Wealth (Piāncái)', 'Metal-': 'Direct Wealth (Zhèngcái)',
    'Water+': 'Indirect Officer (Qīshā)', 'Water-': 'Direct Officer (Zhèngguān)',
    'Wood+': 'Indirect Resource (Piānyin)', 'Wood-': 'Direct Resource (Zhèngyìn)',
  },
  Earth: {
    'Earth+': 'Friend (Bǐjiān)', 'Earth-': 'Rob Wealth (Jiécái)',
    'Metal+': 'Eating God (Shíshén)', 'Metal-': 'Hurting Officer (Shāngguān)',
    'Water+': 'Indirect Wealth (Piāncái)', 'Water-': 'Direct Wealth (Zhèngcái)',
    'Wood+': 'Indirect Officer (Qīshā)', 'Wood-': 'Direct Officer (Zhèngguān)',
    'Fire+': 'Indirect Resource (Piānyin)', 'Fire-': 'Direct Resource (Zhèngyìn)',
  },
  Metal: {
    'Metal+': 'Friend (Bǐjiān)', 'Metal-': 'Rob Wealth (Jiécái)',
    'Water+': 'Eating God (Shíshén)', 'Water-': 'Hurting Officer (Shāngguān)',
    'Wood+': 'Indirect Wealth (Piāncái)', 'Wood-': 'Direct Wealth (Zhèngcái)',
    'Fire+': 'Indirect Officer (Qīshā)', 'Fire-': 'Direct Officer (Zhèngguān)',
    'Earth+': 'Indirect Resource (Piānyin)', 'Earth-': 'Direct Resource (Zhèngyìn)',
  },
  Water: {
    'Water+': 'Friend (Bǐjiān)', 'Water-': 'Rob Wealth (Jiécái)',
    'Wood+': 'Eating God (Shíshén)', 'Wood-': 'Hurting Officer (Shāngguān)',
    'Fire+': 'Indirect Wealth (Piāncái)', 'Fire-': 'Direct Wealth (Zhèngcái)',
    'Earth+': 'Indirect Officer (Qīshā)', 'Earth-': 'Direct Officer (Zhèngguān)',
    'Metal+': 'Indirect Resource (Piānyin)', 'Metal-': 'Direct Resource (Zhèngyìn)',
  },
};

function getTenGod(dayMasterElement: string, stemIndex: number): string {
  const element = STEM_ELEMENTS[stemIndex];
  const polarity = STEM_POLARITY[stemIndex];
  return TEN_GODS_MAP[dayMasterElement]?.[`${element}${polarity}`] || 'Unknown';
}

// ─── VOID BRANCHES ────────────────────────────────────────────────────────────

const VOID_TABLE: Record<number, number[]> = {
  0: [10, 11], 2: [8, 9], 4: [6, 7], 6: [4, 5],
  8: [2, 3], 10: [0, 1], 1: [10, 11], 3: [8, 9],
  5: [6, 7], 7: [4, 5], 9: [2, 3], 11: [0, 1],
};

function isVoidBranch(stemIdx: number, branchIdx: number): boolean {
  const voids = VOID_TABLE[stemIdx] || [];
  return voids.includes(branchIdx);
}

// ─── SOLAR TERM MONTHS ────────────────────────────────────────────────────────

// Approximate solar term month starts (month stem index from year)
function getMonthStemBranch(year: Date, month: number): { stem: number; branch: number } {
  const yearStem = (year.getFullYear() - 4) % 10;
  // Month branch: starts at Yín (2) for the 1st solar month
  const monthBranch = (month + 1) % 12; // simplified
  // Month stem cycles based on year stem
  const monthStemBase = [0, 2, 4, 6, 8, 0, 2, 4, 6, 8][yearStem % 10];
  const monthStem = (monthStemBase + (month % 12) * 2) % 10;
  return { stem: monthStem, branch: monthBranch };
}

// ─── BAZI PILLAR BUILDER ──────────────────────────────────────────────────────

function buildPillar(stemIdx: number, branchIdx: number, dayMasterElement: string): BaziPillar {
  const comboCycleNum = stemIdx * 12 + branchIdx;
  const naYinIdx = Math.floor(comboCycleNum % 60 / 1);

  return {
    heavenlyStem: HEAVENLY_STEMS[stemIdx],
    earthlyBranch: EARTHLY_BRANCHES[branchIdx],
    hiddenStems: (HIDDEN_STEMS[branchIdx] || []).map((i) => STEM_SHORT[i]),
    tenGod: getTenGod(dayMasterElement, stemIdx),
    naYin: NA_YIN[comboCycleNum % 60] || 'Unknown',
    isVoid: isVoidBranch(stemIdx, branchIdx),
  };
}

// ─── MAIN BAZI CALCULATION ────────────────────────────────────────────────────

export function calculateBaziChart(dateOfBirth: Date, timeOfBirth: string, gender: string): BaziData {
  const year = dateOfBirth.getFullYear();
  const month = dateOfBirth.getMonth(); // 0-indexed
  const day = dateOfBirth.getDate();
  const [hours = 12] = timeOfBirth ? timeOfBirth.split(':').map(Number) : [12];

  // ── Year Pillar ──
  const yearStemIdx = (year - 4) % 10;
  const yearBranchIdx = (year - 4) % 12;

  // ── Month Pillar ──
  const { stem: monthStemIdx, branch: monthBranchIdx } = getMonthStemBranch(dateOfBirth, month);

  // ── Day Pillar ──
  // Day stem/branch from JD since a known reference
  const refJD = 2415021; // Jan 1, 1900 = Jiǎ-Zǐ cycle day
  const jd = Math.floor(Date.UTC(year, month, day) / 86400000) + 2440588;
  const dayNum = jd - refJD;
  const dayStemIdx = ((dayNum % 10) + 10) % 10;
  const dayBranchIdx = ((dayNum % 12) + 12) % 12;

  // ── Hour Pillar ──
  // Hour branch: 子 (Zǐ) = 23-1, 丑 (Chǒu) = 1-3, etc.
  const hourBranchIdx = Math.floor(((hours + 1) % 24) / 2);
  const hourStemBase = [0, 2, 4, 6, 8, 0, 2, 4, 6, 8][dayStemIdx];
  const hourStemIdx = (hourStemBase + hourBranchIdx) % 10;

  // Day Master element
  const dayMasterElement = STEM_ELEMENTS[dayStemIdx];

  const yearPillar = buildPillar(yearStemIdx, yearBranchIdx, dayMasterElement);
  const monthPillar = buildPillar(monthStemIdx, monthBranchIdx, dayMasterElement);
  const dayPillar = buildPillar(dayStemIdx, dayBranchIdx, dayMasterElement);
  const hourPillar = buildPillar(hourStemIdx, hourBranchIdx, dayMasterElement);

  // ── Five Element Balance ──
  const elementCounts: Record<string, number> = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
  [yearStemIdx, monthStemIdx, dayStemIdx, hourStemIdx].forEach((s) => {
    elementCounts[STEM_ELEMENTS[s]]++;
  });
  [yearBranchIdx, monthBranchIdx, dayBranchIdx, hourBranchIdx].forEach((b) => {
    elementCounts[BRANCH_ELEMENTS[b]]++;
    // Hidden stems
    (HIDDEN_STEMS[b] || []).forEach((hs) => {
      elementCounts[STEM_ELEMENTS[hs]] = (elementCounts[STEM_ELEMENTS[hs]] || 0) + 0.5;
    });
  });

  // ── Day Master Strength ──
  // Simplified: count supporting elements vs controlling
  const supportingElements: Record<string, string[]> = {
    Wood: ['Water', 'Wood'],
    Fire: ['Wood', 'Fire'],
    Earth: ['Fire', 'Earth'],
    Metal: ['Earth', 'Metal'],
    Water: ['Metal', 'Water'],
  };
  const weakenElements: Record<string, string[]> = {
    Wood: ['Metal', 'Earth'],
    Fire: ['Water', 'Metal'],
    Earth: ['Wood', 'Water'],
    Metal: ['Fire', 'Wood'],
    Water: ['Earth', 'Fire'],
  };

  const supportScore = supportingElements[dayMasterElement]
    .reduce((s, el) => s + (elementCounts[el] || 0), 0);
  const weakenScore = weakenElements[dayMasterElement]
    .reduce((s, el) => s + (elementCounts[el] || 0), 0);

  let strength: 'strong' | 'moderate' | 'weak' = 'moderate';
  if (supportScore > weakenScore + 2) strength = 'strong';
  else if (weakenScore > supportScore + 2) strength = 'weak';

  // ── Favorable / Unfavorable Elements ──
  const controllingElement: Record<string, string> = {
    Wood: 'Metal', Fire: 'Water', Earth: 'Wood', Metal: 'Fire', Water: 'Earth'
  };
  const producingElement: Record<string, string> = {
    Wood: 'Water', Fire: 'Wood', Earth: 'Fire', Metal: 'Earth', Water: 'Metal'
  };

  let favorableElements: string[];
  let unfavorableElements: string[];

  if (strength === 'weak') {
    favorableElements = [dayMasterElement, producingElement[dayMasterElement]];
    unfavorableElements = [controllingElement[dayMasterElement]];
  } else {
    favorableElements = [controllingElement[dayMasterElement]];
    unfavorableElements = [dayMasterElement, producingElement[dayMasterElement]];
  }

  // ── Luck Pillars (大运) ──
  // Direction: male Yang year or female Yin year = forward; else backward
  const yearPolarity = STEM_POLARITY[yearStemIdx];
  const isMale = gender === 'MALE';
  const isForward = (isMale && yearPolarity === '+') || (!isMale && yearPolarity === '-');

  // Find next major solar term
  // Simplified: use a fixed offset of ~3 days per year of age
  const startAge = calculateLuckPillarStartAge(day, month, isForward);

  const luckPillars: LuckPillar[] = Array.from({ length: 8 }, (_, i) => {
    const offset = isForward ? i + 1 : -(i + 1);
    const pillarIdx = ((monthStemIdx + offset * 2) % 10 + 10) % 10;
    const pillarBranchIdx = ((monthBranchIdx + offset) % 12 + 12) % 12;
    const pillarYear = year + startAge + i * 10;
    return {
      startAge: startAge + i * 10,
      endAge: startAge + (i + 1) * 10 - 1,
      startYear: pillarYear,
      heavenlyStem: HEAVENLY_STEMS[pillarIdx],
      earthlyBranch: EARTHLY_BRANCHES[pillarBranchIdx],
      tenGod: getTenGod(dayMasterElement, pillarIdx),
    };
  });

  const currentYear = new Date().getFullYear();
  const currentAge = currentYear - year;
  const currentLuck = luckPillars.find(
    (lp) => currentAge >= lp.startAge && currentAge < lp.endAge
  ) || luckPillars[0];

  // Annual luck pillars (next 10 years)
  const annualLuck = Array.from({ length: 10 }, (_, i) => {
    const annualYear = currentYear + i;
    const annualStemIdx = ((annualYear - 4) % 10 + 10) % 10;
    const annualBranchIdx = ((annualYear - 4) % 12 + 12) % 12;
    return buildPillar(annualStemIdx, annualBranchIdx, dayMasterElement);
  });

  return {
    system: 'BAZI',
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
    dayMaster: `${HEAVENLY_STEMS[dayStemIdx]} (${dayMasterElement})`,
    dayMasterStrength: strength,
    favorableElements,
    unfavorableElements,
    usefulGod: favorableElements[0],
    elementBalance: elementCounts,
    luckPillars,
    currentLuck,
    annualLuck,
  };
}

function calculateLuckPillarStartAge(day: number, month: number, isForward: boolean): number {
  // Simplified: count days to next/previous solar term, divide by 3
  // In reality this requires solar term tables
  const daysToTerm = isForward ? (30 - day) : day;
  return Math.max(1, Math.round(daysToTerm / 3));
}
