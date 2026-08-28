import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useLanguage } from '@/contexts/LanguageContext';

const NAV_KEYS = [
    { name: 'accueil',     href: '/' },
    { name: 'artiste',     href: '/artiste' },
    { name: 'oeuvres',     href: '/oeuvres' },
    { name: 'expositions', href: '/expositions' },
    { name: 'ateliers',    href: '/ateliers' },
    { name: 'presse',      href: '/presse' },
    { name: 'blog',        href: '/blog' },
    { name: 'contact',     href: '/contact' },
];

const BOTTOM_NAV_KEYS = [
    { name: 'accueil',  href: '/',         icon: HomeIcon },
    { name: 'oeuvres',  href: '/oeuvres',  icon: GridIcon },
    { name: 'ateliers', href: '/ateliers', icon: BrushIcon },
    { name: 'contact',  href: '/contact',  icon: MailIcon },
];

export default function PublicLayout({ children }) {
    return <Layout>{children}</Layout>;
}

function Layout({ children }) {
    const { url } = usePage();
    const { lang, toggle, t } = useLanguage();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const isActive = (href) => {
        if (href === '/') return url === '/' || url === '';
        return url.startsWith(href);
    };

    return (
        <div className="min-h-screen bg-background text-on-surface">

            {/* ── Navbar fixe ── */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-primary/20 h-16">
                <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop h-full flex items-center justify-between">

                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                    >
                        <img
                            src="/assets/logo.png"
                            alt="Logo"
                            className="h-10 w-auto object-contain"
                            style={{ mixBlendMode: 'screen' }}
                        />
                        <span className="font-headline-lg text-xl tracking-wide" style={{ color: '#C8A84C' }}>
                            Chokri Benomrane
                        </span>
                    </Link>

                    {/* Liens desktop */}
                    <ul className="hidden md:flex items-center gap-8">
                        {NAV_KEYS.map(({ href, name }) => (
                            <li key={href}>
                                <Link
                                    href={href}
                                    className={[
                                        'font-label-technical text-label-technical uppercase tracking-widest transition-colors duration-200',
                                        isActive(href)
                                            ? 'text-primary'
                                            : 'text-on-surface/60 hover:text-on-surface',
                                    ].join(' ')}
                                >
                                    {t('nav', name)}
                                    {isActive(href) && (
                                        <span className="block h-px bg-primary mt-0.5" />
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Bouton langue + hamburger */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggle}
                            className="font-label-technical text-label-technical uppercase tracking-widest transition-colors duration-200 text-on-surface/50 hover:text-primary border border-on-surface/20 hover:border-primary px-2.5 py-1 text-xs"
                        >
                            {lang === 'fr' ? 'EN' : 'FR'}
                        </button>
                        <button
                            className="md:hidden text-on-surface p-2"
                            onClick={() => setDrawerOpen(true)}
                            aria-label="Ouvrir le menu"
                        >
                            <HamburgerIcon />
                        </button>
                    </div>
                </div>
            </nav>

            {/* ── Drawer mobile ── */}
            {drawerOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40 bg-black/70"
                        onClick={() => setDrawerOpen(false)}
                    />
                    <div className="fixed top-0 right-0 bottom-0 z-50 w-72 flex flex-col pt-6 pb-8 px-8 shadow-2xl" style={{ backgroundImage: 'radial-gradient(circle, #7a353f 0%, #2b1116 100%)' }}>
                        <button
                            onClick={() => setDrawerOpen(false)}
                            className="self-end text-on-surface/60 hover:text-on-surface transition-colors mb-10 p-1"
                            aria-label="Fermer"
                        >
                            <CloseIcon />
                        </button>

                        <nav className="flex flex-col gap-1">
                            {NAV_KEYS.map(({ href, name }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={() => setDrawerOpen(false)}
                                    className={[
                                        'py-3 border-b border-on-surface/10 font-label-technical text-label-technical uppercase tracking-widest transition-colors',
                                        isActive(href) ? 'text-primary' : 'text-on-surface/70 hover:text-on-surface',
                                    ].join(' ')}
                                >
                                    {t('nav', name)}
                                </Link>
                            ))}
                        </nav>

                        <div className="mt-auto">
                            <p className="font-label-technical text-label-technical text-on-surface/30 uppercase tracking-widest">
                                {lang === 'fr' ? 'Peintre tunisien' : 'Tunisian painter'}
                            </p>
                        </div>
                    </div>
                </>
            )}

            {/* ── Contenu principal ── */}
            <main className="pt-16 pb-16 md:pb-0">
                {children}
            </main>

            {/* ── Footer ── */}
            <footer className="border-t border-primary" style={{ backgroundImage: 'radial-gradient(circle, #7a353f 0%, #2b1116 100%)' }}>
                <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-10">
                    <div className="mb-6">
                        {/* Identité */}
                        <div>
                            <p className="font-headline-lg text-2xl text-primary mb-3">Chokri Benomrane</p>
                            <p className="font-body-md text-sm text-on-surface/50 leading-relaxed">
                                {t('footer', 'tagline')}
                            </p>
                        </div>
                    </div>

                    {/* Ligne du bas */}
                    <div className="border-t border-on-surface/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
                        <p className="font-label-technical text-label-technical text-on-surface/30 uppercase tracking-widest">
                            © {new Date().getFullYear()} Chokri Benomrane. {t('footer', 'rights')}
                        </p>
                        <p className="font-label-technical text-label-technical text-on-surface/20 uppercase tracking-widest">
                            {t('footer', 'crafted')}
                        </p>
                    </div>
                </div>
            </footer>

        </div>
    );
}

/* ── Icônes SVG ── */

function HamburgerIcon() {
    return (
        <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
            <line x1="0" y1="1"  x2="22" y2="1"  stroke="currentColor" strokeWidth="1.5"/>
            <line x1="0" y1="8"  x2="22" y2="8"  stroke="currentColor" strokeWidth="1.5"/>
            <line x1="0" y1="15" x2="22" y2="15" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
    );
}

function CloseIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <line x1="1" y1="1"  x2="19" y2="19" stroke="currentColor" strokeWidth="1.5"/>
            <line x1="19" y1="1" x2="1"  y2="19" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
    );
}

function HomeIcon({ active }) {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M1 7L9 1L17 7V17H12V12H6V17H1V7Z" stroke="currentColor" strokeWidth={active ? 1.8 : 1.2} fill="none"/>
        </svg>
    );
}

function GridIcon({ active }) {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="1" y="1" width="6" height="6" stroke="currentColor" strokeWidth={active ? 1.8 : 1.2}/>
            <rect x="11" y="1" width="6" height="6" stroke="currentColor" strokeWidth={active ? 1.8 : 1.2}/>
            <rect x="1" y="11" width="6" height="6" stroke="currentColor" strokeWidth={active ? 1.8 : 1.2}/>
            <rect x="11" y="11" width="6" height="6" stroke="currentColor" strokeWidth={active ? 1.8 : 1.2}/>
        </svg>
    );
}

function BrushIcon({ active }) {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3 15C5 13 8 10 12 4L14 6C8 10 5 13 3 15Z" stroke="currentColor" strokeWidth={active ? 1.8 : 1.2} fill="none"/>
            <circle cx="3" cy="15" r="2" stroke="currentColor" strokeWidth={active ? 1.8 : 1.2} fill="none"/>
        </svg>
    );
}

function MailIcon({ active }) {
    return (
        <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
            <rect x="1" y="1" width="16" height="14" stroke="currentColor" strokeWidth={active ? 1.8 : 1.2}/>
            <path d="M1 1L9 9L17 1" stroke="currentColor" strokeWidth={active ? 1.8 : 1.2}/>
        </svg>
    );
}
