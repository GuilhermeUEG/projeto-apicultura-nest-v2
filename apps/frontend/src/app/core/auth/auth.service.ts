import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export interface User {
  id: string;
  email: string;
  nome: string;
  role: string;
  ativo?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private apiUrl = `${environment.apiUrl}/auth`;
  private usersApiUrl = `${environment.apiUrl}/users`;

  private currentUserSignal = signal<User | null>(null);
  private tokenSignal = signal<string | null>(null);

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuth = computed(() => !!this.currentUserSignal());
  readonly isAdmin = computed(() => this.currentUserSignal()?.role === 'admin');

  constructor() {}

  getToken(): string | null {
    return this.tokenSignal();
  }

  private decodeAndSetUser(token: string) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.currentUserSignal.set({
        id: payload.sub,
        email: payload.email,
        nome: payload.nome,
        role: payload.role,
      });
    } catch (e) {
      this.logout();
    }
  }

  login(credentials: any) {
    return this.http.post<{ access_token: string }>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        this.tokenSignal.set(res.access_token);
        this.decodeAndSetUser(res.access_token);
      }),
    );
  }

  register(userData: any) {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  forgotPassword(email: string) {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(data: any) {
    return this.http.post(`${this.apiUrl}/reset-password`, data);
  }

  logout(expired = false) {
    this.tokenSignal.set(null);
    this.currentUserSignal.set(null);
    if (expired) {
      this.router.navigate(['/login'], { queryParams: { expired: 'true' } });
    } else {
      this.router.navigate(['/login']);
    }
  }

  getUsers() {
    return this.http.get<User[]>(this.usersApiUrl);
  }

  activateUser(id: string) {
    return this.http.patch<User>(`${this.usersApiUrl}/${id}/activate`, {});
  }

  resetUserPassword(id: string) {
    return this.http.post<{ message: string }>(`${this.usersApiUrl}/${id}/reset-password`, {});
  }
}
