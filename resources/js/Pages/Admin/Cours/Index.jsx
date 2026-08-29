import { useState, useEffect } from 'react';
import { router, usePage, useForm } from '@inertiajs/react';
import AdminLayout from '@/Components/Layout/AdminLayout';

/* ── Palette publique ── */
const C = {
    bgCard:   '#1a1816',
    bgDeep:   '#0A0706',
    bgInput:  '#0e0c0a',
    gold:     '#D4AF37',
    cream:    '#F4EFEA',
    muted:    'rgba(244,239,234,0.4)',
    border:   '#2a2520',
    red:      '#822623',
    surface:  '#211f1d',
};

const NIVEAU_LABEL = { debutant: 'Débutant', intermediaire: 'Intermédiaire', avance: 'Avancé', tous: 'Tous niveaux' };
const formatTime   = (t) => (t ? t.substring(0, 5) : '—');
const formatTarif  = (t) => (t ? `${parseFloat(t).toFixed(2)} TND` : '—');
const formatPlaces = (r, total) => (!total ? '—' : `${r ?? '?'} / ${total}`);

const badgeNiveau = (n) => {
    const map = { debutant: '#1d4ed8', intermediaire: '#c2410c', avance: '#b91c1c', tous: '#7c3aed' };
    const col = map[n] ?? '#6b7280';
    return { display: 'inline-block', padding: '0.15rem 0.5rem', border: `1px solid ${col}`, color: col, fontSize: '0.65rem', fontFamily: '"DM Mono", monospace', letterSpacing: '0.06em', textTransform: 'uppercase' };
};

