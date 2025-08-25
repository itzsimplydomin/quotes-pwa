const API = 'https://dummyjson.com'

export type Quote = { id: number; quote: string; author: string }
export type QuotesResponse = { quotes: Quote[]; total: number; skip: number; limit: number }

export async function fetchAllQuotes(): Promise<QuotesResponse> {
    const res = await fetch(`${API}/quotes?limit=0`)
    if (!res.ok) throw new Error('Nie udało się pobrać cytatów')
    return res.json()
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

export async function login(username: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    // UWAGA: bez credentials
    body: JSON.stringify({ username, password, expiresInMins: 30 })
  })
  if (!res.ok) {
    // dla czytelniejszego błędu
    const msg = await res.text().catch(() => '')
    throw new Error(`Błąd logowania (${res.status}) ${msg}`)
  }
  return res.json()
}

export async function me(token: string) {
  const res = await fetch(`${API}/auth/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
    // też bez credentials
  })
  if (!res.ok) throw new Error('Brak autoryzacji')
  return res.json()
}