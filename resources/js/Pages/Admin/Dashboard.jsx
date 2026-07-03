import { useState, useEffect } from 'react';
import { Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Components/Layout/AdminLayout';
import DragZone from '@/Components/Admin/DragZone';

const C = {
    bg:      '#0A0706',
    card:    '#1c1916',
    border:  '#2a2520',
    gold:    '#D4AF37',
    cream:   '#F4EFEA',
    muted:   '#7a6a5a',
    dimmed:  '#3a2e24',
};

const formatDate = (str) =>
    str ? new Date(str).toLocaleDateString('fr-FR') : '—';

const dateJour = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
});

const tronquer = (str, max = 20) =>
    str && str.length > max ? str.substring(0, max) + '…' : str;

const toInputDate = (str) => (str ? str.substring(0, 10) : '');

/* ══════════════════════════════════════
   Page Dashboard
══════════════════════════════════════ */
export default function Dashboard({
    total_tableaux,
    total_peintures,
    total_dessins,
    tableaux_disponibles,
    total_foires,
    foire_a_venir,
    total_cours,
    total_stages,
    derniers_tableaux,
    prochains_stages,
    total_articles = 0,
    articles_publies = 0,
}) {
    const [modal, setModal] = useState(null);
    // null | 'create-tableau' | 'create-foire' | 'create-cours'
    // | { type: 'edit-foire', item } | { type: 'edit-tableau', item }

    useEffect(() => {
        document.body.style.overflow = modal ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [modal]);

    const openCreate = (type) => setModal(`create-${type}`);

    return (
        <AdminLayout>
            {/* ── En-tête ── */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 700, margin: '0 0 0.25rem', color: C.cream }}>
                    Tableau de bord
                </h1>
                <p style={{ color: C.muted, fontSize: '0.875rem', margin: 0, textTransform: 'capitalize' }}>
                    {dateJour}
                </p>
            </div>

            {/* ── 4 cartes stats ── */}
            <div style={grid4}>
                {/* Carte Tableaux */}
                <CarteStats accent={C.gold}>
                    <div style={carteLabel}>Tableaux</div>
                    <div style={carteTotal}>{total_tableaux}</div>
                    <div style={carteSub}>
                        <Puce couleur={C.gold}>{total_peintures} peinture{total_peintures !== 1 ? 's' : ''}</Puce>
                        <Puce couleur={C.muted}>{total_dessins} dessin{total_dessins !== 1 ? 's' : ''}</Puce>
                        <Puce couleur="#6db87a">{tableaux_disponibles} disponible{tableaux_disponibles !== 1 ? 's' : ''}</Puce>
                    </div>
                    <Link href={route('admin.tableaux.index')} style={carteLien}>
                        Gérer les tableaux →
                    </Link>
                </CarteStats>

                {/* Carte Foire à venir */}
                <CarteStats accent="#c47c40">
                    <div style={carteLabel}>Foire à venir</div>
                    {foire_a_venir ? (
                        <>
                            <div style={{ fontWeight: 700, fontSize: '1rem', margin: '0.4rem 0 0.25rem', color: C.cream }}>
                                {foire_a_venir.nom}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: C.muted, marginBottom: '0.25rem' }}>
                                {formatDate(foire_a_venir.date_debut)}
                                {foire_a_venir.date_fin ? ` → ${formatDate(foire_a_venir.date_fin)}` : ''}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: C.muted, marginBottom: '0.75rem' }}>
                                📍 {foire_a_venir.emplacement}
                            </div>
                            <button
                                onClick={() => setModal({ type: 'edit-foire', item: foire_a_venir })}
                                style={{ ...carteLien, background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                            >
                                Modifier →
                            </button>
                        </>
                    ) : (
                        <>
                            <div style={{ color: C.muted, fontSize: '0.875rem', margin: '0.5rem 0 0.75rem' }}>
                                Aucune foire programmée
                            </div>
                            <button
                                onClick={() => openCreate('foire')}
                                style={{ ...carteLien, background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                            >
                                + Ajouter une foire →
                            </button>
                        </>
                    )}
                </CarteStats>

                {/* Carte Cours actifs */}
                <CarteStats accent="#b05a3a">
                    <div style={carteLabel}>Cours actifs</div>
                    <div style={carteTotal}>{total_cours}</div>
                    <div style={carteSub}>
                        <Puce couleur="#c47c40">{total_cours} cours régulier{total_cours !== 1 ? 's' : ''}</Puce>
                    </div>
                    <Link href={route('admin.cours.index')} style={carteLien}>
                        Gérer les cours →
                    </Link>
                </CarteStats>

                {/* Carte Articles */}
                <CarteStats accent="#7a5a8a">
                    <div style={carteLabel}>Articles / Blog</div>
                    <div style={carteTotal}>{total_articles}</div>
                    <div style={carteSub}>
                        <Puce couleur={C.gold}>{articles_publies} publié{articles_publies !== 1 ? 's' : ''}</Puce>
                        <Puce couleur={C.muted}>{total_articles - articles_publies} brouillon{(total_articles - articles_publies) !== 1 ? 's' : ''}</Puce>
                    </div>
                    <Link href={route('admin.articles.index')} style={carteLien}>
                        Gérer les articles →
                    </Link>
                </CarteStats>

                {/* Carte Accès rapides */}
                <CarteStats accent="#8a6a50">
                    <div style={carteLabel}>Accès rapides</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <button onClick={() => openCreate('tableau')} style={btnAcces(C.gold)}>
                            + Nouveau tableau
                        </button>
                        <button onClick={() => openCreate('foire')} style={btnAcces('#c47c40')}>
                            + Nouvelle foire
                        </button>
                        <button onClick={() => openCreate('cours')} style={btnAcces('#b05a3a')}>
                            + Nouveau cours
                        </button>
                    </div>
                </CarteStats>
            </div>

            {/* ── Derniers tableaux ajoutés ── */}
            <div style={section}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
                    <h2 style={sectionTitre}>Derniers tableaux ajoutés</h2>
                    <Link href={route('admin.tableaux.index')} style={{ fontSize: '0.8rem', color: C.gold, textDecoration: 'none' }}>
                        Voir tous les tableaux →
                    </Link>
                </div>

                {derniers_tableaux.length === 0 ? (
                    <p style={vide}>Aucun tableau enregistré.</p>
                ) : (
                    <div style={grid5}>
                        {derniers_tableaux.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setModal({ type: 'edit-tableau', item: t })}
                                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', width: '100%' }}
                            >
                                <div style={carteTableau}>
                                    {t.image_url ? (
                                        <img src={t.image_url} alt={t.nom} style={imgTableau} />
                                    ) : (
                                        <div style={{ ...imgTableau, background: C.dimmed, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted, fontSize: '1.5rem' }}>
                                            ?
                                        </div>
                                    )}
                                    <div style={{ padding: '0.6rem 0.65rem' }}>
                                        <div style={{ fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.35rem', color: C.cream }}>
                                            {tronquer(t.nom, 20)}
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                                            <span style={badgeCat(t.categorie)}>{t.categorie}</span>
                                            <span style={badgeDispo(t.disponible)}>
                                                {t.disponible ? 'Dispo' : 'Vendu'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Prochains stages ── */}
            {prochains_stages.length > 0 && (
                <div style={section}>
                    <h2 style={{ ...sectionTitre, marginBottom: '1rem' }}>Prochains stages</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                        {prochains_stages.map((s) => (
                            <div key={s.id} style={ligneStage}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: C.cream, marginBottom: '0.2rem' }}>
                                        {s.titre}
                                    </div>
                                    <div style={{ fontSize: '0.78rem', color: C.muted }}>
                                        {formatDate(s.date_debut_stage)}
                                        {s.date_fin_stage && s.date_fin_stage !== s.date_debut_stage
                                            ? ` → ${formatDate(s.date_fin_stage)}`
                                            : ''}
                                        {' · '}{s.emplacement}
                                        {s.places_total && (
                                            <span style={{ marginLeft: '0.5rem', color: C.gold, fontWeight: 600 }}>
                                                {s.places_restantes ?? '?'}/{s.places_total} places
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <Link href={route('admin.cours.edit', s.id)} style={btnModifier}>
                                    Modifier
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ══ Modales ══ */}
            {modal === 'create-tableau' && (
                <TableauModal key="ct" mode="create" tableau={null} onClose={() => setModal(null)} />
            )}
            {modal === 'create-foire' && (
                <FoireModal key="cf" mode="create" foire={null} onClose={() => setModal(null)} />
            )}
            {modal === 'create-cours' && (
                <CoursModal key="cc" mode="create" cours={null} onClose={() => setModal(null)} />
            )}
            {modal?.type === 'edit-foire' && (
                <FoireModal key={modal.item.id} mode="edit" foire={modal.item} onClose={() => setModal(null)} />
            )}
            {modal?.type === 'edit-tableau' && (
                <TableauModal key={modal.item.id} mode="edit" tableau={modal.item} onClose={() => setModal(null)} />
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
        } catch { alert('Erreur lors de la mise à jour.'); }
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
                if (etaitPrincipale && restantes.length > 0) {
                    return restantes.map((img, i) => ({ ...img, est_principale: i === 0 }));
                }
                return restantes;
            });
        } catch { alert('Erreur lors de la suppression.'); }
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
            <form onSubmit={submit} style={{ padding: '1.5rem' }}>
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
                <CheckboxField id="db-disponible" checked={data.disponible} onChange={e => setData('disponible', e.target.checked)} label="Disponible à la vente" />

                {isEdit && (
                    <>
                        <Sep label={`Images existantes (${images.length})`} />
                        {images.length === 0 ? (
                            <p style={{ fontSize: '0.8rem', color: C.muted, marginBottom: '1rem' }}>Aucune image — ajoutez-en ci-dessous.</p>
                        ) : (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                                {images.map(img => (
                                    <div key={img.id} style={{ width: 100, border: img.est_principale ? `2px solid ${C.gold}` : `1px solid ${C.border}`, borderRadius: 6, overflow: 'hidden', opacity: loadingId === img.id ? 0.4 : 1 }}>
                                        <img src={img.url} alt="" style={{ width: 100, height: 85, objectFit: 'cover', display: 'block' }} />
                                        <div style={{ padding: '0.25rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                            {img.est_principale
                                                ? <span style={badgePrincipale}>Principale</span>
                                                : <button type="button" onClick={() => setPrincipale(img.id)} disabled={!!loadingId} style={btnDefinir}>Définir principale</button>
                                            }
                                            <button type="button" onClick={() => supprimerImage(img.id)} disabled={!!loadingId} style={btnSupprimerImg}>Supprimer</button>
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
                                <img src={src} alt="" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 4, display: 'block', border: i === 0 ? `2px solid ${C.gold}` : `1px solid ${C.border}` }} />
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

    const [images,    setImages]    = useState(foire?.images ?? []);
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
    const supprimerImage = async (imageId) => {
        if (!confirm('Supprimer cette image ?')) return;
        setLoadingId(imageId);
        try {
            await window.axios.delete(route('admin.foires.images.delete', { foire: foire.id, image: imageId }));
            setImages(prev => prev.filter(img => img.id !== imageId));
        } catch { alert('Erreur lors de la suppression.'); }
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
            <form onSubmit={submit} style={{ padding: '1.5rem' }}>
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
                <CheckboxField id="db-est_a_venir" checked={data.est_a_venir} onChange={e => setData('est_a_venir', e.target.checked)} label='Marquer comme « À venir »' />

                {isEdit && images.length > 0 && (
                    <>
                        <Sep label="Images existantes" />
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                            {images.map(img => (
                                <div key={img.id} style={{ width: 90, border: `1px solid ${C.border}`, borderRadius: 6, overflow: 'hidden', opacity: loadingId === img.id ? 0.4 : 1 }}>
                                    <img src={img.url} alt="" style={{ width: 90, height: 80, objectFit: 'cover', display: 'block' }} />
                                    <div style={{ padding: '0.25rem' }}>
                                        <button type="button" onClick={() => supprimerImage(img.id)} disabled={!!loadingId} style={btnSupprimerImg}>Supprimer</button>
                                    </div>
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
                                <img src={src} alt="" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 4, display: 'block', border: `1px solid ${C.border}` }} />
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
            <form onSubmit={submit} style={{ padding: '1.5rem' }}>
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
                    <Field label="Ordre d'affichage" error={errors.ordre}>
                        <Input type="number" min="0" value={data.ordre} onChange={e => setData('ordre', e.target.value)} err={errors.ordre} />
                    </Field>
                </Row2>
                <Field label="Description" error={errors.description}>
                    <textarea value={data.description} onChange={e => setData('description', e.target.value)} rows={3} style={inputSt(errors.description)} />
                </Field>
                <CheckboxField id="db-actif" checked={data.actif} onChange={e => setData('actif', e.target.checked)} label="Actif (visible sur le site)" />
                <ModalFooter processing={processing} label={isEdit ? 'Mettre à jour' : 'Créer'} onClose={onClose} />
            </form>
        </Overlay>
    );
}

/* ── Shared UI primitives ── */
function Overlay({ children, onClose }) {
    return (
        <div style={overlayStyle} onClick={onClose}>
            <div style={panelStyle} onClick={e => e.stopPropagation()}>{children}</div>
        </div>
    );
}
function ModalHeader({ title, onClose }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: `1px solid ${C.border}` }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: C.cream }}>{title}</h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: C.muted, lineHeight: 1 }}>✕</button>
        </div>
    );
}
function ModalFooter({ processing, label, onClose }) {
    return (
        <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem', borderTop: `1px solid ${C.border}`, marginTop: '0.5rem' }}>
            <button type="submit" disabled={processing} style={btnSubmit(processing)}>{processing ? 'Enregistrement…' : label}</button>
            <button type="button" onClick={onClose} style={{ padding: '0.6rem 1rem', color: C.muted, background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}>Annuler</button>
        </div>
    );
}
function Field({ label: lbl, error, required, children }) {
    return (
        <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column' }}>
            <label style={labelSt}>{lbl}{required && <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>}</label>
            {children}
            {error && <p style={{ color: '#b91c1c', fontSize: '0.72rem', margin: '0.2rem 0 0' }}>{error}</p>}
        </div>
    );
}
function Input({ err, ...props }) { return <input style={inputSt(err)} {...props} />; }
function Select({ err, children, ...props }) { return <select style={inputSt(err)} {...props}>{children}</select>; }
function Row2({ children }) { return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>{children}</div>; }
function Sep({ label: lbl }) { return <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: C.muted, padding: '0.5rem 0', marginBottom: '0.75rem', borderTop: `1px solid ${C.border}`, marginTop: '0.25rem' }}>{lbl}</div>; }
function CheckboxField({ id, checked, onChange, label: lbl }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <input type="checkbox" id={id} checked={checked} onChange={onChange} style={{ width: 16, height: 16, cursor: 'pointer' }} />
            <label htmlFor={id} style={{ ...labelSt, margin: 0, cursor: 'pointer' }}>{lbl}</label>
        </div>
    );
}

/* ── Sous-composants Dashboard ── */
function CarteStats({ accent, children }) {
    return (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderLeft: `4px solid ${accent}`, borderRadius: 8, padding: '1.25rem' }}>
            {children}
        </div>
    );
}
function Puce({ couleur, children }) {
    return <span style={{ fontSize: '0.75rem', color: couleur, display: 'block' }}>{children}</span>;
}

/* ── Styles ── */
const overlayStyle = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' };
const panelStyle   = { background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, width: '100%', maxWidth: 700, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' };
const labelSt      = { fontSize: '0.8rem', fontWeight: 600, color: C.muted, marginBottom: '0.3rem' };
const inputSt      = (err) => ({ width: '100%', padding: '0.45rem 0.7rem', boxSizing: 'border-box', background: '#120f0c', color: C.cream, border: `1px solid ${err ? '#c0392b' : C.border}`, borderRadius: 6, fontSize: '0.875rem', fontFamily: 'inherit' });

const grid4      = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' };
const grid5      = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' };
const carteLabel = { fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: C.muted, marginBottom: '0.4rem' };
const carteTotal = { fontSize: '2rem', fontWeight: 800, color: C.cream, lineHeight: 1, marginBottom: '0.4rem' };
const carteSub   = { display: 'flex', flexDirection: 'column', gap: '0.1rem', marginBottom: '0.75rem' };
const carteLien  = { fontSize: '0.78rem', color: C.gold, textDecoration: 'none', fontWeight: 600 };

const btnAcces = (couleur) => ({
    display: 'block', padding: '0.45rem 0.75rem',
    background: couleur + '18', color: couleur,
    border: `1px solid ${couleur}40`, borderRadius: 6,
    fontSize: '0.8rem', fontWeight: 600,
    textAlign: 'center', cursor: 'pointer', width: '100%',
});

const section      = { background: C.card, borderRadius: 8, border: `1px solid ${C.border}`, padding: '1.25rem', marginBottom: '1.25rem' };
const sectionTitre = { fontSize: '0.95rem', fontWeight: 700, color: C.cream, margin: 0 };
const vide         = { color: C.muted, fontSize: '0.875rem', margin: 0 };
const carteTableau = { border: `1px solid ${C.border}`, borderRadius: 6, overflow: 'hidden', transition: 'box-shadow 0.15s', background: '#120f0c' };
const imgTableau   = { width: '100%', height: 110, objectFit: 'cover', display: 'block' };

const badgeCat   = (c) => ({ fontSize: '0.65rem', fontWeight: 600, padding: '1px 5px', borderRadius: 999, background: c === 'peinture' ? '#2a3a1a' : '#1a2a1a', color: c === 'peinture' ? C.gold : '#6db87a' });
const badgeDispo = (d) => ({ fontSize: '0.65rem', fontWeight: 600, padding: '1px 5px', borderRadius: 999, background: d ? '#1a2a1a' : '#2a1a1a', color: d ? '#6db87a' : '#c0392b' });

const ligneStage = { display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', background: '#120f0c', border: `1px solid ${C.border}`, borderRadius: 6 };
const btnModifier = { padding: '0.3rem 0.75rem', background: C.dimmed, color: C.gold, border: `1px solid ${C.border}`, borderRadius: 4, textDecoration: 'none', fontSize: '0.78rem', whiteSpace: 'nowrap' };
const btnSubmit  = (d) => ({ padding: '0.6rem 1.5rem', background: C.gold, color: '#0A0706', border: 'none', borderRadius: 6, cursor: d ? 'not-allowed' : 'pointer', opacity: d ? 0.65 : 1, fontSize: '0.875rem', fontWeight: 700 });
const btnRetrait = { position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.7)', color: C.cream, border: 'none', borderRadius: '50%', width: 18, height: 18, cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 };
const btnSupprimerImg = { width: '100%', fontSize: '0.65rem', background: '#2a1a1a', color: '#c0392b', border: `1px solid #3a1a1a`, borderRadius: 4, padding: '3px 4px', cursor: 'pointer' };
const btnDefinir = { width: '100%', fontSize: '0.65rem', background: C.dimmed, color: C.muted, border: `1px solid ${C.border}`, borderRadius: 4, padding: '3px 4px', cursor: 'pointer' };
const badgePrincipale = { display: 'block', textAlign: 'center', fontSize: '0.6rem', fontWeight: 700, background: '#2a2418', color: C.gold, borderRadius: 4, padding: '2px 4px' };