/* ══════════════════════════════════════
   Page Index
══════════════════════════════════════ */
export default function Index({ cours }) {
    const { flash } = usePage().props;
    const [modal, setModal] = useState(null);

    useEffect(() => {
        document.body.style.overflow = modal ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [modal]);

    const supprimer = (id, titre) => {
        if (!confirm(`Supprimer "${titre}" ?`)) return;
        router.delete(route('admin.cours.destroy', id));
    };

    return (
        <AdminLayout>
            {flash?.success && <div style={flashSuccess}>{flash.success}</div>}
            {flash?.error   && <div style={flashError}>{flash.error}</div>}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <p style={surtitle}>Administration</p>
                    <h1 style={pageTitle}>Cours <span style={{ color: C.muted, fontSize: '0.6em' }}>({cours.length})</span></h1>
                </div>
                <button onClick={() => setModal('create')} style={btnGold}>+ Ajouter un cours</button>
            </div>

            <div style={{ border: `1px solid ${C.border}`, overflowX: 'auto' }}>
                {cours.length === 0 ? (
                    <p style={{ padding: '3rem', textAlign: 'center', color: C.muted, fontFamily: '"DM Mono", monospace', fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        Aucun cours enregistré.
                    </p>
                ) : (
                    <table style={{ width: '100%', minWidth: 650, borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: C.bgDeep, borderBottom: `1px solid ${C.border}` }}>
                                {['Ord.', 'Titre', 'Niveau', 'Jour', 'Horaires', 'Emplacement', 'Places', 'Tarif', 'Actif', 'Actions'].map(h => (
                                    <th key={h} style={th}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {cours.map((c, i) => (
                                <tr key={c.id} style={{ background: i % 2 === 0 ? C.bgCard : C.surface, borderBottom: `1px solid ${C.border}` }}>
                                    <td style={td}>{c.ordre ?? 0}</td>
                                    <td style={{ ...td, color: C.cream, fontWeight: 500 }}>{c.titre}</td>
                                    <td style={td}><span style={badgeNiveau(c.niveau)}>{NIVEAU_LABEL[c.niveau]}</span></td>
                                    <td style={td}>{c.jour ?? '—'}</td>
                                    <td style={{ ...td, whiteSpace: 'nowrap' }}>
                                        {c.heure_debut ? `${formatTime(c.heure_debut)} – ${formatTime(c.heure_fin)}` : '—'}
                                    </td>
                                    <td style={td}>{c.emplacement}</td>
                                    <td style={{ ...td, whiteSpace: 'nowrap' }}>{formatPlaces(c.places_restantes, c.places_total)}</td>
                                    <td style={{ ...td, whiteSpace: 'nowrap' }}>{formatTarif(c.tarif)}</td>
                                    <td style={td}>
                                        <span style={{ color: c.actif ? '#4ade80' : C.muted, fontFamily: '"DM Mono", monospace', fontSize: '0.65rem' }}>
                                            {c.actif ? '● Actif' : '○ Inactif'}
                                        </span>
                                    </td>
                                    <td style={td}>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <button onClick={() => setModal(c)} style={btnEdit}>Modifier</button>
                                            <button onClick={() => supprimer(c.id, c.titre)} style={btnDel}>Supprimer</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {modal && (
                <CoursModal
                    key={modal === 'create' ? 'create' : modal.id}
                    mode={modal === 'create' ? 'create' : 'edit'}
                    cours={modal === 'create' ? null : modal}
                    onClose={() => setModal(null)}
                />
            )}
        </AdminLayout>
    );
}

/* ══════════════════════════════════════
   Modal Cours
══════════════════════════════════════ */
function CoursModal({ mode, cours, onClose }) {
    const isEdit = mode === 'edit';
    const { data, setData, post, errors, processing } = useForm({
        ...(isEdit ? { _method: 'PUT' } : {}),
        titre:            cours?.titre            ?? '',
        niveau:           cours?.niveau           ?? '',
        emplacement:      cours?.emplacement      ?? '',
        jour:             cours?.jour             ?? '',
        heure_debut:      cours?.heure_debut ? cours.heure_debut.substring(0, 5) : '',
        heure_fin:        cours?.heure_fin   ? cours.heure_fin.substring(0, 5)   : '',
        description:      cours?.description      ?? '',
        actif:            cours?.actif            ?? true,
        ordre:            cours?.ordre            ?? 0,
        tarif:            cours?.tarif            ?? '',
        places_total:     cours?.places_total     ?? '',
        places_restantes: cours?.places_restantes ?? '',
    });

    const handlePlacesTotal = (val) => {
        setData(prev => {
            const autoFill = !prev.places_restantes || prev.places_restantes === prev.places_total;
            return { ...prev, places_total: val, places_restantes: autoFill ? val : prev.places_restantes };
        });
    };

    const submit = (e) => {
        e.preventDefault();
        const r = isEdit ? route('admin.cours.update', cours.id) : route('admin.cours.store');
        post(r, { onSuccess: onClose });
    };

    return (
        <Overlay onClose={onClose}>
            <ModalHeader title={isEdit ? `Modifier : ${cours.titre}` : 'Nouveau cours'} onClose={onClose} />
            <form onSubmit={submit} style={{ padding: '1.75rem' }}>
                <Row2>
                    <Field label="Titre" error={errors.titre} required>
                        <Input value={data.titre} onChange={e => setData('titre', e.target.value)} err={errors.titre} />
                    </Field>
                    <Field label="Niveau" error={errors.niveau} required>
                        <Select value={data.niveau} onChange={e => setData('niveau', e.target.value)} err={errors.niveau}>
                            <option value="">— Choisir —</option>
                            <option value="debutant">Débutant</option>
                            <option value="intermediaire">Intermédiaire</option>
                            <option value="avance">Avancé</option>
                            <option value="tous">Tous niveaux</option>
                        </Select>
                    </Field>
                </Row2>
                <Field label="Emplacement" error={errors.emplacement} required>
                    <Input value={data.emplacement} onChange={e => setData('emplacement', e.target.value)} err={errors.emplacement} placeholder="Atelier, adresse, salle…" />
                </Field>
                <Sep label="Horaires" />
                <Field label="Jour(s)" error={errors.jour} required>
                    <Input value={data.jour} onChange={e => setData('jour', e.target.value)} err={errors.jour} placeholder="ex : Lundi, Mercredi…" />
                </Field>
                <Row2>
                    <Field label="Heure de début" error={errors.heure_debut} required>
                        <Input type="time" value={data.heure_debut} onChange={e => setData('heure_debut', e.target.value)} err={errors.heure_debut} />
                    </Field>
                    <Field label="Heure de fin" error={errors.heure_fin} required>
                        <Input type="time" value={data.heure_fin} onChange={e => setData('heure_fin', e.target.value)} err={errors.heure_fin} />
                    </Field>
                </Row2>
                <Sep label="Informations pratiques" />
                <Row2>
                    <Field label="Places totales" error={errors.places_total}>
                        <Input type="number" min="1" value={data.places_total} onChange={e => handlePlacesTotal(e.target.value)} err={errors.places_total} />
                    </Field>
                    <Field label="Places restantes" error={errors.places_restantes}>
                        <Input type="number" min="0" value={data.places_restantes} onChange={e => setData('places_restantes', e.target.value)} err={errors.places_restantes} />
                    </Field>
                </Row2>
                <Row2>
                    <Field label="Tarif (TND)" error={errors.tarif}>
                        <Input type="number" min="0" step="0.01" value={data.tarif} onChange={e => setData('tarif', e.target.value)} err={errors.tarif} placeholder="0.00" />
                    </Field>
                    <Field label="Ordre" error={errors.ordre}>
                        <Input type="number" min="0" value={data.ordre} onChange={e => setData('ordre', e.target.value)} err={errors.ordre} />
                    </Field>
                </Row2>
                <Field label="Description" error={errors.description}>
                    <textarea value={data.description} onChange={e => setData('description', e.target.value)} rows={3} style={inputSt(errors.description)} />
                </Field>
                <CheckboxField id="actif" checked={data.actif} onChange={e => setData('actif', e.target.checked)} label="Actif (visible sur le site)" />
                <ModalFooter processing={processing} label={isEdit ? 'Mettre à jour' : 'Créer'} onClose={onClose} />
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
            <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontFamily: '"DM Mono", monospace', fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Annuler
            </button>
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
const panelStyle   = { background: C.bgCard, border: `1px solid ${C.border}`, width: '100%', maxWidth: 680, maxHeight: '90vh', overflowY: 'auto', boxShadow: `0 0 60px rgba(212,175,55,0.08)` };
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
