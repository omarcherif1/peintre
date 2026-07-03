import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

const NAV_LINKS = [
    { name: 'accueil',     href: '/',            label: 'Accueil' },
    { name: 'artiste',     href: '/artiste',      label: "L'Artiste" },
    { name: 'oeuvres',     href: '/oeuvres',      label: 'Galerie' },
    { name: 'expositions', href: '/expositions',  label: 'Expositions' },
    { name: 'presse',      href: '/presse',       label: 'Presse' },
    { name: 'ateliers',    href: '/ateliers',     label: 'Ateliers' },
    { name: 'blog',        href: '/blog',         label: 'Chroniques' },
    { name: 'contact',     href: '/contact',      label: 'Contact' },
];

const BOTTOM_LINKS = [
    { name: 'accueil', href: '/',         label: 'Accueil',  icon: HomeIcon },
    { name: 'oeuvres',  href: '/oeuvres',  label: 'Galerie',  icon: GridIcon },
    { name: 'ateliers',href: '/ateliers', label: 'Ateliers', icon: BrushIcon },
    { name: 'contact', href: '/contact',  label: 'Contact',  icon: MailIcon },
];

export default function PublicLayout({ children }) {
    const { url } = usePage();
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
                        className="font-headline-lg text-xl text-primary tracking-wide hover:text-primary/80 transition-colors"
                    >
                        Chokri Benomrane
                    </Link>

                    {/* Liens desktop */}
                    <ul className="hidden md:flex items-center gap-8">
                        {NAV_LINKS.map(({ href, label }) => (
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
                                    {label}
                                    {isActive(href) && (
                                        <span className="block h-px bg-primary mt-0.5" />
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Hamburger mobile */}
                    <button
                        className="md:hidden text-on-surface p-2"
                        onClick={() => setDrawerOpen(true)}
                        aria-label="Ouvrir le menu"
                    >
                        <HamburgerIcon />
                    </button>
                </div>
            </nav>

            {/* ── Drawer mobile ── */}
            {drawerOpen && (
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 z-40 bg-black/70"
                        onClick={() => setDrawerOpen(false)}
                    />
                    {/* Panneau */}
                    <div className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-surface flex flex-col pt-6 pb-8 px-8 shadow-2xl">
                        <button
                            onClick={() => setDrawerOpen(false)}
                            className="self-end text-on-surface/60 hover:text-on-surface transition-colors mb-10 p-1"
                            aria-label="Fermer"
                        >
                            <CloseIcon />
                        </button>

                        <nav className="flex flex-col gap-1">
                            {NAV_LINKS.map(({ href, label }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={() => setDrawerOpen(false)}
                                    className={[
                                        'py-3 border-b border-on-surface/10 font-label-technical text-label-technical uppercase tracking-widest transition-colors',
                                        isActive(href) ? 'text-primary' : 'text-on-surface/70 hover:text-on-surface',
                                    ].join(' ')}
                                >
                                    {label}
                                </Link>
                            ))}
                        </nav>

                        <div className="mt-auto">
                            <p className="font-label-technical text-label-technical text-on-surface/30 uppercase tracking-widest">
                                Peintre tunisien
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
            <footer className="border-t border-primary" style={{ backgroundColor: '#3D1E14' }}>
                <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16 md:py-20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

                        {/* Colonne 1 — Identité */}
                        <div>
                            <p className="font-headline-lg text-2xl text-primary mb-3">Chokri Benomrane</p>
                            <p className="font-body-md text-sm text-on-surface/50 leading-relaxed">
                                Peintre tunisien entre la tradition et la modernité.
                                Huile, acrylique et pastel au service de l'émotion.
                            </p>
                        </div>

                        {/* Colonne 2 — Navigation */}
                        <div>
                            <p className="font-label-technical text-label-technical text-primary uppercase tracking-widest mb-4">
                                Navigation
                            </p>
                            <ul className="flex flex-col gap-2">
                                {NAV_LINKS.map(({ href, label }) => (
                                    <li key={href}>
                                        <Link
                                            href={href}
                                            className="font-body-md text-sm text-on-surface/50 hover:text-primary transition-colors"
                                        >
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Colonne 3 — Contact */}
                        <div>
                            <p className="font-label-technical text-label-technical text-primary uppercase tracking-widest mb-4">
                                Contact
                            </p>
                            <Link
                                href="/contact"
                                className="font-body-md text-sm text-on-surface/50 hover:text-primary transition-colors block mb-2"
                            >
                                Envoyer un message
                            </Link>
                            <Link
                                href="/ateliers"
                                className="font-body-md text-sm text-on-surface/50 hover:text-primary transition-colors block"
                            >
                                Rejoindre un atelier
                            </Link>
                        </div>
                    </div>

                    {/* Ligne du bas */}
                    <div className="border-t border-on-surface/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
                        <p className="font-label-technical text-label-technical text-on-surface/30 uppercase tracking-widest">
                            © {new Date().getFullYear()} Chokri Benomrane. Tous droits réservés.
                        </p>
                        <p className="font-label-technical text-label-technical text-on-surface/20 uppercase tracking-widest">
                            Site réalisé avec soin
                        </p>
                    </div>
                </div>
            </footer>

            {/* ── Bottom Nav mobile ── */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-container border-t border-primary/20 flex">
                {BOTTOM_LINKS.map(({ href, label, icon: Icon }) => (
                    <Link
                        key={href}
                        href={href}
                        className={[
                            'flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors',
                            isActive(href) ? 'text-primary' : 'text-on-surface/40 hover:text-on-surface/70',
                        ].join(' ')}
                    >
                        <Icon active={isActive(href)} />
                        <span className="font-label-technical text-[10px] uppercase tracking-widest">{label}</span>
                    </Link>
                ))}
            </nav>
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
