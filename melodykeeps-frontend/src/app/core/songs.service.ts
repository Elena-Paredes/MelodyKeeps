import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_BASE_URL } from './api.config';

export type SongSearchResult = {
  title: string;
  artist: string;
  coverUrl: string | null;
  spotifyLink: string;
};

export type Song = {
  id: string;
  title: string;
  artist: string;
  coverUrl: string | null;
  link: string;
};

@Injectable({ providedIn: 'root' })
export class SongsService {
  constructor(private http: HttpClient) {}

  search(query: string) {
    return this.http.get<SongSearchResult[]>(`${API_BASE_URL}/songs/search`, { params: { q: query } });
  }

  create(song: { title: string; artist: string; coverUrl: string | null; link: string }) {
    return this.http.post<Song>(`${API_BASE_URL}/songs`, song);
  }
}
