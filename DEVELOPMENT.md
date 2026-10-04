# MelodyKeeps

Convierte tu canción favorita en un recuerdo físico. El usuario elige una canción, el diseño del frente y el producto (llavero o sticker). La app compone el **frente** (player + decoración) y el **reverso** (código de Spotify) de la pieza.

## Tecnologías

**Frontend** (`melodykeeps-frontend/`)
- Angular 19 (componentes standalone, signals) y TypeScript 5.7
- Tailwind CSS 4
- RxJS
- Playwright (pruebas e2e)

**Backend** (`melodykeeps-backend/`)
- .NET 9 / ASP.NET Core, arquitectura por capas (Domain, Infrastructure, Api)
- Entity Framework Core 9 con PostgreSQL (Npgsql) e ASP.NET Identity
- Autenticación con JWT
- SkiaSharp y QRCoder para generar imágenes
- Spotify Web API

**Base de datos**
- PostgreSQL 15 en Docker

## Estructura

```text
MelodyKeeps/
├── melodykeeps-frontend/   Angular: UI, renderer de diseños WaveKeeps, assets
├── melodykeeps-backend/    API .NET: canciones, diseños, usuarios
├── design/                 Referencias de diseño
└── tests/                  Pruebas visuales / e2e
```

## WaveKeeps: cómo se compone una pieza

El frente es un lienzo lógico de 1000×1500 con tres capas:

```text
fondo blanco -> capa decorativa (manifest.json) -> player verificado
```

- Cada diseño frontal es un paquete en `melodykeeps-frontend/src/assets/wavekeeps/designs/front/<design-id>/` con `manifest.json` y `assets/png|svg`.
- Cada canción tiene su reverso en `.../designs/back/<song-id>/`. Hoy contiene el código de Spotify en forma de ondas (`assets/svg/spotify-code.svg`).
- La documentación de diseño está en `melodykeeps-frontend/src/docs/WaveKeeps/`.

## Cómo correrlo en local

Requisitos: Node.js, .NET 9 SDK y Docker.

1. **Base de datos**

   ```bash
   docker run -d --name melodykeps-db -e POSTGRES_PASSWORD=<tu-contraseña> -e POSTGRES_DB=MelodyKeeps -p 5432:5432 postgres:15-alpine
   ```

2. **Backend**: copia `appsettings.Development.example.json` a `appsettings.Development.json` en `melodykeeps-backend/src/MelodyKeeps.Api/` y completa tus credenciales (conexión a la BD, clave JWT y Spotify).

   ```bash
   cd melodykeeps-backend
   dotnet run --project src/MelodyKeeps.Api
   ```

   La API escucha en `http://localhost:5068`. Fuera de desarrollo, las mismas credenciales se pasan por variables de entorno: `ConnectionStrings__Default`, `Jwt__Key`, `Spotify__ClientId` y `Spotify__ClientSecret`.

3. **Frontend**

   ```bash
   cd melodykeeps-frontend
   npm install
   npm start
   ```

   La app queda en `http://localhost:4200`.

## Credenciales: nunca al repositorio

- Los valores reales viven solo en `appsettings.Development.json`, que está en `.gitignore`. El `appsettings.json` versionado solo trae marcadores.
- `.gitignore` también excluye `.env*`, claves y certificados (`*.pem`, `*.key`, `*.pfx`...) en frontend y backend.
- Un guardia pre-commit (`.githooks/`) bloquea cualquier commit que incluya esos archivos o que contenga los valores reales. Después de clonar, actívalo una vez:

  ```bash
  git config core.hooksPath .githooks
  ```
