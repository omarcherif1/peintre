import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '@/Components/Layout/PublicLayout';

const STATS = [
    { value: '25',  label: "Ans d'expérience" },
    { value: '40+', label: 'Œuvres créées' },
    { value: '12',  label: 'Expositions' },
];

export default function Accueil({ tableaux = [] }) {

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
                    style={{ filter: 'blur(14px) brightness(0.45) saturate(1.4)', transform: 'scale(1.08)' }}
                />

                {/* Voile sombre pour profondeur */}
                <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-black/20 to-background/80" />

                {/* Placeholder canvas Three.js */}
                <div id="canvas-hero" className="absolute inset-0 pointer-events-none" />

                {/* Contenu centré */}
                <div className="relative z-10 flex flex-col items-center text-center px-margin-mobile md:px-margin-desktop">

                    {/* Label technique */}
                    <p
                        id="hero-sub"
                        className="font-label-technical text-label-technical text-primary uppercase tracking-widest mb-8"
                        style={{ opacity: 0, transform: 'translateY(1rem)' }}
                    >
                        Peintre tunisien · Huile &amp; Acrylique
                    </p>

                    {/* CHOKRI — clip-reveal */}
                    <div id="hero-chokri" className="overflow-visible clip-reveal">
                        <h1 className="font-display-lg text-5xl sm:text-7xl lg:text-display-lg text-on-surface leading-none select-none">
                            CHOKRI
                        </h1>
                    </div>

                    {/* BENOMRANE — clip-reveal décalé */}
                    <div id="hero-abidi" className="overflow-visible clip-reveal">
                        <h1 className="font-display-lg text-5xl sm:text-7xl lg:text-display-lg text-primary leading-none text-glow-gold select-none">
                            BENOMRANE
                        </h1>
                    </div>

                    {/* Ligne décorative centrée */}
                    <div className="flex items-center gap-3 mt-6 mb-8">
                        <div className="h-px w-16 bg-primary/30" />
                        <div className="w-1 h-1 rounded-full bg-primary" />
                        <div className="h-px w-16 bg-primary/30" />
                    </div>

                    {/* CTA */}
                    <Link
                        id="hero-cta"
                        href={route('oeuvres')}
                        className="inline-flex items-center gap-3 border border-primary text-primary px-8 py-4 font-label-technical text-label-technical uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-colors duration-300"
                        style={{ opacity: 0, transform: 'translateY(1rem)' }}
                    >
                        Découvrir les œuvres
                        <ArrowRight />
                    </Link>
                </div>

                {/* Indicateur de scroll */}
                <div
                    id="scroll-indicator"
                    className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                    style={{ opacity: 0, animation: 'float 2.8s ease-in-out infinite' }}
                >
                    <span className="font-label-technical text-label-technical text-on-surface/50 uppercase tracking-widest" style={{ fontSize: '0.6rem', letterSpacing: '0.2em' }}>
                        Scroll
                    </span>
                    <svg width="14" height="20" viewBox="0 0 14 20" fill="none" style={{ opacity: 0.5 }}>
                        <path d="M7 0 L7 14 M1 9 L7 16 L13 9" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                <style>{`
                    @keyframes float {
                        0%, 100% { transform: translateX(-50%) translateY(0); }
                        50%       { transform: translateX(-50%) translateY(-6px); }
                    }
                `}</style>

                {/* Réseaux sociaux — bas droite */}
                <div className="absolute bottom-20 right-8 md:right-margin-desktop flex flex-row items-center gap-5 z-10">
                    {[
                        {
                            href: 'https://www.instagram.com',
                            label: 'Instagram',
                            svg: (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                                    <circle cx="12" cy="12" r="4"/>
                                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                                </svg>
                            ),
                        },
                        {
                            href: 'https://www.facebook.com',
                            label: 'Facebook',
                            svg: (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                                </svg>
                            ),
                        },
                        {
                            href: 'https://www.youtube.com',
                            label: 'YouTube',
                            svg: (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
                                    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/>
                                </svg>
                            ),
                        },
                    ].map(({ href, label, svg }) => (
                        <a
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={label}
                            className="text-on-surface/30 hover:text-primary transition-colors duration-300"
                        >
                            {svg}
                        </a>
                    ))}
                </div>
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
                                Portfolio
                            </p>
                            <h2 className="font-headline-lg text-headline-lg text-on-surface">
                                Œuvres récentes
                            </h2>
                        </div>
                        <Link
                            href={route('oeuvres')}
                            className="hidden md:inline-flex items-center gap-2 font-label-technical text-label-technical text-on-surface/40 uppercase tracking-widest hover:text-primary transition-colors"
                        >
                            Voir tout <ArrowRight />
                        </Link>
                    </div>

                    {/* Grille — stagger vertical sur index 1 */}
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
                        /* Squelettes si pas encore de tableaux */
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
                            Voir toutes les œuvres <ArrowRight />
                        </Link>
                    </div>
                </div>
            </section>


            {/* ════════════════════════════════════════
                SECTION 3 · Chiffres clés
            ════════════════════════════════════════ */}
            <section className="bg-surface-container py-section-gap px-margin-mobile md:px-margin-desktop border-y border-primary/10">
                <div className="max-w-container-max mx-auto">
                    <div className="grid grid-cols-3 gap-8 md:gap-16 max-w-2xl mx-auto text-center reveal-up">
                        {STATS.map((stat) => (
                            <div key={stat.label}>
                                <div className="font-display-lg text-5xl md:text-7xl font-bold text-primary text-glow-gold leading-none">
                                    {stat.value}
                                </div>
                                <div className="font-label-technical text-label-technical text-on-surface/40 uppercase tracking-widest mt-3">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


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

                        {/* Guillemets */}
                        <svg
                            className="mx-auto mb-10"
                            width="44"
                            height="36"
                            viewBox="0 0 44 36"
                            fill="none"
                            aria-hidden="true"
                        >
                            <path
                                d="M0 36V22C0 13.556 3.556 6.444 10.667 0.889L14.222 4.444C10.074 8.148 8 12.593 8 17.778H16V36H0ZM24.889 36V22C24.889 13.556 28.444 6.444 35.556 0.889L39.111 4.444C34.963 8.148 32.889 12.593 32.889 17.778H40.889V36H24.889Z"
                                fill="#D4AF37"
                                fillOpacity="0.3"
                            />
                        </svg>

                        <blockquote className="font-headline-lg text-headline-lg text-on-surface italic leading-relaxed">
                            La peinture est le silence du monde rendu visible,
                            une confession sans mots, une vérité sans masque.
                        </blockquote>

                        <cite className="block font-label-technical text-label-technical text-primary uppercase tracking-widest mt-8 not-italic">
                            — Chokri Benomrane
                        </cite>

                        {/* Séparateur */}
                        <div className="flex items-center justify-center gap-4 mt-10">
                            <div className="h-px w-12 bg-primary/30" />
                            <div className="w-1 h-1 rounded-full bg-primary/50" />
                            <div className="h-px w-12 bg-primary/30" />
                        </div>

                        <Link
                            href={route('artiste')}
                            className="inline-flex items-center gap-2 mt-8 font-label-technical text-label-technical text-on-surface/40 uppercase tracking-widest hover:text-primary transition-colors"
                        >
                            Découvrir l'artiste <ArrowRight />
                        </Link>
                    </div>
                </div>
            </section>

        </PublicLayout>
    );
}

const CLUB_IMAGES = [
    { src: '/assets/club/1.png', alt: 'Atelier 1' },
    { src: '/assets/club/2.png', alt: 'Atelier 2' },
    { src: '/assets/club/3.png', alt: 'Atelier 3' },
];

function CarouselAteliers() {
    const [current, setCurrent] = useState(0);
    const total = CLUB_IMAGES.length;
    const prev = () => setCurrent((c) => (c - 1 + total) % total);
    const next = () => setCurrent((c) => (c + 1) % total);

    /* Auto-avance toutes les 4s */
    useEffect(() => {
        const id = setInterval(next, 4000);
        return () => clearInterval(id);
    }, []);

    return (
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop" style={{ backgroundColor: '#3D1E14' }}>
            <div className="max-w-container-max mx-auto">

                {/* En-tête */}
                <div className="flex justify-between items-end mb-10 reveal-up">
                    <div>
                        <p className="font-label-technical text-label-technical text-primary uppercase tracking-widest mb-3">
                            Club &amp; Transmission
                        </p>
                        <h2 className="font-headline-lg text-headline-lg text-on-surface">
                            Nos ateliers en images
                        </h2>
                    </div>
                    <Link
                        href={route('ateliers')}
                        className="hidden md:inline-flex items-center gap-2 font-label-technical text-label-technical text-on-surface/40 uppercase tracking-widest hover:text-primary transition-colors"
                    >
                        Rejoindre <ArrowRight />
                    </Link>
                </div>

                {/* Carousel */}
                <div className="relative overflow-hidden reveal-up" style={{ aspectRatio: '16/7' }}>

                    {/* Images */}
                    {CLUB_IMAGES.map((img, i) => (
                        <div
                            key={i}
                            className="absolute inset-0 transition-opacity duration-700"
                            style={{ opacity: i === current ? 1 : 0, pointerEvents: i === current ? 'auto' : 'none' }}
                        >
                            <img
                                src={img.src}
                                alt={img.alt}
                                className="w-full h-full object-cover"
                            />
                            {/* Voile léger */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        </div>
                    ))}

                    {/* Flèches */}
                    <button
                        onClick={prev}
                        aria-label="Précédent"
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 border border-primary/50 text-primary flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all z-10"
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M10 3L5 8L10 13"/></svg>
                    </button>
                    <button
                        onClick={next}
                        aria-label="Suivant"
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 border border-primary/50 text-primary flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all z-10"
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 3L11 8L6 13"/></svg>
                    </button>

                    {/* Points de navigation */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {CLUB_IMAGES.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                aria-label={`Image ${i + 1}`}
                                className="transition-all duration-300"
                                style={{
                                    width: i === current ? 24 : 8,
                                    height: 4,
                                    background: i === current ? '#D4AF37' : 'rgba(212,175,55,0.3)',
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function ArrowRight() {
    return (
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
            <path d="M1 5H13M9 1L13 5L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
        </svg>
    );
}
