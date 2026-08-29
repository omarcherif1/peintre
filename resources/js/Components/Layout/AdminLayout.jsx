import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';

const navLinks = [
    { href: '/admin',           label: 'Tableau de bord', exact: true },
    { href: '/admin/tableaux',  label: 'Tableaux' },
    { href: '/admin/foires',    label: 'Foires' },
    { href: '/admin/cours',     label: 'Cours' },
    { href: '/admin/articles',  label: 'Articles / Blog' },
    { href: '/admin/presse',    label: 'Presse' },
];

export default function AdminLayout({ children }) {
    const { url } = usePage();
    const [open, setOpen] = useState(false);

    const isActive = (href, exact = false) => {
        if (exact) return url === href || url === href + '/';
        return url.startsWith(href);
    };

    const logout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    const sidebarContent = (
        <>
            {/* En-tête logo */}
            <div style={{ padding: '1.75rem 1.5rem 1.25rem', borderBottom: '1px solid #2a2520' }}>
                <p style={{ fontFamily: '"DM Mono", monospace', fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#D4AF37', marginBottom: '0.5rem' }}>
                    Espace artiste
                </p>
                <p style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '1.1rem', fontWeight: 400, color: '#F4EFEA', letterSpacing: '0.01em', lineHeight: 1.3 }}>
                    Chokri Benomrane
                </p>
                <div style={{ width: 32, height: 1, background: '#D4AF37', marginTop: '0.75rem' }} />
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, paddingTop: '0.75rem' }}>
                <p style={{ fontFamily: '"DM Mono", monospace', fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#F4EFEA', opacity: 0.25, padding: '0.5rem 1.5rem' }}>
                    Navigation
                </p>
                {navLinks.map(({ href, label, exact }) => {
                    const active = isActive(href, exact);
                    return (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setOpen(false)}
                            style={{
                                display: 'block',
                                padding: '0.7rem 1.5rem',
                                fontFamily: '"DM Mono", monospace',
                                fontSize: '0.72rem',
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                textDecoration: 'none',
                                color: active ? '#D4AF37' : 'rgba(244,239,234,0.5)',
                                background: active ? 'rgba(212,175,55,0.07)' : 'transparent',
                                borderLeft: active ? '2px solid #D4AF37' : '2px solid transparent',
                                transition: 'all 0.15s',
                            }}
                        >
                            {label}
                        </Link>
                    );
                })}
            </nav>

            {/* Pied de sidebar */}
            <div style={{ borderTop: '1px solid #2a2520', padding: '0.5rem 0' }}>
                <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'block', padding: '0.65rem 1.5rem', fontFamily: '"DM Mono", monospace', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(244,239,234,0.3)', textDecoration: 'none' }}
                >
                    ↗ Voir le site public
                </a>
                <button
                    onClick={logout}
                    style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.65rem 1.5rem', fontFamily: '"DM Mono", monospace', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#822623', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    Déconnexion
                </button>
            </div>
        </>
    );

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0706' }}>

            {/* ── Sidebar desktop ── */}
            <aside style={{
                width: 260, minWidth: 260,
                background: '#0A0706',
                borderRight: '1px solid #2a2520',
                display: 'flex', flexDirection: 'column',
                position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
            }}
                className="hidden md:flex"
            >
                {sidebarContent}
            </aside>

            {/* ── Overlay mobile ── */}
            {open && (
                <div
                    onClick={() => setOpen(false)}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 40 }}
                    className="md:hidden"
                />
            )}

            {/* ── Drawer mobile ── */}
            <aside
                className="md:hidden"
                style={{
                    position: 'fixed', top: 0, left: 0, height: '100vh',
                    width: 260, background: '#0A0706',
                    borderRight: '1px solid #2a2520',
                    display: 'flex', flexDirection: 'column',
                    zIndex: 50,
                    transform: open ? 'translateX(0)' : 'translateX(-100%)',
                    transition: 'transform 0.25s ease',
                    overflowY: 'auto',
                }}
            >
                {sidebarContent}
            </aside>

            {/* ── Contenu principal ── */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

                {/* Topbar mobile */}
                <div
                    className="md:hidden"
                    style={{
                        display: 'flex', alignItems: 'center', gap: '1rem',
                        padding: '1rem 1.25rem',
                        borderBottom: '1px solid #2a2520',
                        background: '#0A0706',
                        position: 'sticky', top: 0, zIndex: 30,
                    }}
                >
                    <button
                        onClick={() => setOpen(true)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#D4AF37', padding: 4 }}
                        aria-label="Ouvrir le menu"
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                            <line x1="3" y1="6" x2="21" y2="6"/>
                            <line x1="3" y1="12" x2="21" y2="12"/>
                            <line x1="3" y1="18" x2="21" y2="18"/>
                        </svg>
                    </button>
                    <p style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '1rem', color: '#F4EFEA', margin: 0 }}>
                        Chokri <span style={{ color: '#D4AF37' }}>Benomrane</span>
                    </p>
                </div>

                <main style={{ flex: 1, background: '#111009', padding: '2rem 1.25rem' }} className="md:p-10">
                    {children}
                </main>
            </div>
        </div>
    );
}
