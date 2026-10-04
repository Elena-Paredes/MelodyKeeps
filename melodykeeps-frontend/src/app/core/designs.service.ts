import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_BASE_URL } from './api.config';

// Must match MelodyKeeps.Domain.Entities.DesignTemplate ordinal values.
export enum DesignTemplate {
  Keychain = 0,
  Sticker = 1,
  Card = 2,
}

export type Design = {
  id: string;
  songId: string;
  template: DesignTemplate;
};

@Injectable({ providedIn: 'root' })
export class DesignsService {
  constructor(private http: HttpClient) {}

  create(songId: string, template: DesignTemplate) {
    return this.http.post<Design>(`${API_BASE_URL}/designs`, { songId, template });
  }

  // ponytail: <img src> can't send the Authorization header, so we fetch the
  // PNG as a blob and hand the component an object URL to bind instead.
  getPrintImage(id: string) {
    return this.http.get(`${API_BASE_URL}/designs/${id}/print`, { responseType: 'blob' });
  }
}
