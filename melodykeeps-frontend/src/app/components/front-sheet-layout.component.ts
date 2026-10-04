import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SUPPORTED_SONGS } from '../data/supported-songs';

@Component({
  selector: 'app-front-sheet-layout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 2rem; max-width: 1400px; margin: 0 auto;">
      <h1>Visualización: Diseños FRONT en Hoja Carta</h1>

      <div style="background: #f5f5f5; padding: 1rem; border-radius: 8px; margin-bottom: 2rem;">
        <h3>Especificaciones:</h3>
        <p><strong>Tamaño diseño:</strong> 6 cm × 9 cm</p>
        <p><strong>Distribución:</strong> 3 columnas × 2 filas = 6 diseños/hoja</p>
        <p><strong>Papel:</strong> Carta (21.59 cm × 27.94 cm)</p>
        <p><strong>Márgenes:</strong> 1 cm</p>
        <p><strong>Total para 12 diseños:</strong> 2 hojas</p>
      </div>

      <!-- Hojas -->
      <div *ngFor="let sheet of sheets; let sheetIndex = index" style="margin-bottom: 3rem;">
        <h2>Hoja {{ sheetIndex + 1 }}</h2>

        <!-- Hoja Carta -->
        <div style="
          width: 600px;
          height: 775px;
          background: white;
          border: 2px solid #333;
          margin: 1rem auto;
          padding: 28px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          position: relative;
          font-family: Arial, sans-serif;
        ">
          <!-- Grilla de diseños -->
          <div style="
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
            height: 100%;
          ">
            <div *ngFor="let song of sheet" style="
              background: #f9f9f9;
              border: 2px solid #0066cc;
              border-radius: 6px;
              padding: 8px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              text-align: center;
              aspect-ratio: 2/3;
            ">
              <!-- Simulación de diseño -->
              <div style="
                width: 90%;
                height: 90%;
                background: linear-gradient(135deg, #e8f4f8 0%, #c0e4f0 100%);
                border: 1px solid #0066cc;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                gap: 4px;
              ">
                <div style="font-size: 9px; font-weight: bold; color: #0066cc;">{{ song.title }}</div>
                <div style="font-size: 7px; color: #666;">{{ song.variantId || 'Purple' }}</div>
              </div>
            </div>
          </div>

          <!-- Indicadores -->
          <div style="
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 9px;
            color: #999;
          ">
            Hoja {{ sheetIndex + 1 }} de 2
          </div>
        </div>

        <!-- Info de hoja -->
        <div style="background: #f0f0f0; padding: 1rem; border-radius: 4px; max-width: 600px; margin: 1rem auto; font-size: 0.9em;">
          <strong>Diseños en esta hoja:</strong>
          <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
            <li *ngFor="let song of sheet">{{ song.title }} ({{ song.variantId || 'Purple' }})</li>
          </ul>
        </div>
      </div>

      <!-- Resumen -->
      <div style="background: #e8f4f8; padding: 1.5rem; border-radius: 8px; border-left: 4px solid #0066cc; max-width: 600px; margin: 2rem auto;">
        <h3 style="margin-top: 0; color: #0066cc;">Resumen de impresión</h3>
        <p><strong>Total diseños:</strong> 12</p>
        <p><strong>Diseños por hoja:</strong> 6</p>
        <p><strong>Hojas necesarias:</strong> 2</p>
        <p><strong>Diseños última hoja:</strong> 6 (completa)</p>
      </div>
    </div>
  `,
})
export class FrontSheetLayoutComponent implements OnInit {
  sheets: any[][] = [];

  ngOnInit() {
    this.sheets = this.createSheets();
  }

  createSheets() {
    const songs = SUPPORTED_SONGS;
    const itemsPerSheet = 6; // 3 cols × 2 rows
    const sheets: any[][] = [];

    for (let i = 0; i < songs.length; i += itemsPerSheet) {
      sheets.push(songs.slice(i, i + itemsPerSheet));
    }

    return sheets;
  }
}
