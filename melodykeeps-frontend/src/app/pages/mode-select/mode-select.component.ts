import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mode-select',
  template: `
    <main class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blush via-lavender to-peach px-4">
      <div class="w-full max-w-md flex flex-col gap-6">
        <div class="text-center">
          <h1 class="text-2xl font-bold bg-gradient-to-r from-accent to-violet bg-clip-text text-transparent">
            ¿Cómo quieres tu diseño?
          </h1>
          <p class="text-sm text-plum/60 mt-1">Elige una opción para continuar</p>
        </div>

        <button
          type="button"
          data-testid="mode-with-design"
          (click)="go('/home')"
          class="rounded-3xl bg-white/80 backdrop-blur-sm shadow-lg shadow-violet/10 p-6 text-left border-2 border-transparent hover:border-accent transition"
        >
          <span class="text-2xl">🎨</span>
          <h2 class="font-semibold text-plum mt-2">Con diseño</h2>
          <p class="text-xs text-plum/60 mt-1">Canciones con diseño decorativo: llavero o sticker, frente y reverso.</p>
        </button>

        <button
          type="button"
          data-testid="mode-no-design"
          (click)="go('/sin-diseno')"
          class="rounded-3xl bg-white/80 backdrop-blur-sm shadow-lg shadow-violet/10 p-6 text-left border-2 border-transparent hover:border-accent transition"
        >
          <span class="text-2xl">🖤</span>
          <h2 class="font-semibold text-plum mt-2">Sin diseño</h2>
          <p class="text-xs text-plum/60 mt-1">Busca cualquier canción en Spotify: sticker con fondo negro, solo frente.</p>
        </button>

        <button
          type=button
          data-testid=mode-polaroid
          (click)="go('/polaroid')"
          class="rounded-3xl bg-white/80 backdrop-blur-sm shadow-lg shadow-violet/10 p-6 text-left border-2 border-transparent hover:border-accent transition"
        >
          <span class="text-2xl">📷</span>
          <h2 class="font-semibold text-plum mt-2">Polaroid</h2>
          <p class="text-xs text-plum/60 mt-1">Sube tus fotos: cada una lleva abajo el código de la canción que elijas (5.5 x 6.5 cm).</p>
        </button>
      </div>
    </main>
  `,
})
export class ModeSelectComponent {
  constructor(private router: Router) {}

  go(path: string) {
    this.router.navigate([path]);
  }
}
