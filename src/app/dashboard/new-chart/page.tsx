'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { LocationResult } from '@/types';

const SYSTEMS = [
  { id: 'VEDIC', label: 'Vedic Jyotish', desc: 'Traditional Indian astrology with divisional charts, dashas, yogas, and doshas', icon: '🪐' },
  { id: 'WESTERN', label: 'Western Natal', desc: 'European astrology with zodiac wheel, aspects, house systems, and progressions', icon: '⭐' },
  { id: 'BAZI', label: 'BaZi / Four Pillars', desc: 'Chinese astrology with heavenly stems, earthly branches, and luck pillars', icon: '☯️' },
];

const VEDIC_SCHOOLS = ['Parashara', 'KP Astrology', 'Jaimini', 'Nadi', 'Tajika', 'Lal Kitab', 'Bhrigu'];
const AYANAMSAS = ['Lahiri', 'Raman', 'Krishnamurti', 'Yukteswar', 'Fagan Bradley', 'True Chitra', 'Pushya Paksha', 'User Defined'];
const HOUSE_SYSTEMS = ['Placidus', 'Whole Sign', 'Equal', 'Porphyry', 'Campanus', 'Regiomontanus', 'Koch', 'Topocentric', 'Morinus'];

const STEP_LABELS = ['System', 'Personal Info', 'Birth Details', 'Location', 'Review'];

