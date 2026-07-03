import { useState, useRef } from 'react';

export default function DragZone({ onChange, multiple = true, hint }) {
    const [dragging, setDragging]   = useState(false);
    const [fileNames, setFileNames] = useState([]);
    const inputRef = useRef(null);

    const process = (files) => {
        const valid = files.filter(f =>
            ['image/jpeg', 'image/png', 'image/webp'].includes(f.type)
        );
        if (!valid.length) return;
        setFileNames(valid.map(f => f.name));
        onChange(valid);
    };

    return (
        <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={(e) => { e.preventDefault(); setDragging(false); }}
            onDrop={(e) => { e.preventDefault(); setDragging(false); process(Array.from(e.dataTransfer.files)); }}
            style={{
                border: `1.5px dashed ${dragging ? '#D4AF37' : '#3a3530'}`,
                background: dragging ? 'rgba(212,175,55,0.06)' : '#0e0c0a',
                padding: '1.75rem 1rem',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'border-color 0.2s, background 0.2s',
                marginBottom: '0.5rem',
            }}
        >
            <input
                ref={inputRef}
                type="file"
                multiple={multiple}
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => process(Array.from(e.target.files))}
                style={{ display: 'none' }}
            />

            {/* Icône upload */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={dragging ? '#D4AF37' : 'rgba(212,175,55,0.4)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 0.6rem' }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>

            {fileNames.length > 0 ? (
                <p style={{ fontFamily: '"DM Mono",monospace', fontSize: '0.65rem', color: '#D4AF37', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>
                    ✓ {fileNames.length} fichier{fileNames.length > 1 ? 's' : ''} sélectionné{fileNames.length > 1 ? 's' : ''}
                </p>
            ) : (
                <p style={{ fontFamily: '"DM Mono",monospace', fontSize: '0.65rem', color: 'rgba(244,239,234,0.35)', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>
                    {dragging ? 'Relâcher pour ajouter' : 'Glisser-déposer ou cliquer'}
                </p>
            )}

            {hint && (
                <p style={{ fontFamily: '"DM Mono",monospace', fontSize: '0.55rem', color: 'rgba(244,239,234,0.2)', letterSpacing: '0.06em' }}>
                    {hint}
                </p>
            )}
        </div>
    );
}
