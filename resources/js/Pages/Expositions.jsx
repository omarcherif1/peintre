import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '@/Components/Layout/PublicLayout';

/* ── Helpers ── */
const formatDate = (isoStr) => {
    if (!isoStr) return '';
    return new Date(isoStr + 'T12:00:00').toLocaleDateString('fr-FR', {
        month: 'long',
        year: 'numeric',
    });
};

const formatDateFoire = (debut, fin) => {
    const d = formatDate(debut);
    const f = formatDate(fin);
    if (!fin || d === f) return d;
    return `${d} — ${f}`;
};

const pad = (n) => String(Math.max(0, n)).padStart(2, '0');

/* ══════════════════════════════════════
   Page principale
══════════════════════════════════════ */
export default function Expositions({ foireAVenir = null, foiresPassees = [] }) {
    return (
        <PublicLayout>
            <main className="pt-24 pb-section-gap">

                {/* ── Hero : foire à venir ou message vide ── */}
                {foireAVenir
                    ? <HeroFoire foire={foireAVenir} />
                    : <EmptyHero />
                }

                {/* ── Timeline expositions passées ── */}
                <TimelineSection foires={foiresPassees} />

                {/* ── Newsletter ── */}
                <NewsletterSection />

            </main>
        </PublicLayout>
    );
}

/* ══════════════════════════════════════
   EmptyHero
══════════════════════════════════════ */
function EmptyHero() {
    return (
        <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mb-section-gap py-24 text-center">
            <span className="material-symbols-outlined text-primary/20 text-6xl block mb-6">event</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">
                Aucune exposition à venir
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
                Restez informé en vous inscrivant à la newsletter ci-dessous.
            </p>
        </section>
    );
}

