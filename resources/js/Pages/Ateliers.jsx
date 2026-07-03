import { useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '@/Components/Layout/PublicLayout';

const NIVEAU_LABEL = {
    debutant:      'Débutant',
    intermediaire: 'Intermédiaire',
    avance:        'Avancé',
    tous:          'Tous niveaux',
};

const NIVEAU_COLOR = {
    debutant:      'bg-green-900/40 text-green-400',
    intermediaire: 'bg-blue-900/40 text-blue-400',
    avance:        'bg-secondary/20 text-secondary',
    tous:          'bg-primary/20 text-primary',
};

/* ══════════════════════════════════════
   Page principale
══════════════════════════════════════ */
export default function Ateliers({ cours = [] }) {
    return (
        <PublicLayout>
            <HeroSection />
            <CoursSection cours={cours} />
        </PublicLayout>
    );
}

/* ══════════════════════════════════════
   HeroSection — parallaxe
══════════════════════════════════════ */
function HeroSection() {
    const bgRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!bgRef.current) return;
            bgRef.current.style.transform = `translateY(${window.scrollY * 0.05}px)`;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section className="relative h-screen overflow-hidden flex items-center justify-center">
            <div
                ref={bgRef}
                className="absolute inset-[-1%]"
                style={{
                    backgroundImage: 'url(/assets/atelier.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    willChange: 'transform',
                }}
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <div className="relative z-10 text-center px-margin-mobile md:px-margin-desktop max-w-2xl mx-auto">
                <p className="font-label-technical text-label-technical text-primary uppercase tracking-widest mb-4">
                    Transmission &amp; Partage
                </p>
                <h1 className="font-display-lg text-5xl sm:text-7xl lg:text-display-lg text-primary leading-none mb-5">
                    Ateliers
                </h1>
                <p className="font-headline-md text-headline-md text-on-surface/65 italic">
                    Transmettre l'émotion par le geste. Rejoindre l'intimité de la création.
                </p>
            </div>

            {/* Indicateur de scroll */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-primary/60 animate-bounce">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 14L3 7h14l-7 7z"/>
                </svg>
            </div>
        </section>
    );
}

/* ══════════════════════════════════════
   CoursSection
══════════════════════════════════════ */
function CoursSection({ cours }) {
    return (
        <section
            id="cours"
            className="py-section-gap px-margin-mobile md:px-margin-desktop"
            style={{ backgroundColor: '#822623' }}
        >
            <div className="max-w-container-max mx-auto">
                <p className="font-label-technical text-label-technical text-on-surface/60 uppercase tracking-widest mb-3">
                    Cours réguliers
                </p>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mb-12">
                    Rejoindre un atelier
                </h2>

                {cours.length === 0 ? (
                    <p className="font-label-technical text-label-technical text-on-surface/40 text-center py-16 uppercase tracking-widest">
                        Aucun cours disponible pour le moment.
                    </p>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-gutter">
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
    const complet  = cours.places_restantes === 0;
    const illimite = cours.places_restantes === null;

    const placesLabel = complet
        ? 'Complet'
        : illimite
        ? 'Places illimitées'
        : `${cours.places_restantes} place${cours.places_restantes > 1 ? 's' : ''} restante${cours.places_restantes > 1 ? 's' : ''}`;

    return (
        <div
            className={`flex flex-col p-6 border transition-all duration-300 ${
                complet ? 'opacity-60 border-on-surface/10' : 'border-on-surface/10 hover:border-primary/40'
            }`}
            style={{ backgroundColor: '#3D1E14' }}
        >
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className={`font-label-technical text-[10px] px-2 py-0.5 uppercase tracking-wider ${NIVEAU_COLOR[cours.niveau] ?? 'bg-primary/20 text-primary'}`}>
                    {NIVEAU_LABEL[cours.niveau] ?? cours.niveau}
                </span>
                {index === 1 && (
                    <span className="font-label-technical text-[10px] px-2 py-0.5 uppercase tracking-wider bg-primary text-on-primary">
                        Conseillé
                    </span>
                )}
            </div>

            {/* Titre */}
            <h3 className="font-headline-md text-headline-md text-on-surface mb-5">
                {cours.titre}
            </h3>

            {/* Infos */}
            <div className="space-y-2.5 flex-1 mb-5">
                {cours.jour && (
                    <InfoRow icon="calendar_today">
                        {cours.jour}
                        {cours.heure_debut && ` · ${cours.heure_debut}–${cours.heure_fin}`}
                    </InfoRow>
                )}
                {cours.emplacement && (
                    <InfoRow icon="location_on">{cours.emplacement}</InfoRow>
                )}
                {cours.description && (
                    <p className="font-body-md text-sm text-on-surface/50 leading-relaxed line-clamp-3 pt-1">
                        {cours.description}
                    </p>
                )}
                <InfoRow icon="group">{placesLabel}</InfoRow>
            </div>

            {/* Pied de carte */}
            <div className="border-t border-on-surface/10 pt-5 mt-auto flex items-center justify-between gap-4">
                <p className="font-label-technical text-label-technical text-primary">
                    {cours.tarif ? `${cours.tarif} TND` : 'Sur demande'}
                </p>
                {complet ? (
                    <span className="font-label-technical text-[10px] px-4 py-2 bg-on-surface/10 text-on-surface/40 uppercase tracking-widest cursor-not-allowed">
                        Complet
                    </span>
                ) : (
                    <Link
                        href={route('contact')}
                        className="font-label-technical text-[10px] px-4 py-2 border border-primary text-primary uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-colors"
                    >
                        S'inscrire
                    </Link>
                )}
            </div>
        </div>
    );
}

/* ── Helper UI ── */
function InfoRow({ icon, children }) {
    return (
        <div className="flex items-start gap-2 text-on-surface/60">
            <span
                className="material-symbols-outlined text-primary leading-none mt-0.5 flex-shrink-0"
                style={{ fontSize: '14px' }}
            >
                {icon}
            </span>
            <span className="font-body-md text-sm">{children}</span>
        </div>
    );
}
