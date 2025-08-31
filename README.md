# Quotes PWA

Lekka aplikacja React (Vite + TypeScript) prezentująca cytaty z możliwością przeglądania, wyszukiwania/eksploracji, dodawania do ulubionych, logowania demonstracyjnego oraz pracy w trybie offline jako PWA.

## Funkcje
- Przeglądanie cytatów: lista cytatów i widok eksploracji.
- Ulubione: zapisywanie i usuwanie ulubionych cytatów (lokalnie, trwałość w localStorage).
- Logowanie demo: prosty stan autoryzacji przechowywany po stronie klienta (brak prawdziwego backendu).
- Ochrona tras: komponent Protected blokuje dostęp do prywatnych podstron bez zalogowania.
- PWA: rejestracja Service Workera, działanie offline, możliwość instalacji na urządzeniu, baner Offline oraz komponent UpdatePrompt informujący o aktualizacjach.
- Powiadomienie o trybie offline: OfflineBanner pokazuje status połączenia.

## Stos technologiczny
- Vite + React + TypeScript
- React Router (nawigacja między stronami: Home, Explore, Favorites, Login, Profile, NotFound)
- Prosty store na potrzeby autoryzacji i ulubionych (src/store/auth.ts, src/store/favs.ts) z trwałością w localStorage
- PWA (Service Worker, manifest, komponent UpdatePrompt)
- CSS (pliki src/App.css, src/index.css)

## Struktura (kluczowe pliki)
- ite.config.ts — konfiguracja Vite (w tym konfiguracja PWA, jeśli włączona)
- index.html — szablon aplikacji i osadzenie skryptu
- src/main.tsx — punkt wejścia, rejestracja aplikacji
- src/App.tsx — główny layout/routing
- src/pages/Home.tsx — strona główna
- src/pages/Explore.tsx — eksploracja/wyszukiwanie cytatów
- src/pages/Favorites.tsx — ulubione cytaty
- src/pages/Login.tsx — logowanie (demo)
- src/pages/Profile.tsx — profil użytkownika
- src/pages/NotFound.tsx — 404
- src/components/Protected.tsx — ochrona tras prywatnych
- src/components/OfflineBanner.tsx — informacja o trybie offline
- src/pwa/UpdatePrompt.tsx — informowanie o nowej wersji aplikacji
- src/api/dummyjson.ts — klient do API cytatów (DummyJSON)

## API
- Źródło danych: DummyJSON (np. endpointy w stylu https://dummyjson.com/quotes).
- Warstwa API jest enkapsulowana w src/api/dummyjson.ts.

## Wymagania
- Node.js 18+ (zalecane LTS)
- Menedżer pakietów: npm / pnpm / yarn

## Szybki start
1. Zainstaluj zależności:
   - 
pm install
2. Uruchom tryb deweloperski:
   - 
pm run dev
3. Budowa produkcyjna:
   - 
pm run build
4. Podgląd buildu (serwer statyczny Vite):
   - 
pm run preview

## PWA i aktualizacje
- Aplikacja rejestruje Service Workera po zbudowaniu (tryb produkcyjny).
- UpdatePrompt informuje, gdy dostępna jest nowa wersja; użytkownik może odświeżyć, aby ją zastosować.
- OfflineBanner prezentuje brak połączenia i tryb offline.
- W środowisku deweloperskim SW może być wyłączony; pełne działanie PWA sprawdzisz po 
pm run build + 
pm run preview.

## Trwałość danych
- Ulubione oraz stan logowania są przechowywane lokalnie (np. localStorage). Usunięcie danych przeglądarki zresetuje stan.

## Deploy
- Hosting statyczny (Vercel, Netlify, GitHub Pages, dowolny serwer CDN).
- Zalecany HTTPS (wymagany przez część funkcji PWA).
- Po wdrożeniu pamiętaj o odświeżeniu Service Workera po aktualizacjach (komponent UpdatePrompt może w tym pomóc).

## Rozwiązywanie problemów
- Zmiany nie pojawiają się po wdrożeniu: odśwież stronę „twardo” lub wyczyść cache Service Workera (DevTools → Application → Service Workers → Unregister/Update).
- Problemy offline: uruchom build i preview (
pm run build && npm run preview) — dopiero w tym trybie SW buforuje zasoby.
- API DummyJSON zwraca błąd: sprawdź połączenie z internetem i ograniczenia CORS.

## Licencja
- Brak osobnej licencji — dostosuj według potrzeb projektu.
