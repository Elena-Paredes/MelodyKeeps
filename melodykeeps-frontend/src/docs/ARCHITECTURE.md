# Frontend Architecture

## Directory Structure
```
src/
├── app/
│   ├── core/
│   │   ├── auth.service.ts        Login/logout, token management
│   │   ├── auth.interceptor.ts    Inject JWT in all requests
│   │   ├── api.config.ts          Backend URL config
│   │   ├── songs.service.ts       Search & fetch songs
│   │   ├── designs.service.ts     CRUD designs
│   │   └── spotify.service.ts     Spotify integration
│   │
│   ├── pages/
│   │   ├── login/                 Login form
│   │   └── home/                  Main app (search, design, player)
│   │
│   ├── components/
│   │   ├── music-player/          Custom player renderer + QR
│   │   │   ├── player-demo.component
│   │   │   ├── player-template-classic.component
│   │   │   ├── classic-theme.model.ts
│   │   │   └── back-placeholder.component
│   │   │
│   │   └── (future: design-builder, song-search)
│   │
│   ├── data/
│   │   ├── back-design-manifests.ts  Design templates (Keychain, Sticker, Card)
│   │   └── supported-songs.ts        Hardcoded song catalog
│   │
│   ├── app.routes.ts              Routing config
│   ├── app.config.ts              Global providers (HttpClient, etc)
│   └── app.component.ts           Root component
│
├── main.ts                        Bootstrap
├── index.html
├── styles.css                     Tailwind imports
└── assets/

tests/
├── app.component.spec.ts
├── pages/login/login.component.spec.ts
└── pages/home/home.component.spec.ts

e2e/
└── (Playwright tests)
```

## Core Services

### AuthService
```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  
  async login(email, password) { ... }
  logout() { ... }
}
```
- Stores JWT in localStorage under `mk_token`
- Signal-based state (Angular 19 reactivity)
- No refresh token logic yet ⚠️

### SongsService
```typescript
async search(query: string) → Song[]
async getById(id: string) → Song
```
Calls backend `/api/songs/search`.

### DesignsService
```typescript
async create(design) → Design
async getMyDesigns() → Design[]
async delete(id) → void
```
User-scoped designs (backend enforces via JWT).

## Authentication Flow

1. **Login page** → `AuthService.login()` → POST `/api/auth/login`
2. Backend returns `{ token: "..." }`
3. Token stored in `localStorage` and `AuthService.token` signal
4. **AuthInterceptor** injects `Authorization: Bearer <token>` on all requests
5. **Protected routes** should use route guard (not yet implemented ⚠️)

## Component Hierarchy

```
AppComponent
├── Router
   ├── LoginComponent
   │   └── (email/password form)
   └── HomeComponent
       ├── SongSearchComponent
       ├── DesignBuilderComponent
       └── MusicPlayerComponent
           ├── PlayerTemplateCLassicComponent
           ├── AlbumArtComponent
           ├── ControlsComponent
           └── QRCodeComponent
```

## Data Flow (Song → Design → Player)

1. User searches song → `SongsService.search()` → backend
2. Selects song, template (Keychain/Sticker/Card), variant (Dark/Pastel)
3. `DesignsService.create()` POSTs to backend
4. Backend returns `Design` with `printFileUrl`
5. `MusicPlayerComponent` renders preview with QR code
6. Click "Download" → fetch from `printFileUrl`

## Reactive Patterns

- **Signals:** `AuthService.token`, state management
- **RxJS:** `firstValueFrom()` in services (convert Observable → Promise)
- **HttpClient:** Observable-based, intercepted by AuthInterceptor

## Missing / TODO

- ⚠️ **Route guards:** `/home` accessible without token
- ⚠️ **Refresh token:** Token expires after 7 days, no silent re-auth
- 🔄 **Error handling:** Basic try/catch, no global error handler
- 🎨 **Design builder UI:** Partial, needs full component
- 📝 **Unit tests:** Spec files exist, coverage unknown
