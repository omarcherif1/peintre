import { useForm } from '@inertiajs/react';
import AdminLayout from '@/Components/Layout/AdminLayout';

export default function Create() {
    const { data, setData, post, errors, processing } = useForm({
        titre:            '',
        niveau:           '',
        emplacement:      '',
        jour:             '',
        heure_debut:      '',
        heure_fin:        '',
        description:      '',
        actif:            true,
        ordre:            0,
        tarif:            '',
        places_total:     '',
        places_restantes: '',
    });

    const handlePlacesTotal = (val) => {
        setData(prev => {
            const autoFill = !prev.places_restantes || prev.places_restantes === prev.places_total;
            return { ...prev, places_total: val, places_restantes: autoFill ? val : prev.places_restantes };
        });
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.cours.store'));
    };

    return (
        <AdminLayout>
            <div style={{ maxWidth: 800 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <a href={route('admin.cours.index')} style={lienRetour}>← Cours</a>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Nouveau cours</h1>
                </div>

                <form onSubmit={submit} style={card}>

                    {/* Titre */}
                    <div style={fieldGroup}>
                        <label style={label}>Titre <Required /></label>
                        <input
                            type="text"
                            value={data.titre}
                            onChange={(e) => setData('titre', e.target.value)}
                            style={inputStyle(errors.titre)}
                        />
                        <Err msg={errors.titre} />
                    </div>

                    {/* Niveau */}
                    <div style={fieldGroup}>
                        <label style={label}>Niveau <Required /></label>
                        <select
                            value={data.niveau}
                            onChange={(e) => setData('niveau', e.target.value)}
                            style={inputStyle(errors.niveau)}
                        >
                            <option value="">— Choisir —</option>
                            <option value="debutant">Débutant</option>
                            <option value="intermediaire">Intermédiaire</option>
                            <option value="avance">Avancé</option>
                            <option value="tous">Tous niveaux</option>
                        </select>
                        <Err msg={errors.niveau} />
                    </div>

                    {/* Emplacement */}
                    <div style={fieldGroup}>
                        <label style={label}>Emplacement <Required /></label>
                        <input
                            type="text"
                            value={data.emplacement}
                            onChange={(e) => setData('emplacement', e.target.value)}
                            style={inputStyle(errors.emplacement)}
                            placeholder="Atelier, adresse, salle…"
                        />
                        <Err msg={errors.emplacement} />
                    </div>

                    {/* Horaires */}
                    <div style={separateur}>Horaires</div>

                    <div style={fieldGroup}>
                        <label style={label}>Jour(s) <Required /></label>
                        <input
                            type="text"
                            value={data.jour}
                            onChange={(e) => setData('jour', e.target.value)}
                            style={inputStyle(errors.jour)}
                            placeholder="ex : Lundi, Mercredi et Vendredi…"
                        />
                        <Err msg={errors.jour} />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={label}>Heure de début <Required /></label>
                            <input
                                type="time"
                                value={data.heure_debut}
                                onChange={(e) => setData('heure_debut', e.target.value)}
                                style={inputStyle(errors.heure_debut)}
                            />
                            <Err msg={errors.heure_debut} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={label}>Heure de fin <Required /></label>
                            <input
                                type="time"
                                value={data.heure_fin}
                                onChange={(e) => setData('heure_fin', e.target.value)}
                                style={inputStyle(errors.heure_fin)}
                            />
                            <Err msg={errors.heure_fin} />
                        </div>
                    </div>

                    {/* Infos pratiques */}
                    <div style={separateur}>Informations pratiques</div>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={label}>Places totales</label>
                            <input
                                type="number"
                                min="1"
                                value={data.places_total}
                                onChange={(e) => handlePlacesTotal(e.target.value)}
                                style={inputStyle(errors.places_total)}
                            />
                            <Err msg={errors.places_total} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={label}>
                                Places restantes
                                <span style={{ fontWeight: 400, color: '#9ca3af', fontSize: '0.75rem', marginLeft: 6 }}>
                                    (auto depuis total)
                                </span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={data.places_restantes}
                                onChange={(e) => setData('places_restantes', e.target.value)}
                                style={inputStyle(errors.places_restantes)}
                            />
                            <Err msg={errors.places_restantes} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={label}>Tarif (TND)</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.tarif}
                                onChange={(e) => setData('tarif', e.target.value)}
                                style={inputStyle(errors.tarif)}
                                placeholder="0.00"
                            />
                            <Err msg={errors.tarif} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={label}>Ordre d'affichage</label>
                            <input
                                type="number"
                                min="0"
                                value={data.ordre}
                                onChange={(e) => setData('ordre', e.target.value)}
                                style={inputStyle(errors.ordre)}
                            />
                            <Err msg={errors.ordre} />
                        </div>
                    </div>

                    <div style={fieldGroup}>
                        <label style={label}>Description</label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={4}
                            style={inputStyle(errors.description)}
                        />
                        <Err msg={errors.description} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                        <input
                            type="checkbox"
                            id="actif"
                            checked={data.actif}
                            onChange={(e) => setData('actif', e.target.checked)}
                            style={{ width: 16, height: 16, cursor: 'pointer' }}
                        />
                        <label htmlFor="actif" style={{ ...label, margin: 0, cursor: 'pointer' }}>
                            Actif (visible sur le site)
                        </label>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', paddingTop: '0.5rem', borderTop: '1px solid #f3f4f6', marginTop: '0.5rem' }}>
                        <button type="submit" disabled={processing} style={btnSubmit(processing)}>
                            {processing ? 'Enregistrement…' : 'Créer'}
                        </button>
                        <a href={route('admin.cours.index')} style={btnAnnuler}>Annuler</a>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

function Required() { return <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>; }
function Err({ msg }) {
    if (!msg) return null;
    return <p style={{ color: '#b91c1c', fontSize: '0.75rem', margin: '0.25rem 0 0' }}>{msg}</p>;
}

const card      = { background: 'white', borderRadius: 8, padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' };
const fieldGroup = { marginBottom: '1.25rem', display: 'flex', flexDirection: 'column' };
const label     = { fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' };
const inputStyle = (err) => ({
    width: '100%', padding: '0.5rem 0.75rem', boxSizing: 'border-box',
    border: `1px solid ${err ? '#f87171' : '#d1d5db'}`, borderRadius: 6,
    fontSize: '0.875rem', fontFamily: 'inherit',
});
const separateur = {
    fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
    letterSpacing: '0.08em', color: '#6b7280',
    padding: '0.6rem 0', marginBottom: '1rem',
    borderTop: '1px solid #f3f4f6', marginTop: '0.25rem',
};
const btnSubmit  = (disabled) => ({
    padding: '0.6rem 1.5rem', background: '#1e1e2e', color: 'white',
    border: 'none', borderRadius: 6, cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.65 : 1, fontSize: '0.875rem',
});
const btnAnnuler = { padding: '0.6rem 1rem', color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem', alignSelf: 'center' };
const lienRetour = { color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem' };
