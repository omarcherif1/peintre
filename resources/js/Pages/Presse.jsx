import { useState, useEffect } from 'react';
import PublicLayout from '@/Components/Layout/PublicLayout';

/* ── Données statiques ── */
const ARTICLES = [
    {
        media:   "Revue d'Art Moderne",
        date:    'Mars 2024',
        titre:   "L'obscurité comme matière : Analyse d'un style ténébreux",
        extrait: '"Benomrane ne peint pas seulement avec des pigments, il sculpte le vide et lui confère une densité que l\'on peut presque toucher."',
        lien:    '#',
    },
    {
        media:   'Le Quotidien Culturel',
        date:    'Janvier 2024',
        titre:   "L'Enigma de la couleur : Quand l'ocre rencontre l'âme",
        extrait: '"Dans les toiles de Chokri Benomrane, chaque coup de pinceau semble dicté par une nécessité intérieure profonde."',
        lien:    '#',
    },
    {
        media:   "L'Observateur d'Art",
        date:    'Décembre 2023',
        titre:   "Entre Tradition et Avant-garde : Le parcours d'un maître",
        extrait: '"Comment Benomrane parvient-il à conjuguer les techniques ancestrales avec une sensibilité résolument contemporaine ?"',
        lien:    '#',
    },
];

const TEMOIGNAGES = [
    {
        texte:  '"Chokri Benomrane possède cette rare faculté de transformer l\'ombre en une source lumineuse vibrante. C\'est un alchimiste des temps modernes."',
        auteur: 'Sophie Marceau-Vignon',
        role:   'Conservatrice',
    },
    {
        texte:  '"Une œuvre qui demande du temps, du silence, et un regard sans concession. La profondeur de ses noirs est vertigineuse."',
        auteur: 'Julian K.',
        role:   'Collectionneur Privé',
    },
    {
        texte:  '"L\'équilibre parfait entre la rigueur académique et l\'explosion de l\'émotion pure. Un artiste majeur de sa génération."',
        auteur: "L'Art Aujourd'hui",
        role:   'Rédaction',
    },
];

const INTERVIEWS = [
    {
        id:      1,
        type:    'podcast',
        media:   "La Voix de l'Art",
        date:    'Octobre 2023',
        titre:   'La nuit comme territoire pictural',
        desc:    "Une conversation intime sur les origines de la démarche artistique, la couleur comme langage et le rôle de l'obscurité dans l'œuvre.",
        bouton:  'Écouter',
        icon:    'headphones',
        href:    '#',
        reverse: false,
    },
    {
        id:      2,
        type:    'tv',
        media:   'Dialogue avec les maîtres',
        date:    'Juin 2023',
        titre:   'Entretien autour de la série "Mémoires du sol"',
        desc:    "L'artiste revient sur la genèse de sa série la plus personnelle : les terres de Tunisie et la mémoire collective comme matière première.",
        bouton:  'Voir',
        icon:    'play_circle',
        href:    '#',
        reverse: true,
    },
];

/* ══════════════════════════════════════
   Page principale
══════════════════════════════════════ */
export default function Presse() {
    const [activeSection, setActiveSection] = useState('articles');
    const [currentSlide,  setCurrentSlide]  = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const interviews = document.getElementById('interviews');
            if (interviews && interviews.getBoundingClientRect().top <= 150) {
                setActiveSection('interviews');
            } else {
                setActiveSection('articles');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <PublicLayout>
            <main className="pt-24">
                <HeroHeader />
                <SousNav activeSection={activeSection} />
                <ArticlesSection />
                <InterviewsSection
                    currentSlide={currentSlide}
                    setCurrentSlide={setCurrentSlide}
                />
            </main>
        </PublicLayout>
    );
}

/* ══════════════════════════════════════
   HeroHeader
══════════════════════════════════════ */
function HeroHeader() {
    return (
        <header className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-20 mb-8 border-b border-outline-variant">
            <p className="font-label-technical text-label-technical text-primary uppercase tracking-widest mb-4">
                Revue de presse
            </p>
            <h1 className="font-display-lg text-5xl sm:text-7xl lg:text-display-lg text-on-surface leading-none mb-6">
                Presse
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                Ce que la critique, les collectionneurs et les médias disent de l'œuvre de Chokri Benomrane.
            </p>
        </header>
    );
}

/* ══════════════════════════════════════
   SousNav
══════════════════════════════════════ */
const NAV_SECTIONS = [
    { id: 'articles',   label: 'Articles' },
    { id: 'interviews', label: 'Interviews & Témoignages' },
];

