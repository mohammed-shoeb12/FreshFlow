import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthSessionService } from './auth-session.service';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  business: { id: string; name: string };
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: AuthUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly session = inject(AuthSessionService);

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/login', { email, password }).pipe(
      tap((response) => this.session.store(response.token, response.user))
    );
  }

  register(details: {
    name: string;
    email: string;
    password: string;
    businessName: string;
    state: string;
    gstin?: string;
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/register', details).pipe(
      tap((response) => this.session.store(response.token, response.user))
    );
  }

  isLoggedIn(): boolean {
    return !!this.session.getToken();
  }

  setToken(token: string) {
    this.session.store(token, null);
  }

  logout() {
    this.session.clear();
  }

  getToken(): string | null {
    return this.session.getToken();
  }
}
