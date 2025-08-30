export default function NotFound() {
    return (
        <div className="card fade-in" style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
            <div style={{
                fontSize: '120px',
                marginBottom: '20px',
                background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: 'bold'
            }}>
                404
            </div>

            <h2 style={{ marginBottom: '16px' }}>Strona nie została znaleziona</h2>

            <p className="small" style={{
                marginBottom: '32px',
                opacity: 0.7,
                lineHeight: 1.6,
                maxWidth: '400px',
                margin: '0 auto 32px'
            }}>
                Ups! Wygląda na to, że zabłądziłeś. Ta strona nie istnieje lub została przeniesiona.
            </p>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                alignItems: 'center'
            }}>
                <a
                    href="/"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 24px',
                        background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))',
                        color: 'white',
                        borderRadius: 'var(--radius-md)',
                        textDecoration: 'none',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        fontSize: '16px'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = 'var(--shadow-lg), 0 0 20px rgba(59, 130, 246, 0.4)'
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                    }}
                >
                    🏠 Wróć do strony głównej
                </a>

                <div style={{
                    display: 'flex',
                    gap: '12px',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    marginTop: '8px'
                }}>
                    <a
                        href="/explore"
                        style={{
                            padding: '8px 16px',
                            background: 'var(--glass)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--fg)',
                            textDecoration: 'none',
                            fontSize: '14px',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = 'var(--surface-hover)'
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = 'var(--glass)'
                        }}
                    >
                        🔍 Odkrywaj
                    </a>

                    <a
                        href="/favorites"
                        style={{
                            padding: '8px 16px',
                            background: 'var(--glass)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--fg)',
                            textDecoration: 'none',
                            fontSize: '14px',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = 'var(--surface-hover)'
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = 'var(--glass)'
                        }}
                    >
                        ❤️ Ulubione
                    </a>
                </div>
            </div>

            <div style={{
                marginTop: '40px',
                padding: '20px',
                background: 'var(--glass)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--glass-border)'
            }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>💭</div>
                <p className="small" style={{ margin: 0, opacity: 0.6, fontStyle: 'italic' }}>
                    "Nie ma złych dróg, są tylko nieodkryte ścieżki do mądrości."
                </p>
            </div>
        </div>
    )
}