import { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Components/Layout/AdminLayout';

const C = {
    card:   '#1c1916',
    border: '#2a2520',
    gold:   '#D4AF37',
    cream:  '#F4EFEA',
    muted:  'rgba(244,239,234,0.4)',
    input:  '#0e0c0a',
    red:    '#822623',
};

export default function Edit({ article }) {
    const { data, setData, post, errors, processing } = useForm({
        _method:          'PUT',
        titre:            article.titre,
        contenu:          article.contenu,
        publie:           article.publie,
        ordre:            article.ordre ?? 0,
        image:            null,
        supprimer_image:  false,
    });

    const [preview, setPreview] = useState(null);

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setData('image', file);
        setPreview(URL.createObjectURL(file));
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.articles.update', article.id), { forceFormData: true });
    };

    return (
        <AdminLayout>
            <div style={{ maxWidth: 820 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
                    <Link href={route('admin.articles.index')} style={lienRetour}>← Articles</Link>
                    <h1 style={pageTitle}>Modifier : {article.titre}</h1>
                </div>

                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                    <Field label="Titre" error={errors.titre} required>
                        <input
                            type="text"
                            value={data.titre}
                            onChange={e => setData('titre', e.target.value)}
                            style={inputSt(errors.titre)}
                        />
                    </Field>

                    <Field label="Contenu" error={errors.contenu} required>
                        <textarea
                            value={data.contenu}
                            onChange={e => setData('contenu', e.target.value)}
                            rows={12}
                            style={{ ...inputSt(errors.contenu), fontFamily: '"DM Mono", monospace', fontSize: '0.82rem', resize: 'vertical' }}
                        />
                    </Field>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                        <Field label="Ordre d'affichage" error={errors.ordre}>
                            <input
                                type="number"
                                min="0"
                                value={data.ordre}
                                onChange={e => setData('ordre', e.target.value)}
                                style={inputSt(errors.ordre)}
                            />
                        </Field>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', paddingTop: '1.5rem' }}>
                            <input
                                type="checkbox"
                                id="publie"
                                checked={data.publie}
                                onChange={e => setData('publie', e.target.checked)}
                                style={{ width: 14, height: 14, accentColor: C.gold, cursor: 'pointer' }}
                            />
                            <label htmlFor="publie" style={{ ...lblSt, margin: 0, cursor: 'pointer' }}>
                                Publié
                            </label>
                        </div>
                    </div>

                    {/* Image existante */}
                    <div>
                        <p style={lblSt}>Image de couverture</p>
                        {article.image_url && !data.supprimer_image && (
                            <div style={{ marginBottom: '0.75rem' }}>
                                <img
                                    src={article.image_url}
                                    alt="Image actuelle"
                                    style={{ maxHeight: 200, objectFit: 'cover', border: `1px solid ${C.border}`, display: 'block' }}
                                />
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                                    <input
                                        type="checkbox"
                                        id="supprimer_image"
                                        checked={data.supprimer_image}
                                        onChange={e => setData('supprimer_image', e.target.checked)}
                                        style={{ width: 14, height: 14, accentColor: C.red, cursor: 'pointer' }}
                                    />
                                    <label htmlFor="supprimer_image" style={{ ...lblSt, color: '#f87171', margin: 0, cursor: 'pointer' }}>
                                        Supprimer l'image
                                    </label>
                                </div>
                            </div>
                        )}
                        {!data.supprimer_image && (
                            <Field label={article.image_url ? 'Remplacer par une nouvelle image' : 'Ajouter une image'} error={errors.image}>
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleImage}
                                    style={{ ...inputSt(errors.image), cursor: 'pointer' }}
                                />
                                {preview && (
                                    <img src={preview} alt="Aperçu" style={{ marginTop: '0.75rem', maxHeight: 200, objectFit: 'cover', border: `1px solid ${C.border}` }} />
                                )}
                            </Field>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', paddingTop: '0.5rem', borderTop: `1px solid ${C.border}`, marginTop: '0.5rem' }}>
                        <button type="submit" disabled={processing} style={processing ? { ...btnGold, opacity: 0.55, cursor: 'not-allowed' } : btnGold}>
                            {processing ? 'Enregistrement…' : 'Mettre à jour'}
                        </button>
                        <Link href={route('admin.articles.index')} style={btnAnnuler}>Annuler</Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

function Field({ label: lbl, error, required, children }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={lblSt}>{lbl}{required && <span style={{ color: C.red, marginLeft: 2 }}>*</span>}</label>
            {children}
            {error && <p style={{ color: C.red, fontFamily: '"DM Mono",monospace', fontSize: '0.65rem', margin: '0.25rem 0 0', letterSpacing: '0.06em' }}>{error}</p>}
        </div>
    );
}

const pageTitle  = { fontFamily: '"Playfair Display", serif', fontSize: '1.6rem', fontWeight: 400, color: C.cream, margin: 0 };
const lblSt      = { fontFamily: '"DM Mono", monospace', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.gold, marginBottom: '0.4rem' };
const inputSt    = (err) => ({ width: '100%', padding: '0.55rem 0.75rem', boxSizing: 'border-box', background: C.input, color: C.cream, border: `1px solid ${err ? C.red : C.border}`, fontFamily: 'Lato, sans-serif', fontSize: '0.875rem', outline: 'none' });
const btnGold    = { background: C.gold, color: '#0A0706', border: 'none', padding: '0.6rem 1.5rem', fontFamily: '"DM Mono", monospace', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', fontWeight: 700 };
const btnAnnuler = { padding: '0.6rem 1rem', color: C.muted, fontFamily: '"DM Mono", monospace', fontSize: '0.68rem', textDecoration: 'none', alignSelf: 'center', letterSpacing: '0.08em', textTransform: 'uppercase' };
const lienRetour = { color: C.muted, textDecoration: 'none', fontFamily: '"DM Mono", monospace', fontSize: '0.7rem', letterSpacing: '0.08em' };
