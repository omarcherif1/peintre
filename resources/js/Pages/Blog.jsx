import { useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '@/Components/Layout/PublicLayout';

export default function Blog({ articles = [] }) {
    const gridRef = useRef(null);

    useEffect(() => {
        const cards = gridRef.current?.querySelectorAll('.reveal-card');
        if (!cards?.length) return;

        const observer = new IntersectionObserver(
            (entries) => entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('active');
                    observer.unobserve(e.target);
                }
            }),
            { threshold: 0.12 }
        );
        cards.forEach(c => observer.observe(c));
        return () => observer.disconnect();
    }, [articles]);

    return (
        <PublicLayout>
            <main className="min-h-screen pt-32 pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">

                {/* ── En-tête ── */}
                <header className="text-center mb-16">
                    <p className="font-label-technical text-label-technical text-primary uppercase tracking-widest mb-3">
                        Chroniques
                    </p>
                    <h1 className="font-headline-lg text-4xl md:text-5xl text-primary mb-4">
                        Chroniques de l'Atelier
                    </h1>
                    <div className="w-12 h-px bg-primary mx-auto mb-5" />
                    <p className="font-body-lg text-body-lg text-on-surface/60 max-w-xl mx-auto">
                        Réflexions, processus et regards sur la création picturale.
                    </p>
                </header>

                {/* ── Grille articles ── */}
                {articles.length === 0 ? (
                    <div className="text-center py-20">
                        <span className="material-symbols-outlined text-primary/30 text-5xl block mb-4">edit_note</span>
                        <p className="font-label-technical text-label-technical text-on-surface/30 uppercase tracking-widest">
                            Aucune chronique publiée pour l'instant.
                        </p>
                    </div>
                ) : (
                    <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                        {articles.map((article, i) => (
                            <ArticleCard key={article.id} article={article} delay={i * 80} />
                        ))}
                    </div>
                )}

                {/* ── Newsletter statique ── */}
                <section className="border-t border-primary/20 pt-16 mt-8">
                    <div className="max-w-xl mx-auto text-center">
                        <p className="font-label-technical text-label-technical text-primary uppercase tracking-widest mb-3">
                            Restez informé
                        </p>
                        <h2 className="font-headline-md text-2xl text-primary mb-4">
                            Suivre l'atelier
                        </h2>
                        <p className="font-body-md text-on-surface/50 mb-8">
                            Retrouvez les nouvelles créations et les prochaines expositions sur nos réseaux sociaux.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-block btn-primary px-8 py-3 font-label-technical text-label-technical uppercase tracking-widest transition-all duration-300"
                        >
                            Nous contacter
                        </Link>
                    </div>
                </section>
            </main>
        </PublicLayout>
    );
}

function ArticleCard({ article, delay }) {
    return (
        <article
            className="reveal-card gallery-frame flex flex-col overflow-hidden"
            style={{ transitionDelay: `${delay}ms` }}
        >
            {/* Image ou placeholder */}
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

            {/* Corps */}
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
                    Lire la chronique →
                </Link>
            </div>
        </article>
    );
}
