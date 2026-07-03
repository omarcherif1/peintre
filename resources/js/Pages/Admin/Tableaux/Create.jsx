import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Components/Layout/AdminLayout';

export default function Create() {
    const { data, setData, post, errors, processing } = useForm({
        nom: '',
        categorie: '',
        technique: '',
        mesure_hauteur: '',
        mesure_largeur: '',
        idee: '',
        description: '',
        disponible: true,
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
        post(route('admin.tableaux.store'), { forceFormData: true });
    };

    return (
        <AdminLayout>
            <div style={{ maxWidth: 800 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <a href={route('admin.tableaux.index')} style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem' }}>
                        ← Tableaux
                    </a>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Nouveau tableau</h1>
                </div>

                <form onSubmit={submit} style={card}>

                    <div style={fieldGroup}>
                        <label style={label}>Nom <Required /></label>
                        <input
                            type="text"
                            value={data.nom}
                            onChange={(e) => setData('nom', e.target.value)}
                            style={input(errors.nom)}
                        />
                        <Err msg={errors.nom} />
                    </div>

                    <div style={fieldGroup}>
                        <label style={label}>Catégorie <Required /></label>
                        <select
                            value={data.categorie}
                            onChange={(e) => setData('categorie', e.target.value)}
                            style={input(errors.categorie)}
                        >
                            <option value="">— Choisir —</option>
                            <option value="peinture">Peinture</option>
                            <option value="dessin">Dessin</option>
                        </select>
                        <Err msg={errors.categorie} />
                    </div>

                    <div style={fieldGroup}>
                        <label style={label}>Technique <Required /></label>
                        <input
                            type="text"
                            value={data.technique}
                            onChange={(e) => setData('technique', e.target.value)}
                            style={input(errors.technique)}
                        />
                        <Err msg={errors.technique} />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={label}>Hauteur (cm) <Required /></label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.mesure_hauteur}
                                onChange={(e) => setData('mesure_hauteur', e.target.value)}
                                style={input(errors.mesure_hauteur)}
                            />
                            <Err msg={errors.mesure_hauteur} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={label}>Largeur (cm) <Required /></label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.mesure_largeur}
                                onChange={(e) => setData('mesure_largeur', e.target.value)}
                                style={input(errors.mesure_largeur)}
                            />
                            <Err msg={errors.mesure_largeur} />
                        </div>
                    </div>

                    <div style={fieldGroup}>
                        <label style={{ ...label, display: 'flex', justifyContent: 'space-between' }}>
                            <span>Idée</span>
                            <span style={{ fontWeight: 400, color: data.idee.length > 900 ? '#b91c1c' : '#9ca3af', fontSize: '0.75rem' }}>
                                {data.idee.length}/1000
                            </span>
                        </label>
                        <textarea
                            value={data.idee}
                            onChange={(e) => setData('idee', e.target.value)}
                            maxLength={1000}
                            rows={3}
                            style={input(errors.idee)}
                        />
                        <Err msg={errors.idee} />
                    </div>

                    <div style={fieldGroup}>
                        <label style={label}>Description</label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={8}
                            style={input(errors.description)}
                        />
                        <Err msg={errors.description} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                        <input
                            type="checkbox"
                            id="disponible"
                            checked={data.disponible}
                            onChange={(e) => setData('disponible', e.target.checked)}
                            style={{ width: 16, height: 16, cursor: 'pointer' }}
                        />
                        <label htmlFor="disponible" style={{ ...label, margin: 0, cursor: 'pointer' }}>
                            Disponible à la vente
                        </label>
                    </div>

                    <div style={fieldGroup}>
                        <label style={label}>Ordre d'affichage</label>
                        <input
                            type="number"
                            value={data.ordre}
                            onChange={(e) => setData('ordre', parseInt(e.target.value) || 0)}
                            style={{ ...input(), width: 100 }}
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
                            JPG, PNG ou WebP · max 5 Mo par image · la première sera l'image principale
                        </p>
                        <Err msg={errors.images} />

                        {previews.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
                                {previews.map((src, i) => (
                                    <div key={i} style={{ position: 'relative' }}>
                                        <img
                                            src={src}
                                            alt=""
                                            style={{
                                                width: 80, height: 80, objectFit: 'cover', borderRadius: 4, display: 'block',
                                                border: i === 0 ? '2px solid #1e1e2e' : '1px solid #e5e7eb',
                                            }}
                                        />
                                        {i === 0 && (
                                            <span style={badgePrincipale}>Principale</span>
                                        )}
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
                            {processing ? 'Enregistrement…' : 'Créer le tableau'}
                        </button>
                        <a href={route('admin.tableaux.index')} style={btnAnnuler}>
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
const input = (err) => ({
    width: '100%', padding: '0.5rem 0.75rem', boxSizing: 'border-box',
    border: `1px solid ${err ? '#f87171' : '#d1d5db'}`, borderRadius: 6,
    fontSize: '0.875rem', fontFamily: 'inherit',
    outline: 'none',
});
const badgePrincipale = {
    position: 'absolute', top: 3, left: 3,
    background: '#1e1e2e', color: 'white',
    fontSize: '0.6rem', padding: '1px 5px', borderRadius: 3,
};
const btnRetrait = {
    position: 'absolute', top: 3, right: 3,
    background: 'rgba(0,0,0,0.55)', color: 'white',
    border: 'none', borderRadius: '50%',
    width: 18, height: 18, cursor: 'pointer',
    fontSize: '0.75rem', lineHeight: 1, display: 'flex',
    alignItems: 'center', justifyContent: 'center', padding: 0,
};
const btnSubmit = (disabled) => ({
    padding: '0.6rem 1.5rem', background: '#1e1e2e', color: 'white',
    border: 'none', borderRadius: 6, cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.65 : 1, fontSize: '0.875rem',
});
const btnAnnuler = {
    padding: '0.6rem 1rem', color: '#6b7280',
    textDecoration: 'none', fontSize: '0.875rem', alignSelf: 'center',
};
