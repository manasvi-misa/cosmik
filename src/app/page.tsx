import Link from 'next/link';

export default function HomePage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--void)', position: 'relative', overflow: 'hidden' }}>
      {/* Background orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '10%', left: '15%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,70,229,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(8,145,178,0.05) 0%, transparent 60%)', filter: 'blur(80px)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 40px', borderBottom: '1px solid rgba(124,58,237,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>✦</div>
            <span className="font-display" style={{ fontSize: 22, fontWeight: 600, color: '#f1f0ff' }}>Cosmik</span>
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <Link href="/auth/login" style={{ color: '#a5b4fc', textDecoration: 'none', fontSize: 14 }}>Sign In</Link>
            <Link href="/auth/register" style={{ padding: '8px 20px', borderRadius: 10, background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: 'white', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Get Started</Link>
          </div>
        </nav>

        {/* Hero */}
        <section style={{ textAlign: 'center', padding: '100px 20px 80px', maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 20, marginBottom: 32, fontSize: 13, color: '#c4b5fd' }}>
            ✦ Vedic · Western · BaZi Astrology
          </div>
          <h1 className="font-display" style={{ fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 24, background: 'linear-gradient(135deg, #f1f0ff, #c4b5fd, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            The cosmos mapped,<br />for you alone.
          </h1>
          <p style={{ fontSize: 18, color: '#a5b4fc', maxWidth: 600, margin: '0 auto 48px', lineHeight: 1.7 }}>
            Generate precise birth charts across three ancient traditions. Explore Vedic Jyotish, Western natal charts, and Chinese BaZi with interpretations built for both beginners and professional astrologers.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth/register" style={{ padding: '14px 32px', borderRadius: 12, background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: 'white', textDecoration: 'none', fontSize: 16, fontWeight: 600, boxShadow: '0 8px 30px rgba(124,58,237,0.4)' }}>
              Create Your Chart Free →
            </Link>
            <Link href="/auth/login" style={{ padding: '14px 32px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(124,58,237,0.3)', color: '#f1f0ff', textDecoration: 'none', fontSize: 16 }}>
              Sign In
            </Link>
          </div>
        </section>

        {/* Features */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {[
              { icon: '🪐', title: 'Vedic Astrology', desc: 'Full Jyotish analysis: Rasi, all 16 divisional charts (D1–D60), Vimshottari & 5 other dasha systems, Ashtakavarga, Shadbala, 50+ yogas, and doshas.' },
              { icon: '⭐', title: 'Western Astrology', desc: 'Natal wheel charts with 9 house systems, aspects grid, solar/lunar returns, secondary progressions, synastry, and composite charts.' },
              { icon: '☯️', title: 'Chinese BaZi', desc: 'Four Pillars of Destiny with full Ten Gods analysis, Five Element balance, 10-year luck pillars, Day Master strength, and annual cycles.' },
              { icon: '📄', title: 'PDF Reports', desc: 'Download professional, beautifully formatted PDF reports including charts, tables, interpretations, and personalized analysis.' },
              { icon: '🔒', title: 'Save 10 Charts', desc: 'Each account stores up to 10 birth charts. Revisit, edit, compare, or delete anytime. Your cosmic library, always accessible.' },
              { icon: '🎨', title: 'Premium UI', desc: 'Interactive chart wheels, clickable planets with tooltips, dark/light mode, smooth animations, and full mobile responsiveness.' },
            ].map((f) => (
              <div key={f.title} className="glass-card" style={{ padding: 28 }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 10, color: '#f1f0ff' }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: '#a5b4fc', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ textAlign: 'center', padding: '80px 24px', borderTop: '1px solid rgba(124,58,237,0.1)' }}>
          <h2 className="font-display" style={{ fontSize: 36, marginBottom: 16, color: '#f1f0ff' }}>Begin your reading</h2>
          <p style={{ color: '#a5b4fc', marginBottom: 32 }}>Create an account and generate your first chart in under 2 minutes.</p>
          <Link href="/auth/register" style={{ padding: '14px 40px', borderRadius: 12, background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: 'white', textDecoration: 'none', fontSize: 16, fontWeight: 600 }}>
            Start Free →
          </Link>
        </section>

        <footer style={{ padding: '32px 40px', borderTop: '1px solid rgba(124,58,237,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <span className="font-display" style={{ color: '#6b7280', fontSize: 14 }}>✦ Cosmik</span>
          <span style={{ color: '#4b5563', fontSize: 13 }}>For educational and entertainment purposes. Not a substitute for professional advice.</span>
        </footer>
      </div>
    </main>
  );
}
