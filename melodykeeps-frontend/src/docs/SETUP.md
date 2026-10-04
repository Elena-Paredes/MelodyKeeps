# Setup & Running Frontend

## Prerequisites
- Node.js 18+
- npm or yarn
- Backend running on http://localhost:5068

## Install Dependencies
```bash
npm install
```

## Development Server
```bash
npm start
# or
ng serve
```
App runs on `http://localhost:4200`

## Backend Configuration

Edit `src/app/core/api.config.ts` if backend port changes:
```typescript
export const API_BASE_URL = 'http://localhost:5068';
```

## Create Test User

Register via frontend or API:
```bash
curl -X POST http://localhost:5068/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"TestPassword123!"}'
```

Then login in the app → token stored in localStorage.

## Build for Production
```bash
npm run build
# Output: dist/melodykeeps-frontend/
```

## Testing

### Unit Tests
```bash
npm test
```
Runs Jasmine + Karma.

### E2E Tests
```bash
npm run e2e
```
Playwright tests (see `playwright.config.ts`).

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Port 4200 in use | `ng serve --port 4300` |
| Backend connection fails | Verify port in `api.config.ts`, check CORS on backend |
| Token expires silently | Add refresh token logic (planned) |
| QR code not rendering | Verify qrcode lib installed: `npm install qrcode` |

## Code Style
- TypeScript strict mode enabled
- ESLint configured (run via `npm lint` if set up)
- Prettier for formatting (optional)
