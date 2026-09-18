import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthSessionService {
  private readonly tokenKey = 'myshop_access_token';
  private readonly userKey = 'myshop_auth_user';

  getToken(): string | null {
    return typeof window === 'undefined' ? null : window.localStorage.getItem(this.tokenKey);
  }

  getUser<T>(): T | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const user = window.localStorage.getItem(this.userKey);
    return user ? (JSON.parse(user) as T) : null;
  }

  store(token: string, user: unknown) {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(this.tokenKey, token);
      window.localStorage.setItem(this.userKey, JSON.stringify(user));
    }
  }

  clear() {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(this.tokenKey);
      window.localStorage.removeItem(this.userKey);
    }
  }
}