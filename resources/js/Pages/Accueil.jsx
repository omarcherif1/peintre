import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '@/Components/Layout/PublicLayout';
import { useLanguage } from '@/contexts/LanguageContext';

const STATS_KEYS = ['statYears', 'statWorks', 'statExpo'];
const STAT_VALUES = ['25', '40+', '12'];

export default function Accueil({ tableaux = [] }) {
    const { t } = useLanguage();

    useEffect(() => {
        let ctx;

        (async () => {
            const { gsap }          = await import('gsap');
            const { ScrollTrigger } = await import('gsap/ScrollTrigger');
            gsap.registerPlugin(ScrollTrigger);

            ctx = gsap.context(() => {

                /* ── Hero clip-reveal ── */
                gsap.to('#hero-chokri', {
                    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                    duration: 1.3,
                    delay: 0.2,
                    ease: 'power3.out',
                });
                gsap.to('#hero-abidi', {
                    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                    duration: 1.3,
                    delay: 0.55,
                    ease: 'power3.out',
                });
                gsap.to('#hero-sub', {
                    opacity: 1,
                    y: 0,
                    duration: 0.9,
                    delay: 1.0,
                    ease: 'power2.out',
                });
                gsap.to('#hero-cta', {
                    opacity: 1,
                    y: 0,
                    duration: 0.9,
                    delay: 1.25,
                    ease: 'power2.out',
                });
                gsap.to('#scroll-indicator', {
                    opacity: 0.4,
                    duration: 0.7,
                    delay: 1.8,
                });

                /* ── Reveal-up sur scroll ── */
                gsap.utils.toArray('.reveal-up').forEach((el) => {
                    gsap.to(el, {
                        opacity: 1,
                        y: 0,
                        duration: 0.75,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 88%',
                            once: true,
                        },
                    });
                });

                /* ── Parallax léger sur les images ── */
                gsap.utils.toArray('.parallax-img').forEach((img) => {
                    gsap.to(img, {
                        y: -24,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: img,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: 1.5,
                        },
                    });
                });
            });
        })();

        return () => ctx?.revert();
    }, []);

    return (
        <PublicLayout>

            {/* ════════════════════════════════════════
                SECTION 1 · Héro
            ════════════════════════════════════════ */}
            <section className="relative h-screen bg-background flex flex-col items-center justify-center overflow-hidden">

                {/* Image de fond floutée */}
                <img
                    src="/assets/tableau.jpg"
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    style={{ filter: 'blur(6px) brightness(0.45) saturate(1.4)', transform: 'scale(1.08)' }}
                />

                {/* Voile sombre pour profondeur */}
                <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-black/20 to-background/80" />

                {/* Placeholder canvas Three.js */}
                <div id="canvas-hero" className="absolute inset-0 pointer-events-none" />

                {/* Contenu centré */}
                <div className="relative z-10 flex flex-col items-center text-center px-margin-mobile md:px-margin-desktop">

                    {/* CHOKRI BENOMRANE — une seule ligne */}
                    <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
                        <div id="hero-chokri" className="overflow-visible clip-reveal pb-4">
                            <h1 className="text-4xl sm:text-6xl lg:text-7xl text-on-surface leading-none select-none font-normal" style={{ fontFamily: "'Pixeled', serif" }}>
                                CHOKRI
                            </h1>
                        </div>
                        <div id="hero-abidi" className="overflow-visible clip-reveal pb-4">
                            <h1 className="font-display-lg text-6xl sm:text-8xl lg:text-[7.5rem] text-primary leading-none text-glow-gold select-none">
                                BENOMRANE
                            </h1>
                        </div>
                    </div>

                    {/* Label technique */}
                    <p
                        id="hero-sub"
                        className="font-label-technical text-label-technical text-primary uppercase tracking-widest mb-8"
                        style={{ opacity: 0, transform: 'translateY(1rem)' }}
                    >
                        {t('accueil', 'heroSub')}
                    </p>

                   <br /><br />

                    {/* Réseaux sociaux — centrés, dorés */}
                    <div
                        id="hero-cta"
                        className="flex items-center gap-3"
                        style={{ opacity: 0, transform: 'translateY(1rem)' }}
                    >
                        {[
                            {
                                href: 'https://www.instagram.com/chokri.benomrane?igsi=MWxqOG9reHJxcWNxaA==',
                                label: 'Instagram',
                                svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>,
                            },
                            {
                                href: 'https://www.tiktok.com/@chokri.benomrane?_r=1&_t=ZS-999Fje3oasG',
                                label: 'TikTok',
                                svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>,
                            },
                            {
                                href: 'https://youtube.com/@chokri.benomrane?si=tIXj6eLidnN8jrwM',
                                label: 'YouTube',
                                svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="3"/><polygon points="10 9 15 12 10 15" fill="currentColor" stroke="none"/></svg>,
                            },
                            {
                                href: 'https://www.facebook.com/share/1EFamWv5KY/',
                                label: 'Facebook',
                                svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
                            },
                        ].map(({ href, label, svg }) => (
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

                    {/* Indicateur de scroll */}
                    <div
                        id="scroll-indicator"
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                        style={{ opacity: 0 }}
                    >
                        <div className="w-px h-10 bg-primary/40 animate-pulse" />
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M6 10L1 5h10L6 10z" fill="currentColor" className="text-primary/60" />
                        </svg>
                    </div>

                    <div className="absolute bottom-8 right-8 hidden md:flex flex-col gap-2">
                        <div
                            className="w-px h-16 bg-gradient-to-b from-transparent to-primary/30 mx-auto"
                        />
                        <div className="w-px h-16 bg-gradient-to-b from-primary/30 to-transparent mx-auto" />
                    </div>
                </div>

                <style>{`
                    @keyframes float {
                        0%, 100% { transform: translateX(-50%) translateY(0); }
                        50%       { transform: translateX(-50%) translateY(-6px); }
                    }
                `}</style>

            </section>


            {/* ════════════════════════════════════════
                SECTION 2 · Œuvres récentes
            ════════════════════════════════════════ */}
            <section className="bg-background py-section-gap px-margin-mobile md:px-margin-desktop">
                <div className="max-w-container-max mx-auto">

                    {/* En-tête */}
                    <div className="flex justify-between items-baseline mb-16 reveal-up">
                        <div>
                            <p className="font-label-technical text-label-technical text-primary uppercase tracking-widest mb-3">
                                {t('accueil', 'portfolioTag')}
                            </p>
                            <h2 className="font-headline-lg text-headline-lg text-on-surface">
                                {t('accueil', 'portfolioTitle')}
                            </h2>
                        </div>
                        <Link
                            href={route('oeuvres')}
                            className="hidden md:inline-flex items-center gap-2 font-label-technical text-label-technical text-on-surface/40 uppercase tracking-widest hover:text-primary transition-colors"
                        >
                            {t('accueil', 'portfolioCta')} <ArrowRight />
                        </Link>
                    </div>

                    {/* Grille */}
                    {tableaux.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                            {tableaux.map((tableau, i) => (
                                <Link
                                    key={tableau.id}
                                    href={route('oeuvres')}
                                    className={[
                                        'group block reveal-up',
                                        i === 1 ? 'md:translate-y-16' : '',
                                    ].join(' ')}
                                >
                                    <div className="overflow-hidden aspect-[3/4] bg-surface-container">
                                        {tableau.image_url ? (
                                            <img
                                                src={tableau.image_url}
                                                alt={tableau.nom}
                                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 parallax-img"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-surface flex items-center justify-center">
                                                <span className="text-on-surface/10 text-5xl font-headline-lg">◇</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-4">
                                        <p className="font-label-technical text-label-technical text-primary uppercase tracking-widest">
                                            {tableau.categorie} · {tableau.annee}
                                        </p>
                                        <h3 className="font-headline-md text-headline-md text-on-surface mt-1 group-hover:text-primary transition-colors">
                                            {tableau.nom}
                                        </h3>
                                        {tableau.technique && (
                                            <p className="font-body-md text-sm text-on-surface/40 mt-1">
                                                {tableau.technique}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                            {[0, 1, 2].map((i) => (
                                <div
                                    key={i}
                                    className={[
                                        'reveal-up',
                                        i === 1 ? 'md:translate-y-16' : '',
                                    ].join(' ')}
                                >
                                    <div className="aspect-[3/4] bg-surface border border-on-surface/5 flex items-center justify-center">
                                        <span className="text-on-surface/10 text-4xl font-headline-lg">◇</span>
                                    </div>
                                    <div className="mt-4 h-3 w-24 bg-surface" />
                                    <div className="mt-2 h-5 w-40 bg-surface" />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Lien mobile */}
                    <div className="md:hidden mt-12 reveal-up">
                        <Link
                            href={route('oeuvres')}
                            className="inline-flex items-center gap-2 font-label-technical text-label-technical text-primary uppercase tracking-widest"
                        >
                            {t('accueil', 'portfolioMobile')} <ArrowRight />
                        </Link>
                    </div>
                </div>
            </section>


            {/* ════════════════════════════════════════
                SECTION 3 · Chiffres clés
            ════════════════════════════════════════ */}
            


            {/* ════════════════════════════════════════
                SECTION · Ateliers en images
            ════════════════════════════════════════ */}
            <CarouselAteliers />


            {/* ════════════════════════════════════════
                SECTION 4 · Citation
            ════════════════════════════════════════ */}
            <section className="bg-background py-section-gap px-margin-mobile md:px-margin-desktop">
                <div className="max-w-container-max mx-auto">
                    <div className="max-w-3xl mx-auto text-center reveal-up">

                        <svg className="mx-auto mb-10" width="44" height="36" viewBox="0 0 44 36" fill="none" aria-hidden="true">
                            <path d="M0 36V22C0 13.556 3.556 6.444 10.667 0.889L14.222 4.444C10.074 8.148 8 12.593 8 17.778H16V36H0ZM24.889 36V22C24.889 13.556 28.444 6.444 35.556 0.889L39.111 4.444C34.963 8.148 32.889 12.593 32.889 17.778H40.889V36H24.889Z" fill="#D4AF37" fillOpacity="0.3" />
                        </svg>

                        <blockquote className="font-headline-lg text-headline-lg text-on-surface italic leading-relaxed">
                            {t('accueil', 'quoteText')}
                        </blockquote>

                        <cite className="block font-label-technical text-label-technical text-primary uppercase tracking-widest mt-8 not-italic">
                            — Chokri Benomrane
                        </cite>

                        <div className="flex items-center justify-center gap-4 mt-10">
                            <div className="h-px w-12 bg-primary/30" />
                            <div className="w-1 h-1 rounded-full bg-primary/50" />
                            <div className="h-px w-12 bg-primary/30" />
                        </div>

                        <Link
                            href={route('artiste')}
                            className="inline-flex items-center gap-2 mt-8 font-label-technical text-label-technical text-on-surface/40 uppercase tracking-widest hover:text-primary transition-colors"
                        >
                            {t('accueil', 'quoteCta')} <ArrowRight />
                        </Link>
                    </div>
                </div>
            </section>

        </PublicLayout>
    );
}

const CLUB_IMAGES = Array.from({ length: 10 }, (_, i) => ({
    src: `/assets/club/${i + 1}.jpg`,
    alt: `Atelier ${i + 1}`,
}));

function CarouselAteliers() {
    const { t } = useLanguage();

    return (
        <section
            className="py-section-gap px-margin-mobile md:px-margin-desktop"
            style={{ backgroundImage: 'radial-gradient(circle, #7a353f 0%, #2b1116 100%)' }}
        >
            <div className="max-w-container-max mx-auto">

                {/* En-tête */}
                <div className="flex justify-between items-end mb-10 reveal-up">
                    <div>
                        <p className="font-label-technical text-label-technical text-primary uppercase tracking-widest mb-3">
                            {t('accueil', 'clubTag')}
                        </p>
                        <h2 className="font-headline-lg text-headline-lg text-on-surface">
                            {t('accueil', 'clubTitle')}
                        </h2>
                    </div>
                    <Link
                        href={route('ateliers')}
                        className="hidden md:inline-flex items-center gap-2 font-label-technical text-label-technical text-on-surface/40 uppercase tracking-widest hover:text-primary transition-colors"
                    >
                        {t('accueil', 'clubCta')} <ArrowRight />
                    </Link>
                </div>

                {/* Mosaïque 5 × 2 */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1.5 reveal-up">
                    {CLUB_IMAGES.map((img, i) => (
                        <div
                            key={i}
                            className="relative overflow-hidden group"
                            style={{ aspectRatio: '4/3' }}
                        >
                            <img
                                src={img.src}
                                alt={img.alt}
                                className="w-full h-full object-cover transition-all duration-500"
                            />
                            <div className="absolute inset-0 border border-transparent group-hover:border-primary/40 transition-all duration-300" />
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}

function ArrowRight() {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 7h10M7 2l5 5-5 5" />
        </svg>
    );
}
