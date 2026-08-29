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

const formatDate  = (str) => { if (!str) return '—'; const d = new Date(str); return isNaN(d) ? '—' : d.toLocaleDateString('fr-FR'); };
const toInputDate = (str) => (str ? str.substring(0, 10) : '');

/* ══════════════════════════════════════
   Page Index
══════════════════════════════════════ */
export default function Index({ foires }) {
    const { flash } = usePage().props;
    const [modal, setModal] = useState(null);

    useEffect(() => {
        document.body.style.overflow = modal ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [modal]);

    const supprimer = (id, nom) => {
        if (!confirm(`Supprimer la foire "${nom}" et toutes ses images ?`)) return;
        router.delete(route('admin.foires.destroy', id));
    };

    return (
        <AdminLayout>
            {flash?.success && <div style={flashSuccess}>{flash.success}</div>}
            {flash?.error   && <div style={flashError}>{flash.error}</div>}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <p style={surtitle}>Administration</p>
                    <h1 style={pageTitle}>Foires & Expositions</h1>
                </div>
                <button onClick={() => setModal('create')} style={btnGold}>+ Ajouter une foire</button>
            </div>

            <div style={{ border: `1px solid ${C.border}`, overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: 650, borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: C.bgDeep, borderBottom: `1px solid ${C.border}` }}>
                            {['Image', 'Nom', 'Emplacement', 'Date début', 'Date fin', 'Statut', 'Ordre', 'Actions'].map(h => (
                                <th key={h} style={th}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {foires.length === 0 && (
                            <tr><td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: C.muted, fontFamily: '"DM Mono", monospace', fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Aucune foire enregistrée.</td></tr>
                        )}
                        {foires.map((foire, i) => (
                            <tr key={foire.id} style={{ background: i % 2 === 0 ? C.bgCard : C.surface, borderBottom: `1px solid ${C.border}` }}>
                                <td style={td}>
                                    {foire.images[0]
                                        ? <img src={foire.images[0].url} alt={foire.nom} style={{ width: 56, height: 56, objectFit: 'cover', display: 'block', border: `1px solid ${C.border}` }} />
                                        : <div style={{ width: 56, height: 56, background: C.bgDeep, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.border, fontSize: '1.2rem', border: `1px solid ${C.border}` }}>?</div>
                                    }
                                </td>
                                <td style={{ ...td, color: C.cream, fontWeight: 500 }}>{foire.nom}</td>
                                <td style={td}>{foire.emplacement}</td>
                                <td style={{ ...td, whiteSpace: 'nowrap' }}>{formatDate(foire.date_debut)}</td>
                                <td style={{ ...td, whiteSpace: 'nowrap' }}>{formatDate(foire.date_fin)}</td>
                                <td style={td}>
                                    <span style={{ color: foire.est_a_venir ? '#4ade80' : C.muted, fontFamily: '"DM Mono", monospace', fontSize: '0.65rem', letterSpacing: '0.06em' }}>
                                        {foire.est_a_venir ? '● À venir' : '○ Passée'}
                                    </span>
                                </td>
                                <td style={td}>{foire.ordre}</td>
                                <td style={td}>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button onClick={() => setModal(foire)} style={btnEdit}>Modifier</button>
                                        <button onClick={() => supprimer(foire.id, foire.nom)} style={btnDel}>Supprimer</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {modal && (
                <FoireModal
                    key={modal === 'create' ? 'create' : modal.id}
                    mode={modal === 'create' ? 'create' : 'edit'}
                    foire={modal === 'create' ? null : modal}
                    onClose={() => setModal(null)}
                />
            )}
        </AdminLayout>
    );
}

/* ══════════════════════════════════════
   Modal Foire
══════════════════════════════════════ */
function FoireModal({ mode, foire, onClose }) {
    const isEdit = mode === 'edit';
    const { data, setData, post, errors, processing } = useForm({
        ...(isEdit ? { _method: 'PUT' } : {}),
        nom:         foire?.nom         ?? '',
        emplacement: foire?.emplacement ?? '',
        date_debut:  toInputDate(foire?.date_debut),
        date_fin:    toInputDate(foire?.date_fin),
        description: foire?.description ?? '',
        est_a_venir: foire?.est_a_venir ?? false,
        ordre:       foire?.ordre       ?? 0,
        images:      [],
    });

    const [images, setImages]       = useState(foire?.images ?? []);
    const [previews, setPreviews]   = useState([]);
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
    const supprimerImage = async (imageId) => {
        if (!confirm('Supprimer cette image ?')) return;
        setLoadingId(imageId);
        try {
            await window.axios.delete(route('admin.foires.images.delete', { foire: foire.id, image: imageId }));
            setImages(prev => prev.filter(img => img.id !== imageId));
        } catch { alert('Erreur.'); }
        finally { setLoadingId(null); }
    };

    const submit = (e) => {
        e.preventDefault();
        const r = isEdit ? route('admin.foires.update', foire.id) : route('admin.foires.store');
        post(r, { forceFormData: true, onSuccess: onClose });
    };

    return (
        <Overlay onClose={onClose}>
            <ModalHeader title={isEdit ? `Modifier : ${foire.nom}` : 'Nouvelle foire'} onClose={onClose} />
            <form onSubmit={submit} style={{ padding: '1.75rem' }}>
                <Field label="Nom" error={errors.nom} required>
                    <Input value={data.nom} onChange={e => setData('nom', e.target.value)} err={errors.nom} />
                </Field>
                <Field label="Emplacement" error={errors.emplacement} required>
                    <Input value={data.emplacement} onChange={e => setData('emplacement', e.target.value)} err={errors.emplacement} placeholder="Ville, salle, adresse…" />
                </Field>
                <Row2>
                    <Field label="Date de début" error={errors.date_debut} required>
                        <Input type="date" value={data.date_debut} onChange={e => setData('date_debut', e.target.value)} err={errors.date_debut} />
                    </Field>
                    <Field label="Date de fin" error={errors.date_fin}>
                        <Input type="date" value={data.date_fin} min={data.date_debut || undefined} onChange={e => setData('date_fin', e.target.value)} err={errors.date_fin} />
                    </Field>
                </Row2>
                <Field label="Description" error={errors.description}>
                    <textarea value={data.description} onChange={e => setData('description', e.target.value)} rows={3} style={inputSt(errors.description)} />
                </Field>
                <Row2>
                    <Field label="Ordre d'affichage" error={errors.ordre}>
                        <Input type="number" min="0" value={data.ordre} onChange={e => setData('ordre', parseInt(e.target.value) || 0)} err={errors.ordre} />
                    </Field>
                    <div />
                </Row2>
                <CheckboxField id="est_a_venir" checked={data.est_a_venir} onChange={e => setData('est_a_venir', e.target.checked)} label='Marquer comme « À venir »' />

                {isEdit && images.length > 0 && (
                    <>
                        <Sep label="Images existantes" />
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                            {images.map(img => (
                                <div key={img.id} style={{ width: 88, border: `1px solid ${C.border}`, opacity: loadingId === img.id ? 0.3 : 1 }}>
                                    <img src={img.url} alt="" style={{ width: 88, height: 78, objectFit: 'cover', display: 'block' }} />
                                    <button type="button" onClick={() => supprimerImage(img.id)} disabled={!!loadingId} style={{ width: '100%', background: 'rgba(130,38,35,0.2)', color: '#f87171', border: 'none', fontFamily: '"DM Mono",monospace', fontSize: '0.6rem', letterSpacing: '0.06em', padding: '3px', cursor: 'pointer' }}>
                                        Supprimer
                                    </button>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                <Sep label={isEdit ? 'Ajouter des images' : 'Images'} />
                <Field label="" error={errors.images}>
                    <DragZone onChange={handleFiles} hint="JPG, PNG ou WebP · max 5 Mo" />
                </Field>
                {previews.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                        {previews.map((src, i) => (
                            <div key={i} style={{ position: 'relative' }}>
                                <img src={src} alt="" style={{ width: 68, height: 68, objectFit: 'cover', display: 'block', border: `1px solid ${C.border}` }} />
                                <button type="button" onClick={() => retirerPreview(i)} style={btnRetrait}>✕</button>
                            </div>
                        ))}
                    </div>
                )}
                <ModalFooter processing={processing} label={isEdit ? 'Mettre à jour' : 'Créer la foire'} onClose={onClose} />
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
const panelStyle   = { background: C.bgCard, border: `1px solid ${C.border}`, width: '100%', maxWidth: 680, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 0 60px rgba(212,175,55,0.08)' };
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
