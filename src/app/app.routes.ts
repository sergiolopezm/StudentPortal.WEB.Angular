import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/dashboard/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'estudiantes',
    canActivate: [AuthGuard],
    data: { roles: ['Admin'] },
    loadChildren: () => import('./features/estudiantes/estudiantes.routes').then(m => m.routes)
  },
  {
    path: 'materias',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/materias/materias.routes').then(m => m.routes)
  },
  {
    path: 'inscripciones',
    canActivate: [AuthGuard],
    data: { roles: ['Estudiante'] },
    loadChildren: () => import('./features/inscripciones/inscripciones.routes').then(m => m.routes)
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];