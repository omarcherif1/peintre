import { useState, useEffect } from 'react';
import { router, usePage, useForm } from '@inertiajs/react';
import AdminLayout from '@/Components/Layout/AdminLayout';
import DragZone from '@/Components/Admin/DragZone';

/* ── Palette publique ── */
const C = {
    bgCard:  '#1a1816',
    bgDeep:  '#0A0706',
    bgInput: '#0e0c0a',
    gold:    '#D4AF37',
    cream:   '#F4EFEA',
    muted:   'rgba(244,239,234,0.4)',
    border:  '#2a2520',
    red:     '#822623',
    surface: '#211f1d',
};

/* ══════════════════════════════════════
   Page Index
══════════════════════════════════════ */
export default function Index({ tableaux }) {
    const { flash } = usePage().props;
    const [modal, setModal] = useState(null);

    useEffect(() => {
        document.body.style.overflow = modal ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [modal]);

    const supprimer = (id, nom) => {
        if (!confirm(`Supprimer le tableau "${nom}" et toutes ses images ?`)) return;
        router.delete(route('admin.tableaux.destroy', id));
    };

    return (
        <AdminLayout>
            {flash?.success && <div style={flashSuccess}>{flash.success}</div>}
            {flash?.error   && <div style={flashError}>{flash.error}</div>}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <p style={surtitle}>Administration</p>
                    <h1 style={pageTitle}>Tableaux</h1>
                </div>
                <button onClick={() => setModal('create')} style={btnGold}>+ Ajouter un tableau</button>
            </div>

            <div style={{ border: `1px solid ${C.border}`, overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: 700, borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: C.bgDeep, borderBottom: `1px solid ${C.border}` }}>
                            {['Image', 'Nom', 'Catégorie', 'Technique', 'Dimensions', 'Disponible', 'Ordre', 'Actions'].map(h => (
                                <th key={h} style={th}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {tableaux.length === 0 && (
                            <tr><td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: C.muted, fontFamily: '"DM Mono", monospace', fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Aucun tableau enregistré.</td></tr>
                        )}
                        {tableaux.map((tableau, i) => (
                            <tr key={tableau.id} style={{ background: i % 2 === 0 ? C.bgCard : C.surface, borderBottom: `1px solid ${C.border}` }}>
                                <td style={td}>
                                    {tableau.images[0]
                                        ? <img src={tableau.images[0].url} alt={tableau.nom} style={{ width: 56, height: 56, objectFit: 'cover', display: 'block', border: `1px solid ${C.border}` }} />
                                        : <div style={{ width: 56, height: 56, background: C.bgDeep, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.border, fontSize: '1.2rem' }}>?</div>
                                    }
                                </td>
                                <td style={{ ...td, color: C.cream, fontWeight: 500 }}>{tableau.nom}</td>
                                <td style={td}>
                                    <span style={{ color: tableau.categorie === 'peinture' ? '#93c5fd' : '#86efac', fontFamily: '"DM Mono",monospace', fontSize: '0.65rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                                        {tableau.categorie}
                                    </span>
                                </td>
                                <td style={td}>{tableau.technique}</td>
                                <td style={{ ...td, whiteSpace: 'nowrap' }}>{tableau.mesure_hauteur} × {tableau.mesure_largeur} cm</td>
                                <td style={td}>
                                    <span style={{ color: tableau.disponible ? '#4ade80' : C.muted, fontFamily: '"DM Mono",monospace', fontSize: '0.65rem', letterSpacing: '0.06em' }}>
                                        {tableau.disponible ? '● Disponible' : '○ Vendu'}
                                    </span>
                                </td>
                                <td style={td}>{tableau.ordre}</td>
                                <td style={td}>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button onClick={() => setModal(tableau)} style={btnEdit}>Modifier</button>
                                        <button onClick={() => supprimer(tableau.id, tableau.nom)} style={btnDel}>Supprimer</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {modal && (
                <TableauModal
                    key={modal === 'create' ? 'create' : modal.id}
                    mode={modal === 'create' ? 'create' : 'edit'}
                    tableau={modal === 'create' ? null : modal}
                    onClose={() => setModal(null)}
                />
            )}
        </AdminLayout>
    );
}

/* ══════════════════════════════════════
   Modal Tableau
══════════════════════════════════════ */
function TableauModal({ mode, tableau, onClose }) {
    const isEdit = mode === 'edit';
    const { data, setData, post, errors, processing } = useForm({
        ...(isEdit ? { _method: 'PUT' } : {}),
        nom:            tableau?.nom            ?? '',
        categorie:      tableau?.categorie      ?? '',
        technique:      tableau?.technique      ?? '',
        mesure_hauteur: tableau?.mesure_hauteur ?? '',
        mesure_largeur: tableau?.mesure_largeur ?? '',
        idee:           tableau?.idee           ?? '',
        description:    tableau?.description    ?? '',
        disponible:     tableau?.disponible     ?? true,
        en_biographie:  tableau?.en_biographie  ?? false,
        ordre:          tableau?.ordre          ?? 0,
        images:         [],
    });

    const [images,    setImages]    = useState(tableau?.images ?? []);
    const [previews,  setPreviews]  = useState([]);
    const [loadingId, setLoadingId] = useState(null);

    const handleFiles = (files) => {
        setData('images', files);
        setPreviews(files.map(f => URL.createObjectURL(f)));
    };
    const retirerPreview = (i) => {
        URL.revokeObjectURL(previews[i]);
        setData('images', data.images.filter((_, idx) => idx !== i));
        setPreviews(p => p.filter((_, idx) => idx !== i));
    };
    const setPrincipale = async (imageId) => {
        setLoadingId(imageId);
        try {
            await window.axios.patch(route('admin.tableaux.images.principale', { tableau: tableau.id, image: imageId }));
            setImages(prev => prev.map(img => ({ ...img, est_principale: img.id === imageId })));
        } catch { alert('Erreur.'); }
        finally { setLoadingId(null); }
    };
    const supprimerImage = async (imageId) => {
        if (!confirm('Supprimer cette image ?')) return;
        setLoadingId(imageId);
        try {
            await window.axios.delete(route('admin.tableaux.images.delete', { tableau: tableau.id, image: imageId }));
            setImages(prev => {
                const etaitPrincipale = prev.find(img => img.id === imageId)?.est_principale;
                const restantes = prev.filter(img => img.id !== imageId);
                if (etaitPrincipale && restantes.length > 0) return restantes.map((img, i) => ({ ...img, est_principale: i === 0 }));
                return restantes;
            });
        } catch { alert('Erreur.'); }
        finally { setLoadingId(null); }
    };

    const submit = (e) => {
        e.preventDefault();
        const r = isEdit ? route('admin.tableaux.update', tableau.id) : route('admin.tableaux.store');
        post(r, { forceFormData: true, onSuccess: onClose });
    };

    return (
        <Overlay onClose={onClose}>
            <ModalHeader title={isEdit ? `Modifier : ${tableau.nom}` : 'Nouveau tableau'} onClose={onClose} />
            <form onSubmit={submit} style={{ padding: '1.75rem' }}>
                <Field label="Nom" error={errors.nom} required>
                    <Input value={data.nom} onChange={e => setData('nom', e.target.value)} err={errors.nom} />
                </Field>
                <Row2>
                    <Field label="Catégorie" error={errors.categorie} required>
                        <Select value={data.categorie} onChange={e => setData('categorie', e.target.value)} err={errors.categorie}>
                            <option value="">— Choisir —</option>
                            <option value="peinture">Peinture</option>
                            <option value="dessin">Dessin</option>
                        </Select>
                    </Field>
                    <Field label="Technique" error={errors.technique} required>
                        <Input value={data.technique} onChange={e => setData('technique', e.target.value)} err={errors.technique} />
                    </Field>
                </Row2>
                <Row2>
                    <Field label="Hauteur (cm)" error={errors.mesure_hauteur} required>
                        <Input type="number" step="0.01" min="0" value={data.mesure_hauteur} onChange={e => setData('mesure_hauteur', e.target.value)} err={errors.mesure_hauteur} />
                    </Field>
                    <Field label="Largeur (cm)" error={errors.mesure_largeur} required>
                        <Input type="number" step="0.01" min="0" value={data.mesure_largeur} onChange={e => setData('mesure_largeur', e.target.value)} err={errors.mesure_largeur} />
                    </Field>
                </Row2>
                <Field label="Idée" error={errors.idee}>
                    <textarea value={data.idee} onChange={e => setData('idee', e.target.value)} maxLength={1000} rows={2} style={inputSt(errors.idee)} />
                </Field>
                <Field label="Description" error={errors.description}>
                    <textarea value={data.description} onChange={e => setData('description', e.target.value)} rows={3} style={inputSt(errors.description)} />
                </Field>
                <Row2>
                    <Field label="Ordre d'affichage" error={errors.ordre}>
                        <Input type="number" value={data.ordre} onChange={e => setData('ordre', parseInt(e.target.value) || 0)} err={errors.ordre} />
                    </Field>
                    <div />
                </Row2>
                <CheckboxField id="disponible" checked={data.disponible} onChange={e => setData('disponible', e.target.checked)} label="Disponible à la vente" />
                <CheckboxField id="en_biographie" checked={data.en_biographie} onChange={e => setData('en_biographie', e.target.checked)} label="Ajouter à la page Biographie" />

                {isEdit && (
                    <>
                        <Sep label={`Images existantes (${images.length})`} />
                        {images.length === 0 ? (
                            <p style={{ fontFamily: '"DM Mono",monospace', fontSize: '0.65rem', color: C.muted, marginBottom: '1rem', letterSpacing: '0.06em' }}>Aucune image — ajoutez-en ci-dessous.</p>
                        ) : (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                                {images.map(img => (
                                    <div key={img.id} style={{ width: 100, border: img.est_principale ? `2px solid ${C.gold}` : `1px solid ${C.border}`, opacity: loadingId === img.id ? 0.3 : 1 }}>
                                        <img src={img.url} alt="" style={{ width: 100, height: 85, objectFit: 'cover', display: 'block' }} />
                                        <div style={{ padding: '0.25rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', background: C.bgDeep }}>
                                            {img.est_principale
                                                ? <span style={{ display: 'block', textAlign: 'center', fontFamily: '"DM Mono",monospace', fontSize: '0.55rem', color: C.gold, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '2px 0' }}>● Principale</span>
                                                : <button type="button" onClick={() => setPrincipale(img.id)} disabled={!!loadingId} style={{ background: 'rgba(212,175,55,0.1)', color: C.gold, border: `1px solid rgba(212,175,55,0.3)`, fontFamily: '"DM Mono",monospace', fontSize: '0.55rem', letterSpacing: '0.06em', padding: '2px', cursor: 'pointer' }}>Principale</button>
                                            }
                                            <button type="button" onClick={() => supprimerImage(img.id)} disabled={!!loadingId} style={{ background: 'rgba(130,38,35,0.2)', color: '#f87171', border: 'none', fontFamily: '"DM Mono",monospace', fontSize: '0.55rem', letterSpacing: '0.06em', padding: '2px', cursor: 'pointer' }}>Supprimer</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                <Sep label={isEdit ? 'Ajouter des images' : 'Images'} />
                <Field label="" error={errors.images}>
                    <DragZone onChange={handleFiles} hint={`JPG, PNG ou WebP · max 5 Mo${!isEdit ? ' · la première sera principale' : ''}`} />
                </Field>
                {previews.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                        {previews.map((src, i) => (
                            <div key={i} style={{ position: 'relative' }}>
                                <img src={src} alt="" style={{ width: 68, height: 68, objectFit: 'cover', display: 'block', border: i === 0 ? `2px solid ${C.gold}` : `1px solid ${C.border}` }} />
                                <button type="button" onClick={() => retirerPreview(i)} style={btnRetrait}>✕</button>
                            </div>
                        ))}
                    </div>
                )}
                <ModalFooter processing={processing} label={isEdit ? 'Mettre à jour' : 'Créer le tableau'} onClose={onClose} />
            </form>
        </Overlay>
    );
}

/* ── Shared primitives ── */
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
                <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.2rem', fontWeight: 400, color: C.cream, margin: 0 }}>{title}</h2>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
        </div>
    );
}
function ModalFooter({ processing, label, onClose }) {
    return (
        <div style={{ display: 'flex', gap: '1rem', paddingTop: '1.25rem', borderTop: `1px solid ${C.border}`, marginTop: '0.5rem' }}>
            <button type="submit" disabled={processing} style={processing ? { ...btnGold, opacity: 0.5, cursor: 'not-allowed' } : btnGold}>{processing ? 'Enregistrement…' : label}</button>
            <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontFamily: '"DM Mono",monospace', fontSize: '0.68rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Annuler</button>
        </div>
    );
}
function Field({ label: lbl, error, required, children }) {
    return (
        <div style={{ marginBottom: '1.1rem', display: 'flex', flexDirection: 'column' }}>
            <label style={lblSt}>{lbl}{required && <span style={{ color: C.red, marginLeft: 2 }}>*</span>}</label>
            {children}
            {error && <p style={{ color: C.red, fontFamily: '"DM Mono",monospace', fontSize: '0.65rem', margin: '0.25rem 0 0', letterSpacing: '0.06em' }}>{error}</p>}
        </div>
    );
}
function Input({ err, ...props }) { return <input style={inputSt(err)} {...props} />; }
function Select({ err, children, ...props }) { return <select style={inputSt(err)} {...props}>{children}</select>; }
function Row2({ children }) { return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>{children}</div>; }
function Sep({ label: lbl }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1rem 0 1.1rem' }}>
            <div style={{ width: 16, height: 1, background: C.gold }} />
            <span style={{ ...lblSt, marginBottom: 0, color: C.gold }}>{lbl}</span>
        </div>
    );
}
function CheckboxField({ id, checked, onChange, label: lbl }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.1rem' }}>
            <input type="checkbox" id={id} checked={checked} onChange={onChange} style={{ width: 14, height: 14, accentColor: C.gold, cursor: 'pointer' }} />
            <label htmlFor={id} style={{ ...lblSt, margin: 0, cursor: 'pointer' }}>{lbl}</label>
        </div>
    );
}

/* ── Styles ── */
const overlayStyle = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' };
const panelStyle   = { background: C.bgCard, border: `1px solid ${C.border}`, width: '100%', maxWidth: 720, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 0 60px rgba(212,175,55,0.08)' };
const lblSt        = { fontFamily: '"DM Mono", monospace', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.gold, marginBottom: '0.4rem' };
const inputSt      = (err) => ({ width: '100%', padding: '0.55rem 0.75rem', boxSizing: 'border-box', background: C.bgInput, color: C.cream, border: `1px solid ${err ? C.red : C.border}`, fontFamily: 'Lato, sans-serif', fontSize: '0.875rem', outline: 'none' });
const th           = { padding: '0.75rem 1rem', textAlign: 'left', fontFamily: '"DM Mono", monospace', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.gold, fontWeight: 400 };
const td           = { padding: '0.75rem 1rem', verticalAlign: 'middle', fontFamily: 'Lato, sans-serif', fontSize: '0.875rem', color: C.muted };
const surtitle     = { fontFamily: '"DM Mono", monospace', fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.gold, marginBottom: '0.4rem' };
const pageTitle    = { fontFamily: '"Playfair Display", serif', fontSize: '1.8rem', fontWeight: 400, color: C.cream, margin: 0, letterSpacing: '-0.01em' };
const flashSuccess = { background: 'rgba(74,222,128,0.08)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)', padding: '0.75rem 1rem', marginBottom: '1.5rem', fontFamily: '"DM Mono",monospace', fontSize: '0.72rem', letterSpacing: '0.06em' };
const flashError   = { background: 'rgba(130,38,35,0.15)', color: '#f87171', border: '1px solid rgba(130,38,35,0.3)', padding: '0.75rem 1rem', marginBottom: '1.5rem', fontFamily: '"DM Mono",monospace', fontSize: '0.72rem', letterSpacing: '0.06em' };
const btnGold      = { background: C.gold, color: '#0A0706', border: 'none', padding: '0.55rem 1.25rem', fontFamily: '"DM Mono", monospace', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' };
const btnEdit      = { background: 'transparent', color: C.gold, border: `1px solid ${C.gold}`, padding: '0.3rem 0.65rem', fontFamily: '"DM Mono", monospace', fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' };
const btnDel       = { background: 'rgba(130,38,35,0.15)', color: '#f87171', border: '1px solid rgba(130,38,35,0.3)', padding: '0.3rem 0.65rem', fontFamily: '"DM Mono", monospace', fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' };
const btnRetrait   = { position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.7)', color: C.cream, border: 'none', borderRadius: '50%', width: 18, height: 18, cursor: 'pointer', fontSize: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 };
