// Klient API dla DummyJSON
// Zebrane w jednym miejscu wywołania sieciowe związane z cytatami i autoryzacją
const API = 'https://dummyjson.com'

// Podstawowe typy danych zwracanych przez API
export type Quote = { id: number; quote: string; author: string }
export type QuotesResponse = { quotes: Quote[]; total: number; skip: number; limit: number }

// Pełny zestaw cytatów – używane np. na stronie „Odkrywaj”
// Uwaga: pobiera cały zbiór
export async function fetchAllQuotes(): Promise<QuotesResponse> {
  const res = await fetch(`${API}/quotes?limit=0`)
  if (!res.ok) throw new Error('Nie udało się pobrać cytatów')
  return res.json()
}

// Cytat dnia: zamiast pobierać wszystko na start,
// deterministycznie wybieramy jeden cytat na podstawie indeksu dnia
export async function fetchQuoteForDay(dayIndex: number): Promise<Quote> {
  // Najpierw pobieramy minimalne metadane, aby poznać łączną liczbę cytatów
  const metaRes = await fetch(`${API}/quotes?limit=1`)
  if (!metaRes.ok) throw new Error('Nie udało się pobrać metadanych cytatów')
  const meta = (await metaRes.json()) as QuotesResponse
  const total = meta.total || 1
  // Wyliczane przesunięcie tak, aby co dzień był inny cytat
  const skip = Math.abs((dayIndex - 1) % total)

  const res = await fetch(`${API}/quotes?limit=1&skip=${skip}`)
  if (!res.ok) throw new Error('Nie udało się pobrać cytatu dnia')
  const data = (await res.json()) as QuotesResponse
  return data.quotes[0]
}

// Losowy cytat 
export async function fetchRandomQuote(): Promise<Quote> {
  const res = await fetch(`${API}/quotes/random`)
  if (!res.ok) throw new Error('Nie udało się pobrać losowego cytatu')
  return res.json()
}

// Typ odpowiedzi logowania 
export type LoginResponse = {
  id: number; username: string; firstName: string; lastName: string; email: string;
  image?: string; accessToken: string; refreshToken: string;
}

// Logowanie do DummyJSON – zwraca tokeny i podstawowe dane użytkownika
export async function login(username: string, password: string) {
  const res = await fetch(`https://dummyjson.com/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ username, password, expiresInMins: 30 }),
  })
  if (!res.ok) throw new Error('Błąd logowania')
  return res.json()
}

// Odczyt danych zalogowanego użytkownika
export async function me(token: string) {
  const res = await fetch(`${API}/auth/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('Brak autoryzacji')
  return res.json()
}
