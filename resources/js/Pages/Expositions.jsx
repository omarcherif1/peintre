import { useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Components/Layout/PublicLayout';
import { useLanguage } from '@/contexts/LanguageContext';

const pad = (n) => String(Math.max(0, n)).padStart(2, '0');

export default function Expositions({ foireAVenir = null, foiresPassees = [] }) {
    return (
        <PublicLayout>
            <Head>
                <title>Expositions — Chokri Benomrane, Peintre Tunisien</title>
                <meta name="description" content="Calendrier des expositions et foires d'art de Chokri Benomrane en Tunisie et à l'international. Découvrez les prochains événements du peintre de l'absurde." />
                <meta name="keywords" content="exposition Chokri Benomrane, foire art Tunis, exposition peinture tunisienne, art tunisien" />
            </Head>
            <main className="pt-24 pb-section-gap">
                {foireAVenir ? <HeroFoire foire={foireAVenir} /> : <EmptyHero />}
                <TimelineSection foires={foiresPassees} />
            </main>
        </PublicLayout>
    );
}

function EmptyHero() {
    const { t } = useLanguage();
    return (
        <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mb-section-gap py-24 text-center">
            <span className="material-symbols-outlined text-primary/20 text-6xl block mb-6">event</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">
                {t('expositions','emptyTitle')}
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
                {t('expositions','emptyDesc')}
            </p>
        </section>
    );
}

function HeroFoire({ foire }) {
    const { t } = useLanguage();
    const locale = t('expositions','locale');

    const formatDateFoire = (debut, fin) => {
        const fmt = (d) => d ? new Date(d + 'T12:00:00').toLocaleDateString(locale, { month: 'long', year: 'numeric' }) : '';
        const d = fmt(debut), f = fmt(fin);
        if (!fin || d === f) return d;
        return `${d} — ${f}`;
    };

    return (
        <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mb-section-gap">
            <div className="grid md:grid-cols-2 gap-gutter items-center">

                <div className="relative aspect-[4/3] overflow-hidden">
                    {foire.image_url ? (
                        <img src={foire.image_url} alt={foire.nom} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-surface-container flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary/20 text-6xl">image</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
                </div>

                <div className="flex flex-col gap-6 py-4">
                    <span
                        className="self-start font-label-technical text-label-technical uppercase tracking-widest px-3 py-1 text-on-surface"
                        style={{ backgroundColor: '#822623' }}
                    >
                        {t('expositions','prochain')}
                    </span>

                    <h2 className="font-headline-lg text-headline-lg text-on-surface">{foire.nom}</h2>

                    <div className="flex items-center gap-2 text-on-surface-variant">
                        <span className="material-symbols-outlined text-primary leading-none" style={{ fontSize: '18px' }}>location_on</span>
                        <span className="font-body-md text-sm">{foire.emplacement}</span>
                    </div>

                    <p className="font-label-technical text-label-technical text-primary uppercase tracking-widest">
                        {formatDateFoire(foire.date_debut, foire.date_fin)}
                    </p>

                    {foire.description && (
                        <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">{foire.description}</p>
                    )}

                    <Countdown targetDate={foire.date_debut} />

                    <Link
                        href={route('contact')}
                        className="self-start inline-flex items-center gap-3 border border-primary text-primary px-6 py-3 font-label-technical text-label-technical uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-colors duration-300"
                    >
                        {t('expositions','contacter')}
                        <span className="material-symbols-outlined leading-none" style={{ fontSize: '16px' }}>arrow_forward</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}

function Countdown({ targetDate }) {
    const { t } = useLanguage();
    const [time, setTime] = useState({ days: 0, hours: 0, mins: 0 });

    useEffect(() => {
        const calc = () => {
            const diff = new Date(targetDate + 'T00:00:00') - Date.now();
            if (diff <= 0) { setTime({ days: 0, hours: 0, mins: 0 }); return; }
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
                { value: time.days,  key: 'jours' },
                { value: time.hours, key: 'heures' },
                { value: time.mins,  key: 'minutes' },
            ].map(({ value, key }) => (
                <div key={key} className="text-center">
                    <div className="countdown-item font-display-lg text-5xl font-bold text-primary leading-none">{pad(value)}</div>
                    <div className="font-label-technical text-label-technical text-on-surface-variant uppercase tracking-widest mt-2">
                        {t('expositions', key)}
                    </div>
                </div>
            ))}
        </div>
    );
}

function TimelineSection({ foires }) {
    const { t } = useLanguage();

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
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
                    {t('expositions','emptyPassee')}
                </p>
            </section>
        );
    }

    return (
        <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mb-section-gap">
            <div className="mb-16">
                <p className="font-label-technical text-label-technical text-primary uppercase tracking-widest mb-3">
                    {t('expositions','historiqueTag')}
                </p>
                <h2 className="font-headline-lg text-headline-lg text-on-surface">
                    {t('expositions','historiqueTitle')}
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant mt-4 max-w-xl">
                    {t('expositions','historiqueDesc')}
                </p>
            </div>

            <div className="relative">
                <div className="timeline-line hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0" />
                {foires.map((foire, index) => (
                    <TimelineItem key={foire.id} foire={foire} index={index} />
                ))}
            </div>
        </section>
    );
}

function TimelineItem({ foire, index }) {
    const { t } = useLanguage();
    const locale = t('expositions','locale');
    const isEven = index % 2 === 0;
    const year   = foire.date_debut ? new Date(foire.date_debut + 'T12:00:00').getFullYear() : '—';

    return (
        <div className="relative flex items-start md:items-center mb-12 md:mb-20">
            <div className="hidden md:flex flex-1 justify-end pr-14">
                {isEven
                    ? <FoireCard foire={foire} locale={locale} />
                    : <span className="font-display-lg text-6xl font-bold text-primary/20 leading-none self-center">{year}</span>
                }
            </div>
            <div className="w-4 h-4 bg-primary rounded-full z-10 flex-shrink-0 mr-5 md:mx-0 mt-1 md:mt-0" />
            <div className="flex-1 md:pl-14">
                <div className="md:hidden"><FoireCard foire={foire} locale={locale} /></div>
                <div className="hidden md:block">
                    {!isEven
                        ? <FoireCard foire={foire} locale={locale} />
                        : <span className="font-display-lg text-6xl font-bold text-primary/20 leading-none block">{year}</span>
                    }
                </div>
            </div>
        </div>
    );
}

function FoireCard({ foire, locale }) {
    const formatDateFoire = (debut, fin) => {
        const fmt = (d) => d ? new Date(d + 'T12:00:00').toLocaleDateString(locale, { month: 'long', year: 'numeric' }) : '';
        const d = fmt(debut), f = fmt(fin);
        if (!fin || d === f) return d;
        return `${d} — ${f}`;
    };

    return (
        <div className="art-card-glow max-w-sm w-full p-6" style={{ backgroundImage: 'radial-gradient(circle, #7a353f 0%, #2b1116 100%)' }}>
            {foire.image_url && (
                <div className="w-full aspect-video overflow-hidden mb-5">
                    <img src={foire.image_url} alt={foire.nom} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                </div>
            )}
            <p className="font-label-technical text-label-technical text-primary uppercase tracking-widest mb-2">
                {formatDateFoire(foire.date_debut, foire.date_fin)}
            </p>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-3">{foire.nom}</h3>
            <div className="flex items-center gap-2 text-on-surface-variant mb-3">
                <span className="material-symbols-outlined text-primary leading-none" style={{ fontSize: '16px' }}>location_on</span>
                <span className="font-body-md text-sm">{foire.emplacement}</span>
            </div>
            {foire.description && (
                <p className="font-body-md text-sm text-on-surface/60 leading-relaxed line-clamp-3">{foire.description}</p>
            )}
        </div>
    );
}

