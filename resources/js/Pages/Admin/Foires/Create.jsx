import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Components/Layout/AdminLayout';

export default function Create() {
    const { data, setData, post, errors, processing } = useForm({
        nom: '',
        emplacement: '',
        date_debut: '',
        date_fin: '',
        description: '',
        est_a_venir: false,
        ordre: 0,
        images: [],
    });

    const [previews, setPreviews] = useState([]);

    const handleImages = (e) => {
        const files = Array.from(e.target.files);
        setData('images', files);
        setPreviews(files.map((f) => URL.createObjectURL(f)));
    };

    const retirerImage = (index) => {
        URL.revokeObjectURL(previews[index]);
        setData('images', data.images.filter((_, i) => i !== index));
        setPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.foires.store'), { forceFormData: true });
    };

    return (
        <AdminLayout>
            <div style={{ maxWidth: 800 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <a href={route('admin.foires.index')} style={lienRetour}>
                        ← Foires
                    </a>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Nouvelle foire</h1>
                </div>

                <form onSubmit={submit} style={card}>

                    <div style={fieldGroup}>
                        <label style={label}>Nom <Required /></label>
                        <input
                            type="text"
                            value={data.nom}
                            onChange={(e) => setData('nom', e.target.value)}
                            style={inputStyle(errors.nom)}
                        />
                        <Err msg={errors.nom} />
                    </div>

                    <div style={fieldGroup}>
                        <label style={label}>Emplacement <Required /></label>
                        <input
                            type="text"
                            value={data.emplacement}
                            onChange={(e) => setData('emplacement', e.target.value)}
                            style={inputStyle(errors.emplacement)}
                            placeholder="Ville, salle, adresse…"
                        />
                        <Err msg={errors.emplacement} />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={label}>Date de début <Required /></label>
                            <input
                                type="date"
                                value={data.date_debut}
                                onChange={(e) => setData('date_debut', e.target.value)}
                                style={inputStyle(errors.date_debut)}
                            />
                            <Err msg={errors.date_debut} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={label}>Date de fin</label>
                            <input
                                type="date"
                                value={data.date_fin}
                                min={data.date_debut || undefined}
                                onChange={(e) => setData('date_fin', e.target.value)}
                                style={inputStyle(errors.date_fin)}
                            />
                            <Err msg={errors.date_fin} />
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

                    <div style={{ marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input
                                type="checkbox"
                                id="est_a_venir"
                                checked={data.est_a_venir}
                                onChange={(e) => setData('est_a_venir', e.target.checked)}
                                style={{ width: 16, height: 16, cursor: 'pointer' }}
                            />
                            <label htmlFor="est_a_venir" style={{ ...label, margin: 0, cursor: 'pointer' }}>
                                Marquer comme « À venir »
                            </label>
                        </div>
                        {data.est_a_venir && (
                            <p style={{ fontSize: '0.75rem', color: '#92400e', background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: 4, padding: '0.4rem 0.65rem', marginTop: '0.4rem' }}>
                                Attention : les autres foires actuellement marquées « À venir » seront automatiquement basculées en « Passée ».
                            </p>
                        )}
                    </div>

                    <div style={fieldGroup}>
                        <label style={label}>Ordre d'affichage</label>
                        <input
                            type="number"
                            min="0"
                            value={data.ordre}
                            onChange={(e) => setData('ordre', parseInt(e.target.value) || 0)}
                            style={{ ...inputStyle(), width: 100 }}
                        />
                    </div>

                    <div style={fieldGroup}>
                        <label style={label}>Images</label>
                        <input
                            type="file"
                            multiple
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleImages}
                            style={{ fontSize: '0.875rem' }}
                        />
                        <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: '0.25rem 0 0' }}>
                            JPG, PNG ou WebP · max 5 Mo par image
                        </p>
                        <Err msg={errors.images} />

                        {previews.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
                                {previews.map((src, i) => (
                                    <div key={i} style={{ position: 'relative' }}>
                                        <img
                                            src={src}
                                            alt=""
                                            style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4, display: 'block', border: '1px solid #e5e7eb' }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => retirerImage(i)}
                                            style={btnRetrait}
                                            title="Retirer"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', paddingTop: '0.5rem', borderTop: '1px solid #f3f4f6', marginTop: '0.5rem' }}>
                        <button type="submit" disabled={processing} style={btnSubmit(processing)}>
                            {processing ? 'Enregistrement…' : 'Créer la foire'}
                        </button>
                        <a href={route('admin.foires.index')} style={btnAnnuler}>
                            Annuler
                        </a>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

function Required() {
    return <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>;
}
function Err({ msg }) {
    if (!msg) return null;
    return <p style={{ color: '#b91c1c', fontSize: '0.75rem', margin: '0.25rem 0 0' }}>{msg}</p>;
}

const card = {
    background: 'white', borderRadius: 8,
    padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
};
const fieldGroup = { marginBottom: '1.25rem', display: 'flex', flexDirection: 'column' };
const label = { fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' };
const inputStyle = (err) => ({
    width: '100%', padding: '0.5rem 0.75rem', boxSizing: 'border-box',
    border: `1px solid ${err ? '#f87171' : '#d1d5db'}`, borderRadius: 6,
    fontSize: '0.875rem', fontFamily: 'inherit',
});
const btnRetrait = {
    position: 'absolute', top: 3, right: 3,
    background: 'rgba(0,0,0,0.55)', color: 'white',
    border: 'none', borderRadius: '50%',
    width: 18, height: 18, cursor: 'pointer',
    fontSize: '0.75rem', display: 'flex',
    alignItems: 'center', justifyContent: 'center', padding: 0,
};
const btnSubmit = (disabled) => ({
    padding: '0.6rem 1.5rem', background: '#1e1e2e', color: 'white',
    border: 'none', borderRadius: 6,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.65 : 1, fontSize: '0.875rem',
});
const btnAnnuler = {
    padding: '0.6rem 1rem', color: '#6b7280',
    textDecoration: 'none', fontSize: '0.875rem', alignSelf: 'center',
};
const lienRetour = {
    color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem',
};
