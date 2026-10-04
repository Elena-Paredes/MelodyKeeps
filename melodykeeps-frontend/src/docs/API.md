# API Integration Guide

All requests go through `AuthInterceptor`, which injects `Authorization: Bearer <token>` header.

Base URL: Configured in `src/app/core/api.config.ts`
```typescript
export const API_BASE_URL = 'http://localhost:5068';
```

## Auth Endpoints

### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "TestPassword123!"
}

Response 201:
{
  "id": "uuid",
  "email": "user@example.com"
}
```

Called by login form before login attempt (optional flow).

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "TestPassword123!"
}

Response 200:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Token expires in 7 days. No refresh endpoint yet.

**Frontend:** `AuthService.login()` handles this.
```typescript
const res = await firstValueFrom(
  this.http.post<{ token: string }>(`${API_BASE_URL}/auth/login`, { email, password })
);
localStorage.setItem('mk_token', res.token);
this.token.set(res.token);
```

## Songs Endpoints

### Search
```
POST /api/songs/search
Authorization: Bearer <token>
Content-Type: application/json

{
  "query": "Bohemian Rhapsody"
}

Response 200:
[
  {
    "id": "spotify-123",
    "title": "Bohemian Rhapsody",
    "artist": "Queen",
    "albumArt": "https://..."
  }
]
```

**Frontend:** `SongsService.search(query)` calls this.

## Designs Endpoints

### Create
```
POST /api/designs
Authorization: Bearer <token>
Content-Type: application/json

{
  "songId": "uuid",
  "template": "Keychain",  // Keychain, Sticker, Card
  "variant": "Dark"        // Dark, Pastel
}

Response 201:
{
  "id": "design-uuid",
  "userId": "user-uuid",
  "songId": "song-uuid",
  "template": "Keychain",
  "variant": "Dark",
  "printFileUrl": null,
  "createdAt": "2026-10-03T..."
}
```

**Frontend:** `DesignsService.create(design)`.

### Get My Designs
```
GET /api/designs
Authorization: Bearer <token>

Response 200:
[
  { ...design },
  { ...design }
]
```

**Frontend:** `DesignsService.getMyDesigns()`.

### Delete
```
DELETE /api/designs/{designId}
Authorization: Bearer <token>

Response 204 No Content
```

**Frontend:** `DesignsService.delete(id)`.

## Error Handling

### 401 Unauthorized
Token invalid or expired. Frontend should:
1. Clear localStorage
2. Clear `AuthService.token`
3. Redirect to login

Current behavior: Generic error message, no auto-redirect.

### 403 Forbidden
Not authorized for this resource (e.g., deleting another user's design).

### 500 Server Error
Backend issue. Log to console, show user message.

## Testing Endpoints

Use Postman, curl, or `Invoke-WebRequest`:

```powershell
# Login
$body = @{ email="dev@melodykeeps.com"; password="DevPassword123!" } | ConvertTo-Json
$response = Invoke-WebRequest -Uri "http://localhost:5068/api/auth/login" `
  -Method Post -ContentType "application/json" -Body $body
$token = ($response.Content | ConvertFrom-Json).token

# Search songs
$headers = @{ "Authorization" = "Bearer $token" }
Invoke-WebRequest -Uri "http://localhost:5068/api/songs/search" `
  -Method Post -ContentType "application/json" `
  -Headers $headers `
  -Body (@{ query = "Beatles" } | ConvertTo-Json)
```

## OpenAPI Schema
Full endpoint definitions: `GET http://localhost:5068/openapi/v1.json`
