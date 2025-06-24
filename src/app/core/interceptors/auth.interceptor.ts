import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  // Headers obligatorios para la API
  let headers = req.headers
    .set('Sitio', 'StudentPortal')
    .set('Clave', 'Portal123');

  // Token JWT si existe
  const token = localStorage.getItem('token');
  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  // Usuario ID si existe
  const usuarioId = localStorage.getItem('user_data');
  if (usuarioId) {
    try {
      const userData = JSON.parse(usuarioId);
      if (userData?.id) {
        headers = headers.set('UsuarioId', userData.id);
      }
    } catch (error) {
      console.warn('Error parsing user data:', error);
    }
  }

  const authReq = req.clone({ headers });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Limpiar localStorage y redirigir al login
        localStorage.removeItem('token');
        localStorage.removeItem('token_expiration');
        localStorage.removeItem('user_data');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};