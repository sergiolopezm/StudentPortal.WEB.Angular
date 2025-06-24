import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../../core/services/auth.service';
import { EstudianteService } from '../../../core/services/estudiante.service';
import { InscripcionService } from '../../../core/services/inscripcion.service';
import { EstudianteDto } from '../../../models/academico/estudiante.dto';
import { InscripcionDto } from '../../../models/academico/inscripcion.dto';
import { CompaneroClaseDto } from '../../../models/academico/companero-clase.dto';

@Component({
  selector: 'app-mis-clases',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSnackBarModule
  ],
  templateUrl: './mis-clases.component.html',
  styleUrls: ['./mis-clases.component.css']
})
export class MisClasesComponent implements OnInit {
  estudiante: EstudianteDto | null = null;
  inscripciones: InscripcionDto[] = [];
  companeros: CompaneroClaseDto[] = [];
  loading = true;
  displayedColumns: string[] = ['materia', 'creditos', 'profesores', 'estado', 'calificacion', 'acciones'];

  constructor(
    private authService: AuthService,
    private estudianteService: EstudianteService,
    private inscripcionService: InscripcionService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private async loadData(): Promise<void> {
    try {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) return;

      const estudiantesResult = await this.estudianteService.getAll().toPromise();
      if (estudiantesResult?.exito) {
        this.estudiante = estudiantesResult.resultado?.find(e => e.usuarioId === currentUser.id) || null;
        
        if (this.estudiante) {
          await this.loadInscripciones();
          await this.loadCompaneros();
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      this.loading = false;
    }
  }

  private async loadInscripciones(): Promise<void> {
    if (!this.estudiante) return;
    
    const result = await this.inscripcionService.getByEstudiante(this.estudiante.id).toPromise();
    if (result?.exito) {
      this.inscripciones = result.resultado || [];
    }
  }

  private async loadCompaneros(): Promise<void> {
    if (!this.estudiante) return;
    
    const result = await this.estudianteService.getCompaneros(this.estudiante.id).toPromise();
    if (result?.exito) {
      this.companeros = result.resultado || [];
    }
  }

  cancelarInscripcion(inscripcionId: number): void {
    this.inscripcionService.cancelar(inscripcionId).subscribe({
      next: (response) => {
        if (response.exito) {
          this.snackBar.open('Inscripción cancelada', 'Cerrar', { duration: 3000 });
          this.loadInscripciones();
        } else {
          this.snackBar.open(response.mensaje, 'Cerrar', { duration: 5000 });
        }
      },
      error: () => {
        this.snackBar.open('Error al cancelar inscripción', 'Cerrar', { duration: 5000 });
      }
    });
  }

  getStatusClass(estado: string): string {
    switch(estado) {
      case 'Inscrito': return 'status-inscrito';
      case 'Cancelado': return 'status-cancelado';
      case 'Completado': return 'status-completado';
      default: return 'status-default';
    }
  }

  getCompanerosPorMateria(materiaId: number): CompaneroClaseDto[] {
    return this.companeros.filter(c => c.materiaId === materiaId);
  }
}