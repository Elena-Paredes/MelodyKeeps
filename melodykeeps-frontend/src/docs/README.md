# MelodyKeeps Frontend Documentation

Angular 19 app for creating custom music player designs (keychains, stickers, cards) with Spotify/Deezer integration.

## Quick Links
- [Setup & Running](./SETUP.md)
- [Architecture](./ARCHITECTURE.md)
- [API Integration](./API.md)

## Tech Stack
- **Framework:** Angular 19.2
- **Styling:** Tailwind CSS 4.3.3
- **HTTP:** RxJS 7.8, HttpClient
- **QR library:** qrcode 1.5.4 (legacy dependency; the BACK uses Spotify Code SVG assets)
- **Testing:** Jasmine, Karma, Playwright E2E

## Project Structure
```
src/
├── app/
│   ├── core/          Services (auth, API, Spotify)
│   ├── pages/         Login, Home components
│   ├── components/    Music player, design builder
│   └── data/          Design manifests, song lists
└── assets/
```

## Key Features
- User authentication with JWT
- Search songs via Spotify/Deezer
- Design builder (template + variant selection)
- Music player preview with custom styling
- Spotify Code per song (local SVG assets, no runtime Spotify requests)
- Print file generation (backend)
