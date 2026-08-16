# Cosmik — Multi-System Astrology Web Application

A modern, production-ready astrology web application supporting **Vedic Jyotish**, **Western Natal**, and **Chinese BaZi (Four Pillars)** astrology systems.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + Custom CSS Variables |
| Database | PostgreSQL via Prisma ORM |
| Auth | NextAuth.js v5 (Auth.js) |
| Charts | Custom SVG (South Indian Vedic + Western Wheel) |
| Deployment | Docker + Docker Compose |
| Geocoding | OpenStreetMap Nominatim (free, no API key) |

## Features

### Vedic Jyotish
- 7 school presets (Parashara, KP, Jaimini, Nadi, Tajika, Lal Kitab, Bhrigu)
- 8 ayanamsas (Lahiri, Raman, Krishnamurti, Yukteswar, Fagan Bradley, True Chitra, Pushya Paksha)
- South Indian style SVG chart
- All 16 divisional charts (D1–D60)
- Full Vimshottari Dasha with Antardashas (9 Mahadashas × 9 Antardashas)
- Yoga detection: Gaja Kesari, Budhaditya, Pancha Mahapurusha, Raj Yoga, Dhana Yoga & more
- Dosha analysis: Manglik, Kaal Sarp, Guru Chandal, Pitru with remedies
- Ashtakavarga bindus per sign per planet
- Shadbala strength values
- Current transits (Gochar) overlay

### Western Natal
- 9 house systems (Placidus, Whole Sign, Equal, Porphyry, Campanus, Regiomontanus, Koch, Topocentric, Morinus)
- Interactive SVG wheel with color-coded aspect lines
- 11 aspect types (Conjunction, Opposition, Trine, Square, Sextile + minor)
- Element & modality balance
- Chart shape detection (Bundle, Bowl, Locomotive, Seesaw, Splash)
- North Node, Chiron, Lilith, Part of Fortune, Midheaven

### BaZi (Four Pillars)
- Year, Month, Day, Hour pillars with Heavenly Stems & Earthly Branches
- Hidden stems, Ten Gods, Na Yin, Void branches for each pillar
- Five Element balance with percentages
- Day Master strength analysis (Strong/Moderate/Weak)
- Favorable & unfavorable elements
- 8 × 10-year Luck Pillars (大运)
- Annual pillars for next 10 years (流年)
- Life recommendations

### Account & Dashboard
- 10 charts per account with slot counter
- Star/favorite charts
- Search & filter by name, city, system
- Admin panel with user stats & feature toggles

## 🛠 Local Setup

```bash
git clone https://github.com/yourusername/cosmik.git
cd cosmik
npm install
cp .env.example .env   # Configure DATABASE_URL and AUTH_SECRET

# Start PostgreSQL
docker run -d -e POSTGRES_PASSWORD=password -e POSTGRES_DB=cosmik -p 5432:5432 postgres:16-alpine

# Set up database
npx prisma db push
npx prisma db seed

# Run dev server
npm run dev
```

Open http://localhost:3000

**Demo:** `demo@cosmik.app` / `demo1234` | Admin: `admin@cosmik.app` / `admin123`

## Docker

```bash
cp .env.example .env   # Set AUTH_SECRET and NEXTAUTH_URL
docker compose up -d
docker compose exec app npx prisma db push
docker compose exec app npx prisma db seed
```

## Structure

```
src/
├── app/             # Next.js App Router (pages + API routes)
├── components/      # React components
│   └── charts/      # VedicChartView, WesternChartView, BaziChartView, SVG wheels
├── lib/             # Calculation engines + utilities
│   ├── vedic-engine.ts
│   ├── western-engine.ts
│   ├── bazi-engine.ts
│   ├── geocoding.ts
│   ├── auth.ts
│   └── prisma.ts
└── types/           # TypeScript types
```

## Roadmap
- Swiss Ephemeris for arc-second precision
- AI interpretations (Claude API)
- Kundli matching, Muhurta, Panchang
- PDF export, Synastry, Progressions
- Subscription plans, Payment gateway

---
*For educational and entertainment purposes. © Cosmik*
