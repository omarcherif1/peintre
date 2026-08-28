import { useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '@/Components/Layout/PublicLayout';
import { useLanguage } from '@/contexts/LanguageContext';

const NIVEAU_COLOR = {
    debutant:      { bg: 'bg-emerald-900/30', text: 'text-emerald-400', border: 'border-emerald-800/40' },
    intermediaire: { bg: 'bg-blue-900/30',    text: 'text-blue-400',    border: 'border-blue-800/40' },
    avance:        { bg: 'bg-secondary/15',   text: 'text-secondary',   border: 'border-secondary/30' },
    tous:          { bg: 'bg-primary/15',     text: 'text-primary',     border: 'border-primary/30' },
};

export default function Ateliers({ cours = [] }) {
    return (
        <PublicLayout>
            <HeroSection />
            <PhilosophieSection />
            <CoursSection cours={cours} />
            <CtaSection />
        </PublicLayout>
    );
}

/* ─────────────────────────────────────────
   HERO
───────────────────────────────────────── */
function HeroSection() {
    const { t } = useLanguage();
    const bgRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!bgRef.current) return;
            bgRef.current.style.transform = `translateY(${window.scrollY * 0.06}px)`;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section className="relative h-screen overflow-hidden flex items-center justify-center">
            <div
                ref={bgRef}
                className="absolute inset-[-2%]"
                style={{
                    backgroundImage: 'url(/assets/atelier.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    willChange: 'transform',
                }}
            />
            {/* Voiles superposés */}
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-background" />
            {/* Ligne décorative gauche */}
            <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3">
                <div className="w-px h-24 bg-primary/40" />
                <span className="font-label-technical text-[10px] text-primary/50 uppercase tracking-[0.3em] [writing-mode:vertical-lr]">
                    Atelier
                </span>
                <div className="w-px h-24 bg-primary/40" />
            </div>

            <div className="relative z-10 text-center px-margin-mobile md:px-margin-desktop max-w-3xl mx-auto">
                <p className="font-label-technical text-label-technical text-primary uppercase tracking-[0.3em] mb-6">
                    {t('ateliers', 'heroTag')}
                </p>
                <h1 className="font-display-lg text-6xl sm:text-8xl lg:text-[9rem] text-on-surface leading-none mb-8 tracking-tight">
                    {t('ateliers', 'heroTitle')}
                </h1>
                <div className="flex items-center justify-center gap-4 mb-8">
                    <div className="h-px w-16 bg-primary/50" />
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <div className="h-px w-16 bg-primary/50" />
                </div>
                <p className="font-headline-md text-lg text-on-surface/60 italic max-w-xl mx-auto leading-relaxed mb-10">
                    {t('ateliers', 'heroSub')}
                </p>

                {/* Réseaux sociaux atelier */}
                <div className="flex items-center justify-center gap-3">
                    {[
                        { label: 'Instagram', href: 'https://www.instagram.com/club_peinture_tunis?igsi=ZWtkcGZrMWM2bXNr',
                          svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg> },
                        { label: 'TikTok',    href: '#',
                          svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg> },
                        { label: 'YouTube',   href: '#',
                          svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="3"/><polygon points="10 9 15 12 10 15" fill="currentColor" stroke="none"/></svg> },
                        { label: 'Facebook',  href: 'https://www.facebook.com/share/19YKD89X5g/',
                          svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> },
                    ].map(({ label, href, svg }) => (
                        <a
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={label}
                            className="text-primary hover:text-primary/70 transition-colors duration-200"
                        >
                            {svg}
                        </a>
                    ))}
                </div>
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
                <div className="w-px h-10 bg-primary/40 animate-pulse" />
                <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" className="text-primary/50">
                    <path d="M5 8L0 3h10L5 8z"/>
                </svg>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────
   PHILOSOPHIE
───────────────────────────────────────── */
function PhilosophieSection() {
    const { t } = useLanguage();
    return (
        <section className="py-24 px-margin-mobile md:px-margin-desktop bg-background border-b border-primary/10">
            <div className="max-w-container-max mx-auto grid md:grid-cols-2 gap-16 items-center">
                <div>
                    <p className="font-label-technical text-label-technical text-primary uppercase tracking-widest mb-4">
                        {t('ateliers', 'coursTag')}
                    </p>
                    <h2 className="font-headline-lg text-4xl sm:text-5xl text-on-surface leading-tight">
                        {t('ateliers', 'coursTitle')}
                    </h2>
                </div>
                <div className="border-l border-primary/20 pl-10">
                    <svg width="32" height="26" viewBox="0 0 44 36" fill="none" className="mb-4">
                        <path d="M0 36V22C0 13.556 3.556 6.444 10.667 0.889L14.222 4.444C10.074 8.148 8 12.593 8 17.778H16V36H0ZM24.889 36V22C24.889 13.556 28.444 6.444 35.556 0.889L39.111 4.444C34.963 8.148 32.889 12.593 32.889 17.778H40.889V36H24.889Z" fill="#C8A84C" fillOpacity="0.4"/>
                    </svg>
                    <p className="font-body-lg text-body-lg text-on-surface/60 leading-relaxed italic">
                        {t('ateliers', 'heroSub')}
                    </p>
                </div>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────
   COURS
───────────────────────────────────────── */
function CoursSection({ cours }) {
    const { t } = useLanguage();
    return (
        <section id="cours" className="py-section-gap px-margin-mobile md:px-margin-desktop bg-background">
            <div className="max-w-container-max mx-auto">
                {cours.length === 0 ? (
                    <div className="text-center py-24 border border-primary/10">
                        <span className="material-symbols-outlined text-primary/20 text-5xl block mb-4">brush</span>
                        <p className="font-label-technical text-label-technical text-on-surface/30 uppercase tracking-widest">
                            {t('ateliers', 'coursEmpty')}
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {cours.map((c, i) => (
                            <CoursCard key={c.id} cours={c} index={i} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

function CoursCard({ cours, index }) {
    const { t, lang } = useLanguage();
    const complet  = cours.places_restantes === 0;
    const illimite = cours.places_restantes === null;
    const niveau   = NIVEAU_COLOR[cours.niveau] ?? NIVEAU_COLOR.tous;

    const NIVEAU_LABEL = {
        debutant:      t('ateliers', 'nivDebutant'),
        intermediaire: t('ateliers', 'nivInter'),
        avance:        t('ateliers', 'nivAvance'),
        tous:          t('ateliers', 'nivTous'),
    };

    const placesLabel = complet
        ? t('ateliers', 'complet')
        : illimite
        ? t('ateliers', 'illimite')
        : lang === 'fr'
        ? `${cours.places_restantes} place${cours.places_restantes > 1 ? 's' : ''} restante${cours.places_restantes > 1 ? 's' : ''}`
        : `${cours.places_restantes} spot${cours.places_restantes > 1 ? 's' : ''} remaining`;

    return (
        <div
            className={`group relative flex flex-col lg:flex-row border-l-2 transition-all duration-500 ${
                complet
                    ? 'border-on-surface/10 opacity-60'
                    : 'border-primary hover:border-secondary'
            }`}
            style={{ backgroundImage: 'radial-gradient(circle, #7a353f 0%, #2b1116 100%)' }}
        >
            {/* Numéro décoratif */}
            <div className="flex-shrink-0 w-full lg:w-32 flex items-center justify-center py-8 lg:py-0 border-b lg:border-b-0 lg:border-r border-white/5">
                <span className="font-display-lg text-6xl font-bold leading-none select-none"
                    style={{ color: 'rgba(200,168,76,0.15)' }}>
                    {String(index + 1).padStart(2, '0')}
                </span>
            </div>

            {/* Contenu principal */}
            <div className="flex-1 p-8 flex flex-col gap-5">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2">
                    <span className={`font-label-technical text-[10px] px-2.5 py-1 uppercase tracking-wider border ${niveau.bg} ${niveau.text} ${niveau.border}`}>
                        {NIVEAU_LABEL[cours.niveau] ?? cours.niveau}
                    </span>
                    {index === 0 && (
                        <span className="font-label-technical text-[10px] px-2.5 py-1 uppercase tracking-wider bg-primary/90 text-on-primary">
                            {t('ateliers', 'conseille')}
                        </span>
                    )}
                    {complet && (
                        <span className="font-label-technical text-[10px] px-2.5 py-1 uppercase tracking-wider bg-on-surface/10 text-on-surface/40">
                            {t('ateliers', 'complet')}
                        </span>
                    )}
                </div>

                {/* Titre */}
                <h3 className="font-headline-lg text-2xl sm:text-3xl text-on-surface group-hover:text-primary transition-colors duration-300">
                    {cours.titre}
                </h3>

                {/* Infos */}
                <div className="flex flex-wrap gap-x-8 gap-y-2">
                    {cours.jour && (
                        <InfoItem icon="calendar_today">
                            {cours.jour}{cours.heure_debut && ` · ${cours.heure_debut}–${cours.heure_fin}`}
                        </InfoItem>
                    )}
                    {cours.emplacement && (
                        <InfoItem icon="location_on">{cours.emplacement}</InfoItem>
                    )}
                    <InfoItem icon="group">{placesLabel}</InfoItem>
                </div>

                {cours.description && (
                    <p className="font-body-md text-sm text-on-surface/50 leading-relaxed max-w-2xl">
                        {cours.description}
                    </p>
                )}
            </div>

            {/* Bloc tarif + CTA */}
            <div className="flex-shrink-0 flex flex-col items-center justify-center gap-5 p-8 border-t lg:border-t-0 lg:border-l border-white/5 min-w-[180px]">
                <div className="text-center">
                    <p className="font-label-technical text-[10px] text-on-surface/30 uppercase tracking-widest mb-1">
                        Tarif
                    </p>
                    <p className="font-display-lg text-3xl text-primary leading-none">
                        {cours.tarif ? `${cours.tarif}` : '—'}
                    </p>
                    {cours.tarif && (
                        <p className="font-label-technical text-[10px] text-primary/50 uppercase tracking-widest mt-1">TND</p>
                    )}
                    {!cours.tarif && (
                        <p className="font-label-technical text-[10px] text-on-surface/40 uppercase tracking-widest mt-1">
                            {t('ateliers', 'surDemande')}
                        </p>
                    )}
                </div>

                {complet ? (
                    <span className="w-full text-center font-label-technical text-[10px] px-6 py-3 bg-on-surface/5 text-on-surface/30 uppercase tracking-widest cursor-not-allowed border border-on-surface/10">
                        {t('ateliers', 'complet')}
                    </span>
                ) : (
                    <Link
                        href={route('contact')}
                        className="w-full text-center font-label-technical text-[11px] px-6 py-3 border border-primary text-primary uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all duration-300"
                    >
                        {t('ateliers', 'inscrire')}
                    </Link>
                )}
            </div>
        </div>
    );
}

function InfoItem({ icon, children }) {
    return (
        <div className="flex items-center gap-1.5 text-on-surface/50">
            <span className="material-symbols-outlined text-primary/70 leading-none flex-shrink-0" style={{ fontSize: '14px' }}>
                {icon}
            </span>
            <span className="font-body-md text-sm">{children}</span>
        </div>
    );
}

/* ─────────────────────────────────────────
   CTA FINAL
───────────────────────────────────────── */
function CtaSection() {
    const { t } = useLanguage();
    return (
        <section
            className="py-24 px-margin-mobile md:px-margin-desktop text-center"
            style={{ backgroundImage: 'radial-gradient(ellipse at center, #7a353f 0%, #2b1116 60%, #0a0706 100%)' }}
        >
            <div className="max-w-xl mx-auto">
                <p className="font-label-technical text-label-technical text-primary uppercase tracking-widest mb-4">
                    {t('ateliers', 'heroTag')}
                </p>
                <h2 className="font-headline-lg text-3xl sm:text-4xl text-on-surface mb-6 leading-tight">
                    {t('ateliers', 'coursTitle')}
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface/50 mb-10 leading-relaxed">
                    {t('ateliers', 'heroSub')}
                </p>
                <Link
                    href={route('contact')}
                    className="inline-flex items-center gap-3 border border-primary text-primary px-10 py-4 font-label-technical text-label-technical uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all duration-300"
                >
                    {t('ateliers', 'inscrire')}
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 7h10M7 2l5 5-5 5"/></svg>
                </Link>
            </div>
        </section>
    );
}
