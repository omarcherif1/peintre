import { useState, useEffect } from 'react';
import PublicLayout from '@/Components/Layout/PublicLayout';

export default function Oeuvres({ peintures = [], dessins = [] }) {
    const [lightbox, setLightbox] = useState(null);

    /* Bloquer le scroll body quand lightbox ouverte */
    useEffect(() => {
        document.body.style.overflow = lightbox ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [lightbox]);

    return (
        <PublicLayout>
            <main className="pt-24 pb-section-gap">

                {/* ── Header ── */}
                <header className="px-margin-mobile md:px-margin-desktop mb-section-gap max-w-container-max mx-auto">
                    <h1 className="font-display-lg text-5xl sm:text-7xl lg:text-display-lg text-primary mb-unit leading-none">
                        Galerie
                    </h1>
                    <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-4">
                        Explorez l'univers visuel de Chokri Benomrane — peintures à l'huile, acryliques et dessins qui traversent le temps et la mémoire.
                    </p>
                </header>

                {/* ════════════════════════════
                    SECTION · Peintures
                ════════════════════════════ */}
                <section
                    id="peintures"
                    className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mb-section-gap"
                >
                    {/* Header section */}
                    <div className="sticky-section-header py-gutter mb-gutter border-b-[0.5px] border-outline-variant">
                        <span className="font-label-technical text-label-technical text-secondary block mb-unit">
                            CATÉGORIE
                        </span>
                        <h2 className="font-headline-lg text-headline-lg text-on-surface">
                            Peinture
                        </h2>
                    </div>

                    {peintures.length === 0 ? (
                        <p className="font-label-technical text-label-technical text-on-surface-variant text-center py-20 uppercase tracking-widest">
                            Aucune peinture disponible.
                        </p>
                    ) : (
                        <div className="masonry-grid">
                            {peintures.map((tableau) => (
                                <ArtworkCard
                                    key={tableau.id}
                                    tableau={tableau}
                                    style="copper"
                                    onClick={() => setLightbox({ tableau, imageIndex: 0 })}
                                />
                            ))}
                        </div>
                    )}
                </section>

                {/* ════════════════════════════
                    SECTION · Dessins
                ════════════════════════════ */}
                <section
                    id="dessins"
                    className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto"
                >
                    <div className="sticky-section-header py-gutter mb-gutter flex items-end justify-between border-b-[0.5px] border-outline-variant">
                        <div>
                            <span className="font-label-technical text-label-technical text-secondary block mb-unit">
                                CATÉGORIE
                            </span>
                            <h2 className="font-headline-lg text-headline-lg text-on-surface">
                                Dessins                            </h2>
                        </div>
                    </div>

                    {dessins.length === 0 ? (
                        <p className="font-label-technical text-label-technical text-on-surface-variant text-center py-20 uppercase tracking-widest">
                            Aucun dessin disponible.
                        </p>
                    ) : (
                        <div className="masonry-grid">
                            {dessins.map((tableau) => (
                                <ArtworkCard
                                    key={tableau.id}
                                    tableau={tableau}
                                    style="gold"
                                    onClick={() => setLightbox({ tableau, imageIndex: 0 })}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {/* ── Lightbox ── */}
            {lightbox && (
                <Lightbox
                    tableau={lightbox.tableau}
                    imageIndex={lightbox.imageIndex}
                    onClose={() => setLightbox(null)}
                    onChangeImage={(i) =>
                        setLightbox((prev) => ({ ...prev, imageIndex: i }))
                    }
                />
            )}
        </PublicLayout>
    );
}

/* ══════════════════════════════════════
   Composant ArtworkCard
══════════════════════════════════════ */
function ArtworkCard({ tableau, style, onClick }) {
    const frameClass = style === 'copper'
        ? 'copper-frame bg-surface-container'
        : 'gold-border p-unit bg-surface-container-low';

    return (
        <div
            className={`artwork-card ${frameClass} overflow-hidden group cursor-pointer`}
            onClick={onClick}
        >
            {tableau.image_url ? (
                <img
                    src={tableau.image_url}
                    alt={tableau.nom}
                    className="w-full h-auto object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                    loading="lazy"
                />
            ) : (
                <div className="w-full aspect-square bg-surface-container-highest flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary/20 text-6xl">image</span>
                </div>
            )}

            <div className="reveal-overlay">
                <span className="font-label-technical text-label-technical text-primary mb-unit">
                    {tableau.annee}{tableau.technique ? ` | ${tableau.technique.toUpperCase()}` : ''}
                </span>
                <h3 className="font-headline-md text-headline-md text-on-surface">
                    {tableau.nom}
                </h3>
                {tableau.mesure_h && (
                    <p className="font-label-technical text-[11px] text-primary/60 mt-1">
                        {tableau.mesure_h} × {tableau.mesure_l} cm
                    </p>
                )}
            </div>
        </div>
    );
}

/* ══════════════════════════════════════
   Composant Lightbox
══════════════════════════════════════ */
function Lightbox({ tableau, imageIndex, onClose, onChangeImage }) {
    const images   = tableau.toutes_images ?? [];
    const current  = images[imageIndex] ?? null;
    const [expanded, setExpanded] = useState(false);

    /* Fermeture ESC */
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    /* Navigation clavier ← → */
    useEffect(() => {
        if (images.length <= 1) return;
        const handler = (e) => {
            if (e.key === 'ArrowLeft')  onChangeImage((imageIndex - 1 + images.length) % images.length);
            if (e.key === 'ArrowRight') onChangeImage((imageIndex + 1) % images.length);
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [imageIndex, images.length]);

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center bg-background/98 backdrop-blur-sm"
            onClick={onClose}
        >
            {/* Panneau principal */}
            <div
                className="relative flex flex-col lg:flex-row w-full max-w-7xl mx-auto h-full lg:h-auto max-h-screen p-4 lg:p-0"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ── Image + description ── */}
                <div className="relative flex-1 flex flex-col overflow-hidden bg-surface-container min-h-[50vh] lg:min-h-0">
                    {/* Image dans cadre doré */}
                    <div className="relative flex-1 flex items-center justify-center p-8">
                        {/* Cadre luxueux en or */}
                        <div style={{
                            position: 'relative',
                            padding: '18px',
                            background: 'linear-gradient(135deg, #c8a84b 0%, #f0d060 20%, #a8782a 40%, #e8c84a 55%, #b89030 75%, #f0d060 90%, #c8a84b 100%)',
                            boxShadow: '0 0 0 1px #7a5a18, 0 8px 40px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,220,80,0.3)',
                        }}>
                            {/* Filet intérieur */}
                            <div style={{
                                position: 'absolute',
                                inset: 6,
                                border: '1px solid rgba(120,80,10,0.6)',
                                pointerEvents: 'none',
                            }} />
                            {/* Coins décoratifs */}
                            {[['top-1','left-1'],['top-1','right-1'],['bottom-1','left-1'],['bottom-1','right-1']].map(([v,h],i) => (
                                <div key={i} style={{
                                    position: 'absolute',
                                    [v.split('-')[0]]: 4,
                                    [h.split('-')[0]]: 4,
                                    width: 12, height: 12,
                                    borderTop: v === 'top-1' ? '2px solid rgba(120,80,10,0.7)' : 'none',
                                    borderBottom: v === 'bottom-1' ? '2px solid rgba(120,80,10,0.7)' : 'none',
                                    borderLeft: h === 'left-1' ? '2px solid rgba(120,80,10,0.7)' : 'none',
                                    borderRight: h === 'right-1' ? '2px solid rgba(120,80,10,0.7)' : 'none',
                                }} />
                            ))}
                            {current ? (
                                <img
                                    src={current.url}
                                    alt={tableau.nom}
                                    style={{ display: 'block', maxHeight: '58vh', maxWidth: '100%', objectFit: 'contain' }}
                                />
                            ) : (
                                <div className="w-64 h-64 bg-surface-container-highest flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary/20 text-6xl">image</span>
                                </div>
                            )}
                        </div>

                        {/* Navigation ← → */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={() => onChangeImage((imageIndex - 1 + images.length) % images.length)}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-primary text-primary flex items-center justify-center hover:bg-primary hover:text-background transition-all"
                                    aria-label="Image précédente"
                                >
                                    <span className="material-symbols-outlined">chevron_left</span>
                                </button>
                                <button
                                    onClick={() => onChangeImage((imageIndex + 1) % images.length)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-primary text-primary flex items-center justify-center hover:bg-primary hover:text-background transition-all"
                                    aria-label="Image suivante"
                                >
                                    <span className="material-symbols-outlined">chevron_right</span>
                                </button>
                            </>
                        )}
                    </div>

                    {/* Description sous l'image */}
                    {tableau.description && (
                        <div className="px-6 pt-4 pb-2 border-t shrink-0" style={{ borderColor: 'rgba(212,175,55,0.15)' }}>
                            <span className="font-label-technical text-[11px] text-on-surface-variant uppercase tracking-widest block mb-2">
                                Description
                            </span>
                            <div className={expanded ? 'overflow-y-auto max-h-40' : ''}>
                                <p className={[
                                    'font-body-md text-sm text-on-surface/60 leading-relaxed',
                                    expanded ? '' : 'line-clamp-3',
                                ].join(' ')}>
                                    {tableau.description}
                                </p>
                            </div>
                            <button
                                onClick={() => setExpanded(!expanded)}
                                className="font-label-technical text-[10px] text-primary uppercase tracking-widest mt-1.5 mb-2 hover:text-primary/70 transition-colors"
                            >
                                {expanded ? 'Réduire ↑' : 'Afficher plus...'}
                            </button>
                        </div>
                    )}
                </div>

                {/* ── Fiche technique ── */}
                <div
                    className="w-full lg:w-80 bg-surface p-8 flex flex-col gap-6 overflow-y-auto"
                    style={{ borderLeft: '0.5px solid rgba(212,175,55,0.3)' }}
                >
                    <h2 className="font-headline-md text-headline-md text-on-surface">
                        {tableau.nom}
                    </h2>

                    <div className="space-y-4">
                        <Row label="Année"     value={tableau.annee} />
                        <Row label="Technique" value={tableau.technique} />
                        {tableau.mesure_h && (
                            <Row label="Dimensions" value={`${tableau.mesure_h} × ${tableau.mesure_l} cm`} />
                        )}
                        {tableau.idee && (
                            <div>
                                <span className="font-label-technical text-[11px] text-on-surface-variant uppercase block mb-1">
                                    Idée
                                </span>
                                <p className="font-body-md text-sm text-primary/70 leading-relaxed italic">
                                    {tableau.idee}
                                </p>
                            </div>
                        )}
                        <div className="flex items-center gap-3">
                            <span className="font-label-technical text-[11px] text-on-surface-variant uppercase">
                                Disponibilité
                            </span>
                            <span className={[
                                'font-label-technical text-[11px] px-2 py-0.5',
                                tableau.disponible
                                    ? 'bg-green-900/40 text-green-400'
                                    : 'bg-secondary/20 text-secondary',
                            ].join(' ')}>
                                {tableau.disponible ? 'Disponible' : 'Vendu'}
                            </span>
                        </div>
                    </div>

                    {/* Miniatures si plusieurs images */}
                    {images.length > 1 && (
                        <div className="flex flex-wrap gap-2">
                            {images.map((img, i) => (
                                <button
                                    key={img.id}
                                    onClick={() => onChangeImage(i)}
                                    className={[
                                        'w-14 h-14 overflow-hidden transition-all',
                                        i === imageIndex
                                            ? 'outline outline-2 outline-primary'
                                            : 'opacity-50 hover:opacity-100',
                                    ].join(' ')}
                                    aria-label={`Image ${i + 1}`}
                                >
                                    <img
                                        src={img.url}
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Bouton fermer ── */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-on-surface hover:text-primary transition-colors"
                    aria-label="Fermer"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>
        </div>
    );
}

/* ── Helper Row ── */
function Row({ label, value }) {
    if (!value) return null;
    return (
        <div>
            <span className="font-label-technical text-[11px] text-on-surface-variant uppercase block mb-0.5">
                {label}
            </span>
            <span className="font-label-technical text-[13px] text-primary">
                {value}
            </span>
        </div>
    );
}
