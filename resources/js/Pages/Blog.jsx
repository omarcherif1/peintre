import { useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Components/Layout/PublicLayout';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Blog({ articles = [] }) {
    const gridRef = useRef(null);

    useEffect(() => {
        const cards = gridRef.current?.querySelectorAll('.reveal-card');
        if (!cards?.length) return;
        const observer = new IntersectionObserver(
            (entries) => entries.forEach(e => {
                if (e.isIntersecting) { e.target.classList.add('active'); observer.unobserve(e.target); }
            }),
            { threshold: 0.12 }
        );
        cards.forEach(c => observer.observe(c));
        return () => observer.disconnect();
    }, [articles]);

    return (
        <PublicLayout>
            <Head>
                <title>Blog — Chokri Benomrane, Peintre Tunisien</title>
                <meta name="description" content="Articles et réflexions du peintre tunisien Chokri Benomrane sur l'art, la peinture de l'absurde et la création artistique." />
                <meta name="keywords" content="blog Chokri Benomrane, articles art tunisien, peinture absurde blog, réflexions peintre tunisien" />
            </Head>
            <main className="min-h-screen pt-32 pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
                <BlogHeader />

                {articles.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                        {articles.map((article, i) => (
                            <ArticleCard key={article.id} article={article} delay={i * 80} />
                        ))}
                    </div>
                )}

                {/* <BlogNewsletter /> */}
            </main>
        </PublicLayout>
    );
}

function BlogHeader() {
    const { t } = useLanguage();
    return (
        <header className="text-center mb-16">
            <p className="font-label-technical text-label-technical text-primary uppercase tracking-widest mb-3">
                {t('blog','heroTag')}
            </p>
            <h1 className="font-headline-lg text-4xl md:text-5xl text-primary mb-4">
                {t('blog','heroTitle')}
            </h1>
            <div className="w-12 h-px bg-primary mx-auto mb-5" />
            <p className="font-body-lg text-body-lg text-on-surface/60 max-w-xl mx-auto">
                {t('blog','heroDesc')}
            </p>
        </header>
    );
}

function EmptyState() {
    const { t } = useLanguage();
    return (
        <div className="text-center py-20">
            <span className="material-symbols-outlined text-primary/30 text-5xl block mb-4">edit_note</span>
            <p className="font-label-technical text-label-technical text-on-surface/30 uppercase tracking-widest">
                {t('blog','empty')}
            </p>
        </div>
    );
}

function BlogNewsletter() {
    const { t } = useLanguage();
    return (
        <section className="border-t border-primary/20 pt-16 mt-8">
            <div className="max-w-xl mx-auto text-center">
                <p className="font-label-technical text-label-technical text-primary uppercase tracking-widest mb-3">
                    {t('blog','nlTag')}
                </p>
                <h2 className="font-headline-md text-2xl text-primary mb-4">
                    {t('blog','nlTitle')}
                </h2>
                <p className="font-body-md text-on-surface/50 mb-8">
                    {t('blog','nlDesc')}
                </p>
                <Link
                    href="/contact"
                    className="inline-block btn-primary px-8 py-3 font-label-technical text-label-technical uppercase tracking-widest transition-all duration-300"
                >
                    {t('blog','nlCta')}
                </Link>
            </div>
        </section>
    );
}

function ArticleCard({ article, delay }) {
    const { t } = useLanguage();
    return (
        <article
            className="reveal-card gallery-frame flex flex-col overflow-hidden"
            style={{ transitionDelay: `${delay}ms` }}
        >
            <div className="relative overflow-hidden" style={{ height: 220 }}>
                {article.image_url ? (
                    <img
                        src={article.image_url}
                        alt={article.titre}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ background: '#1c1916' }}>
                        <span className="material-symbols-outlined text-primary/20" style={{ fontSize: '3rem' }}>edit_note</span>
                    </div>
                )}
            </div>

            <div className="flex flex-col flex-1 p-6" style={{ background: '#1c1916' }}>
                <p className="font-label-technical text-label-technical text-primary/60 uppercase tracking-widest mb-2">
                    {article.date}
                </p>
                <h2 className="font-headline-md text-xl text-primary mb-3 leading-snug">
                    {article.titre}
                </h2>
                <p className="font-body-md text-on-surface/60 text-sm leading-relaxed line-clamp-3 flex-1 mb-5">
                    {article.extrait}
                </p>
                <Link
                    href={route('blog.article', article.id)}
                    className="btn-primary self-start px-5 py-2 font-label-technical text-label-technical uppercase tracking-widest text-xs transition-all duration-300"
                >
                    {t('blog','lire')}
                </Link>
            </div>
        </article>
    );
}
