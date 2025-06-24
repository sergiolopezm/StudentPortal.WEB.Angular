import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development.js';

// Interfaces
import { UsuarioLoginDto } from '../../models/auth/usuario-login.dto';
import { UsuarioRegistroDto } from '../../models/auth/usuario-registro.dto';
import { UsuarioRegistroCompletoDto } from '../../models/auth/usuario-registro-completo.dto';
import { UsuarioPerfilDto } from '../../models/auth/usuario-perfil.dto';
import { TokenDto } from '../../models/auth/token.dto';
import { ResponseDto } from '../../models/common/response.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<UsuarioPerfilDto | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Cargar usuario desde localStorage al inicializar
    this.loadUserFromStorage();
  }

  login(loginDto: UsuarioLoginDto): Observable<ResponseDto<TokenDto>> {
    return this.http.post<ResponseDto<TokenDto>>(`${this.apiUrl}/login`, loginDto)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.setSession(response.data);
          }
        })
      );
  }

  register(registroDto: UsuarioRegistroDto): Observable<ResponseDto<any>> {
    return this.http.post<ResponseDto<any>>(`${this.apiUrl}/register`, registroDto);
  }

  registerComplete(registroDto: UsuarioRegistroCompletoDto): Observable<ResponseDto<any>> {
    return this.http.post<ResponseDto<any>>(`${this.apiUrl}/register-complete`, registroDto);
  }

  getProfile(): Observable<ResponseDto<UsuarioPerfilDto>> {
    return this.http.get<ResponseDto<UsuarioPerfilDto>>(`${this.apiUrl}/profile`)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.currentUserSubject.next(response.data);
          }
        })
      );
  }

  logout(): Observable<ResponseDto<any>> {
    return this.http.post<ResponseDto<any>>(`${this.apiUrl}/logout`, {})
      .pipe(
        tap(() => {
          this.clearSession();
        })
      );
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const expiration = localStorage.getItem('token_expiration');
      if (expiration) {
        const expirationDate = new Date(expiration);
        return new Date() < expirationDate;
      }
    } catch {
      return false;
    }
    return false;
  }

  getCurrentUser(): UsuarioPerfilDto | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private setSession(tokenData: TokenDto): void {
    localStorage.setItem('token', tokenData.token);
    localStorage.setItem('token_expiration', tokenData.expiracion.toString());
    localStorage.setItem('user_data', JSON.stringify(tokenData.usuario));
    this.currentUserSubject.next(tokenData.usuario);
  }

  private clearSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('token_expiration');
    localStorage.removeItem('user_data');
    this.currentUserSubject.next(null);
  }

  private loadUserFromStorage(): void {
    if (this.isAuthenticated()) {
      const userData = localStorage.getItem('user_data');
      if (userData) {
        try {
          const user = JSON.parse(userData) as UsuarioPerfilDto;
          this.currentUserSubject.next(user);
        } catch {
          this.clearSession();
        }
      }
    } else {
      this.clearSession();
    }
  }
}