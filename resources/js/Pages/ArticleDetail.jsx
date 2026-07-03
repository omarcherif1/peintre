import { Link } from '@inertiajs/react';
import PublicLayout from '@/Components/Layout/PublicLayout';

export default function ArticleDetail({ article }) {
    return (
        <PublicLayout>
            <main className="min-h-screen pt-32 pb-section-gap px-margin-mobile md:px-margin-desktop">
                <div className="max-w-3xl mx-auto">

                    {/* ── Retour ── */}
                    <Link
                        href={route('blog')}
                        className="font-label-technical text-label-technical text-on-surface/40 uppercase tracking-widest hover:text-primary transition-colors inline-block mb-10"
                    >
                        ← Chroniques
                    </Link>

                    {/* ── En-tête ── */}
                    <header className="mb-10">
                        <p className="font-label-technical text-label-technical text-primary uppercase tracking-widest mb-4 capitalize">
                            {article.date}
                        </p>
                        <h1 className="font-headline-lg text-3xl md:text-4xl text-primary leading-tight mb-6">
                            {article.titre}
                        </h1>
                        <div className="w-16 h-px bg-primary" />
                    </header>

                    {/* ── Image ── */}
                    {article.image_url && (
                        <div className="mb-10 gallery-frame overflow-hidden">
                            <img
                                src={article.image_url}
                                alt={article.titre}
                                className="w-full object-cover"
                                style={{ maxHeight: 500 }}
                            />
                        </div>
                    )}

                    {/* ── Contenu ── */}
                    <div
                        className="font-body-lg text-body-lg text-on-surface/80 leading-relaxed mb-16"
                        style={{ whiteSpace: 'pre-wrap' }}
                    >
                        {article.contenu}
                    </div>

                    {/* ── Navigation bas ── */}
                    <div className="border-t border-primary/20 pt-10 flex items-center justify-between">
                        <Link
                            href={route('blog')}
                            className="font-label-technical text-label-technical text-on-surface/40 uppercase tracking-widest hover:text-primary transition-colors"
                        >
                            ← Retour aux chroniques
                        </Link>
                        <p className="font-headline-md text-primary italic text-lg">
                            Chokri Benomrane
                        </p>
                    </div>
                </div>
            </main>
        </PublicLayout>
    );
}
