const API = 'https://dummyjson.com'

export type Quote = { id: number; quote: string; author: string }
export type QuotesResponse = { quotes: Quote[]; total: number; skip: number; limit: number }

// Keep a compatibility function for pages that need the full dataset (e.g., Explore)
export async function fetchAllQuotes(): Promise<QuotesResponse> {
  const res = await fetch(`${API}/quotes?limit=0`)
  if (!res.ok) throw new Error('Nie udało się pobrać cytatów')
  return res.json()
}

// Avoid fetching the entire dataset on initial load.
// Fetch just a single quote deterministically for the day.
export async function fetchQuoteForDay(dayIndex: number): Promise<Quote> {
  // First fetch minimal metadata to know total count
  const metaRes = await fetch(`${API}/quotes?limit=1`)
  if (!metaRes.ok) throw new Error('Nie udało się pobrać metadanych cytatów')
  const meta = (await metaRes.json()) as QuotesResponse
  const total = meta.total || 1
  const skip = Math.abs((dayIndex - 1) % total)

  const res = await fetch(`${API}/quotes?limit=1&skip=${skip}`)
  if (!res.ok) throw new Error('Nie udało się pobrać cytatu dnia')
  const data = (await res.json()) as QuotesResponse
  return data.quotes[0]
}

export async function fetchRandomQuote(): Promise<Quote> {
  const res = await fetch(`${API}/quotes/random`)
  if (!res.ok) throw new Error('Nie udało się pobrać losowego cytatu')
  return res.json()
}

export type LoginResponse = {
  id: number; username: string; firstName: string; lastName: string; email: string;
  image?: string; accessToken: string; refreshToken: string;
}

export async function login(username: string, password: string) {
  const res = await fetch(`https://dummyjson.com/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ username, password, expiresInMins: 30 }),
  })
  if (!res.ok) throw new Error('Błąd logowania')
  return res.json()
}

export async function me(token: string) {
  const res = await fetch(`${API}/auth/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('Brak autoryzacji')
  return res.json()
}
