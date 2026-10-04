import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from './api.config';

const TOKEN_KEY = 'mk_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  token = signal<string | null>(localStorage.getItem(TOKEN_KEY));

  constructor(private http: HttpClient) {}

  async login(email: string, password: string): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.http.post<{ token: string }>(`${API_BASE_URL}/auth/login`, { email, password })
      );
      localStorage.setItem(TOKEN_KEY, res.token);
      this.token.set(res.token);
    } catch (error: any) {
      const status = error?.status;
      const message = error?.error?.message || error?.message || 'Error desconocido';

      if (status === 401 || status === 0) {
        throw new Error('Credenciales inválidas o servidor no disponible');
      }
      throw new Error(message);
    }
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.token.set(null);
  }
}
