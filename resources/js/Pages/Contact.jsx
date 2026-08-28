import PublicLayout from '@/Components/Layout/PublicLayout';
import { useLanguage } from '@/contexts/LanguageContext';

const SOCIALS = [
    { label: 'Instagram', href: 'https://www.instagram.com/chokri.benomrane?igsi=MWxqOG9reHJxcWNxaA==',
      svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg> },
    { label: 'TikTok',    href: 'https://www.tiktok.com/@chokri.benomrane?_r=1&_t=ZS-999Fje3oasG',
      svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg> },
    { label: 'YouTube',   href: 'https://youtube.com/@chokri.benomrane?si=tIXj6eLidnN8jrwM',
      svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="3"/><polygon points="10 9 15 12 10 15" fill="currentColor" stroke="none"/></svg> },
    { label: 'Facebook',  href: 'https://www.facebook.com/share/1EFamWv5KY/',
      svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> },
];

export default function Contact() {
    const { t } = useLanguage();

    return (
        <PublicLayout>
            <div className="min-h-screen bg-background">

                {/* ── Hero image plein écran ── */}
                <div className="relative h-[55vh] min-h-[380px] overflow-hidden">
                    <img
                        src="/assets/peintre1.png"
                        alt=""
                        aria-hidden
                        className="absolute inset-0 w-full h-full object-cover object-top"
                        style={{ filter: 'brightness(0.35) saturate(0.8)' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-background" />

                    {/* Texte positionné en bas à gauche */}
                    <div className="absolute bottom-0 left-0 right-0 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pb-12">
                        <p className="font-label-technical text-label-technical text-primary uppercase tracking-[0.3em] mb-3">
                            {t('contact', 'subtitle')}
                        </p>
                        <h1 className="font-display-lg text-6xl sm:text-8xl text-on-surface leading-none">
                            {t('contact', 'title')}
                        </h1>
                    </div>
                </div>

                {/* ── Infos principales ── */}
                <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-20 grid md:grid-cols-2 gap-0 md:divide-x divide-primary/10">

                    {/* Email + Tél + Réseaux */}
                    <div className="flex flex-col gap-16 md:pr-16 pb-16 md:pb-0">
                        <div>
                            <p className="font-label-technical text-[10px] text-primary/40 uppercase tracking-[0.25em] mb-5">
                                Email
                            </p>
                            <a
                                href="mailto:contact@chokribenomrane.com"
                                className="group inline-flex items-end gap-3 font-headline-lg text-xl sm:text-2xl text-on-surface hover:text-primary transition-colors duration-300"
                            >
                                contact@chokribenomrane.com
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" className="mb-1 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-200 text-primary flex-shrink-0"><path d="M2 8h12M8 3l5 5-5 5"/></svg>
                            </a>
                        </div>

                        <div>
                            <p className="font-label-technical text-[10px] text-primary/40 uppercase tracking-[0.25em] mb-5">
                                {t('contact', 'tel')}
                            </p>
                            <a
                                href="tel:+21620579225"
                                className="font-display-lg text-5xl sm:text-6xl text-primary hover:text-secondary transition-colors duration-300 leading-none block"
                            >
                                +216 20 579 225
                            </a>
                            <p className="font-label-technical text-[10px] text-on-surface/20 uppercase tracking-widest mt-5">
                                {t('contact', 'reponse')}
                            </p>
                        </div>

                        {/* Réseaux sociaux */}
                        <div>
                            <p className="font-label-technical text-[10px] text-primary/40 uppercase tracking-[0.25em] mb-5">
                                {t('contact', 'reseaux')}
                            </p>
                            <div className="flex flex-col gap-1">
                                {SOCIALS.map(({ label, href, svg }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-4 py-3 border-b border-primary/10 text-on-surface/40 hover:text-primary hover:border-primary/30 transition-all duration-200 group"
                                    >
                                        <span className="text-primary/40 group-hover:text-primary transition-colors">{svg}</span>
                                        <span className="font-label-technical text-[11px] uppercase tracking-widest">{label}</span>
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="ml-auto opacity-0 group-hover:opacity-60 group-hover:translate-x-0.5 transition-all duration-200 text-primary"><path d="M2 6h8M6 2l4 4-4 4"/></svg>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Localisation + carte */}
                    <div className="flex flex-col gap-8 md:pl-16 pt-16 md:pt-0">
                        <div>
                            <p className="font-label-technical text-[10px] text-primary/40 uppercase tracking-[0.25em] mb-5">
                                {t('contact', 'localisation')}
                            </p>
                            <p className="font-body-md text-base text-on-surface/50 leading-relaxed whitespace-pre-line">
                                {t('contact', 'adresse')}
                            </p>
                        </div>

                        <div className="flex-1 min-h-[260px] overflow-hidden border border-primary/10">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3194.4560908058206!2d10.1823273!3d36.807589300000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd3465461b071d%3A0xdd49f8876880ece0!2sClub%20de%20peinture%20de%20Tunis!5e0!3m2!1sfr!2stn!4v1782896239982!5m2!1sfr!2stn"
                                width="100%"
                                height="100%"
                                className="w-full h-full min-h-[260px] block"
                                style={{ border: 0, filter: 'grayscale(1) brightness(0.6) sepia(0.2)' }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="strict-origin-when-cross-origin"
                                title="Club de peinture de Tunis"
                            />
                        </div>
                    </div>
                </div>

            </div>
        </PublicLayout>
    );
}
