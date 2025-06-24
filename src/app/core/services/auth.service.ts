import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';

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
  private readonly BASE_URL = `${environment.apiUrl}/Auth`;
  private currentUserSubject = new BehaviorSubject<UsuarioPerfilDto | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  login(loginDto: UsuarioLoginDto): Observable<{ exito: boolean; mensaje: string; resultado?: TokenDto }> {
    loginDto.ip = '127.0.0.1';
    
    return this.http.post<{ exito: boolean; mensaje: string; resultado?: TokenDto }>(
      `${this.BASE_URL}/login`, loginDto)
      .pipe(
        tap(response => {
          console.log('Auth service response:', response);
          if (response.exito && response.resultado) {
            this.setSession(response.resultado);
          }
        })
      );
  }

  registerComplete(registroDto: UsuarioRegistroCompletoDto): Observable<{ exito: boolean; mensaje: string; resultado?: any }> {
    return this.http.post<{ exito: boolean; mensaje: string; resultado?: any }>(
      `${this.BASE_URL}/registroCompleto`, registroDto);
  }

  getProfile(): Observable<{ exito: boolean; mensaje: string; resultado?: UsuarioPerfilDto }> {
    return this.http.get<{ exito: boolean; mensaje: string; resultado?: UsuarioPerfilDto }>(
      `${this.BASE_URL}/perfil`)
      .pipe(
        tap(response => {
          if (response.exito && response.resultado) {
            this.currentUserSubject.next(response.resultado);
          }
        })
      );
  }

  logout(): Observable<{ exito: boolean; mensaje: string }> {
    return this.http.post<{ exito: boolean; mensaje: string }>(
      `${this.BASE_URL}/logout`, {})
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

  private setSession(tokenData: any): void {
    console.log('Setting session with:', tokenData);
    localStorage.setItem('token', tokenData.token);
    
    // Manejar la fecha de expiración que puede venir como string
    const expiracion = tokenData.expiracion ? new Date(tokenData.expiracion).toISOString() : new Date(Date.now() + 24*60*60*1000).toISOString();
    localStorage.setItem('token_expiration', expiracion);
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