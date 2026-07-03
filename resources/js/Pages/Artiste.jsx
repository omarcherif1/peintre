import { useState, useEffect, useRef } from 'react';
import PublicLayout from '@/Components/Layout/PublicLayout';


const DEMARCHE_CARDS = [
    {
        tag: 'Style',
        title: 'La peinture de l\'absurde',
        text: 'Fondateur d\'un courant singulier, Chokri Benomrane combine surréalisme, expressionnisme et peinture moderne pour explorer les paradoxes de l\'existence — lumière et ombre, chaos et harmonie coexistent sur chaque toile.',
    },
    {
        tag: 'Langage pictural',
        title: 'L\'absurde en image',
        text: 'Ses œuvres, entre abstraction et poésie visuelle, transforment l\'absurde en langage pictural. Une esthétique originale et profondément humaine qui révèle ce que les mots peinent à nommer.',
    },
    {
        tag: 'Mission',
        title: 'Diffusion & Transmission',
        text: 'Artiste, professeur et mentor, Chokri Benomrane œuvre pour la diffusion de la peinture de l\'absurde en Tunisie et à l\'international, affirmant sa place parmi les artistes contemporains les plus innovants.',
    },
];

export default function Artiste({ images = [] }) {
    const [activeSection, setActiveSection] = useState('biographie');
    const observerRef = useRef(null);

    useEffect(() => {
        /* ── Scroll → activeSection ── */
        const handleScroll = () => {
            const demarche = document.getElementById('demarche');
            if (demarche && demarche.getBoundingClientRect().top <= 150) {
                setActiveSection('demarche');
            } else {
                setActiveSection('biographie');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });

        /* ── IntersectionObserver → reveal section-child ── */
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observerRef.current?.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );
        document.querySelectorAll('.section-child').forEach((el) => {
            observerRef.current.observe(el);
        });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            observerRef.current?.disconnect();
        };
    }, []);

    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (!el) return;
        const offset = 120; // nav 64 + subnav 56
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    };

    return (
        <PublicLayout>

            {/* ── Sticky Sub-Nav ── */}
            <div
                className="sticky top-[64px] z-40 border-b border-primary/20"
                style={{ backgroundColor: '#3D1E14' }}
            >
                <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop h-14 flex items-center gap-8">
                    {[
                        { id: 'biographie', label: 'Biographie' },
                        { id: 'demarche',   label: 'Démarche' },
                    ].map(({ id, label }) => (
                        <button
                            key={id}
                            onClick={() => scrollToSection(id)}
                            className={[
                                'font-label-technical text-label-technical uppercase tracking-widest pb-1 transition-colors duration-200',
                                activeSection === id
                                    ? 'text-primary border-b-2 border-secondary'
                                    : 'text-on-surface/50 hover:text-on-surface',
                            ].join(' ')}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>


            {/* ════════════════════════════════════════
                SECTION 1 · Biographie
            ════════════════════════════════════════ */}
            <section
                id="biographie"
                className="pt-[128px] pb-section-gap px-margin-mobile md:px-margin-desktop"
                style={{ backgroundColor: '#0A0706' }}
            >
                <div className="max-w-container-max mx-auto">

                    {/* Grille 12 colonnes : 5 portrait + 7 texte */}
                    <div className="section-child grid lg:grid-cols-12 gap-gutter items-start">

                        {/* ── Portrait ── */}
                        <div className="lg:col-span-5">
                            <div className="aspect-[3/4] bg-surface border border-primary/30 custom-glow overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                                <img
                                    src="/assets/peintre.png"
                                    alt="Portrait de Chokri Benomrane"
                                    className="w-full h-full object-cover object-center"
                                />
                            </div>

                            {/* Signature */}
                            <div className="mt-5 flex justify-end pr-2">
                                <SignatureSVG />
                            </div>
                        </div>

                        {/* ── Texte ── */}
                        <div className="lg:col-span-7 lg:pl-6">
                            <p className="font-label-technical text-label-technical text-primary uppercase tracking-widest mb-3">
                                L'Artiste
                            </p>
                            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-10">
                                Chokri Benomrane
                            </h1>

                            {/* 3 données clés */}
                            <div className="grid grid-cols-3 gap-4 mb-10 pb-10 border-b border-on-surface/10">
                                {[
                                    { value: 'Tunis', label: 'Tunisie' },
                                    { value: '25+',   label: "Années d'art" },
                                    { value: '3',     label: 'Casquettes' },
                                ].map((d) => (
                                    <div key={d.label}>
                                        <p className="font-display-lg text-4xl font-bold text-primary leading-none">
                                            {d.value}
                                        </p>
                                        <p className="font-label-technical text-label-technical text-on-surface/40 uppercase tracking-widest mt-2">
                                            {d.label}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Profession & lieu */}
                            <div className="flex flex-wrap gap-6 mb-8">
                                {[
                                    { label: 'Profession', value: 'Artiste · Professeur · Mentor' },
                                    { label: 'Lieu',       value: 'Tunis, Tunisie' },
                                ].map(({ label, value }) => (
                                    <div key={label}>
                                        <p className="font-label-technical text-[10px] text-on-surface/40 uppercase tracking-widest mb-1">{label}</p>
                                        <p className="font-body-md text-sm text-on-surface/80">{value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* 3 paragraphes bio */}
                            <div className="space-y-5 font-body-lg text-body-lg text-on-surface/70 leading-relaxed">
                                <p>
                                    Chokri Benomrane est professeur, mentor d'artistes et peintre tunisien. Fondateur de la peinture de l'absurde, il s'impose comme une figure majeure de l'art contemporain en Tunisie, alliant rigueur pédagogique et vision artistique radicalement personnelle.
                                </p>
                                <p>
                                    Son style unique combine surréalisme, expressionnisme et peinture moderne, explorant les paradoxes de l'existence à travers le contraste entre lumière et ombre, chaos et harmonie. Ses œuvres, entre abstraction et poésie visuelle, transforment l'absurde en langage pictural, révélant une esthétique originale et profondément humaine.
                                </p>
                                <p>
                                    À travers son parcours artistique, ses expositions et ses expérimentations, Chokri Benomrane œuvre pour la diffusion de la peinture de l'absurde en Tunisie et à l'international, affirmant sa place parmi les artistes contemporains les plus innovants et singuliers.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>



            {/* ════════════════════════════════════════
                SECTION 2 · Démarche
            ════════════════════════════════════════ */}
            <section
                id="demarche"
                className="pt-[128px] pb-section-gap px-margin-mobile md:px-margin-desktop"
                style={{ backgroundColor: '#0A0706' }}
            >
                <div className="max-w-container-max mx-auto">

                    {/* Intro */}
                    <div className="section-child max-w-2xl mb-16">
                        <p className="font-label-technical text-label-technical text-primary uppercase tracking-widest mb-4">
                            Démarche artistique
                        </p>
                        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-6">
                            Entre tradition et rupture
                        </h2>
                        <p className="font-body-lg text-body-lg text-on-surface/60 leading-relaxed">
                            Son univers est créatif, ses expositions, ses expérimentations et ses projets offrent un accès direct à son monde artistique unique et à sa contribution au développement de l'art contemporain mondial.
                        </p>
                    </div>

                    {/* 3 cartes */}
                    <div className="section-child grid md:grid-cols-3 gap-gutter mb-16">
                        {DEMARCHE_CARDS.map((card) => (
                            <div
                                key={card.title}
                                className="p-8 border border-primary/20"
                                style={{ backgroundColor: '#3D1E14' }}
                            >
                                <p className="font-label-technical text-label-technical text-primary uppercase tracking-widest mb-3">
                                    {card.tag}
                                </p>
                                <h3 className="font-headline-md text-headline-md text-on-surface mb-4">
                                    {card.title}
                                </h3>
                                <p className="font-body-md text-sm text-on-surface/60 leading-relaxed">
                                    {card.text}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Citation centrale */}
                    <div className="section-child max-w-3xl mx-auto text-center mb-16 py-14 border-y border-on-surface/10">
                        <svg
                            className="mx-auto mb-6"
                            width="38"
                            height="30"
                            viewBox="0 0 44 36"
                            fill="none"
                            aria-hidden="true"
                        >
                            <path
                                d="M0 36V22C0 13.556 3.556 6.444 10.667 0.889L14.222 4.444C10.074 8.148 8 12.593 8 17.778H16V36H0ZM24.889 36V22C24.889 13.556 28.444 6.444 35.556 0.889L39.111 4.444C34.963 8.148 32.889 12.593 32.889 17.778H40.889V36H24.889Z"
                                fill="#6B1515"
                                fillOpacity="0.9"
                            />
                        </svg>
                        <blockquote className="font-headline-lg text-headline-lg text-on-surface italic leading-relaxed">
                            L'absurde n'est pas une limite — c'est le territoire où l'art commence vraiment.
                        </blockquote>
                        <cite className="block font-label-technical text-label-technical text-secondary uppercase tracking-widest mt-6 not-italic">
                            — Chokri Benomrane
                        </cite>
                    </div>

                    {/* Galerie biographie */}
                    {images.length > 0 && (
                    <div className="section-child grid grid-cols-2 md:grid-cols-4 gap-4">
                        {images.map((t) => (
                            <div
                                key={t.id}
                                className="aspect-square bg-surface overflow-hidden grayscale hover:grayscale-0 brightness-75 hover:brightness-100 transition-all duration-500 cursor-pointer group relative"
                            >
                                <img
                                    src={t.image_url}
                                    alt={t.nom}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                                    <p className="font-label-technical text-[10px] text-primary uppercase tracking-widest leading-tight">
                                        {t.nom}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    )}
                </div>
            </section>

        </PublicLayout>
    );
}

/* ── Signature SVG décorative ── */
function SignatureSVG() {
    return (
        <svg width="180" height="48" viewBox="0 0 180 48" fill="none" className="opacity-65">
            {/* Tracé "Chokri" */}
            <path
                d="M10 30 C16 18 26 8 38 14 C50 20 46 34 36 38 C26 42 20 28 32 22 C44 16 58 22 66 30"
                stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" fill="none"
            />
            {/* Tracé "Benomrane" */}
            <path
                d="M78 24 C86 16 96 12 106 18 C114 24 110 36 102 38 C94 40 90 26 100 22 C112 16 126 24 134 32 C140 36 144 38 154 32 C162 26 168 20 176 26"
                stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" fill="none"
            />
            {/* Ligne de base pointillée */}
            <path
                d="M10 43 L176 43"
                stroke="#D4AF37" strokeWidth="0.6" strokeDasharray="3 4" strokeLinecap="round"
            />
            <circle cx="178" cy="43" r="1.5" fill="#D4AF37" />
        </svg>
    );
}
