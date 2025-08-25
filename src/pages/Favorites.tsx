import { useFavs } from '../store/favs'

export default function Favorites() {
  const favs = useFavs(s => s.favs)
  const items = Object.values(favs)
  return (
    <div className="card">
      <h2>Ulubione</h2>
      {items.length === 0 ? <p className="small">Brak ulubionych (dodaj w zakładce „Odkrywaj”).</p> :
        <div className="row">
          {items.map(q => (
            <div key={q.id} className="card" style={{ flex: '1 1 260px' }}>
              <div className="small">#{q.id}</div>
              <div className="quote">“{q.quote}”</div>
              <div className="small">— {q.author}</div>
            </div>
          ))}
        </div>}
    </div>
  )
}
