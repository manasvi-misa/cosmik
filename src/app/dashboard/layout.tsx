'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: '◈' },
  { href: '/dashboard/new-chart', label: 'New Chart', icon: '✦' },
  { href: '/dashboard/charts', label: 'My Charts', icon: '◉' },
  { href: '/dashboard/settings', label: 'Settings', icon: '⚙' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login');
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid rgba(124,58,237,0.3)', borderTopColor: '#7c3aed', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#a5b4fc', fontSize: 14 }}>Loading Cosmik...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!session) return null;

  const isAdmin = (session.user as any)?.role === 'ADMIN';
  const navItems = isAdmin ? [...NAV, { href: '/admin', label: 'Admin', icon: '⚡' }] : NAV;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: 240, background: 'rgba(8,6,24,0.95)', borderRight: '1px solid rgba(124,58,237,0.15)',
        display: 'flex', flexDirection: 'column', position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 50,
        transform: sidebarOpen ? 'translateX(0)' : undefined,
        backdropFilter: 'blur(12px)',
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(124,58,237,0.1)' }}>
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>✦</div>
            <span className="font-display" style={{ fontSize: 20, color: '#f1f0ff', fontWeight: 600 }}>Cosmik</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10,
                textDecoration: 'none', fontSize: 14, fontWeight: active ? 600 : 400,
                color: active ? '#f1f0ff' : '#6b7280',
                background: active ? 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(79,70,229,0.15))' : 'transparent',
                border: active ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent',
                transition: 'all 0.15s',
              }}>
                <span style={{ fontSize: 16, opacity: active ? 1 : 0.6 }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User profile */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(124,58,237,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, marginBottom: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'white', flexShrink: 0 }}>
              {session.user?.name?.[0]?.toUpperCase() || session.user?.email?.[0]?.toUpperCase() || '?'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#f1f0ff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{session.user?.name || 'User'}</div>
              <div style={{ fontSize: 11, color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{session.user?.email}</div>
            </div>
          </div>
          <button onClick={() => signOut({ callbackUrl: '/' })} style={{ width: '100%', padding: '9px 12px', borderRadius: 10, background: 'transparent', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: 13, cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.background = 'rgba(239,68,68,0.1)'; }}
            onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.background = 'transparent'; }}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ marginLeft: 240, flex: 1, minHeight: '100vh', background: 'var(--void)' }}>
        <div style={{ position: 'fixed', top: 0, left: 240, right: 0, height: '100vh', pointerEvents: 'none', zIndex: 0 }}>
          <div style={{ position: 'absolute', top: '10%', right: '20%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      </main>

      <style>{`
        @media (max-width: 768px) {
          aside { transform: translateX(-100%); }
          main { margin-left: 0 !important; }
        }
      `}</style>
    </div>
  );
}