/* ══════════════════════════════════════
   HeroFoire
══════════════════════════════════════ */
function HeroFoire({ foire }) {
    return (
        <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mb-section-gap">
            <div className="grid md:grid-cols-2 gap-gutter items-center">

                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                    {foire.image_url ? (
                        <img
                            src={foire.image_url}
                            alt={foire.nom}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-surface-container flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary/20 text-6xl">image</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
                </div>

                {/* Contenu */}
                <div className="flex flex-col gap-6 py-4">

                    {/* Badge Prochain */}
                    <span
                        className="self-start font-label-technical text-label-technical uppercase tracking-widest px-3 py-1 text-on-surface"
                        style={{ backgroundColor: '#822623' }}
                    >
                        Prochain
                    </span>

                    <h2 className="font-headline-lg text-headline-lg text-on-surface">
                        {foire.nom}
                    </h2>

                    {/* Emplacement */}
                    <div className="flex items-center gap-2 text-on-surface-variant">
                        <span className="material-symbols-outlined text-primary leading-none" style={{ fontSize: '18px' }}>
                            location_on
                        </span>
                        <span className="font-body-md text-sm">{foire.emplacement}</span>
                    </div>

                    {/* Date */}
                    <p className="font-label-technical text-label-technical text-primary uppercase tracking-widest">
                        {formatDateFoire(foire.date_debut, foire.date_fin)}
                    </p>

                    {/* Description */}
                    {foire.description && (
                        <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                            {foire.description}
                        </p>
                    )}

                    {/* Countdown */}
                    <Countdown targetDate={foire.date_debut} />

                    {/* CTA */}
                    <Link
                        href={route('contact')}
                        className="self-start inline-flex items-center gap-3 border border-primary text-primary px-6 py-3 font-label-technical text-label-technical uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-colors duration-300"
                    >
                        Nous contacter
                        <span className="material-symbols-outlined leading-none" style={{ fontSize: '16px' }}>
                            arrow_forward
                        </span>
                    </Link>
                </div>
            </div>
        </section>
    );
}

/* ══════════════════════════════════════
   Countdown
══════════════════════════════════════ */
function Countdown({ targetDate }) {
    const [time, setTime] = useState({ days: 0, hours: 0, mins: 0 });

    useEffect(() => {
        const calc = () => {
            const diff = new Date(targetDate + 'T00:00:00') - Date.now();
            if (diff <= 0) {
                setTime({ days: 0, hours: 0, mins: 0 });
                return;
            }
            setTime({
                days:  Math.floor(diff / 86_400_000),
                hours: Math.floor((diff % 86_400_000) / 3_600_000),
                mins:  Math.floor((diff % 3_600_000) / 60_000),
            });
        };
        calc();
        const id = setInterval(calc, 1000);
        return () => clearInterval(id);
    }, [targetDate]);

    return (
        <div className="flex gap-8 py-2">
            {[
                { value: time.days,  label: 'Jours' },
                { value: time.hours, label: 'Heures' },
                { value: time.mins,  label: 'Minutes' },
            ].map(({ value, label }) => (
                <div key={label} className="text-center">
                    <div className="countdown-item font-display-lg text-5xl font-bold text-primary leading-none">
                        {pad(value)}
                    </div>
                    <div className="font-label-technical text-label-technical text-on-surface-variant uppercase tracking-widest mt-2">
                        {label}
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ══════════════════════════════════════
   TimelineSection
══════════════════════════════════════ */
function TimelineSection({ foires }) {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );

        document.querySelectorAll('.art-card-glow').forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [foires]);

    if (foires.length === 0) {
        return (
            <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mb-section-gap py-20 text-center">
                <p className="font-label-technical text-label-technical text-on-surface-variant uppercase tracking-widest">
                    Aucune exposition passée enregistrée.
                </p>
            </section>
        );
    }

    return (
        <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mb-section-gap">

            {/* En-tête */}
            <div className="mb-16">
                <p className="font-label-technical text-label-technical text-primary uppercase tracking-widest mb-3">
                    Historique
                </p>
                <h2 className="font-headline-lg text-headline-lg text-on-surface">
                    Expositions passées
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant mt-4 max-w-xl">
                    Un parcours à travers les galeries et foires qui ont marqué le travail de Chokri Benomrane.
                </p>
            </div>

            {/* Timeline */}
            <div className="relative">
                {/* Ligne verticale centrale */}
                <div className="timeline-line hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0" />

                {foires.map((foire, index) => (
                    <TimelineItem key={foire.id} foire={foire} index={index} />
                ))}
            </div>
        </section>
    );
}

/* ══════════════════════════════════════
   TimelineItem — alternance gauche/droite
══════════════════════════════════════ */
function TimelineItem({ foire, index }) {
    const isEven = index % 2 === 0; // pair → card gauche, numéro droite
    const year   = foire.date_debut ? new Date(foire.date_debut + 'T12:00:00').getFullYear() : '—';

    return (
        <div className="relative flex items-start md:items-center mb-12 md:mb-20">

            {/* ── Côté gauche (desktop) ── */}
            <div className="hidden md:flex flex-1 justify-end pr-14">
                {isEven
                    ? <FoireCard foire={foire} />
                    : <span className="font-display-lg text-6xl font-bold text-primary/20 leading-none self-center">
                        {year}
                      </span>
                }
            </div>

            {/* ── Point central ── */}
            <div className="w-4 h-4 bg-primary rounded-full z-10 flex-shrink-0 mr-5 md:mx-0 mt-1 md:mt-0" />

            {/* ── Côté droit (desktop) + tout (mobile) ── */}
            <div className="flex-1 md:pl-14">
                {/* Mobile — toujours la card */}
                <div className="md:hidden">
                    <FoireCard foire={foire} />
                </div>
                {/* Desktop */}
                <div className="hidden md:block">
                    {!isEven
                        ? <FoireCard foire={foire} />
                        : <span className="font-display-lg text-6xl font-bold text-primary/20 leading-none block">
                            {year}
                          </span>
                    }
                </div>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════
   FoireCard
══════════════════════════════════════ */
function FoireCard({ foire }) {
    return (
        <div
            className="art-card-glow max-w-sm w-full p-6"
            style={{ backgroundColor: '#3D1E14' }}
        >
            {/* Image optionnelle */}
            {foire.image_url && (
                <div className="w-full aspect-video overflow-hidden mb-5">
                    <img
                        src={foire.image_url}
                        alt={foire.nom}
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                    />
                </div>
            )}

            <p className="font-label-technical text-label-technical text-primary uppercase tracking-widest mb-2">
                {formatDateFoire(foire.date_debut, foire.date_fin)}
            </p>

            <h3 className="font-headline-md text-headline-md text-on-surface mb-3">
                {foire.nom}
            </h3>

            <div className="flex items-center gap-2 text-on-surface-variant mb-3">
                <span
                    className="material-symbols-outlined text-primary leading-none"
                    style={{ fontSize: '16px' }}
                >
                    location_on
                </span>
                <span className="font-body-md text-sm">{foire.emplacement}</span>
            </div>

            {foire.description && (
                <p className="font-body-md text-sm text-on-surface/60 leading-relaxed line-clamp-3">
                    {foire.description}
                </p>
            )}
        </div>
    );
}

/* ══════════════════════════════════════
   NewsletterSection
══════════════════════════════════════ */
function NewsletterSection() {
    const [email, setEmail]         = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email.trim()) setSubscribed(true);
    };

    return (
        <section
            className="px-margin-mobile md:px-margin-desktop py-section-gap"
            style={{ backgroundColor: '#3D1E14' }}
        >
            <div className="max-w-container-max mx-auto">
                <div className="max-w-xl mx-auto text-center">

                    <p className="font-label-technical text-label-technical text-primary uppercase tracking-widest mb-4">
                        Newsletter
                    </p>
                    <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">
                        Restez informé
                    </h2>
                    <p className="font-body-lg text-body-lg text-on-surface-variant mb-10">
                        Recevez les actualités et les prochaines expositions de Chokri Benomrane directement dans votre boîte mail.
                    </p>

                    {subscribed ? (
                        <div className="flex flex-col items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-5xl">check_circle</span>
                            <p className="font-headline-md text-headline-md text-primary">Merci !</p>
                            <p className="font-body-md text-sm text-on-surface-variant">
                                Vous recevrez nos prochaines actualités par e-mail.
                            </p>
                        </div>
                    ) : (
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="votre@email.com"
                                required
                                className="flex-1 bg-surface-container-low border border-outline-variant px-4 py-3 font-body-md text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors"
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 bg-primary text-on-primary font-label-technical text-label-technical uppercase tracking-widest hover:bg-primary/90 transition-colors whitespace-nowrap"
                            >
                                S'abonner
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}
