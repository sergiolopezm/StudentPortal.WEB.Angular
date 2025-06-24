import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { EstudianteService } from '../../../core/services/estudiante.service';
import { InscripcionService } from '../../../core/services/inscripcion.service';
import { UsuarioPerfilDto } from '../../../models/auth/usuario-perfil.dto';
import { EstudianteDto } from '../../../models/academico/estudiante.dto';
import { InscripcionDto } from '../../../models/academico/inscripcion.dto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    RouterModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: UsuarioPerfilDto | null = null;
  estudiante: EstudianteDto | null = null;
  inscripciones: InscripcionDto[] = [];
  loading = true;
  displayedColumns: string[] = ['materia', 'creditos', 'estado', 'calificacion'];

  constructor(
    private authService: AuthService,
    private estudianteService: EstudianteService,
    private inscripcionService: InscripcionService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  private async loadUserData(): Promise<void> {
    this.currentUser = this.authService.getCurrentUser();
    
    if (this.currentUser?.rol === 'Estudiante') {
      await this.loadEstudianteData();
    }
    
    this.loading = false;
  }

  private async loadEstudianteData(): Promise<void> {
    try {
      const estudiantesResult = await this.estudianteService.getAll().toPromise();
      if (estudiantesResult?.success && estudiantesResult.data) {
        this.estudiante = estudiantesResult.data.find(e => e.usuarioId === this.currentUser!.id) || null;
        
        if (this.estudiante) {
          const inscripcionesResult = await this.inscripcionService.getByEstudiante(this.estudiante.id).toPromise();
          if (inscripcionesResult?.success) {
            this.inscripciones = inscripcionesResult.data || [];
          }
        }
      }
    } catch (error) {
      console.error('Error loading student data:', error);
    }
  }

  getWelcomeMessage(): string {
    switch(this.currentUser?.rol) {
      case 'Admin': return 'Administre estudiantes, materias e inscripciones desde su panel de control.';
      case 'Estudiante': return 'Gestione sus materias inscritas y consulte su información académica.';
      case 'Profesor': return 'Consulte sus clases asignadas y estudiantes registrados.';
      default: return 'Bienvenido al sistema de gestión académica.';
    }
  }

  getStatusClass(estado: string): string {
    switch(estado) {
      case 'Inscrito': return 'status-inscrito';
      case 'Cancelado': return 'status-cancelado';
      case 'Completado': return 'status-completado';
      default: return 'status-default';
    }
  }
}