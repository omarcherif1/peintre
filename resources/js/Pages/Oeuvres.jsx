import { useState, useEffect } from 'react';
import PublicLayout from '@/Components/Layout/PublicLayout';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Oeuvres({ peintures = [], dessins = [] }) {
    const [lightbox, setLightbox] = useState(null);

    useEffect(() => {
        document.body.style.overflow = lightbox ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [lightbox]);

    return (
        <PublicLayout>
            <main className="pt-24 pb-section-gap">
                <OeuvresHeader />
                <PeinturesSection peintures={peintures} onOpen={(t) => setLightbox({ tableau: t, imageIndex: 0 })} />
                <DessinsSection dessins={dessins} onOpen={(t) => setLightbox({ tableau: t, imageIndex: 0 })} />
            </main>

            {lightbox && (
                <Lightbox
                    tableau={lightbox.tableau}
                    imageIndex={lightbox.imageIndex}
                    onClose={() => setLightbox(null)}
                    onChangeImage={(i) => setLightbox((prev) => ({ ...prev, imageIndex: i }))}
                />
            )}
        </PublicLayout>
    );
}

function OeuvresHeader() {
    const { t } = useLanguage();
    return (
        <header className="px-margin-mobile md:px-margin-desktop mb-section-gap max-w-container-max mx-auto">
            <h1 className="font-display-lg text-5xl sm:text-7xl lg:text-display-lg text-primary mb-unit leading-none">
                {t('oeuvres','title')}
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-4">
                {t('oeuvres','desc')}
            </p>
        </header>
    );
}

function PeinturesSection({ peintures, onOpen }) {
    const { t } = useLanguage();
    return (
        <section id="peintures" className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mb-section-gap">
            <div className="sticky-section-header py-gutter mb-gutter border-b-[0.5px] border-outline-variant">
                <span className="font-label-technical text-label-technical text-secondary block mb-unit">
                    {t('oeuvres','cat')}
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface">
                    {t('oeuvres','peinture')}
                </h2>
            </div>
            {peintures.length === 0 ? (
                <p className="font-label-technical text-label-technical text-on-surface-variant text-center py-20 uppercase tracking-widest">
                    {t('oeuvres','emptyP')}
                </p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {peintures.map((tableau) => (
                        <ArtworkCard key={tableau.id} tableau={tableau} style="copper" onClick={() => onOpen(tableau)} />
                    ))}
                </div>
            )}
        </section>
    );
}

function DessinsSection({ dessins, onOpen }) {
    const { t } = useLanguage();
    return (
        <section id="dessins" className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
            <div className="sticky-section-header py-gutter mb-gutter flex items-end justify-between border-b-[0.5px] border-outline-variant">
                <div>
                    <span className="font-label-technical text-label-technical text-secondary block mb-unit">
                        {t('oeuvres','cat')}
                    </span>
                    <h2 className="font-headline-lg text-headline-lg text-on-surface">
                        {t('oeuvres','dessin')}
                    </h2>
                </div>
            </div>
            {dessins.length === 0 ? (
                <p className="font-label-technical text-label-technical text-on-surface-variant text-center py-20 uppercase tracking-widest">
                    {t('oeuvres','emptyD')}
                </p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {dessins.map((tableau) => (
                        <ArtworkCard key={tableau.id} tableau={tableau} style="gold" onClick={() => onOpen(tableau)} />
                    ))}
                </div>
            )}
        </section>
    );
}

function ArtworkCard({ tableau, style, onClick }) {
    return (
        <div
            className="relative overflow-hidden cursor-pointer group border border-primary/20 hover:border-primary/50 transition-colors duration-300"
            style={{
                aspectRatio: tableau.mesure_h && tableau.mesure_l
                    ? `${tableau.mesure_l} / ${tableau.mesure_h}`
                    : '3 / 4',
            }}
            onClick={onClick}
        >
            {tableau.image_url ? (
                <img
                    src={tableau.image_url}
                    alt={tableau.nom}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            ) : (
                <div className="absolute inset-0 bg-surface-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary/20 text-5xl">image</span>
                </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                <span className="font-label-technical text-[9px] text-primary uppercase tracking-widest">
                    {tableau.annee}{tableau.technique ? ` | ${tableau.technique.toUpperCase()}` : ''}
                </span>
                <h3 className="font-body-md text-xs text-on-surface mt-0.5 leading-tight">{tableau.nom}</h3>
                {tableau.mesure_h && (
                    <p className="font-label-technical text-[9px] text-primary/60 mt-0.5">
                        {tableau.mesure_h} × {tableau.mesure_l} cm
                    </p>
                )}
            </div>
        </div>
    );
}

function Lightbox({ tableau, imageIndex, onClose, onChangeImage }) {
    const { t } = useLanguage();
    const images  = tableau.toutes_images ?? [];
    const current = images[imageIndex] ?? null;
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    useEffect(() => {
        if (images.length <= 1) return;
        const handler = (e) => {
            if (e.key === 'ArrowLeft')  onChangeImage((imageIndex - 1 + images.length) % images.length);
            if (e.key === 'ArrowRight') onChangeImage((imageIndex + 1) % images.length);
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [imageIndex, images.length]);

    const GoldenFrame = ({ children }) => (
        <div style={{
            position: 'relative',
            padding: '14px',
            background: 'linear-gradient(135deg, #c8a84b 0%, #f0d060 20%, #a8782a 40%, #e8c84a 55%, #b89030 75%, #f0d060 90%, #c8a84b 100%)',
            boxShadow: '0 0 0 1px #7a5a18, 0 8px 40px rgba(0,0,0,0.7)',
        }}>
            <div style={{ position: 'absolute', inset: 5, border: '1px solid rgba(120,80,10,0.6)', pointerEvents: 'none', zIndex: 1 }} />
            {children}
        </div>
    );

    const InfoPanel = ({ compact }) => (
        <div className={compact ? 'p-5' : 'p-8 flex flex-col gap-5'}>
            <div className={compact ? 'flex items-start justify-between gap-3' : ''}>
                <h2 className="font-headline-md text-headline-md text-on-surface leading-tight">{tableau.nom}</h2>
                {compact && (
                    <span className={[
                        'flex-shrink-0 font-label-technical text-[10px] px-2 py-0.5 mt-1',
                        tableau.disponible ? 'bg-green-900/40 text-green-400' : 'bg-secondary/20 text-secondary',
                    ].join(' ')}>
                        {tableau.disponible ? t('oeuvres','disponible') : t('oeuvres','vendu')}
                    </span>
                )}
            </div>
            <div className={compact ? 'flex flex-wrap gap-x-6 gap-y-2 mt-3' : 'space-y-4'}>
                <LightboxRow label={t('oeuvres','labelAnnee')} value={tableau.annee} />
                <LightboxRow label={t('oeuvres','labelTech')}  value={tableau.technique} />
                {tableau.mesure_h && (
                    <LightboxRow label={t('oeuvres','labelDim')} value={`${tableau.mesure_h} × ${tableau.mesure_l} cm`} />
                )}
                {tableau.idee && (
                    <div className={compact ? 'w-full mt-1' : ''}>
                        <span className="font-label-technical text-[11px] text-on-surface-variant uppercase block mb-1">{t('oeuvres','labelIdee')}</span>
                        <p className="font-body-md text-sm text-primary/70 leading-relaxed italic">{tableau.idee}</p>
                    </div>
                )}
                {!compact && (
                    <div className="flex items-center gap-3">
                        <span className="font-label-technical text-[11px] text-on-surface-variant uppercase">{t('oeuvres','labelDispo')}</span>
                        <span className={['font-label-technical text-[11px] px-2 py-0.5', tableau.disponible ? 'bg-green-900/40 text-green-400' : 'bg-secondary/20 text-secondary'].join(' ')}>
                            {tableau.disponible ? t('oeuvres','disponible') : t('oeuvres','vendu')}
                        </span>
                    </div>
                )}
            </div>
            {!compact && images.length > 1 && (
                <div className="flex flex-wrap gap-2 pt-2">
                    {images.map((img, i) => (
                        <button key={img.id} onClick={() => onChangeImage(i)}
                            className={['w-12 h-12 overflow-hidden transition-all', i === imageIndex ? 'outline outline-2 outline-primary' : 'opacity-40 hover:opacity-80'].join(' ')}
                            aria-label={`Image ${i + 1}`}>
                            <img src={img.url} alt="" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm" onClick={onClose}>

            {/* ── MOBILE layout ── */}
            <div className="flex flex-col h-full lg:hidden" onClick={e => e.stopPropagation()}>

                {/* Image zone */}
                <div className="flex-1 flex items-center justify-center px-4 pt-14 pb-2 relative" style={{ backgroundColor: '#0a0706' }}>
                    <GoldenFrame>
                        {current
                            ? <img src={current.url} alt={tableau.nom} style={{ display: 'block', maxHeight: '52vh', maxWidth: '100%', objectFit: 'contain' }} />
                            : <div className="w-48 h-48 flex items-center justify-center"><span className="material-symbols-outlined text-primary/20 text-5xl">image</span></div>
                        }
                    </GoldenFrame>

                    {images.length > 1 && (
                        <>
                            <button onClick={() => onChangeImage((imageIndex - 1 + images.length) % images.length)}
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 border border-primary/50 text-primary flex items-center justify-center active:bg-primary active:text-background"
                                aria-label="Précédent">
                                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                            </button>
                            <button onClick={() => onChangeImage((imageIndex + 1) % images.length)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 border border-primary/50 text-primary flex items-center justify-center active:bg-primary active:text-background"
                                aria-label="Suivant">
                                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                            </button>
                        </>
                    )}
                </div>

                {/* Info strip */}
                <div className="shrink-0 border-t border-primary/20 overflow-y-auto max-h-[38vh]"
                    style={{ backgroundImage: 'radial-gradient(circle, #7a353f 0%, #2b1116 100%)' }}>
                    <InfoPanel compact />
                </div>
            </div>

            {/* ── DESKTOP layout ── */}
            <div className="hidden lg:flex items-center justify-center h-full" onClick={e => e.stopPropagation()}>
                <div className="relative flex w-full max-w-6xl mx-auto h-[90vh] border border-primary/20 overflow-hidden">

                    {/* Image panel */}
                    <div className="flex-1 flex items-center justify-center p-10 relative" style={{ backgroundColor: '#0a0706' }}>
                        <GoldenFrame>
                            {current
                                ? <img src={current.url} alt={tableau.nom} style={{ display: 'block', maxHeight: '72vh', maxWidth: '100%', objectFit: 'contain' }} />
                                : <div className="w-64 h-64 flex items-center justify-center"><span className="material-symbols-outlined text-primary/20 text-6xl">image</span></div>
                            }
                        </GoldenFrame>
                        {images.length > 1 && (
                            <>
                                <button onClick={() => onChangeImage((imageIndex - 1 + images.length) % images.length)}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 border border-primary/50 text-primary flex items-center justify-center hover:bg-primary hover:text-background transition-all"
                                    aria-label="Précédent">
                                    <span className="material-symbols-outlined">chevron_left</span>
                                </button>
                                <button onClick={() => onChangeImage((imageIndex + 1) % images.length)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 border border-primary/50 text-primary flex items-center justify-center hover:bg-primary hover:text-background transition-all"
                                    aria-label="Suivant">
                                    <span className="material-symbols-outlined">chevron_right</span>
                                </button>
                            </>
                        )}
                    </div>

                    {/* Technical sheet */}
                    <div className="w-72 overflow-y-auto flex-shrink-0"
                        style={{ backgroundImage: 'radial-gradient(circle, #7a353f 0%, #2b1116 100%)', borderLeft: '0.5px solid rgba(212,175,55,0.3)' }}>
                        <InfoPanel compact={false} />
                    </div>
                </div>
            </div>

            {/* Fermer */}
            <button onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white/60 hover:text-primary transition-colors z-10"
                aria-label="Fermer">
                <span className="material-symbols-outlined">close</span>
            </button>
        </div>
    );
}

function LightboxRow({ label, value }) {
    if (!value) return null;
    return (
        <div>
            <span className="font-label-technical text-[11px] text-on-surface-variant uppercase block mb-0.5">{label}</span>
            <span className="font-label-technical text-[13px] text-primary">{value}</span>
        </div>
    );
}
