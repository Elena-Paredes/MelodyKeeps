import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface BackPlaceholderData {
  title: string;
  artist: string;
  quote: string;
}

@Component({
  selector: 'app-back-placeholder',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg
      [attr.viewBox]="'0 0 1000 1500'"
      [attr.preserveAspectRatio]="'xMidYMid meet'"
      [style.aspectRatio]="'2 / 3'"
      [style.width]="'100%'"
      [style.height]="'auto'"
    >
      <!-- Background -->
      <rect width="1000" height="1500" fill="#FFFFFF" />

      <!-- Top label WAVEKEEPS -->
      <text
        x="500"
        y="165"
        font-family="Inter"
        font-weight="500"
        font-size="22"
        fill="#777777"
        text-anchor="middle"
        letter-spacing="4"
      >
        WAVEKEEPS
      </text>

      <!-- QR Code -->
      @if (qrDataUrl) {
        <image x="250" y="300" width="500" height="500" [attr.href]="qrDataUrl" />
      } @else {
        <rect x="250" y="300" width="500" height="500" fill="none" stroke="#CCCCCC" stroke-width="2" stroke-dasharray="10,5" />
        <text
          x="500"
          y="575"
          font-family="Inter"
          font-weight="400"
          font-size="16"
          fill="#999999"
          text-anchor="middle"
        >
          QR CODE REGION
        </text>
      }

      <!-- CTA: ESCANEA Y ESCUCHA -->
      <text
        x="500"
        y="875"
        font-family="Inter"
        font-weight="600"
        font-size="26"
        fill="#111111"
        text-anchor="middle"
        letter-spacing="3"
      >
        ESCANEA Y ESCUCHA
      </text>

      <!-- Quote region -->
      <text
        x="500"
        y="955"
        font-family="Inter"
        font-weight="500"
        font-size="28"
        fill="#222222"
        text-anchor="middle"
        font-style="italic"
      >
        <tspan x="500" dy="0">{{ quote }}</tspan>
      </text>

      <!-- Song title -->
      <text
        x="500"
        y="1260"
        font-family="Inter"
        font-weight="700"
        font-size="30"
        fill="#111111"
        text-anchor="middle"
      >
        {{ title }}
      </text>

      <!-- Artist -->
      <text
        x="500"
        y="1310"
        font-family="Inter"
        font-weight="400"
        font-size="24"
        fill="#666666"
        text-anchor="middle"
      >
        {{ artist }}
      </text>

      <!-- WaveKeeps mark -->
      <text
        x="500"
        y="1400"
        font-family="Inter"
        font-weight="500"
        font-size="18"
        fill="#999999"
        text-anchor="middle"
        letter-spacing="3"
      >
        WAVEKEEPS
      </text>

      <!-- Decorative elements: tiny stars -->
      <circle cx="120" cy="200" r="2" fill="#DDDDDD" opacity="0.6" />
      <circle cx="880" cy="250" r="1.5" fill="#EEEEEE" opacity="0.5" />
      <circle cx="150" cy="1350" r="1.8" fill="#DDDDDD" opacity="0.5" />
      <circle cx="850" cy="1380" r="2" fill="#EEEEEE" opacity="0.6" />
    </svg>
  `,
})
export class BackPlaceholderComponent {
  @Input() title: string = '';
  @Input() artist: string = '';
  @Input() quote: string = '';
  @Input() qrDataUrl: string = '';
}