export default function NewChartPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [locationResults, setLocationResults] = useState<LocationResult[]>([]);
  const [locationQuery, setLocationQuery] = useState('');
  const [showLocationDrop, setShowLocationDrop] = useState(false);
  const locationTimer = useRef<NodeJS.Timeout>();

  const [form, setForm] = useState({
    astrologySystem: '',
    vedicSchool: 'Parashara',
    ayanamsa: 'Lahiri',
    houseSystem: 'Placidus',
    name: '',
    gender: 'MALE',
    dateOfBirth: '',
    timeOfBirth: '',
    unknownTime: false,
    country: '',
    state: '',
    city: '',
    latitude: 0,
    longitude: 0,
    timezone: 'UTC+05:30',
    notes: '',
  });

  function setField(k: string, v: any) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function searchLocation(q: string) {
    if (q.length < 2) { setLocationResults([]); return; }
    const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setLocationResults(data.results || []);
    setShowLocationDrop(true);
  }

  function onLocationInput(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value;
    setLocationQuery(q);
    clearTimeout(locationTimer.current);
    locationTimer.current = setTimeout(() => searchLocation(q), 400);
  }

  function selectLocation(loc: LocationResult) {
    setLocationQuery(loc.city || loc.displayName);
    setField('city', loc.city);
    setField('country', loc.country);
    setField('state', loc.state || '');
    setField('latitude', loc.latitude);
    setField('longitude', loc.longitude);
    setField('timezone', loc.timezone);
    setShowLocationDrop(false);
    setLocationResults([]);
  }

  function canProceed() {
    if (step === 0) return !!form.astrologySystem;
    if (step === 1) return form.name.length >= 1 && form.gender;
    if (step === 2) return !!form.dateOfBirth;
    if (step === 3) return form.latitude !== 0 && form.city;
    return true;
  }

  async function submit() {
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        ...form,
        ayanamsa: form.ayanamsa?.toUpperCase().replace(/ /g, '_'),
        houseSystem: form.houseSystem?.toUpperCase().replace(/ /g, '_'),
        vedicSchool: form.vedicSchool?.toUpperCase().replace(/ /g, '_'),
      };
      const res = await fetch('/api/charts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to create chart'); return; }
      router.push(`/chart/${data.chart.id}`);
    } finally {
      setSubmitting(false);
    }
  }

  const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 10, padding: '10px 14px', color: '#f1f0ff', fontSize: 14, outline: 'none' };
  const labelStyle = { display: 'block', fontSize: 13, fontWeight: 500 as const, color: '#a5b4fc', marginBottom: 6 };
  const selectStyle = { ...inputStyle, cursor: 'pointer' };

  return (
    <div style={{ padding: '32px 40px', maxWidth: 700 }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <h1 className="font-display" style={{ fontSize: 26, color: '#f1f0ff', marginBottom: 6 }}>New Birth Chart</h1>
        <p style={{ color: '#6b7280', fontSize: 14 }}>Step {step + 1} of {STEP_LABELS.length}</p>
      </div>

      {/* Step indicator */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 40, alignItems: 'center' }}>
        {STEP_LABELS.map((label, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600,
              background: i < step ? 'linear-gradient(135deg, #7c3aed, #4f46e5)' : i === step ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.04)',
              border: i === step ? '1px solid rgba(124,58,237,0.6)' : '1px solid rgba(124,58,237,0.1)',
              color: i <= step ? '#f1f0ff' : '#4b5563',
              flexShrink: 0,
            }}>{i < step ? '✓' : i + 1}</div>
            <span style={{ fontSize: 12, color: i === step ? '#a5b4fc' : '#4b5563', display: i < 4 ? undefined : 'none' }}>{label}</span>
            {i < STEP_LABELS.length - 1 && <div style={{ width: 20, height: 1, background: i < step ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.05)' }} />}
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ padding: 32, minHeight: 340 }}>

        {/* Step 0 – System selection */}
        {step === 0 && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#f1f0ff', marginBottom: 20 }}>Choose Astrology System</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {SYSTEMS.map((s) => (
                <div key={s.id} onClick={() => setField('astrologySystem', s.id)} style={{
                  padding: '18px 20px', borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16,
                  background: form.astrologySystem === s.id ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.02)',
                  border: form.astrologySystem === s.id ? '1px solid rgba(124,58,237,0.5)' : '1px solid rgba(255,255,255,0.05)',
                  transition: 'all 0.15s',
                }}>
                  <span style={{ fontSize: 32 }}>{s.icon}</span>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#f1f0ff', marginBottom: 3 }}>{s.label}</div>
                    <div style={{ fontSize: 13, color: '#6b7280' }}>{s.desc}</div>
                  </div>
                  {form.astrologySystem === s.id && <span style={{ marginLeft: 'auto', color: '#7c3aed', fontSize: 20 }}>✓</span>}
                </div>
              ))}
            </div>

            {form.astrologySystem === 'VEDIC' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 20 }}>
                <div>
                  <label style={labelStyle}>Vedic School</label>
                  <select value={form.vedicSchool} onChange={(e) => setField('vedicSchool', e.target.value)} style={selectStyle}>
                    {VEDIC_SCHOOLS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Ayanamsa</label>
                  <select value={form.ayanamsa} onChange={(e) => setField('ayanamsa', e.target.value)} style={selectStyle}>
                    {AYANAMSAS.map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>
            )}

            {form.astrologySystem === 'WESTERN' && (
              <div style={{ marginTop: 20 }}>
                <label style={labelStyle}>House System</label>
                <select value={form.houseSystem} onChange={(e) => setField('houseSystem', e.target.value)} style={selectStyle}>
                  {HOUSE_SYSTEMS.map((h) => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Step 1 – Personal info */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#f1f0ff', marginBottom: 20 }}>Personal Information</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={labelStyle}>Full Name *</label>
                <input type="text" value={form.name} onChange={(e) => setField('name', e.target.value)} style={inputStyle} placeholder="e.g. Arjun Sharma" required />
              </div>
              <div>
                <label style={labelStyle}>Gender *</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {['MALE', 'FEMALE', 'OTHER'].map((g) => (
                    <button key={g} type="button" onClick={() => setField('gender', g)} style={{
                      flex: 1, padding: '10px', borderRadius: 10, border: form.gender === g ? '1px solid rgba(124,58,237,0.6)' : '1px solid rgba(255,255,255,0.06)',
                      background: form.gender === g ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.02)',
                      color: form.gender === g ? '#f1f0ff' : '#6b7280', cursor: 'pointer', fontSize: 13, fontWeight: 500,
                    }}>{g[0] + g.slice(1).toLowerCase()}</button>
                  ))}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Notes (optional)</label>
                <textarea value={form.notes} onChange={(e) => setField('notes', e.target.value)} style={{ ...inputStyle, minHeight: 80, resize: 'vertical' as const }} placeholder="Any additional notes about this chart..." />
              </div>
            </div>
          </div>
        )}

        {/* Step 2 – Birth date/time */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#f1f0ff', marginBottom: 20 }}>Birth Date & Time</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={labelStyle}>Date of Birth *</label>
                <input type="date" value={form.dateOfBirth} onChange={(e) => setField('dateOfBirth', e.target.value)} style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}>Time of Birth</label>
                <input type="time" value={form.timeOfBirth} onChange={(e) => setField('timeOfBirth', e.target.value)} style={{ ...inputStyle, opacity: form.unknownTime ? 0.4 : 1 }} disabled={form.unknownTime} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input type="checkbox" id="unknownTime" checked={form.unknownTime} onChange={(e) => { setField('unknownTime', e.target.checked); if (e.target.checked) setField('timeOfBirth', ''); }} style={{ width: 16, height: 16, accentColor: '#7c3aed' }} />
                <label htmlFor="unknownTime" style={{ fontSize: 13, color: '#a5b4fc', cursor: 'pointer' }}>Birth time unknown (will use 12:00 noon)</label>
              </div>
              {!form.unknownTime && (
                <div style={{ padding: '12px 16px', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 10, fontSize: 13, color: '#a5b4fc' }}>
                  💡 Accurate birth time gives more precise rising sign, house positions, and dasha calculations.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3 – Location */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#f1f0ff', marginBottom: 20 }}>Birth Location</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ position: 'relative' }}>
                <label style={labelStyle}>Search City *</label>
                <input type="text" value={locationQuery} onChange={onLocationInput} style={inputStyle} placeholder="Type city name..." autoComplete="off" />
                {showLocationDrop && locationResults.length > 0 && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100, background: '#110d2b', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 10, marginTop: 4, maxHeight: 220, overflowY: 'auto' }}>
                    {locationResults.map((loc, i) => (
                      <div key={i} onClick={() => selectLocation(loc)} style={{ padding: '10px 14px', cursor: 'pointer', fontSize: 13, color: '#f1f0ff', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(124,58,237,0.1)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}>
                        <div style={{ fontWeight: 500 }}>{loc.city || loc.displayName.split(',')[0]}</div>
                        <div style={{ color: '#6b7280', fontSize: 12, marginTop: 2 }}>{loc.displayName}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {form.latitude !== 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={labelStyle}>City</label>
                    <input type="text" value={form.city} onChange={(e) => setField('city', e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Country</label>
                    <input type="text" value={form.country} onChange={(e) => setField('country', e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Latitude</label>
                    <input type="number" step="0.0001" value={form.latitude} onChange={(e) => setField('latitude', parseFloat(e.target.value))} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Longitude</label>
                    <input type="number" step="0.0001" value={form.longitude} onChange={(e) => setField('longitude', parseFloat(e.target.value))} style={inputStyle} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Timezone</label>
                    <input type="text" value={form.timezone} onChange={(e) => setField('timezone', e.target.value)} style={inputStyle} placeholder="e.g. UTC+05:30" />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 4 – Review */}
        {step === 4 && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#f1f0ff', marginBottom: 20 }}>Review & Create</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                ['System', SYSTEMS.find((s) => s.id === form.astrologySystem)?.label || ''],
                ['Name', form.name],
                ['Gender', form.gender[0] + form.gender.slice(1).toLowerCase()],
                ['Date of Birth', form.dateOfBirth],
                ['Time of Birth', form.unknownTime ? 'Unknown (12:00 noon)' : form.timeOfBirth || '—'],
                ['City', form.city],
                ['Country', form.country],
                ['Timezone', form.timezone],
                ['Latitude', form.latitude.toFixed(4)],
                ['Longitude', form.longitude.toFixed(4)],
                ...(form.astrologySystem === 'VEDIC' ? [['School', form.vedicSchool], ['Ayanamsa', form.ayanamsa]] : []),
                ...(form.astrologySystem === 'WESTERN' ? [['House System', form.houseSystem]] : []),
              ].map(([k, v]) => (
                <div key={k} style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid rgba(124,58,237,0.1)' }}>
                  <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{k}</div>
                  <div style={{ fontSize: 14, color: '#f1f0ff', fontWeight: 500 }}>{v || '—'}</div>
                </div>
              ))}
            </div>
            {error && (
              <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#fca5a5', fontSize: 14 }}>{error}</div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
        <button onClick={() => step > 0 ? setStep((s) => s - 1) : router.push('/dashboard')}
          style={{ padding: '11px 24px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(124,58,237,0.2)', color: '#a5b4fc', fontSize: 14, cursor: 'pointer' }}>
          {step === 0 ? 'Cancel' : '← Back'}
        </button>
        {step < STEP_LABELS.length - 1 ? (
          <button onClick={() => canProceed() && setStep((s) => s + 1)} disabled={!canProceed()}
            style={{ padding: '11px 28px', borderRadius: 10, background: canProceed() ? 'linear-gradient(135deg, #7c3aed, #4f46e5)' : 'rgba(124,58,237,0.3)', color: 'white', border: 'none', fontSize: 14, fontWeight: 600, cursor: canProceed() ? 'pointer' : 'not-allowed', boxShadow: canProceed() ? '0 4px 15px rgba(124,58,237,0.4)' : 'none' }}>
            Next →
          </button>
        ) : (
          <button onClick={submit} disabled={submitting}
            style={{ padding: '11px 28px', borderRadius: 10, background: submitting ? 'rgba(124,58,237,0.4)' : 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: 'white', border: 'none', fontSize: 14, fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', boxShadow: '0 4px 15px rgba(124,58,237,0.4)' }}>
            {submitting ? 'Calculating...' : '✦ Generate Chart'}
          </button>
        )}
      </div>
    </div>
  );
}
