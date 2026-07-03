import { useForm, usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import PublicLayout from '@/Components/Layout/PublicLayout';

export default function Contact() {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        nom:       '',
        email:     '',
        telephone: '',
        sujet:     'acquisition',
        message:   '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('contact.envoyer'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <PublicLayout>
            <main className="min-h-screen pt-32 pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">

                {/* Header */}
                <header className="mb-section-gap text-center md:text-left">
                    <h1 className="font-headline-lg text-headline-lg text-primary mb-4">
                        Contact
                    </h1>
                    <p className="font-body-lg text-body-lg text-on-surface-variant tracking-wider uppercase opacity-80">
                        Acquisitions · Expositions · Ateliers · Commandes privées
                    </p>
                </header>

                {/* Flash succès */}
                {flash?.success && (
                    <div className="mb-8 p-4 border border-primary/30 bg-primary/10 font-label-technical text-label-technical text-primary">
                        {flash.success}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter lg:gap-section-gap">

                    {/* Colonne gauche — coordonnées */}
                    <ContactInfo />

                    {/* Colonne droite — formulaire */}
                    <div className="md:col-span-7">
                        <div
                            className="p-margin-mobile md:p-gutter border-[0.5px] border-primary-container/20"
                            style={{ backgroundColor: '#1d1b19' }}
                        >
                            <h3 className="font-headline-md text-headline-md text-primary mb-12">
                                Formulaire d'Enquête
                            </h3>

                            <form className="space-y-12" onSubmit={handleSubmit}>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                                    <Field label="Nom Complet" error={errors.nom}>
                                        <input
                                            type="text"
                                            value={data.nom}
                                            onChange={(e) => setData('nom', e.target.value)}
                                            placeholder="Votre nom..."
                                            className="w-full bg-transparent border-b border-primary-container/30 py-4 font-body-md text-on-surface placeholder:text-on-surface/30 focus:border-primary focus:outline-none transition-all"
                                        />
                                    </Field>
                                    <Field label="Email" error={errors.email}>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="votre@email.com"
                                            className="w-full bg-transparent border-b border-primary-container/30 py-4 font-body-md text-on-surface placeholder:text-on-surface/30 focus:border-primary focus:outline-none transition-all"
                                        />
                                    </Field>
                                </div>

                                <Field label="Numéro de téléphone" error={errors.telephone}>
                                    <input
                                        type="tel"
                                        value={data.telephone}
                                        onChange={(e) => setData('telephone', e.target.value.replace(/\D/g, '').slice(0, 8))}
                                        placeholder="12345678"
                                        maxLength={8}
                                        className="w-full bg-transparent border-b border-primary-container/30 py-4 font-body-md text-on-surface placeholder:text-on-surface/30 focus:border-primary focus:outline-none transition-all"
                                    />
                                </Field>

                                <Field label="Sujet de la demande" error={errors.sujet}>
                                    <div className="relative">
                                        <select
                                            value={data.sujet}
                                            onChange={(e) => setData('sujet', e.target.value)}
                                            className="w-full bg-transparent border-b border-primary-container/30 py-4 font-body-md text-on-surface focus:border-primary focus:outline-none appearance-none cursor-pointer"
                                        >
                                            <option value="acquisition" className="bg-surface-container">Acquisition d'œuvre</option>
                                            <option value="exposition"  className="bg-surface-container">Projet d'exposition</option>
                                            <option value="atelier"     className="bg-surface-container">Ateliers &amp; Cours</option>
                                            <option value="commande"    className="bg-surface-container">Commande privée</option>
                                            <option value="presse"      className="bg-surface-container">Presse &amp; Médias</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-0 bottom-4 text-primary pointer-events-none">
                                            keyboard_arrow_down
                                        </span>
                                    </div>
                                </Field>

                                <Field label="Votre Message" error={errors.message}>
                                    <textarea
                                        rows={4}
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        placeholder="Comment pouvons-nous vous aider ?"
                                        className="w-full bg-transparent border-b border-primary-container/30 py-4 font-body-md text-on-surface placeholder:text-on-surface/30 focus:border-primary focus:outline-none resize-none transition-all"
                                    />
                                </Field>

                                <div className="flex justify-end pt-6">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-primary text-on-primary px-12 py-4 font-label-technical text-label-technical uppercase tracking-[0.2em] hover:bg-secondary transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {processing ? 'ENVOI...' : 'Envoyer'}
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </PublicLayout>
    );
}

function Field({ label, error, children }) {
    return (
        <div>
            <label className="font-label-technical text-label-technical text-on-surface-variant uppercase mb-2 block">
                {label}
            </label>
            {children}
            {error && (
                <p className="font-label-technical text-[11px] text-secondary mt-1">{error}</p>
            )}
        </div>
    );
}

function ContactInfo() {
    return (
        <div className="md:col-span-5 flex flex-col space-y-12">

            <section>
                <h3 className="font-label-technical text-label-technical text-primary-container mb-6 tracking-widest uppercase">
                    Direct
                </h3>
                <div className="space-y-4">
                    <a
                        href="mailto:contact@chokribenomrane.com"
                        className="block font-headline-md text-headline-md text-primary hover:text-secondary transition-colors duration-300 break-words"
                    >
                        contact@chokribenomrane.com
                    </a>
                    <p className="font-body-md text-body-md text-on-surface">
                        +216 20 579 225
                    </p>
                </div>
                <div className="mt-8 border-t-[0.5px] border-primary-container/30 pt-4">
                    <p className="font-label-technical text-label-technical text-on-surface-variant italic">
                        Réponse sous 48h
                    </p>
                </div>
            </section>

            <section>
                <h3 className="font-label-technical text-label-technical text-primary-container mb-6 tracking-widest uppercase">
                    Réseaux Sociaux
                </h3>
                <div className="flex flex-col gap-5">
                    {[
                        {
                            label: 'Instagram', href: '#',
                            svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>,
                        },
                        {
                            label: 'WhatsApp', href: '#',
                            svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>,
                        },
                        {
                            label: 'Facebook', href: '#',
                            svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
                        },
                    ].map(({ label, href, svg }) => (
                        <a key={label} href={href} className="flex items-center gap-4 group">
                            <span className="text-primary group-hover:text-secondary transition-colors">
                                {svg}
                            </span>
                            <span className="font-body-md text-body-md group-hover:text-primary transition-colors">
                                {label}
                            </span>
                        </a>
                    ))}
                </div>
            </section>

            <section>
                <h3 className="font-label-technical text-label-technical text-primary-container mb-6 tracking-widest uppercase">
                    Localisation
                </h3>
                <p className="font-body-md text-body-md leading-relaxed text-on-surface">
                    Atelier de l'Artiste<br />
                    Centre ville , Tunis<br />
                    Tunisie
                </p>
                <div className="mt-8 w-full border border-outline-variant overflow-hidden" style={{ height: 260 }}>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3194.4560908058206!2d10.1823273!3d36.807589300000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd3465461b071d%3A0xdd49f8876880ece0!2sClub%20de%20peinture%20de%20Tunis!5e0!3m2!1sfr!2stn!4v1782896239982!5m2!1sfr!2stn"
                        width="100%"
                        height="100%"
                        style={{ border: 0, display: 'block' }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="strict-origin-when-cross-origin"
                        title="Club de peinture de Tunis"
                    />
                </div>
            </section>

        </div>
    );
}
