import { useState, useEffect } from 'react';
import { router, usePage, useForm } from '@inertiajs/react';
import AdminLayout from '@/Components/Layout/AdminLayout';
import DragZone from '@/Components/Admin/DragZone';

const C = {
    bg:      '#0A0706',
    card:    '#1c1916',
    border:  '#2a2520',
    gold:    '#D4AF37',
    cream:   '#F4EFEA',
    muted:   'rgba(244,239,234,0.4)',
    surface: '#211f1d',
    input:   '#0e0c0a',
    red:     '#822623',
};

const tronquer = (str, n) => str && str.length > n ? str.slice(0, n) + '…' : str;

/* ══════════════════════════════════════
   Page Index
══════════════════════════════════════ */
export default function Index({ articles }) {
    const { flash } = usePage().props;
    const [modal, setModal] = useState(null);

    useEffect(() => {
        document.body.style.overflow = modal ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [modal]);

    const supprimer = (id, titre) => {
        if (!confirm(`Supprimer "${titre}" ?`)) return;
        router.delete(route('admin.articles.destroy', id));
    };

    return (
        <AdminLayout>
            {flash?.success && <div style={flashSuccess}>{flash.success}</div>}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <p style={surtitle}>Administration</p>
                    <h1 style={pageTitle}>
                        Articles <span style={{ color: C.muted, fontSize: '0.6em' }}>({articles.length})</span>
                    </h1>
                </div>
                <button onClick={() => setModal('create')} style={btnGold}>
                    + Nouvel article
                </button>
            </div>

            <div style={{ border: `1px solid ${C.border}`, overflow: 'hidden' }}>
                {articles.length === 0 ? (
                    <p style={{ padding: '3rem', textAlign: 'center', color: C.muted, fontFamily: '"DM Mono", monospace', fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        Aucun article rédigé.
                    </p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
                                {['Image', 'Titre', 'Extrait', 'Date', 'Statut', 'Ord.', 'Actions'].map(h => (
                                    <th key={h} style={th}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {articles.map((a, i) => (
                                <tr key={a.id} style={{ background: i % 2 === 0 ? C.card : C.surface, borderBottom: `1px solid ${C.border}` }}>
                                    <td style={{ ...td, width: 70 }}>
                                        {a.image_url ? (
                                            <img src={a.image_url} alt="" style={{ width: 60, height: 60, objectFit: 'cover', display: 'block', border: `1px solid ${C.border}` }} />
                                        ) : (
                                            <div style={{ width: 60, height: 60, background: '#120f0c', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <span className="material-symbols-outlined" style={{ color: C.muted, fontSize: '1.2rem' }}>edit_note</span>
                                            </div>
                                        )}
                                    </td>
                                    <td style={{ ...td, color: C.cream, fontWeight: 500, maxWidth: 200 }}>
                                        {tronquer(a.titre, 40)}
                                    </td>
                                    <td style={{ ...td, maxWidth: 260 }}>
                                        {tronquer(a.extrait, 80)}
                                    </td>
                                    <td style={{ ...td, whiteSpace: 'nowrap' }}>{a.created_at}</td>
                                    <td style={td}>
                                        <span style={a.publie ? badgePublie : badgeBrouillon}>
                                            {a.publie ? 'Publié' : 'Brouillon'}
                                        </span>
                                    </td>
                                    <td style={td}>{a.ordre}</td>
                                    <td style={td}>
                                        <div style={{ display: 'flex', gap: 8, whiteSpace: 'nowrap' }}>
                                            <button onClick={() => setModal(a)} style={btnEdit}>
                                                Modifier
                                            </button>
                                            <button onClick={() => supprimer(a.id, a.titre)} style={btnDel}>
                                                Supprimer
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {modal && (
                <ArticleModal
                    key={modal === 'create' ? 'create' : modal.id}
                    mode={modal === 'create' ? 'create' : 'edit'}
                    article={modal === 'create' ? null : modal}
                    onClose={() => setModal(null)}
                />
            )}
        </AdminLayout>
    );
}

/* ══════════════════════════════════════
   Modal Article
══════════════════════════════════════ */
function ArticleModal({ mode, article, onClose }) {
    const isEdit = mode === 'edit';
    const { data, setData, post, errors, processing } = useForm({
        ...(isEdit ? { _method: 'PUT' } : {}),
        titre:           article?.titre           ?? '',
        contenu:         article?.contenu         ?? '',
        publie:          article?.publie          ?? false,
        ordre:           article?.ordre           ?? 0,
        image:           null,
        supprimer_image: false,
    });

    const [preview, setPreview] = useState(null);

    const handleFiles = (files) => {
        const file = files[0];
        if (!file) return;
        setData('image', file);
        if (preview) URL.revokeObjectURL(preview);
        setPreview(URL.createObjectURL(file));
    };

    const submit = (e) => {
        e.preventDefault();
        const r = isEdit
            ? route('admin.articles.update', article.id)
            : route('admin.articles.store');
        post(r, { forceFormData: true, onSuccess: onClose });
    };

    return (
        <Overlay onClose={onClose}>
            <ModalHeader
                title={isEdit ? `Modifier : ${tronquer(article.titre, 40)}` : 'Nouvel article'}
                onClose={onClose}
            />
            <form onSubmit={submit} style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

                <Field label="Titre" error={errors.titre} required>
                    <input
                        type="text"
                        value={data.titre}
                        onChange={e => setData('titre', e.target.value)}
                        style={inputSt(errors.titre)}
                        placeholder="Titre de la chronique…"
                    />
                </Field>

                <Field label="Contenu" error={errors.contenu} required>
                    <textarea
                        value={data.contenu}
                        onChange={e => setData('contenu', e.target.value)}
                        rows={12}
                        style={{ ...inputSt(errors.contenu), fontFamily: '"DM Mono", monospace', fontSize: '0.8rem', resize: 'vertical', lineHeight: 1.7 }}
                        placeholder="Rédigez votre chronique…"
                    />
                </Field>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <Field label="Ordre d'affichage" error={errors.ordre}>
                        <input
                            type="number"
                            min="0"
                            value={data.ordre}
                            onChange={e => setData('ordre', e.target.value)}
                            style={inputSt(errors.ordre)}
                        />
                    </Field>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', paddingTop: '1.4rem' }}>
                        <input
                            type="checkbox"
                            id="publie-modal"
                            checked={data.publie}
                            onChange={e => setData('publie', e.target.checked)}
                            style={{ width: 14, height: 14, accentColor: C.gold, cursor: 'pointer' }}
                        />
                        <label htmlFor="publie-modal" style={{ ...lblSt, margin: 0, cursor: 'pointer' }}>
                            Publier
                        </label>
                    </div>
                </div>

                {/* Image existante (mode edit) */}
                {isEdit && article.image_url && (
                    <div>
                        <p style={lblSt}>Image actuelle</p>
                        <img
                            src={article.image_url}
                            alt=""
                            style={{ maxHeight: 160, objectFit: 'cover', border: `1px solid ${C.border}`, display: 'block', marginBottom: '0.6rem', opacity: data.supprimer_image ? 0.3 : 1, transition: 'opacity 0.2s' }}
                        />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input
                                type="checkbox"
                                id="supprimer_image"
                                checked={data.supprimer_image}
                                onChange={e => setData('supprimer_image', e.target.checked)}
                                style={{ width: 14, height: 14, accentColor: '#f87171', cursor: 'pointer' }}
                            />
                            <label htmlFor="supprimer_image" style={{ ...lblSt, color: '#f87171', margin: 0, cursor: 'pointer' }}>
                                Supprimer l'image
                            </label>
                        </div>
                    </div>
                )}

                {/* DragZone image */}
                {!data.supprimer_image && (
                    <Field
                        label={isEdit && article.image_url ? 'Remplacer l\'image' : 'Image de couverture'}
                        error={errors.image}
                    >
                        <DragZone
                            onChange={handleFiles}
                            multiple={false}
                            hint="JPG, PNG ou WebP · max 5 Mo"
                        />
                        {preview && (
                            <img
                                src={preview}
                                alt="Aperçu"
                                style={{ marginTop: '0.5rem', maxHeight: 160, objectFit: 'cover', border: `1px solid ${C.gold}`, display: 'block' }}
                            />
                        )}
                    </Field>
                )}

                <ModalFooter
                    processing={processing}
                    label={isEdit ? 'Mettre à jour' : 'Créer l\'article'}
                    onClose={onClose}
                />
            </form>
        </Overlay>
    );
}

/* ── Primitives UI ── */
function Overlay({ children, onClose }) {
    return (
        <div style={overlayStyle} onClick={onClose}>
            <div style={panelStyle} onClick={e => e.stopPropagation()}>{children}</div>
        </div>
    );
}
function ModalHeader({ title, onClose }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.75rem', borderBottom: `1px solid ${C.border}` }}>
            <div>
                <div style={{ width: 24, height: 1, background: C.gold, marginBottom: '0.6rem' }} />
                <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.15rem', fontWeight: 400, color: C.cream, margin: 0 }}>{title}</h2>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1 }}>✕</button>
        </div>
    );
}
function ModalFooter({ processing, label, onClose }) {
    return (
        <div style={{ display: 'flex', gap: '1rem', paddingTop: '1.25rem', borderTop: `1px solid ${C.border}`, marginTop: '0.5rem' }}>
            <button type="submit" disabled={processing} style={processing ? { ...btnGold, opacity: 0.5, cursor: 'not-allowed' } : btnGold}>
                {processing ? 'Enregistrement…' : label}
            </button>
            <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontFamily: '"DM Mono", monospace', fontSize: '0.68rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Annuler
            </button>
        </div>
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

/* ── Styles ── */
const overlayStyle   = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' };
const panelStyle     = { background: C.card, border: `1px solid ${C.border}`, width: '100%', maxWidth: 720, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 0 60px rgba(212,175,55,0.08)' };
const lblSt          = { fontFamily: '"DM Mono", monospace', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.gold, marginBottom: '0.4rem' };
const inputSt        = (err) => ({ width: '100%', padding: '0.55rem 0.75rem', boxSizing: 'border-box', background: C.input, color: C.cream, border: `1px solid ${err ? C.red : C.border}`, fontFamily: 'Lato, sans-serif', fontSize: '0.875rem', outline: 'none' });
const surtitle       = { fontFamily: '"DM Mono", monospace', fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.gold, marginBottom: '0.4rem' };
const pageTitle      = { fontFamily: '"Playfair Display", serif', fontSize: '1.8rem', fontWeight: 400, color: C.cream, margin: 0 };
const th             = { padding: '0.75rem 1rem', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.gold, fontWeight: 400 };
const td             = { padding: '0.75rem 1rem', verticalAlign: 'middle', fontFamily: 'Lato, sans-serif', fontSize: '0.875rem', color: C.muted };
const flashSuccess   = { background: 'rgba(74,222,128,0.08)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)', padding: '0.75rem 1rem', marginBottom: '1.5rem', fontFamily: '"DM Mono",monospace', fontSize: '0.72rem', letterSpacing: '0.06em' };
const btnGold        = { background: C.gold, color: '#0A0706', border: 'none', padding: '0.55rem 1.25rem', fontFamily: '"DM Mono", monospace', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', fontWeight: 700 };
const btnEdit        = { background: 'transparent', color: C.gold, border: `1px solid ${C.gold}`, padding: '0.3rem 0.65rem', fontFamily: '"DM Mono", monospace', fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' };
const btnDel         = { background: 'rgba(130,38,35,0.15)', color: '#f87171', border: '1px solid rgba(130,38,35,0.3)', padding: '0.3rem 0.65rem', fontFamily: '"DM Mono", monospace', fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' };
const badgePublie    = { display: 'inline-block', padding: '0.15rem 0.5rem', border: `1px solid ${C.gold}`, color: C.gold, fontSize: '0.65rem', fontFamily: '"DM Mono", monospace', letterSpacing: '0.06em', textTransform: 'uppercase' };
const badgeBrouillon = { display: 'inline-block', padding: '0.15rem 0.5rem', border: `1px solid ${C.muted}`, color: C.muted, fontSize: '0.65rem', fontFamily: '"DM Mono", monospace', letterSpacing: '0.06em', textTransform: 'uppercase' };
