'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function set(k: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || 'Registration failed'); setLoading(false); return; }
    await signIn('credentials', { email: form.email, password: form.password, redirect: false });
    router.push('/dashboard');
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at 70% 30%, rgba(124,58,237,0.1) 0%, transparent 60%)', pointerEvents: 'none' }} />
      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 16px' }}>✦</div>
          <h1 className="font-display" style={{ fontSize: 28, color: '#f1f0ff', marginBottom: 6 }}>Create account</h1>
          <p style={{ color: '#a5b4fc', fontSize: 14 }}>Begin your cosmic journey today</p>
        </div>
        <div className="glass-card" style={{ padding: 32 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {error && (
              <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#fca5a5', fontSize: 14 }}>{error}</div>
            )}
            <div>
              <label className="cosmic-label">Full name</label>
              <input type="text" value={form.name} onChange={set('name')} className="cosmic-input" placeholder="Your name" required />
            </div>
            <div>
              <label className="cosmic-label">Email address</label>
              <input type="email" value={form.email} onChange={set('email')} className="cosmic-input" placeholder="you@example.com" required />
            </div>
            <div>
              <label className="cosmic-label">Password</label>
              <input type="password" value={form.password} onChange={set('password')} className="cosmic-input" placeholder="Min. 8 characters" required />
            </div>
            <div>
              <label className="cosmic-label">Confirm password</label>
              <input type="password" value={form.confirm} onChange={set('confirm')} className="cosmic-input" placeholder="Repeat password" required />
            </div>
            <button type="submit" disabled={loading} style={{ padding: '12px', borderRadius: 10, background: loading ? 'rgba(124,58,237,0.5)' : 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: 'white', border: 'none', fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 15px rgba(124,58,237,0.4)', marginTop: 4 }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
            <p style={{ fontSize: 12, color: '#6b7280', textAlign: 'center' }}>
              By creating an account you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>
        </div>
        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#6b7280' }}>
          Already have an account?{' '}
          <Link href="/auth/login" style={{ color: '#a5b4fc', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
