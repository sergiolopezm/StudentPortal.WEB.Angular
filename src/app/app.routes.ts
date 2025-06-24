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
    loadComponent: () => import('./features/estudiantes/lista-estudiantes/lista-estudiantes.component').then(m => m.ListaEstudiantesComponent)
  },
  {
    path: 'materias',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/materias/lista-materias/lista-materias.component').then(m => m.ListaMateriasComponent)
  },
  {
    path: 'inscripciones/materias',
    canActivate: [AuthGuard],
    data: { roles: ['Estudiante'] },
    loadComponent: () => import('./features/inscripciones/seleccionar-materias/seleccionar-materias.component').then(m => m.SeleccionarMateriasComponent)
  },
  {
    path: 'inscripciones/clases',
    canActivate: [AuthGuard],
    data: { roles: ['Estudiante'] },
    loadComponent: () => import('./features/inscripciones/mis-clases/mis-clases.component').then(m => m.MisClasesComponent)
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];