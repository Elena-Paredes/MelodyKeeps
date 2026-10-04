import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_BASE_URL } from './api.config';

export interface SpotifyTrackData {
  title: string;
  artist: string;
  coverUrl: string;
  spotifyLink: string;
}

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  constructor(private http: HttpClient) {}

  getTrackData(trackId: string): Observable<SpotifyTrackData> {
    return this.http.get<SpotifyTrackData>(`${API_BASE_URL}/songs/spotify/${trackId}`).pipe(
      tap((data) => {
        console.log(`[Spotify] Loaded ${trackId}:`, data);
      })
    );
  }
}
