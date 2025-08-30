export default function NotFound() {
    return (
        <div className="card">
            <h2>Nie znaleziono strony</h2>
            <p className="small">Sprawdź adres lub wróć na stronę główną.</p>
            <a href="/" style={{ display: 'inline-block', marginTop: 8 }}>← Wróć do „Dzisiejszy cytat”</a>
        </div>
    )
}
