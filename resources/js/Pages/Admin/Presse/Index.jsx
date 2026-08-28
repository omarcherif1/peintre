import { useState, useEffect, useRef } from 'react';
import { useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Components/Layout/AdminLayout';

const C = {
    bg: '#0A0706', card: '#1c1916', border: '#2a2520',
    gold: '#D4AF37', cream: '#F4EFEA', muted: '#7a6a5a', red: '#822623',
};

const s = {
    label:  { fontFamily: '"DM Mono", monospace', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: '0.4rem' },
    input:  { width: '100%', background: '#111009', border: `1px solid ${C.border}`, color: C.cream, padding: '0.55rem 0.75rem', fontFamily: 'Lato, sans-serif', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' },
    btn:    { padding: '0.55rem 1.25rem', fontFamily: '"DM Mono", monospace', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', border: 'none' },
    err:    { fontFamily: '"DM Mono", monospace', fontSize: '0.6rem', color: C.red, marginTop: '0.25rem' },
};

/* ══════════════════════════════════════════════
   Page principale
══════════════════════════════════════════════ */
export default function PresseIndex({ articles = [], interviews = [] }) {
    const [tab, setTab] = useState('articles');

    return (
        <AdminLayout>
            <div style={{ maxWidth: 960 }}>

                {/* En-tête */}
                <div style={{ marginBottom: '2rem' }}>
                    <p style={{ ...s.label, marginBottom: '0.5rem' }}>Administration</p>
                    <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.8rem', fontWeight: 600, color: C.cream, margin: 0 }}>
                        Presse
                    </h1>
                </div>

                {/* Onglets */}
                <div style={{ display: 'flex', gap: '0.25rem', borderBottom: `1px solid ${C.border}`, marginBottom: '2rem' }}>
                    {[
                        { key: 'articles',   label: `Articles (${articles.length})` },
                        { key: 'interviews', label: `Interviews (${interviews.length})` },
                    ].map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setTab(key)}
                            style={{
                                ...s.btn,
                                background: tab === key ? C.gold : 'transparent',
                                color: tab === key ? C.bg : C.muted,
                                borderBottom: tab === key ? `2px solid ${C.gold}` : '2px solid transparent',
                                borderRadius: 0,
                            }}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Contenu par onglet */}
                {tab === 'articles'   && <ArticlesTab   articles={articles} />}
                {tab === 'interviews' && <InterviewsTab interviews={interviews} />}
            </div>
        </AdminLayout>
    );
}

/* ══════════════════════════════════════════════
   Onglet Articles
══════════════════════════════════════════════ */
function ArticlesTab({ articles }) {
    const [modal, setModal] = useState(null); // null | 'create' | article

    useEffect(() => {
        document.body.style.overflow = modal ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [modal]);

    const handleDelete = (id) => {
        if (!confirm('Supprimer cet article ?')) return;
        router.delete(route('admin.presse.articles.destroy', id), { preserveScroll: true });
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>
                <button onClick={() => setModal('create')} style={{ ...s.btn, background: C.gold, color: C.bg }}>
                    + Ajouter un article
                </button>
            </div>

            {articles.length === 0 ? (
                <p style={{ color: C.muted, fontFamily: '"DM Mono", monospace', fontSize: '0.75rem', textAlign: 'center', padding: '3rem 0' }}>
                    Aucun article de presse.
                </p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                            {['Média', 'Date', 'Titre', 'Publié', ''].map(h => (
                                <th key={h} style={{ ...s.label, padding: '0.5rem 0.75rem', textAlign: 'left' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {articles.map(a => (
                            <tr key={a.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                                <td style={{ padding: '0.75rem', color: C.gold, fontFamily: '"DM Mono", monospace', fontSize: '0.75rem' }}>{a.media}</td>
                                <td style={{ padding: '0.75rem', color: C.muted, fontFamily: '"DM Mono", monospace', fontSize: '0.72rem' }}>{a.date_publication}</td>
                                <td style={{ padding: '0.75rem', color: C.cream, fontFamily: 'Lato, sans-serif', fontSize: '0.875rem', maxWidth: 280 }}>{a.titre}</td>
                                <td style={{ padding: '0.75rem' }}>
                                    <span style={{ fontFamily: '"DM Mono", monospace', fontSize: '0.65rem', padding: '0.2rem 0.5rem', background: a.publie ? 'rgba(212,175,55,0.15)' : 'rgba(130,38,35,0.15)', color: a.publie ? C.gold : C.red }}>
                                        {a.publie ? 'Publié' : 'Masqué'}
                                    </span>
                                </td>
                                <td style={{ padding: '0.75rem', whiteSpace: 'nowrap' }}>
                                    <button onClick={() => setModal(a)} style={{ ...s.btn, background: 'transparent', color: C.gold, border: `1px solid ${C.border}`, marginRight: '0.5rem' }}>Modifier</button>
                                    <button onClick={() => handleDelete(a.id)} style={{ ...s.btn, background: 'transparent', color: C.red, border: `1px solid ${C.border}` }}>Supprimer</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {modal !== null && (
                <ArticleModal item={modal === 'create' ? null : modal} onClose={() => setModal(null)} />
            )}
        </>
    );
}

function ArticleModal({ item, onClose }) {
    const isEdit = item !== null;
    const { data, setData, post, put, processing, errors, reset } = useForm({
        media:            item?.media            ?? '',
        date_publication: item?.date_publication ?? '',
        titre:            item?.titre            ?? '',
        extrait:          item?.extrait          ?? '',
        lien:             item?.lien             ?? '',
        ordre:            item?.ordre            ?? 0,
        publie:           item?.publie           ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        const r = isEdit
            ? route('admin.presse.articles.update', item.id)
            : route('admin.presse.articles.store');
        const method = isEdit ? put : post;
        method(r, { preserveScroll: true, onSuccess: () => { reset(); onClose(); } });
    };

    return (
        <Modal title={isEdit ? 'Modifier l\'article' : 'Nouvel article'} onClose={onClose}>
            <form onSubmit={submit}>
                <Row2>
                    <Field label="Média *" error={errors.media}>
                        <input style={s.input} value={data.media} onChange={e => setData('media', e.target.value)} placeholder="Le Monde, Jeune Afrique…" />
                    </Field>
                    <Field label="Date *" error={errors.date_publication}>
                        <input style={s.input} value={data.date_publication} onChange={e => setData('date_publication', e.target.value)} placeholder="Mars 2024" />
                    </Field>
                </Row2>
                <Field label="Titre *" error={errors.titre}>
                    <input style={s.input} value={data.titre} onChange={e => setData('titre', e.target.value)} />
                </Field>
                <Field label="Extrait" error={errors.extrait}>
                    <textarea style={{ ...s.input, resize: 'vertical', minHeight: 80 }} value={data.extrait} onChange={e => setData('extrait', e.target.value)} />
                </Field>
                <Field label="Lien (URL)" error={errors.lien}>
                    <input style={s.input} value={data.lien} onChange={e => setData('lien', e.target.value)} placeholder="https://…" />
                </Field>
                <Row2>
                    <Field label="Ordre" error={errors.ordre}>
                        <input style={s.input} type="number" min="0" value={data.ordre} onChange={e => setData('ordre', e.target.value)} />
                    </Field>
                    <Field label="Statut" error={errors.publie}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', paddingTop: '0.6rem' }}>
                            <input type="checkbox" checked={data.publie} onChange={e => setData('publie', e.target.checked)} />
                            <span style={{ fontFamily: 'Lato, sans-serif', fontSize: '0.875rem', color: C.cream }}>Publié</span>
                        </label>
                    </Field>
                </Row2>
                <ModalFooter processing={processing} onClose={onClose} isEdit={isEdit} />
            </form>
        </Modal>
    );
}

/* ══════════════════════════════════════════════
   Onglet Interviews
══════════════════════════════════════════════ */
function InterviewsTab({ interviews }) {
    const [modal, setModal] = useState(null);

    useEffect(() => {
        document.body.style.overflow = modal ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [modal]);

    const handleDelete = (id) => {
        if (!confirm('Supprimer cette interview ?')) return;
        router.delete(route('admin.presse.interviews.destroy', id), { preserveScroll: true });
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>
                <button onClick={() => setModal('create')} style={{ ...s.btn, background: C.gold, color: C.bg }}>
                    + Ajouter une interview
                </button>
            </div>

            {interviews.length === 0 ? (
                <p style={{ color: C.muted, fontFamily: '"DM Mono", monospace', fontSize: '0.75rem', textAlign: 'center', padding: '3rem 0' }}>
                    Aucune interview.
                </p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {interviews.map(iv => (
                        <div key={iv.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: C.card, border: `1px solid ${C.border}` }}>
                            {/* Miniature */}
                            <div style={{ width: 64, height: 48, flexShrink: 0, background: '#111009', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                {iv.image_url
                                    ? <img src={iv.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    : <span style={{ color: C.muted, fontSize: '1.25rem' }}>{iv.type === 'podcast' ? '🎙' : '🎬'}</span>
                                }
                            </div>
                            {/* Infos */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ ...s.label, marginBottom: '0.2rem', color: C.gold }}>{iv.media} · {iv.date_publication}</p>
                                <p style={{ fontFamily: 'Lato, sans-serif', fontSize: '0.875rem', color: C.cream, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{iv.titre}</p>
                            </div>
                            {/* Badge type */}
                            <span style={{ fontFamily: '"DM Mono", monospace', fontSize: '0.6rem', padding: '0.2rem 0.5rem', background: 'rgba(212,175,55,0.1)', color: C.gold, textTransform: 'uppercase', flexShrink: 0 }}>
                                {iv.type}
                            </span>
                            {/* Statut */}
                            <span style={{ fontFamily: '"DM Mono", monospace', fontSize: '0.6rem', padding: '0.2rem 0.5rem', background: iv.publie ? 'rgba(212,175,55,0.15)' : 'rgba(130,38,35,0.15)', color: iv.publie ? C.gold : C.red, flexShrink: 0 }}>
                                {iv.publie ? 'Publié' : 'Masqué'}
                            </span>
                            {/* Actions */}
                            <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                                <button onClick={() => setModal(iv)} style={{ ...s.btn, background: 'transparent', color: C.gold, border: `1px solid ${C.border}` }}>Modifier</button>
                                <button onClick={() => handleDelete(iv.id)} style={{ ...s.btn, background: 'transparent', color: C.red, border: `1px solid ${C.border}` }}>Supprimer</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {modal !== null && (
                <InterviewModal item={modal === 'create' ? null : modal} onClose={() => setModal(null)} />
            )}
        </>
    );
}

function InterviewModal({ item, onClose }) {
    const isEdit = item !== null;
    const [preview, setPreview] = useState(item?.image_url ?? null);
    const dropRef = useRef(null);
    const [dragging, setDragging] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        _method:          isEdit ? 'PUT' : undefined,
        type:             item?.type             ?? 'podcast',
        media:            item?.media            ?? '',
        date_publication: item?.date_publication ?? '',
        titre:            item?.titre            ?? '',
        description:      item?.description      ?? '',
        url:              item?.url              ?? '',
        ordre:            item?.ordre            ?? 0,
        publie:           item?.publie           ?? true,
        image:            null,
        supprimer_image:  false,
    });

    const handleFiles = (files) => {
        const file = files[0];
        if (!file) return;
        setData('image', file);
        setPreview(URL.createObjectURL(file));
    };

    const onDrop = (e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); };
    const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
    const onDragLeave = () => setDragging(false);

    const submit = (e) => {
        e.preventDefault();
        const r = isEdit
            ? route('admin.presse.interviews.update', item.id)
            : route('admin.presse.interviews.store');
        post(r, { forceFormData: true, preserveScroll: true, onSuccess: () => { reset(); onClose(); } });
    };

    return (
        <Modal title={isEdit ? 'Modifier l\'interview' : 'Nouvelle interview'} onClose={onClose}>
            <form onSubmit={submit}>
                <Row2>
                    <Field label="Type *" error={errors.type}>
                        <select style={s.input} value={data.type} onChange={e => setData('type', e.target.value)}>
                            <option value="podcast">Podcast</option>
                            <option value="tv">Vidéo / TV</option>
                        </select>
                    </Field>
                    <Field label="Média *" error={errors.media}>
                        <input style={s.input} value={data.media} onChange={e => setData('media', e.target.value)} placeholder="Radio, chaîne…" />
                    </Field>
                </Row2>
                <Row2>
                    <Field label="Date *" error={errors.date_publication}>
                        <input style={s.input} value={data.date_publication} onChange={e => setData('date_publication', e.target.value)} placeholder="Octobre 2024" />
                    </Field>
                    <Field label="URL (lien)" error={errors.url}>
                        <input style={s.input} value={data.url} onChange={e => setData('url', e.target.value)} placeholder="https://…" />
                    </Field>
                </Row2>
                <Field label="Titre *" error={errors.titre}>
                    <input style={s.input} value={data.titre} onChange={e => setData('titre', e.target.value)} />
                </Field>
                <Field label="Description" error={errors.description}>
                    <textarea style={{ ...s.input, resize: 'vertical', minHeight: 70 }} value={data.description} onChange={e => setData('description', e.target.value)} />
                </Field>

                {/* Image drag & drop */}
                <Field label="Image (optionnelle)" error={errors.image}>
                    <div
                        ref={dropRef}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onClick={() => document.getElementById('iv-file-input').click()}
                        style={{
                            border: `1px dashed ${dragging ? C.gold : C.border}`,
                            background: dragging ? 'rgba(212,175,55,0.05)' : '#111009',
                            padding: '1.25rem',
                            textAlign: 'center',
                            cursor: 'pointer',
                            position: 'relative',
                            minHeight: 90,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {preview ? (
                            <img src={preview} alt="" style={{ maxHeight: 80, maxWidth: '100%', objectFit: 'contain', opacity: data.supprimer_image ? 0.3 : 1 }} />
                        ) : (
                            <p style={{ color: C.muted, fontFamily: '"DM Mono", monospace', fontSize: '0.65rem', margin: 0 }}>
                                Glisser une image ou cliquer
                            </p>
                        )}
                        <input id="iv-file-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFiles(e.target.files)} />
                    </div>
                    {isEdit && preview && (
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', cursor: 'pointer' }}>
                            <input type="checkbox" checked={data.supprimer_image} onChange={e => setData('supprimer_image', e.target.checked)} />
                            <span style={{ fontFamily: '"DM Mono", monospace', fontSize: '0.65rem', color: C.red }}>Supprimer l'image</span>
                        </label>
                    )}
                </Field>

                <Row2>
                    <Field label="Ordre" error={errors.ordre}>
                        <input style={s.input} type="number" min="0" value={data.ordre} onChange={e => setData('ordre', e.target.value)} />
                    </Field>
                    <Field label="Statut" error={errors.publie}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', paddingTop: '0.6rem' }}>
                            <input type="checkbox" checked={data.publie} onChange={e => setData('publie', e.target.checked)} />
                            <span style={{ fontFamily: 'Lato, sans-serif', fontSize: '0.875rem', color: C.cream }}>Publié</span>
                        </label>
                    </Field>
                </Row2>

                <ModalFooter processing={processing} onClose={onClose} isEdit={isEdit} />
            </form>
        </Modal>
    );
}

/* ══════════════════════════════════════════════
   Composants partagés
══════════════════════════════════════════════ */
function Modal({ title, onClose, children }) {
    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', background: 'rgba(0,0,0,0.75)', overflowY: 'auto', padding: '2rem 1rem' }}>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, width: '100%', maxWidth: 640, padding: '2rem', position: 'relative' }} onClick={e => e.stopPropagation()}>
                <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1 }}>✕</button>
                <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.25rem', color: C.cream, marginTop: 0, marginBottom: '1.5rem' }}>{title}</h2>
                {children}
            </div>
        </div>
    );
}

function Field({ label, error, children }) {
    return (
        <div style={{ marginBottom: '1.1rem' }}>
            <label style={s.label}>{label}</label>
            {children}
            {error && <p style={s.err}>{error}</p>}
        </div>
    );
}

function Row2({ children }) {
    return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>{children}</div>;
}

function ModalFooter({ processing, onClose, isEdit }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: `1px solid ${C.border}` }}>
            <button type="button" onClick={onClose} style={{ ...s.btn, background: 'transparent', color: C.muted, border: `1px solid ${C.border}` }}>Annuler</button>
            <button type="submit" disabled={processing} style={{ ...s.btn, background: C.gold, color: C.bg, opacity: processing ? 0.6 : 1 }}>
                {processing ? 'Enregistrement…' : (isEdit ? 'Enregistrer' : 'Créer')}
            </button>
        </div>
    );
}
