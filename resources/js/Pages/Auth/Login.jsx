import { useEffect, useRef, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';

export default function Login({ status }) {
    const emailRef = useRef(null);
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email:    '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        emailRef.current?.focus();
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <>
            <Head title="Connexion — Chokri Benomrane" />

            <div className="min-h-screen bg-background flex items-center justify-center px-6 relative overflow-hidden">

                {/* Motif décoratif en fond */}
                <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                    <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] opacity-[0.04]" viewBox="0 0 700 700" fill="none">
                        <circle cx="350" cy="350" r="340" stroke="#D4AF37" strokeWidth="1"/>
                        <circle cx="350" cy="350" r="260" stroke="#D4AF37" strokeWidth="1"/>
                        <circle cx="350" cy="350" r="180" stroke="#D4AF37" strokeWidth="1"/>
                        <circle cx="350" cy="350" r="100" stroke="#D4AF37" strokeWidth="1"/>
                        <line x1="0" y1="350" x2="700" y2="350" stroke="#D4AF37" strokeWidth="0.5"/>
                        <line x1="350" y1="0" x2="350" y2="700" stroke="#D4AF37" strokeWidth="0.5"/>
                    </svg>
                </div>

                {/* Carte centrale */}
                <div className="relative z-10 w-full max-w-md">

                    {/* En-tête identité */}
                    <div className="mb-10 text-center">
                        <div className="w-8 h-px bg-primary mx-auto mb-5" />
                        <p className="font-label-technical text-label-technical text-primary uppercase tracking-widest mb-3">
                            Espace artiste
                        </p>
                        <h1 className="font-headline-lg text-on-surface" style={{ fontSize: '2.2rem', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                            Chokri <span className="text-primary">Benomrane</span>
                        </h1>
                    </div>

                    {/* Panneau formulaire */}
                    <div className="bg-surface relative" style={{ borderTop: '1px solid #D4AF37' }}>

                        <div className="px-8 py-8">
                            <div className="mb-7">
                                <h2 className="font-headline-lg text-on-surface mb-1" style={{ fontSize: '1.4rem', fontWeight: 400 }}>
                                    Connexion
                                </h2>
                                <p className="font-label-technical text-label-technical text-on-surface/40 uppercase tracking-widest">
                                    Administration
                                </p>
                            </div>

                            {status && (
                                <div className="mb-6 px-4 py-3 border border-primary/30 bg-primary/5 font-label-technical text-label-technical text-primary">
                                    {status}
                                </div>
                            )}

                            <form onSubmit={submit} noValidate className="flex flex-col gap-5">

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block font-label-technical text-label-technical text-primary uppercase tracking-widest mb-2">
                                        Adresse e-mail
                                    </label>
                                    <input
                                        ref={emailRef}
                                        id="email"
                                        type="email"
                                        name="email"
                                        autoComplete="username"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        placeholder="admin@exemple.com"
                                        className={[
                                            'w-full bg-background text-on-surface font-body-md px-4 py-3',
                                            'border focus:outline-none transition-colors',
                                            'placeholder:text-on-surface/20',
                                            errors.email
                                                ? 'border-secondary-container'
                                                : 'border-outline-variant focus:border-primary',
                                        ].join(' ')}
                                    />
                                    {errors.email && (
                                        <p className="font-label-technical text-label-technical text-secondary-container mt-1">{errors.email}</p>
                                    )}
                                </div>

                                {/* Mot de passe */}
                                <div>
                                    <label htmlFor="password" className="block font-label-technical text-label-technical text-primary uppercase tracking-widest mb-2">
                                        Mot de passe
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            autoComplete="current-password"
                                            value={data.password}
                                            onChange={e => setData('password', e.target.value)}
                                            placeholder="••••••••"
                                            className={[
                                                'w-full bg-background text-on-surface font-body-md px-4 py-3 pr-11',
                                                'border focus:outline-none transition-colors',
                                                'placeholder:text-on-surface/20',
                                                errors.password
                                                    ? 'border-secondary-container'
                                                    : 'border-outline-variant focus:border-primary',
                                            ].join(' ')}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(v => !v)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface/40 hover:text-primary transition-colors"
                                            aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                                        >
                                            {showPassword ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                                                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                                                    <line x1="1" y1="1" x2="23" y2="23"/>
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                                    <circle cx="12" cy="12" r="3"/>
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="font-label-technical text-label-technical text-secondary-container mt-1">{errors.password}</p>
                                    )}
                                </div>

                                {/* Se souvenir */}
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={e => setData('remember', e.target.checked)}
                                        style={{ accentColor: '#D4AF37', width: 14, height: 14 }}
                                    />
                                    <span className="font-label-technical text-label-technical text-on-surface/40 uppercase tracking-widest">
                                        Se souvenir de moi
                                    </span>
                                </label>

                                {/* Bouton */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={[
                                        'w-full py-3 font-label-technical text-label-technical uppercase tracking-widest transition-all mt-1',
                                        processing
                                            ? 'bg-primary/40 text-on-primary/40 cursor-not-allowed'
                                            : 'bg-primary text-on-primary hover:bg-primary/90 cursor-pointer',
                                    ].join(' ')}
                                >
                                    {processing ? 'Connexion…' : 'Se connecter'}
                                </button>
                            </form>
                        </div>

                        {/* Pied de panneau */}
                        <div className="px-8 pb-6 border-t border-on-surface/10 pt-5">
                            <a
                                href="/"
                                className="font-label-technical text-label-technical text-on-surface/30 uppercase tracking-widest hover:text-primary transition-colors"
                            >
                                ← Retour au site
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