function SousNav({ activeSection }) {
    const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div
            className="sticky top-[64px] z-40 border-b border-outline-variant overflow-x-auto hide-scrollbar"
            style={{ backgroundColor: 'rgba(10,7,6,0.95)', backdropFilter: 'blur(12px)' }}
        >
            <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop h-14 flex items-center gap-8 min-w-max">
                {NAV_SECTIONS.map(({ id, label }) => (
                    <button
                        key={id}
                        onClick={() => scrollTo(id)}
                        className={`font-label-technical text-label-technical uppercase tracking-widest whitespace-nowrap transition-colors duration-200 pb-0.5 ${
                            activeSection === id
                                ? 'text-primary border-b border-primary'
                                : 'text-on-surface-variant hover:text-primary'
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
}

/* ══════════════════════════════════════
   ArticlesSection
══════════════════════════════════════ */
function ArticlesSection() {
    return (
        <section
            id="articles"
            className="py-section-gap px-margin-mobile md:px-margin-desktop bg-background"
        >
            <div className="max-w-container-max mx-auto">
                <p className="font-label-technical text-label-technical text-primary uppercase tracking-widest mb-3">
                    Presse écrite
                </p>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mb-16">
                    Articles &amp; Critiques
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-gutter">
                    {ARTICLES.map((article, i) => (
                        <ArticleCard key={i} article={article} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function ArticleCard({ article }) {
    return (
        <div
            className="article-card border-t-2 border-primary flex flex-col min-h-[400px] p-8"
            style={{ backgroundColor: 'rgba(130,38,35,0.12)' }}
        >
            {/* Logo média — placeholder texte */}
            <div className="h-8 flex items-center mb-8">
                <span className="font-label-technical text-label-technical text-primary/40 uppercase tracking-widest">
                    {article.media}
                </span>
            </div>

            <p className="font-label-technical text-label-technical text-on-surface-variant uppercase tracking-widest mb-5">
                {article.date}
            </p>

            <h3 className="font-headline-md text-headline-md text-on-surface mb-5 flex-1">
                {article.titre}
            </h3>

            <p className="font-body-md text-sm text-on-surface/55 leading-relaxed italic mb-8 line-clamp-4">
                {article.extrait}
            </p>

            <a
                href={article.lien}
                className="inline-flex items-center gap-2 font-label-technical text-label-technical text-secondary uppercase tracking-widest hover:text-primary transition-colors"
            >
                Lire l'article
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                    arrow_forward
                </span>
            </a>
        </div>
    );
}

/* ══════════════════════════════════════
   InterviewsSection
══════════════════════════════════════ */
function InterviewsSection({ currentSlide, setCurrentSlide }) {
    useEffect(() => {
        const id = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % TEMOIGNAGES.length);
        }, 5000);
        return () => clearInterval(id);
    }, []);

    return (
        <section
            id="interviews"
            className="py-section-gap border-t border-outline-variant"
            style={{ backgroundColor: '#1d1b19' }}
        >
            <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">

                <p className="font-label-technical text-label-technical text-primary uppercase tracking-widest mb-3">
                    Médias
                </p>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mb-16">
                    Interviews
                </h2>

                {/* Cartes interviews */}
                <div className="flex flex-col gap-8 mb-section-gap">
                    {INTERVIEWS.map((iv) => (
                        <InterviewCard key={iv.id} interview={iv} />
                    ))}
                </div>

                {/* ── Carousel témoignages ── */}
                <div className="py-section-gap border-t border-outline-variant">
                    <p className="font-label-technical text-label-technical text-primary uppercase tracking-widest mb-3 text-center">
                        Témoignages
                    </p>
                    <h3 className="font-headline-lg text-headline-lg text-on-surface text-center mb-16">
                        Ce qu'ils disent
                    </h3>

                    <div className="relative overflow-hidden">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {TEMOIGNAGES.map((t, i) => (
                                <div
                                    key={i}
                                    className="min-w-full flex flex-col items-center text-center px-4 md:px-24"
                                >
                                    <blockquote className="font-headline-md text-headline-md text-on-secondary-container mb-8 max-w-3xl leading-relaxed italic">
                                        {t.texte}
                                    </blockquote>
                                    <cite className="font-label-technical text-label-technical text-primary uppercase tracking-widest not-italic">
                                        {t.auteur} — {t.role}
                                    </cite>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Indicateurs */}
                    <div className="flex justify-center gap-4 mt-12">
                        {TEMOIGNAGES.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentSlide(i)}
                                className={`h-[2px] w-8 transition-colors ${
                                    i === currentSlide
                                        ? 'bg-primary'
                                        : 'bg-on-secondary-container/30'
                                }`}
                                aria-label={`Témoignage ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function InterviewCard({ interview }) {
    return (
        <div
            className={`flex flex-col ${interview.reverse ? 'md:flex-row-reverse' : 'md:flex-row'} border border-outline-variant overflow-hidden`}
            style={{ backgroundColor: '#3D1E14' }}
        >
            {/* Placeholder image */}
            <div
                className="w-full md:w-72 lg:w-96 flex-shrink-0 aspect-video md:aspect-auto min-h-[200px] flex items-center justify-center relative"
                style={{ backgroundColor: '#211f1d' }}
            >
                <span className="material-symbols-outlined text-primary/20" style={{ fontSize: '64px' }}>
                    {interview.type === 'podcast' ? 'headphones' : 'movie'}
                </span>
                <span className="absolute bottom-4 left-4 font-label-technical text-[10px] text-primary/40 uppercase tracking-widest">
                    {interview.type === 'podcast' ? 'Podcast' : 'Vidéo'}
                </span>
            </div>

            {/* Contenu */}
            <div className="flex flex-col justify-center gap-4 p-8">
                <div className="flex items-center gap-3">
                    <span className="font-label-technical text-label-technical text-primary uppercase tracking-widest">
                        {interview.media}
                    </span>
                    <span className="text-on-surface/20">·</span>
                    <span className="font-label-technical text-label-technical text-on-surface-variant">
                        {interview.date}
                    </span>
                </div>

                <h3 className="font-headline-md text-headline-md text-on-surface">
                    {interview.titre}
                </h3>

                <p className="font-body-md text-sm text-on-surface/60 leading-relaxed max-w-lg">
                    {interview.desc}
                </p>

                <a
                    href={interview.href}
                    className="self-start inline-flex items-center gap-2 border border-primary text-primary px-6 py-3 font-label-technical text-label-technical uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-colors mt-2"
                >
                    <span className="material-symbols-outlined leading-none" style={{ fontSize: '16px' }}>
                        {interview.icon}
                    </span>
                    {interview.bouton}
                </a>
            </div>
        </div>
    );
}
