import { useState, useEffect } from 'react';
import PublicLayout from '@/Components/Layout/PublicLayout';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Presse({ articles = [], interviews = [] }) {
    const [activeSection, setActiveSection] = useState('articles');

    useEffect(() => {
        const handleScroll = () => {
            const el = document.getElementById('interviews');
            if (el && el.getBoundingClientRect().top <= 150) {
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
                <ArticlesSection articles={articles} />
                <InterviewsSection interviews={interviews} />
            </main>
        </PublicLayout>
    );
}

function HeroHeader() {
    const { t } = useLanguage();
    return (
        <header className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-20 mb-8 border-b border-outline-variant">
            <p className="font-label-technical text-label-technical text-primary uppercase tracking-widest mb-4">
                {t('presse','heroTag')}
            </p>
            <h1 className="font-display-lg text-5xl sm:text-7xl lg:text-display-lg text-on-surface leading-none mb-6">
                {t('presse','heroTitle')}
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                {t('presse','heroDesc')}
            </p>
        </header>
    );
}

function SousNav({ activeSection }) {
    const { t } = useLanguage();
    const NAV_SECTIONS = [
        { id: 'articles',   labelKey: 'navArticles' },
        { id: 'interviews', labelKey: 'navInterviews' },
    ];

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
                {NAV_SECTIONS.map(({ id, labelKey }) => (
                    <button
                        key={id}
                        onClick={() => scrollTo(id)}
                        className={`font-label-technical text-label-technical uppercase tracking-widest whitespace-nowrap transition-colors duration-200 pb-0.5 ${
                            activeSection === id
                                ? 'text-primary border-b border-primary'
                                : 'text-on-surface-variant hover:text-primary'
                        }`}
                    >
                        {t('presse', labelKey)}
                    </button>
                ))}
            </div>
        </div>
    );
}

function ArticlesSection({ articles }) {
    const { t } = useLanguage();
    return (
        <section id="articles" className="py-section-gap px-margin-mobile md:px-margin-desktop bg-background">
            <div className="max-w-container-max mx-auto">
                <p className="font-label-technical text-label-technical text-primary uppercase tracking-widest mb-3">
                    {t('presse','articlesTag')}
                </p>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mb-16">
                    {t('presse','articlesTitle')}
                </h2>

                {articles.length === 0 ? (
                    <p className="font-label-technical text-label-technical text-on-surface/30 text-center py-20 uppercase tracking-widest">
                        {t('presse','articlesEmpty')}
                    </p>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-gutter">
                        {articles.map((article) => (
                            <ArticleCard key={article.id} article={article} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

function ArticleCard({ article }) {
    const { t } = useLanguage();
    return (
        <div
            className="article-card border-t-2 border-primary flex flex-col min-h-[400px] p-8"
            style={{ backgroundColor: 'rgba(130,38,35,0.12)' }}
        >
            <div className="h-8 flex items-center mb-8">
                <span className="font-label-technical text-label-technical text-primary/40 uppercase tracking-widest">
                    {article.media}
                </span>
            </div>
            <p className="font-label-technical text-label-technical text-on-surface-variant uppercase tracking-widest mb-5">
                {article.date_publication}
            </p>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-5 flex-1">
                {article.titre}
            </h3>
            {article.extrait && (
                <p className="font-body-md text-sm text-on-surface/55 leading-relaxed italic mb-8 line-clamp-4">
                    {article.extrait}
                </p>
            )}
            {article.lien && (
                <a
                    href={article.lien}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-label-technical text-label-technical text-secondary uppercase tracking-widest hover:text-primary transition-colors mt-auto"
                >
                    {t('presse','lireArticle')}
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
                </a>
            )}
        </div>
    );
}

function InterviewsSection({ interviews }) {
    const { t } = useLanguage();
    return (
        <section id="interviews" className="py-section-gap border-t border-outline-variant" style={{ backgroundColor: '#1d1b19' }}>
            <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
                <p className="font-label-technical text-label-technical text-primary uppercase tracking-widest mb-3">
                    {t('presse','interviewsTag')}
                </p>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mb-16">
                    {t('presse','interviewsTitle')}
                </h2>

                {interviews.length === 0 ? (
                    <p className="font-label-technical text-label-technical text-on-surface/30 text-center py-20 uppercase tracking-widest">
                        {t('presse','interviewsEmpty')}
                    </p>
                ) : (
                    <div className="flex flex-col gap-8">
                        {interviews.map((iv, index) => (
                            <InterviewCard key={iv.id} interview={iv} reverse={index % 2 !== 0} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

function InterviewCard({ interview, reverse }) {
    const { t } = useLanguage();
    const bouton = interview.type === 'podcast' ? t('presse','ecouter') : t('presse','voir');
    const icon   = interview.type === 'podcast' ? 'headphones' : 'play_circle';

    return (
        <div
            className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} border border-outline-variant overflow-hidden`}
            style={{ backgroundImage: 'radial-gradient(circle, #7a353f 0%, #2b1116 100%)' }}
        >
            <div
                className="w-full md:w-72 lg:w-96 flex-shrink-0 aspect-video md:aspect-auto min-h-[200px] flex items-center justify-center relative"
                style={{ backgroundColor: '#211f1d' }}
            >
                {interview.image_url ? (
                    <img src={interview.image_url} alt={interview.titre} className="w-full h-full object-cover" />
                ) : (
                    <>
                        <span className="material-symbols-outlined text-primary/20" style={{ fontSize: '64px' }}>
                            {interview.type === 'podcast' ? 'headphones' : 'movie'}
                        </span>
                        <span className="absolute bottom-4 left-4 font-label-technical text-[10px] text-primary/40 uppercase tracking-widest">
                            {interview.type === 'podcast' ? t('presse','podcast') : t('presse','video')}
                        </span>
                    </>
                )}
            </div>

            <div className="flex flex-col justify-center gap-4 p-8">
                <div className="flex items-center gap-3">
                    <span className="font-label-technical text-label-technical text-primary uppercase tracking-widest">{interview.media}</span>
                    <span className="text-on-surface/20">·</span>
                    <span className="font-label-technical text-label-technical text-on-surface-variant">{interview.date_publication}</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface">{interview.titre}</h3>
                {interview.description && (
                    <p className="font-body-md text-sm text-on-surface/60 leading-relaxed max-w-lg">{interview.description}</p>
                )}
                {interview.url && (
                    <a
                        href={interview.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="self-start inline-flex items-center gap-2 border border-primary text-primary px-6 py-3 font-label-technical text-label-technical uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-colors mt-2"
                    >
                        <span className="material-symbols-outlined leading-none" style={{ fontSize: '16px' }}>{icon}</span>
                        {bouton}
                    </a>
                )}
            </div>
        </div>
    );
}
