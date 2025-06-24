import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    const usuarioId = localStorage.getItem('usuarioId');
    
    let headers = req.headers
      .set('Sitio', 'StudentPortal')
      .set('Clave', 'Portal123');

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    if (usuarioId) {
      headers = headers.set('UsuarioId', usuarioId);
    }

    const authReq = req.clone({ headers });
    
    return next.handle(authReq);
  }
}