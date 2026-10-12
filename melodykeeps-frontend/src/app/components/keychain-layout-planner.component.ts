import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface LayoutConfig {
  designWidth: number;  // cm
  designHeight: number; // cm
  paperWidth: number;   // cm
  paperHeight: number;  // cm
  marginX: number;      // cm
  marginY: number;      // cm
  spacingX: number;     // cm
  spacingY: number;     // cm
}

interface LayoutResult {
  colsPerSheet: number;
  rowsPerSheet: number;
  itemsPerSheet: number;
  totalSheets: number;
  lastSheetItems: number;
  warnings: string[];
}

@Component({
  selector: 'app-keychain-layout-planner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="padding: 2rem; max-width: 1200px;">
      <h1>Planificador de Llaveros - Hoja Carta</h1>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
        <!-- Controls -->
        <div style="border: 1px solid #ccc; padding: 1rem; border-radius: 8px;">
          <h2>Configuración</h2>

          <div style="margin-bottom: 1rem;">
            <label>Ancho llavero (cm): </label>
            <input type="number" [(ngModel)]="config.designWidth" (change)="calculate()" step="0.1" min="0.1">
          </div>

          <div style="margin-bottom: 1rem;">
            <label>Alto llavero (cm): </label>
            <input type="number" [(ngModel)]="config.designHeight" (change)="calculate()" step="0.1" min="0.1">
          </div>

          <div style="margin-bottom: 1rem;">
            <label>Espaciado horiz. (cm): </label>
            <input type="number" [(ngModel)]="config.spacingX" (change)="calculate()" step="0.1" min="0.1">
          </div>

          <div style="margin-bottom: 1rem;">
            <label>Espaciado vert. (cm): </label>
            <input type="number" [(ngModel)]="config.spacingY" (change)="calculate()" step="0.1" min="0.1">
          </div>

          <hr>

          <div style="background: #f0f0f0; padding: 1rem; border-radius: 4px;">
            <h3>Resultado</h3>
            <p><strong>Columnas:</strong> {{ result.colsPerSheet }}</p>
            <p><strong>Filas:</strong> {{ result.rowsPerSheet }}</p>
            <p style="font-size: 1.3em; color: #0066cc;"><strong>Llaveros/hoja:</strong> {{ result.itemsPerSheet }}</p>
            <p style="font-size: 1.3em; color: #006600;"><strong>Hojas para 12:</strong> {{ result.totalSheets }}</p>
            <p style="color: #666;">Última hoja: {{ result.lastSheetItems }} llaveros</p>
          </div>

          <div *ngIf="result.warnings.length > 0" style="background: #fff3cd; padding: 1rem; margin-top: 1rem; border-radius: 4px; color: #856404;">
            <strong>⚠ Advertencias:</strong>
            <ul>
              <li *ngFor="let warning of result.warnings">{{ warning }}</li>
            </ul>
          </div>
        </div>

        <!-- Preview -->
        <div style="border: 1px solid #ccc; padding: 1rem; border-radius: 8px; background: #fafafa;">
          <h2>Vista previa (proporcional)</h2>
          <div #previewContainer style="position: relative; background: white; margin: 1rem 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <svg [attr.viewBox]="'0 0 ' + config.paperWidth + ' ' + config.paperHeight"
                 style="width: 100%; border: 1px solid #ddd; background: white;">

              <!-- Marco papel -->
              <rect [attr.x]="0" [attr.y]="0" [attr.width]="config.paperWidth" [attr.height]="config.paperHeight"
                    fill="none" stroke="#999" stroke-width="0.5" stroke-dasharray="2,2"/>

              <!-- Márgenes (guía) -->
              <rect [attr.x]="config.marginX" [attr.y]="config.marginY"
                    [attr.width]="config.paperWidth - config.marginX * 2"
                    [attr.height]="config.paperHeight - config.marginY * 2"
                    fill="none" stroke="#ccc" stroke-width="0.3"/>

              <!-- Llaveros -->
              <rect *ngFor="let item of getPreviewItems()"
                    [attr.x]="item.x" [attr.y]="item.y"
                    [attr.width]="config.designWidth" [attr.height]="config.designHeight"
                    fill="#e8f4f8" stroke="#0066cc" stroke-width="0.2"
                    [attr.title]="item.label"/>

              <!-- Números de llavero -->
              <text *ngFor="let item of getPreviewItems()"
                    [attr.x]="item.x + config.designWidth / 2"
                    [attr.y]="item.y + config.designHeight / 2 + 0.3"
                    text-anchor="middle" font-size="0.6" fill="#0066cc" font-weight="bold">
                {{ item.number }}
              </text>
            </svg>
          </div>
          <div style="font-size: 0.9em; color: #666;">
            Escala: {{ (previewContainer?.clientWidth || 0) / config.paperWidth }}:1
          </div>
        </div>
      </div>

      <!-- Tabla de hojas -->
      <div style="border: 1px solid #ccc; padding: 1rem; border-radius: 8px;">
        <h2>Distribución de impresión (12 llaveros)</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background: #f0f0f0;">
            <th style="border: 1px solid #ddd; padding: 0.5rem; text-align: left;">Hoja</th>
            <th style="border: 1px solid #ddd; padding: 0.5rem; text-align: left;">Llaveros</th>
            <th style="border: 1px solid #ddd; padding: 0.5rem; text-align: left;">Acciones</th>
          </tr>
          <tr *ngFor="let sheet of getSheetDistribution()">
            <td style="border: 1px solid #ddd; padding: 0.5rem;"><strong>{{ sheet.number }}</strong></td>
            <td style="border: 1px solid #ddd; padding: 0.5rem;"><strong style="color: #006600;">{{ sheet.count }}/{{ result.itemsPerSheet }}</strong></td>
            <td style="border: 1px solid #ddd; padding: 0.5rem;">
              <span *ngIf="sheet.isFull" style="color: #006600;">✓ Completa</span>
              <span *ngIf="!sheet.isFull" style="color: #cc6600;">⚠ Parcial ({{ sheet.count }} de {{ result.itemsPerSheet }})</span>
            </td>
          </tr>
        </table>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      font-family: Arial, sans-serif;
      color: #333;
    }
    input {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      width: 100%;
      box-sizing: border-box;
    }
    label {
      display: block;
      margin-bottom: 0.25rem;
      font-weight: bold;
    }
    h1 { color: #0066cc; }
    h2 { color: #0066cc; font-size: 1.3em; margin-top: 0; }
    h3 { margin-top: 0; }
  `]
})
export class KeychainLayoutPlannerComponent implements OnInit {
  config: LayoutConfig = {
    designWidth: 3.5,      // cm (ancho)
    designHeight: 4.5,     // cm (alto)
    paperWidth: 21.59,     // carta: 8.5"
    paperHeight: 27.94,    // carta: 11"
    marginX: 0.1,          // 0.1 cm (ajustado para caber 6 filas)
    marginY: 0.1,          // 0.1 cm (ajustado para caber 6 filas)
    spacingX: 0.5,         // cm
    spacingY: 0.5,         // cm
  };

  result: LayoutResult = {
    colsPerSheet: 0,
    rowsPerSheet: 0,
    itemsPerSheet: 0,
    totalSheets: 0,
    lastSheetItems: 0,
    warnings: [],
  };

  previewContainer: HTMLElement | null = null;

  ngOnInit() {
    this.calculate();
  }

  calculate() {
    const availableWidth = this.config.paperWidth - this.config.marginX * 2;
    const availableHeight = this.config.paperHeight - this.config.marginY * 2;

    // Calcular cuántos caben por fila
    let cols = 0;
    let usedWidth = 0;
    while (usedWidth + this.config.designWidth <= availableWidth) {
      cols++;
      usedWidth += this.config.designWidth;
      if (cols > 1) usedWidth += this.config.spacingX;
    }

    // Calcular cuántos caben por columna
    let rows = 0;
    let usedHeight = 0;
    while (usedHeight + this.config.designHeight <= availableHeight) {
      rows++;
      usedHeight += this.config.designHeight;
      if (rows > 1) usedHeight += this.config.spacingY;
    }

    const itemsPerSheet = cols * rows;
    const totalItems = 12;
    const totalSheets = Math.ceil(totalItems / itemsPerSheet);
    const lastSheetItems = totalItems % itemsPerSheet || itemsPerSheet;

    this.result = {
      colsPerSheet: cols,
      rowsPerSheet: rows,
      itemsPerSheet,
      totalSheets,
      lastSheetItems,
      warnings: this.getWarnings(cols, rows, lastSheetItems, itemsPerSheet),
    };
  }

  getWarnings(cols: number, rows: number, lastSheet: number, itemsPerSheet: number): string[] {
    const warnings: string[] = [];

    if (cols === 0 || rows === 0) {
      warnings.push('El llavero es demasiado grande para el papel.');
    }

    if (lastSheet < itemsPerSheet && lastSheet > 0) {
      warnings.push(`Última hoja: ${lastSheet} de ${itemsPerSheet} espacios (${itemsPerSheet - lastSheet} espacios vacíos)`);
    }

    if (itemsPerSheet > 20) {
      warnings.push('Muchos llaveros por hoja: verifica legibilidad en impresión.');
    }

    return warnings;
  }

  getPreviewItems(): any[] {
    const items: any[] = [];
    const availableWidth = this.config.paperWidth - this.config.marginX * 2;
    const availableHeight = this.config.paperHeight - this.config.marginY * 2;

    // Calcular posiciones centradas
    const totalUsedWidth = this.result.colsPerSheet * this.config.designWidth +
                          (this.result.colsPerSheet - 1) * this.config.spacingX;
    const startX = this.config.marginX + (availableWidth - totalUsedWidth) / 2;

    const totalUsedHeight = this.result.rowsPerSheet * this.config.designHeight +
                           (this.result.rowsPerSheet - 1) * this.config.spacingY;
    const startY = this.config.marginY + (availableHeight - totalUsedHeight) / 2;

    let number = 1;
    for (let row = 0; row < this.result.rowsPerSheet; row++) {
      for (let col = 0; col < this.result.colsPerSheet; col++) {
        const x = startX + col * (this.config.designWidth + this.config.spacingX);
        const y = startY + row * (this.config.designHeight + this.config.spacingY);

        items.push({
          x: x.toFixed(2),
          y: y.toFixed(2),
          number,
          label: `Llavero ${number}`,
        });
        number++;
      }
    }

    return items;
  }

  getSheetDistribution(): any[] {
    const sheets: any[] = [];
    const itemsPerSheet = this.result.itemsPerSheet;
    const totalItems = 12;

    for (let sheet = 1; sheet <= this.result.totalSheets; sheet++) {
      const startItem = (sheet - 1) * itemsPerSheet + 1;
      const endItem = Math.min(sheet * itemsPerSheet, totalItems);
      const count = endItem - startItem + 1;

      sheets.push({
        number: sheet,
        count,
        isFull: count === itemsPerSheet,
      });
    }

    return sheets;
  }
}
